import html2canvas from "html2canvas";

interface CopyAsImageOptions {
  redrawTextSelector?: string;
}

/**
 * DOM 노드를 PNG로 렌더한 뒤 클립보드(이미지)에 씁니다.
 * HTTPS 또는 localhost에서만 동작하는 환경이 많습니다.
 */
export async function copyElementAsImageToClipboard(
  element: HTMLElement | null,
  options?: CopyAsImageOptions,
): Promise<void> {
  if (!element) {
    throw new Error("복사할 영역이 없습니다.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const render = async (foreignObjectRendering: boolean) =>
    html2canvas(element, {
      scale: Math.max(2, window.devicePixelRatio || 1),
      useCORS: true,
      foreignObjectRendering,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (doc) => {
        // 작은 슬롯 라벨이 캡처 이미지에서 누락되는 현상을 줄입니다.
        doc
          .querySelectorAll<HTMLElement>("[data-copy-label='true']")
          .forEach((el) => {
            el.style.fontSize = "12px";
            el.style.lineHeight = "1.2";
            el.style.fontWeight = "700";
            el.style.color = "#ffffff";
            el.style.textShadow = "0 0 1px rgba(0,0,0,0.35)";
            el.style.opacity = "1";
          });
      },
    });

  let canvas = await render(false);
  if (isLikelyBlackCanvas(canvas)) {
    canvas = await render(true);
  }

  if (options?.redrawTextSelector) {
    redrawTextFromSource(canvas, element, options.redrawTextSelector);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png", 1);
  });

  if (!blob) {
    throw new Error("이미지 생성에 실패했습니다.");
  }

  if (!navigator.clipboard?.write) {
    throw new Error("클립보드 API를 사용할 수 없습니다.");
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ]);
}

function isLikelyBlackCanvas(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const points = [
    [canvas.width * 0.25, canvas.height * 0.25],
    [canvas.width * 0.5, canvas.height * 0.5],
    [canvas.width * 0.75, canvas.height * 0.75],
    [canvas.width * 0.5, canvas.height * 0.2],
    [canvas.width * 0.2, canvas.height * 0.5],
  ] as const;

  let darkCount = 0;
  for (const [x, y] of points) {
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const [r, g, b, a] = pixel;
    if (a > 0 && r < 8 && g < 8 && b < 8) darkCount += 1;
  }
  return darkCount >= 4;
}

function redrawTextFromSource(
  canvas: HTMLCanvasElement,
  sourceRoot: HTMLElement,
  selector: string,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rootRect = sourceRoot.getBoundingClientRect();
  const scaleX = canvas.width / rootRect.width;
  const scaleY = canvas.height / rootRect.height;

  const nodes = sourceRoot.querySelectorAll<HTMLElement>(selector);
  nodes.forEach((el) => {
    const text = (el.textContent ?? "").trim();
    if (!text) return;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const centerX = ((rect.left - rootRect.left) + rect.width / 2) * scaleX;
    const centerY = ((rect.top - rootRect.top) + rect.height / 2) * scaleY;
    const baseFontPx = Number.parseFloat(style.fontSize || "12");
    const fontPx = Math.max(11, baseFontPx) * Math.min(scaleX, scaleY);
    const weight = style.fontWeight || "700";

    ctx.save();
    ctx.font = `${weight} ${fontPx}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = Math.max(1, fontPx * 0.12);
    ctx.strokeText(text, centerX, centerY);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  });
}
