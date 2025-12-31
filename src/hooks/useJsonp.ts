import { useCallback, useRef } from "react";
import { GOOGLE_SCRIPT_URL, JSONP_TIMEOUT } from "../constants";

interface JsonpOptions {
  action: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  timeout?: number;
}

export function useJsonp() {
  const activeCallbacks = useRef<Set<string>>(new Set());

  const fetchJsonp = useCallback(
    ({
      action,
      onSuccess,
      onError,
      timeout = JSONP_TIMEOUT,
    }: JsonpOptions) => {
      const callbackName = `jsonp_callback_${action}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      activeCallbacks.current.add(callbackName);

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        if (activeCallbacks.current.has(callbackName)) {
          cleanup();
          onError?.(
            "요청 시간이 초과되었습니다. Google Apps Script 배포를 확인해주세요."
          );
        }
      }, timeout);

      const cleanup = () => {
        activeCallbacks.current.delete(callbackName);
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        const script = document.getElementById(`jsonp_script_${callbackName}`);
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      // 전역 콜백 함수 설정
      (window as any)[callbackName] = (result: any) => {
        if (!activeCallbacks.current.has(callbackName)) {
          return; // 이미 정리된 경우 무시
        }

        cleanup();

        if (result && result.success) {
          onSuccess?.(result.data);
        } else {
          onError?.(
            result?.error || `${action} 데이터를 불러오는데 실패했습니다.`
          );
        }
      };

      // 스크립트 태그 생성
      const script = document.createElement("script");
      script.id = `jsonp_script_${callbackName}`;
      script.src = `${GOOGLE_SCRIPT_URL}?action=${action}&callback=${callbackName}`;

      script.onerror = () => {
        if (activeCallbacks.current.has(callbackName)) {
          cleanup();
          onError?.(
            "스크립트를 로드할 수 없습니다. Google Apps Script 배포 설정을 확인해주세요."
          );
        }
      };

      document.body.appendChild(script);

      // cleanup 함수 반환 (필요시 수동 정리)
      return cleanup;
    },
    []
  );

  return { fetchJsonp };
}

