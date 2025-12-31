// Google Apps Script 코드
// 스프레드시트의 Apps Script 편집기에 이 코드를 붙여넣으세요

// CORS 헤더를 포함한 응답 생성 헬퍼 함수
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// 기본 연결 테스트용 GET 요청
function doGet(e) {
  Logger.log("doGet function called!");

  try {
    return createCorsResponse({
      success: true,
      message: "Google Apps Script 연결 성공",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return createCorsResponse({
      success: false,
      error: error.toString(),
    });
  }
}

// 기본 연결 테스트용 POST 요청
function doPost(e) {
  Logger.log("doPost function called!");

  try {
    const data = e.postData ? JSON.parse(e.postData.contents) : {};
    Logger.log("Received data: " + JSON.stringify(data));

    return createCorsResponse({
      success: true,
      message: "Google Apps Script 연결 성공",
      receivedData: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return createCorsResponse({
      success: false,
      error: error.toString(),
    });
  }
}
