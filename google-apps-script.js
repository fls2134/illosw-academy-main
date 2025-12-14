// Google Apps Script 코드
// 스프레드시트의 Apps Script 편집기에 이 코드를 붙여넣으세요

// CORS 헤더를 포함한 응답 생성 헬퍼 함수
function createCorsResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  Logger.log('doPost function called!');
  
  try {
    // 스프레드시트 ID 명시적으로 지정
    const SPREADSHEET_ID = '1zEl7O5MqqLMWIcIogoWQIBpp55TxQ1rqLf72Ga4Dz10';
    Logger.log('Opening spreadsheet: ' + SPREADSHEET_ID);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    Logger.log('Sheet opened successfully');
    
    // POST 요청에서 데이터 파싱
    Logger.log('Raw postData: ' + e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // 현재 시간 추가
    const timestamp = new Date();
    
    // 학생 구분 한글 변환
    const studentTypeMap = {
      'middle': '중학생',
      'high': '고등학생'
    };
    
    // 학년 한글 변환
    const gradeMap = {
      'prep1': '예비 1학년',
      '1': '1학년',
      '2': '2학년'
    };
    
    // 행 데이터 준비
    const rowData = [
      timestamp, // 제출 시간
      data.phone || '', // 전화번호
      data.name || '', // 신청인 성함
      data.school || '', // 학생 학교
      studentTypeMap[data.studentType] || data.studentType || '', // 학생 구분
      gradeMap[data.grade] || data.grade || '', // 학생 학년
      data.content || '' // 상담/설명회에서 듣고싶은 내용
    ];
    
    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출 시간',
        '전화번호',
        '신청인 성함',
        '학생 학교',
        '학생 구분',
        '학생 학년',
        '상담/설명회에서 듣고싶은 내용'
      ]);
    }
    
    // 데이터 추가
    Logger.log('Attempting to append row: ' + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    Logger.log('Row appended successfully!');
    
    // 성공 응답
    return createCorsResponse({
      success: true,
      message: '데이터가 성공적으로 저장되었습니다.'
    });
      
  } catch (error) {
    // 에러 응답
    return createCorsResponse({
      success: false,
      error: error.toString()
    });
  }
}

// GET 요청 지원 (URL 파라미터로 데이터 받기)
function doGet(e) {
  // 함수 호출 확인
  Logger.log('doGet function called!');
  
  try {
    // 스프레드시트 ID 명시적으로 지정
    const SPREADSHEET_ID = '1zEl7O5MqqLMWIcIogoWQIBpp55TxQ1rqLf72Ga4Dz10';
    Logger.log('Opening spreadsheet: ' + SPREADSHEET_ID);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    Logger.log('Sheet opened successfully');
    
    // URL 파라미터에서 데이터 가져오기
    const params = e.parameter;
    
    // 디버깅: 로그에 파라미터 출력
    Logger.log('Received parameters: ' + JSON.stringify(params));
    
    // 현재 시간 추가
    const timestamp = new Date();
    
    // 학생 구분 한글 변환
    const studentTypeMap = {
      'middle': '중학생',
      'high': '고등학생'
    };
    
    // 학년 한글 변환
    const gradeMap = {
      'prep1': '예비 1학년',
      '1': '1학년',
      '2': '2학년'
    };
    
    // 행 데이터 준비
    const rowData = [
      timestamp, // 제출 시간
      params.phone || '', // 전화번호
      params.name || '', // 신청인 성함
      params.school || '', // 학생 학교
      studentTypeMap[params.studentType] || params.studentType || '', // 학생 구분
      gradeMap[params.grade] || params.grade || '', // 학생 학년
      params.content || '' // 상담/설명회에서 듣고싶은 내용
    ];
    
    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출 시간',
        '전화번호',
        '신청인 성함',
        '학생 학교',
        '학생 구분',
        '학생 학년',
        '상담/설명회에서 듣고싶은 내용'
      ]);
    }
    
    // 데이터 추가
    Logger.log('Attempting to append row: ' + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    Logger.log('Row appended successfully!');
    
    // 디버깅: 로그에 저장된 데이터 확인
    Logger.log('Data saved: ' + JSON.stringify(rowData));
    
    // 성공 페이지 반환 (HTML)
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>제출 완료</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #1e293b;
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ 신청이 완료되었습니다!</h1>
            <p>데이터가 성공적으로 저장되었습니다.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    // 에러 로깅
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>오류</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #1e293b;
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>오류 발생</h1>
            <p>${error.toString()}</p>
            <p style="font-size: 0.8em; color: #94a3b8;">로그를 확인해주세요.</p>
          </div>
        </body>
      </html>
    `);
  }
}

// 테스트용 함수 - 스프레드시트 접근 확인
function testSpreadsheetAccess() {
  try {
    const SPREADSHEET_ID = '1zEl7O5MqqLMWIcIogoWQIBpp55TxQ1rqLf72Ga4Dz10';
    Logger.log('Testing spreadsheet access: ' + SPREADSHEET_ID);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    Logger.log('Sheet accessed successfully');
    
    // 테스트 데이터 추가
    const testData = [
      new Date(),
      '010-1234-5678',
      '테스트',
      '테스트학교',
      '고등학생',
      '1학년',
      '테스트 내용'
    ];
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출 시간',
        '전화번호',
        '신청인 성함',
        '학생 학교',
        '학생 구분',
        '학생 학년',
        '상담/설명회에서 듣고싶은 내용'
      ]);
    }
    
    sheet.appendRow(testData);
    Logger.log('Test data added successfully!');
    return 'Success: Test data added to spreadsheet';
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// GET 요청 테스트
function testGet() {
  const mockEvent = {
    parameter: {
      phone: '010-1234-5678',
      name: '테스트',
      school: '테스트학교',
      studentType: 'high',
      grade: '1',
      content: '테스트 내용'
    }
  };
  
  const result = doGet(mockEvent);
  Logger.log('Test result: ' + result.getContent());
  return result;
}

