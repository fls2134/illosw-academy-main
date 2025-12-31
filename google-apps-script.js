// Google Apps Script 코드
// 스프레드시트의 Apps Script 편집기에 이 코드를 붙여넣으세요

const SPREADSHEET_ID = "1zEl7O5MqqLMWIcIogoWQIBpp55TxQ1rqLf72Ga4Dz10";
const EMAIL_TO = "fls213444@gmail.com";
const SPREADSHEET_URL =
  "https://docs.google.com/spreadsheets/d/1zEl7O5MqqLMWIcIogoWQIBpp55TxQ1rqLf72Ga4Dz10/edit?gid=1051641823#gid=1051641823";

// CORS 헤더를 포함한 응답 생성 헬퍼 함수
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// 스프레드시트 열기
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// timetable 조회 (원시 데이터만 반환)
function getTimetables() {
  try {
    const spreadsheet = getSpreadsheet();
    const timetableSheet = spreadsheet.getSheetByName("timetable");

    if (!timetableSheet) {
      throw new Error("timetable 시트를 찾을 수 없습니다.");
    }

    // timetable 데이터 가져오기
    const timetableData = timetableSheet.getDataRange().getValues();
    const timetableDisplayData = timetableSheet
      .getDataRange()
      .getDisplayValues(); // 표시된 문자열 값
    const timetableHeaders = timetableData[0];
    const timetableRows = timetableData.slice(1);
    const timetableDisplayRows = timetableDisplayData.slice(1);

    // timetable 데이터 포맷팅
    const serialIndex = timetableHeaders.indexOf("serial");
    const dayIndex = timetableHeaders.indexOf("day");
    const timeIndex = timetableHeaders.indexOf("time");
    const isNewIndex = timetableHeaders.indexOf("is_new");
    const fullcountIndex = timetableHeaders.indexOf("fullcount");

    const timetables = timetableRows.map((row, index) => {
      // 시간 값 가져오기 - getDisplayValues()로 텍스트 그대로 가져오기
      const displayRow = timetableDisplayRows[index];
      const timeStr = displayRow ? String(displayRow[timeIndex] || "") : "";

      return {
        serial: row[serialIndex],
        day: row[dayIndex],
        time: timeStr,
        is_new: row[isNewIndex] === 1,
        fullcount: row[fullcountIndex],
      };
    });

    return {
      success: true,
      data: timetables,
    };
  } catch (error) {
    Logger.log("getTimetables error: " + error.toString());
    throw error;
  }
}

// class 조회 (원시 데이터만 반환)
function getClasses() {
  try {
    const spreadsheet = getSpreadsheet();
    const classSheet = spreadsheet.getSheetByName("class");

    if (!classSheet) {
      throw new Error("class 시트를 찾을 수 없습니다.");
    }

    const classData = classSheet.getDataRange().getValues();
    const classHeaders = classData[0];
    const classRows = classData.slice(1);

    const serialIndex = classHeaders.indexOf("serial");
    const categoryIndex = classHeaders.indexOf("category");
    const classNameIndex = classHeaders.indexOf("class");
    const isActiveIndex = classHeaders.indexOf("is_active");

    const classes = classRows.map((row) => ({
      serial: row[serialIndex],
      category: row[categoryIndex],
      class: row[classNameIndex],
      is_active: row[isActiveIndex],
    }));

    return {
      success: true,
      data: classes,
    };
  } catch (error) {
    Logger.log("getClasses error: " + error.toString());
    throw error;
  }
}

// current 조회
function getCurrent() {
  try {
    const spreadsheet = getSpreadsheet();
    const currentSheet = spreadsheet.getSheetByName("current");

    if (!currentSheet) {
      throw new Error("current 시트를 찾을 수 없습니다.");
    }

    const currentData = currentSheet.getDataRange().getValues();
    const currentHeaders = currentData[0];
    const currentRows = currentData.slice(1);

    const studentSerialIndex = currentHeaders.indexOf("student_serial");
    const classSerialIndex = currentHeaders.indexOf("class_serial");
    const timetableSerialIndex = currentHeaders.indexOf("timetable_serial");

    const current = currentRows.map((row) => ({
      student_serial: row[studentSerialIndex],
      class_serial: row[classSerialIndex],
      timetable_serial: row[timetableSerialIndex],
    }));

    return {
      success: true,
      data: current,
    };
  } catch (error) {
    Logger.log("getCurrent error: " + error.toString());
    throw error;
  }
}

// students 조회
function getStudents() {
  try {
    const spreadsheet = getSpreadsheet();
    const studentsSheet = spreadsheet.getSheetByName("students");

    if (!studentsSheet) {
      throw new Error("students 시트를 찾을 수 없습니다.");
    }

    const studentsData = studentsSheet.getDataRange().getValues();
    const studentsHeaders = studentsData[0];
    const studentsRows = studentsData.slice(1);

    const serialIndex = studentsHeaders.indexOf("serial");
    const nameIndex = studentsHeaders.indexOf("name");
    const numberIndex = studentsHeaders.indexOf("number");
    const isRegisterIndex = studentsHeaders.indexOf("is_register");

    const students = studentsRows.map((row) => ({
      serial: row[serialIndex],
      name: row[nameIndex],
      number: row[numberIndex],
      is_register: row[isRegisterIndex],
    }));

    return {
      success: true,
      data: students,
    };
  } catch (error) {
    Logger.log("getStudents error: " + error.toString());
    throw error;
  }
}

// 신규 등록 처리
function registerStudent(data) {
  try {
    const spreadsheet = getSpreadsheet();
    const studentsSheet = spreadsheet.getSheetByName("students");
    const currentSheet = spreadsheet.getSheetByName("current");

    if (!studentsSheet || !currentSheet) {
      throw new Error("시트를 찾을 수 없습니다.");
    }

    const { name, number, class_serial, timetable_serial } = data;

    // 필수 필드 검증
    if (!name || !number || !class_serial || !timetable_serial) {
      throw new Error("필수 필드가 누락되었습니다.");
    }

    // students 시트에 추가
    const studentsData = studentsSheet.getDataRange().getValues();
    const lastSerial =
      studentsData.length > 1
        ? Math.max(...studentsData.slice(1).map((row) => row[0] || 0))
        : 0;
    const newStudentSerial = lastSerial + 1;

    studentsSheet.appendRow([newStudentSerial, name, number, 0]); // is_register = 0

    // current 시트에 추가
    currentSheet.appendRow([newStudentSerial, class_serial, timetable_serial]);

    // 이메일 발송
    try {
      const subject = "[illo sw academy]에 신규 상담 요청이 있습니다.";
      const body =
        "새로운 상담 요청이 등록되었습니다.\n\n" +
        "스프레드시트 링크: " +
        SPREADSHEET_URL +
        "\n\n" +
        "등록 정보:\n" +
        "- 이름: " +
        name +
        "\n" +
        "- 전화번호: " +
        number +
        "\n" +
        "- 클래스: " +
        class_serial +
        "\n" +
        "- 시간표: " +
        timetable_serial;

      MailApp.sendEmail({
        to: EMAIL_TO,
        subject: subject,
        body: body,
      });

      Logger.log("이메일 발송 완료");
    } catch (emailError) {
      Logger.log("이메일 발송 실패: " + emailError.toString());
      // 이메일 실패해도 등록은 성공으로 처리
    }

    return {
      success: true,
      message: "등록이 완료되었습니다.",
      student_serial: newStudentSerial,
    };
  } catch (error) {
    Logger.log("registerStudent error: " + error.toString());
    throw error;
  }
}

// GET 요청 처리
function doGet(e) {
  Logger.log("doGet function called!");
  Logger.log("Parameters: " + JSON.stringify(e.parameter));

  try {
    const action = e.parameter.action;
    let result;

    if (action === "timetables") {
      result = getTimetables();
    } else if (action === "classes") {
      result = getClasses();
    } else if (action === "current") {
      result = getCurrent();
    } else if (action === "students") {
      result = getStudents();
    } else {
      result = {
        success: true,
        message: "Google Apps Script 연결 성공",
        timestamp: new Date().toISOString(),
      };
    }

    // JSONP 콜백 지원
    const callback = e.parameter.callback;
    if (callback) {
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(result) + ");"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return createCorsResponse(result);
  } catch (error) {
    Logger.log("Error: " + error.toString());
    const errorResult = {
      success: false,
      error: error.toString(),
    };

    const callback = e.parameter.callback;
    if (callback) {
      return ContentService.createTextOutput(
        callback + "(" + JSON.stringify(errorResult) + ");"
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return createCorsResponse(errorResult);
  }
}

// POST 요청 처리
function doPost(e) {
  Logger.log("doPost function called!");

  try {
    const data = e.postData ? JSON.parse(e.postData.contents) : {};
    Logger.log("Received data: " + JSON.stringify(data));

    const action = data.action;

    if (action === "register") {
      const result = registerStudent(data);
      return createCorsResponse(result);
    } else {
      return createCorsResponse({
        success: true,
        message: "Google Apps Script 연결 성공",
        receivedData: data,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return createCorsResponse({
      success: false,
      error: error.toString(),
    });
  }
}
