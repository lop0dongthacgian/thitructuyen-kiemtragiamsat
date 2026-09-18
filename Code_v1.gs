// ================================================================
// CUỘC THI TÌM HIỂU CÔNG TÁC KIỂM TRA, GIÁM SÁT CỦA ĐẢNG
// ================================================================

var SPREADSHEET_ID   = '1CAYFefrxR7n7viZFUOPsK9yHX9LUpOm9E8XaCqJmSaw';

var QUEUE_SHEET      = 'HangCho';
var RESULT_SHEET     = 'KetQuaThi';
var STATS_SHEET      = 'ThongKeChiBo';
var LOG_SHEET        = 'NhatKy';
var BACKUP_SHEET     = 'DuPhong';


var QUEUE_HEADERS = [
  'UUID', 'Thời gian nhận', 'Trạng thái',
  'ID', 'Họ và tên', 'Số điện thoại', 'Chi bộ',
  'Số câu đúng', 'Câu sai',
  'Thời gian làm bài (MM:SS)',
  'Câu hỏi phụ', 'Thời gian nộp'
];

var RESULT_HEADERS = [
  'Hạng', 'Họ và tên', 'Số điện thoại', 'Chi bộ',
  'Số câu đúng', 'Câu sai',
  'Thời gian làm bài (MM:SS)',
  'Câu hỏi phụ', 'Thời gian nộp bài'
];

// ================================================================
// HÀM KIỂM TRA SỐ ĐIỆN THOẠI ĐÃ THI CHƯA
// ================================================================
function chuanHoaSdt(sdt) {
  if (sdt === null || sdt === undefined || sdt === '') return '';
  var s;
  if (typeof sdt === 'number') {
    // Tránh bị hiển thị ký hiệu khoa học (vd 9.12345E+9) khi ô lỡ bị đọc thành number
    s = sdt.toFixed(0);
  } else {
    s = String(sdt);
  }
  s = s.trim().replace(/\D/g, '');
  return s.replace(/^0+/, '');
}

function kiemTraSoDienThoaiDaThi(soDienThoai) {
  try {
    var ss  = getSpreadsheet();
    var sdt = chuanHoaSdt(soDienThoai);
    if (!sdt) return false;

    // 1. Kiểm tra sheet KetQuaThi (cột 3)
    var rSheet = ss.getSheetByName(RESULT_SHEET);
    if (rSheet && rSheet.getLastRow() >= 2) {
      var rData = rSheet.getRange(2, 3, rSheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < rData.length; i++) {
        if (chuanHoaSdt(rData[i][0]) === sdt) return true;
      }
    }

    // 2. Kiểm tra sheet HangCho (cột 6 = Số điện thoại)
    var qSheet = ss.getSheetByName(QUEUE_SHEET);
    if (qSheet && qSheet.getLastRow() >= 2) {
      var qData = qSheet.getRange(2, 6, qSheet.getLastRow() - 1, 1).getValues();
      for (var j = 0; j < qData.length; j++) {
        if (chuanHoaSdt(qData[j][0]) === sdt) return true;
      }
    }

    // 3. Kiểm tra sheet DuPhong (cột 3=SĐT, cột 10=Trạng thái)
    // Chỉ bỏ qua hàng đã DONE, tính tất cả PENDING và hàng không có trạng thái
    var bSheet = ss.getSheetByName(BACKUP_SHEET);
    if (bSheet && bSheet.getLastRow() >= 2) {
      var bLastCol = bSheet.getLastColumn();
      var bReadCols = Math.max(bLastCol, 3);
      var bData = bSheet.getRange(2, 1, bSheet.getLastRow() - 1, bReadCols).getValues();
      for (var k = 0; k < bData.length; k++) {
        if (chuanHoaSdt(bData[k][2]) !== sdt) continue;
        // Có cột 10 (Trạng thái)? Chỉ bỏ qua nếu là DONE
        var statusB = (bReadCols >= 10) ? String(bData[k][9]).toUpperCase() : '';
        if (statusB === 'DONE') continue;
        return true;
      }
    }

    return false;
  } catch (err) {
    ghiLog('kiemTraSoDienThoaiDaThi', err.message);
    return false;
  }
}

// ================================================================
// CHỐNG NỘP TRÙNG DO GỬI CHẬM / MẤT MẠNG (idempotent theo sessionId)
// ----------------------------------------------------------------
// Nếu do mạng chậm mà trình duyệt không nhận được phản hồi kịp và tự
// gửi lại (hoặc người dùng bấm "Nộp bài" thêm lần nữa), ta trả lại
// ĐÚNG kết quả của lần nộp đầu tiên thay vì báo nhầm "đã thi rồi".
// ================================================================
function _luuKetQuaDaXuLy(sessionId, ketQua) {
  try {
    CacheService.getScriptCache().put(
      'ketqua_' + sessionId,
      JSON.stringify(ketQua),
      21600 // 6 giờ (giới hạn tối đa của CacheService)
    );
  } catch (e) {}
}

function _layKetQuaDaXuLy(sessionId) {
  try {
    var raw = CacheService.getScriptCache().get('ketqua_' + sessionId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ================================================================
// TỰ ĐỘNG "CHỮA LÀNH" TRIGGER NẾU BỊ THIẾU
// ----------------------------------------------------------------
// Nếu vì lý do gì đó trigger chạy nền (processQueue / flushBackup mỗi phút)
// bị thiếu (chưa từng chạy setup(), hoặc trigger bị xoá/hết hạn), bài thi sẽ
// bị kẹt mãi ở trạng thái PENDING trong HangCho mà KHÔNG BAO GIỜ tự chuyển
// sang KetQuaThi. Hàm này tự kiểm tra và tự cài lại trigger nếu thiếu, mỗi
// khi có người nộp bài — không cần con người phải nhớ chạy lại setup().
// Giới hạn 15 phút kiểm tra 1 lần (đủ nhanh để tự phục hồi, vừa nhẹ tài
// nguyên cho đợt thi 1 tuần / 6.000–7.000 bài).
// ================================================================
function _damBaoTrigger() {
  try {
    var props = PropertiesService.getScriptProperties();
    var last = props.getProperty('lastTriggerCheck');
    var now = Date.now();
    if (last && (now - Number(last)) < 15 * 60 * 1000) return;
    props.setProperty('lastTriggerCheck', String(now));

    var existing = ScriptApp.getProjectTriggers();
    var hasFlush = false, hasProcess = false;
    existing.forEach(function(t) {
      var fn = t.getHandlerFunction();
      if (fn === 'flushBackup')  hasFlush = true;
      if (fn === 'processQueue') hasProcess = true;
    });

    if (!hasFlush) {
      ScriptApp.newTrigger('flushBackup').timeBased().everyMinutes(1).create();
      ghiLog('_damBaoTrigger', 'Da tu dong tao lai trigger flushBackup (bi thieu)');
    }
    if (!hasProcess) {
      ScriptApp.newTrigger('processQueue').timeBased().everyMinutes(1).create();
      ghiLog('_damBaoTrigger', 'Da tu dong tao lai trigger processQueue (bi thieu)');
    }
  } catch (e) {
    // Có thể thiếu quyền uỷ quyền (authorization) ở lần chạy đầu tiên — không
    // sao, vẫn ghi log để biết, không làm hỏng luồng nộp bài của người dùng.
    ghiLog('_damBaoTrigger', e.message);
  }
}

// ================================================================
// ENTRY POINTS
// ================================================================
function doPost(e) {
  _damBaoTrigger();

  if (!e || !e.postData || !e.postData.contents) {
    return jsonOk({ success: false, error: 'Khong co du lieu POST' });
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (parseErr) {
    ghiLog('doPost.parse', parseErr.message);
    return jsonOk({ success: false, error: 'Du lieu JSON khong hop le' });
  }

  // ================================================================
  // LUỒNG MỚI: nộp bài kèm sessionId + answers (giao diện hiện tại dùng luồng này)
  // ================================================================
  if (data.sessionId && data.answers) {

    // 1) CHỐNG "BÁO NHẦM ĐÃ THI": nếu đây là yêu cầu gửi LẠI (do mạng chậm,
    //    client timeout rồi tự thử lại, hoặc người dùng bấm nộp bài 2 lần)
    //    của CHÍNH phiên thi này, trả lại đúng kết quả cũ — không chấm lại,
    //    không kiểm tra trùng SĐT, không báo lỗi.
    var ketQuaCu = _layKetQuaDaXuLy(data.sessionId);
    if (ketQuaCu) {
      return jsonOk(ketQuaCu);
    }

    var phien = _layPhien(data.sessionId);
    if (!phien) {
      return jsonOk({ success: false, error: 'Phien thi da het han hoac khong hop le. Vui long lam lai tu dau.' });
    }

    // 2) Chỉ kiểm tra trùng số điện thoại SAU KHI xác nhận đây thực sự là
    //    một phiên còn hiệu lực (không phải lần gửi lại của chính nó).
    if (data.soDienThoai && kiemTraSoDienThoaiDaThi(data.soDienThoai)) {
      ghiLog('doPost', 'So dien thoai da thi: ' + data.soDienThoai);
      return jsonOk({
        success: false,
        error: 'Số điện thoại này đã tham gia thi rồi. Mỗi người chỉ được thi 1 lần duy nhất.'
      });
    }

    var soCauDung  = 0;
    var cauSaiList = [];
    var wrongAnswers = [];

    phien.questions.forEach(function(sq) {
      var userAnswer = data.answers['q' + sq.id] || '';
      if (userAnswer === sq.correctAnswer) {
        soCauDung++;
      } else {
        var userLetter = (userAnswer && userAnswer.length > 0) ? userAnswer.charAt(0) : '-';
        cauSaiList.push(sq.id + userLetter);
        wrongAnswers.push({
          questionId:    sq.id,
          userAnswer:    userAnswer || 'Chưa trả lời',
          correctAnswer: sq.correctAnswer
        });
      }
    });

    _xoaPhien(data.sessionId);

    data.soCauDung   = soCauDung;
    data.cauSai      = cauSaiList.join(', ');
    // Ưu tiên thời điểm nộp bài do CLIENT ghi nhận NGAY LÚC BẤM NÚT (trước khi
    // gửi mạng), để thời gian nộp không bị lệch vì gửi chậm / hàng đợi xử lý.
    data.thoiGianNop = data.thoiGianNop || new Date().toLocaleString('vi-VN');

    var ketQua = { success: true, score: soCauDung, total: phien.questions.length, wrongAnswers: wrongAnswers };

    // Lưu kết quả lại NGAY để nếu client gửi trùng (mất mạng/timeout) sẽ nhận
    // lại đúng kết quả này thay vì bị chấm/ghi 2 lần hoặc báo lỗi nhầm.
    _luuKetQuaDaXuLy(data.sessionId, ketQua);

    // Ghi dữ liệu THẬT NHANH: không xếp hạng/thống kê ngay trong doPost để
    // tránh làm nghẽn phản hồi (nguyên nhân chính gây "nộp bài bị treo mãi").
    // Việc chuyển từ HangCho -> KetQuaThi + xếp hạng đã có trigger chạy mỗi
    // phút (processQueue) đảm nhiệm ở nền, không ảnh hưởng người đang thi.
    var lock2 = LockService.getScriptLock();
    var gotLock2 = false;
    try { gotLock2 = lock2.tryLock(3000); } catch (le) {}

    try {
      if (gotLock2) {
        writeToQueue(data);
      } else {
        writeToBackup(data);
        ghiLog('doPost.newFlow.lock', 'Lock ban, luu DuPhong: ' + data.hoTen);
      }
    } catch (err2) {
      ghiLog('doPost.newFlow', err2.message + '\n' + (err2.stack || ''));
      try { writeToBackup(data); } catch (be2) { ghiLog('doPost.newFlow.backup', be2.message); }
    } finally {
      if (gotLock2) { try { lock2.releaseLock(); } catch (re) {} }
    }

    return jsonOk(ketQua);
  }

  // ================================================================
  // LUỒNG CŨ (giữ lại để tương thích ngược)
  // ================================================================
  if (data.soDienThoai && kiemTraSoDienThoaiDaThi(data.soDienThoai)) {
    ghiLog('doPost', 'So dien thoai da thi: ' + data.soDienThoai);
    return jsonOk({
      success: false,
      error: 'Số điện thoại này đã tham gia thi rồi. Mỗi người chỉ được thi 1 lần duy nhất.'
    });
  }

  var thieu = [];
  if (!data.hoTen)       thieu.push('hoTen');
  if (!data.soDienThoai) thieu.push('soDienThoai');
  if (!data.chiBo)       thieu.push('chiBo');
  if (data.soCauDung   === undefined || data.soCauDung   === null) thieu.push('soCauDung');
  if (data.thoiGianLamBai === undefined || data.thoiGianLamBai === null) thieu.push('thoiGianLamBai');

  if (thieu.length > 0) {
    ghiLog('doPost', 'Thieu truong: ' + thieu.join(', '));
    return jsonOk({ success: false, error: 'Thieu du lieu: ' + thieu.join(', ') });
  }

  var lock = LockService.getScriptLock();
  var gotLock = false;
  try {
    gotLock = lock.tryLock(3000);
  } catch (le) {}

  try {
    if (gotLock) {
      writeToQueue(data);
    } else {
      writeToBackup(data);
      ghiLog('doPost.lock', 'Lock timeout, luu DuPhong: ' + data.hoTen);
    }
    return jsonOk({ success: true, message: 'Da nhan bai thi!' });
  } catch (err) {
    ghiLog('doPost', err.message + '\n' + (err.stack || ''));
    try { writeToBackup(data); } catch (be2) { ghiLog('doPost.backup2', be2.message); }
    return jsonOk({ success: true, message: 'Da nhan bai thi (du phong)!' });
  } finally {
    if (gotLock) { try { lock.releaseLock(); } catch (re) {} }
  }
}

// ================================================================
// NGÂN HÀNG CÂU HỎI — CÔNG TÁC KIỂM TRA, GIÁM SÁT CỦA ĐẢNG
// ================================================================
// ⚠️ ĐÂY CHỈ LÀ BỘ CÂU HỎI MẪU ĐỂ TEST (10 câu/phần = 30 câu).
// Mục tiêu cuối cùng: Phần 1 = 25 câu, Phần 2 = 25 câu, Phần 3 = 20 câu
// (tổng 70 câu trong ngân hàng). Hệ thống sẽ tự động rút ngẫu nhiên
// 18 câu (phần 1) + 18 câu (phần 2) + 14 câu (phần 3) = 50 câu/lượt thi.
// Chỉ cần thêm object { id, text, options, correctAnswer } vào đúng
// mảng của từng phần bên dưới — id phải là số duy nhất, tăng dần.
var QUESTION_BANK = {
  // PHẦN 1: Quy định, nguyên tắc về công tác kiểm tra, giám sát của Đảng
  1: [
    { id: 1, text: "Điều lệ Đảng Cộng sản Việt Nam hiện hành quy định về công tác kiểm tra, giám sát của Đảng tại chương nào?", options: [ "A. Chương VI", "B. Chương VII", "C. Chương VIII", "D. Chương IX" ], correctAnswer: "B. Chương VII" },
    { id: 2, text: "Theo Điều lệ Đảng, kiểm tra, giám sát là nhiệm vụ của ai?", options: [ "A. Chỉ của Ủy ban Kiểm tra các cấp", "B. Của toàn Đảng, trước hết là nhiệm vụ của cấp ủy, do cấp ủy trực tiếp tiến hành", "C. Chỉ của Ban Thường vụ cấp ủy", "D. Chỉ của Bí thư cấp ủy" ], correctAnswer: "B. Của toàn Đảng, trước hết là nhiệm vụ của cấp ủy, do cấp ủy trực tiếp tiến hành" },
    { id: 3, text: "Ủy ban Kiểm tra các cấp do cơ quan nào bầu ra?", options: [ "A. Do đại hội đảng bộ cùng cấp bầu", "B. Do cấp ủy cùng cấp bầu", "C. Do Ủy ban Kiểm tra cấp trên chỉ định", "D. Do Ban Tổ chức cấp trên bổ nhiệm" ], correctAnswer: "B. Do cấp ủy cùng cấp bầu" },
    { id: 4, text: "Nhiệm kỳ của Ủy ban Kiểm tra các cấp được xác định như thế nào?", options: [ "A. Cùng nhiệm kỳ với cấp ủy cùng cấp", "B. 2,5 năm, không phụ thuộc nhiệm kỳ cấp ủy", "C. 10 năm", "D. Không quy định nhiệm kỳ cụ thể" ], correctAnswer: "A. Cùng nhiệm kỳ với cấp ủy cùng cấp" },
    { id: 5, text: "Quy định 22-QĐ/TW ngày 28/7/2021 của Ban Chấp hành Trung ương quy định về nội dung gì?", options: [ "A. Công tác dân vận của Đảng", "B. Công tác kiểm tra, giám sát và kỷ luật của Đảng", "C. Công tác tổ chức cán bộ", "D. Công tác tuyên giáo" ], correctAnswer: "B. Công tác kiểm tra, giám sát và kỷ luật của Đảng" },
    { id: 6, text: "\"Giám sát\" trong công tác Đảng được hiểu là gì?", options: [ "A. Việc tổ chức đảng quan sát, theo dõi, xem xét, đánh giá hoạt động nhằm kịp thời tác động để đối tượng giám sát chấp hành đúng Cương lĩnh, Điều lệ, chủ trương, nghị quyết của Đảng", "B. Việc xử lý kỷ luật đảng viên vi phạm", "C. Việc thanh tra tài chính của Đảng", "D. Việc tổ chức đại hội đảng bộ" ], correctAnswer: "A. Việc tổ chức đảng quan sát, theo dõi, xem xét, đánh giá hoạt động nhằm kịp thời tác động để đối tượng giám sát chấp hành đúng Cương lĩnh, Điều lệ, chủ trương, nghị quyết của Đảng" },
    { id: 7, text: "Đối tượng giám sát của cấp ủy, tổ chức đảng và Ủy ban Kiểm tra các cấp bao gồm?", options: [ "A. Chỉ đảng viên là cán bộ chủ chốt", "B. Tổ chức đảng cấp dưới và đảng viên", "C. Chỉ tổ chức đảng", "D. Chỉ đảng viên mới kết nạp" ], correctAnswer: "B. Tổ chức đảng cấp dưới và đảng viên" },
    { id: 8, text: "Nguyên tắc nào sau đây KHÔNG phải là nguyên tắc trong công tác kiểm tra, giám sát của Đảng?", options: [ "A. Đảng thống nhất lãnh đạo công tác kiểm tra, giám sát trong toàn Đảng", "B. Công khai, dân chủ, khách quan, thận trọng và chặt chẽ", "C. Chỉ tiến hành kiểm tra, giám sát khi có đơn thư tố cáo", "D. Thực hiện đúng nguyên tắc, thẩm quyền, quy trình, thủ tục" ], correctAnswer: "C. Chỉ tiến hành kiểm tra, giám sát khi có đơn thư tố cáo" },
    { id: 9, text: "Phương châm trong công tác kiểm tra, giám sát, kỷ luật đảng là gì?", options: [ "A. Chủ động, chiến đấu, giáo dục, hiệu quả", "B. Nghiêm minh, chính xác, kịp thời", "C. Cả A và B đều đúng", "D. Không có phương châm cụ thể" ], correctAnswer: "C. Cả A và B đều đúng" },
    { id: 10, text: "Kiểm tra, giám sát của Đảng nhằm mục đích chủ yếu nào sau đây?", options: [ "A. Chỉ để phát hiện và xử lý vi phạm", "B. Chủ động phòng ngừa, ngăn chặn vi phạm, đồng thời phát hiện, xử lý kịp thời khi có vi phạm, giúp tổ chức đảng, đảng viên phát huy ưu điểm, khắc phục hạn chế", "C. Chỉ nhằm đánh giá thi đua khen thưởng", "D. Không có mục đích cụ thể" ], correctAnswer: "B. Chủ động phòng ngừa, ngăn chặn vi phạm, đồng thời phát hiện, xử lý kịp thời khi có vi phạm, giúp tổ chức đảng, đảng viên phát huy ưu điểm, khắc phục hạn chế" }
  ],
  // PHẦN 2: Nhiệm vụ, quyền hạn, tổ chức của Ủy ban Kiểm tra các cấp
  2: [
    { id: 11, text: "Ủy ban Kiểm tra Trung ương do cơ quan nào bầu ra?", options: [ "A. Đại hội đại biểu toàn quốc bầu số lượng Ủy viên; Ban Chấp hành Trung ương bầu Ủy ban Kiểm tra trong số Ủy viên đó", "B. Do Bộ Chính trị bầu trực tiếp", "C. Do Ban Bí thư chỉ định", "D. Do Quốc hội phê chuẩn" ], correctAnswer: "A. Đại hội đại biểu toàn quốc bầu số lượng Ủy viên; Ban Chấp hành Trung ương bầu Ủy ban Kiểm tra trong số Ủy viên đó" },
    { id: 12, text: "Ủy ban Kiểm tra các cấp thực hiện việc kiểm tra, giám sát trong phạm vi nào?", options: [ "A. Chỉ trong phạm vi cấp Trung ương", "B. Trong phạm vi nhiệm vụ, quyền hạn do Điều lệ Đảng và cấp ủy cùng cấp giao", "C. Không có phạm vi giới hạn", "D. Chỉ theo yêu cầu của cấp trên" ], correctAnswer: "B. Trong phạm vi nhiệm vụ, quyền hạn do Điều lệ Đảng và cấp ủy cùng cấp giao" },
    { id: 13, text: "Một trong những nhiệm vụ của Ủy ban Kiểm tra là gì?", options: [ "A. Kiểm tra đảng viên, kể cả cấp ủy viên cùng cấp khi có dấu hiệu vi phạm tiêu chuẩn đảng viên, tiêu chuẩn cấp ủy viên", "B. Quyết định ngân sách địa phương", "C. Bổ nhiệm cán bộ chủ chốt", "D. Tổ chức bầu cử đại biểu Quốc hội" ], correctAnswer: "A. Kiểm tra đảng viên, kể cả cấp ủy viên cùng cấp khi có dấu hiệu vi phạm tiêu chuẩn đảng viên, tiêu chuẩn cấp ủy viên" },
    { id: 14, text: "Ủy ban Kiểm tra có quyền giám sát đối với đối tượng nào?", options: [ "A. Cấp ủy viên cùng cấp", "B. Cán bộ diện cấp ủy cùng cấp quản lý", "C. Cả A và B", "D. Chỉ đảng viên là quần chúng" ], correctAnswer: "C. Cả A và B" },
    { id: 15, text: "Ủy ban Kiểm tra cấp trên có trách nhiệm gì đối với Ủy ban Kiểm tra cấp dưới?", options: [ "A. Chỉ đạo, hướng dẫn Ủy ban Kiểm tra cấp dưới thực hiện nhiệm vụ, đồng thời kiểm tra, giám sát hoạt động của cấp dưới", "B. Không có mối liên hệ về nghiệp vụ", "C. Chỉ nhận báo cáo, không chỉ đạo", "D. Thay thế hoàn toàn nhiệm vụ của cấp dưới" ], correctAnswer: "A. Chỉ đạo, hướng dẫn Ủy ban Kiểm tra cấp dưới thực hiện nhiệm vụ, đồng thời kiểm tra, giám sát hoạt động của cấp dưới" },
    { id: 16, text: "Ai chịu trách nhiệm trước cấp ủy về việc lãnh đạo, tổ chức thực hiện nhiệm vụ kiểm tra, giám sát ở đơn vị mình?", options: [ "A. Chủ nhiệm Ủy ban Kiểm tra", "B. Chỉ Bí thư cấp ủy", "C. Toàn thể cấp ủy, trước hết và trực tiếp là thường trực cấp ủy", "D. Trưởng ban Tổ chức" ], correctAnswer: "C. Toàn thể cấp ủy, trước hết và trực tiếp là thường trực cấp ủy" },
    { id: 17, text: "Ủy viên Ủy ban Kiểm tra cần đáp ứng tiêu chuẩn cơ bản nào?", options: [ "A. Có phẩm chất đạo đức tốt, có bản lĩnh, trung thực, công tâm, khách quan; am hiểu nghiệp vụ kiểm tra, giám sát", "B. Không cần tiêu chuẩn riêng biệt nào", "C. Chỉ cần là đảng viên lâu năm", "D. Chỉ cần có trình độ đại học" ], correctAnswer: "A. Có phẩm chất đạo đức tốt, có bản lĩnh, trung thực, công tâm, khách quan; am hiểu nghiệp vụ kiểm tra, giám sát" },
    { id: 18, text: "Chủ nhiệm Ủy ban Kiểm tra cấp ủy thường đồng thời giữ vị trí nào trong cấp ủy (theo cơ cấu phổ biến)?", options: [ "A. Là ủy viên ban thường vụ cấp ủy cùng cấp", "B. Không tham gia cấp ủy", "C. Là Bí thư cấp ủy", "D. Không có quy định về cơ cấu" ], correctAnswer: "A. Là ủy viên ban thường vụ cấp ủy cùng cấp" },
    { id: 19, text: "Kinh phí, phương tiện hoạt động của Ủy ban Kiểm tra do cơ quan nào bảo đảm?", options: [ "A. Do cấp ủy cùng cấp bảo đảm", "B. Do đảng viên tự đóng góp", "C. Do Ủy ban Kiểm tra tự thu, tự chi", "D. Không có kinh phí hoạt động riêng" ], correctAnswer: "A. Do cấp ủy cùng cấp bảo đảm" },
    { id: 20, text: "Một trong các nhiệm vụ trọng tâm của Ủy ban Kiểm tra các cấp là gì?", options: [ "A. Kiểm tra tổ chức đảng cấp dưới và đảng viên khi có dấu hiệu vi phạm trong việc chấp hành Cương lĩnh, Điều lệ, nghị quyết, chỉ thị, quy định của Đảng", "B. Giải quyết tranh chấp dân sự tại địa phương", "C. Quản lý ngân sách nhà nước", "D. Ban hành văn bản quy phạm pháp luật" ], correctAnswer: "A. Kiểm tra tổ chức đảng cấp dưới và đảng viên khi có dấu hiệu vi phạm trong việc chấp hành Cương lĩnh, Điều lệ, nghị quyết, chỉ thị, quy định của Đảng" }
  ],
  // PHẦN 3: Quy trình, thủ tục kiểm tra, giám sát và thi hành kỷ luật đảng
  3: [
    { id: 21, text: "Quy trình kiểm tra khi có dấu hiệu vi phạm thường gồm những bước cơ bản nào?", options: [ "A. Chuẩn bị kiểm tra, tiến hành kiểm tra, kết thúc kiểm tra (báo cáo, kết luận)", "B. Chỉ có 1 bước duy nhất", "C. 10 bước theo trình tự cố định không thay đổi", "D. Không có quy trình cụ thể" ], correctAnswer: "A. Chuẩn bị kiểm tra, tiến hành kiểm tra, kết thúc kiểm tra (báo cáo, kết luận)" },
    { id: 22, text: "Trước khi tiến hành kiểm tra, tổ chức đảng có thẩm quyền phải làm gì?", options: [ "A. Xây dựng kế hoạch, ban hành quyết định kiểm tra và thông báo cho đối tượng được kiểm tra", "B. Không cần thông báo trước cho đối tượng", "C. Chỉ cần thông báo miệng, không cần văn bản", "D. Ủy quyền hoàn toàn cho cấp dưới thực hiện thay" ], correctAnswer: "A. Xây dựng kế hoạch, ban hành quyết định kiểm tra và thông báo cho đối tượng được kiểm tra" },
    { id: 23, text: "Đảng viên, tổ chức đảng là đối tượng bị kiểm tra, giám sát có quyền gì?", options: [ "A. Được trình bày ý kiến, cung cấp tài liệu, giải trình và bảo lưu ý kiến theo quy định", "B. Không có quyền gì trong quá trình kiểm tra", "C. Chỉ được giữ im lặng", "D. Chỉ được khiếu nại sau khi có kết luận, không được giải trình trước" ], correctAnswer: "A. Được trình bày ý kiến, cung cấp tài liệu, giải trình và bảo lưu ý kiến theo quy định" },
    { id: 24, text: "Các hình thức kỷ luật đối với đảng viên chính thức vi phạm gồm những hình thức nào?", options: [ "A. Khiển trách, cảnh cáo, cách chức, khai trừ", "B. Chỉ khiển trách và cảnh cáo", "C. Chỉ khai trừ", "D. Phạt tiền" ], correctAnswer: "A. Khiển trách, cảnh cáo, cách chức, khai trừ" },
    { id: 25, text: "Các hình thức kỷ luật đối với tổ chức đảng vi phạm gồm những hình thức nào?", options: [ "A. Khiển trách, cảnh cáo, giải tán", "B. Chỉ có hình thức khiển trách", "C. Chỉ có hình thức cách chức", "D. Không áp dụng kỷ luật đối với tổ chức đảng" ], correctAnswer: "A. Khiển trách, cảnh cáo, giải tán" },
    { id: 26, text: "Sau khi có kết luận kiểm tra, tổ chức đảng có thẩm quyền cần làm gì?", options: [ "A. Thông báo kết luận đến đối tượng được kiểm tra và tổ chức đảng có liên quan theo quy định", "B. Giữ bí mật tuyệt đối, không thông báo cho ai", "C. Không cần thực hiện thêm bước nào", "D. Chuyển toàn bộ hồ sơ cho cơ quan khác xử lý thay" ], correctAnswer: "A. Thông báo kết luận đến đối tượng được kiểm tra và tổ chức đảng có liên quan theo quy định" },
    { id: 27, text: "Đảng viên bị thi hành kỷ luật có quyền khiếu nại về kỷ luật không?", options: [ "A. Có quyền khiếu nại theo quy định của Điều lệ Đảng", "B. Không được quyền khiếu nại trong mọi trường hợp", "C. Chỉ đảng viên là cấp ủy viên mới được khiếu nại", "D. Chỉ được khiếu nại một lần duy nhất trong suốt thời gian là đảng viên" ], correctAnswer: "A. Có quyền khiếu nại theo quy định của Điều lệ Đảng" },
    { id: 28, text: "Trong thời gian tổ chức đảng có thẩm quyền đang xem xét, giải quyết khiếu nại kỷ luật, quyết định kỷ luật có còn hiệu lực không?", options: [ "A. Quyết định kỷ luật vẫn có hiệu lực thi hành cho đến khi có quyết định mới", "B. Đương nhiên bị hủy bỏ", "C. Tạm dừng hiệu lực ngay khi có đơn khiếu nại", "D. Không có quy định về việc này" ], correctAnswer: "A. Quyết định kỷ luật vẫn có hiệu lực thi hành cho đến khi có quyết định mới" },
    { id: 29, text: "Việc giám sát của Đảng được tiến hành theo những hình thức nào?", options: [ "A. Giám sát thường xuyên và giám sát theo chuyên đề", "B. Chỉ có duy nhất một hình thức giám sát", "C. Không được kết hợp các hình thức giám sát", "D. Giám sát chỉ được thực hiện khi có đơn thư tố cáo" ], correctAnswer: "A. Giám sát thường xuyên và giám sát theo chuyên đề" },
    { id: 30, text: "Hồ sơ, tài liệu kiểm tra, giám sát, kỷ luật đảng phải được quản lý như thế nào?", options: [ "A. Lập, quản lý, lưu trữ theo đúng quy định về bảo mật và công tác văn thư, lưu trữ của Đảng", "B. Không cần lưu trữ sau khi kết thúc kiểm tra", "C. Có thể công khai rộng rãi cho mọi cá nhân, tổ chức", "D. Giao toàn bộ cho đối tượng được kiểm tra tự lưu giữ" ], correctAnswer: "A. Lập, quản lý, lưu trữ theo đúng quy định về bảo mật và công tác văn thư, lưu trữ của Đảng" }
  ]
};

// ================================================================
// XÁO TRỘN CHUẨN
// ================================================================
function _shuffle_(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}


function layNgauNhien50Cau_() {
  var chiTieu = [{ phan: 1, sl: 18 }, { phan: 2, sl: 18 }, { phan: 3, sl: 14 }];
  var ketQua = [];
  chiTieu.forEach(function(muc) {
    var bank = QUESTION_BANK[muc.phan] || [];
    var ds = _shuffle_(bank.slice());
    var soLuong = Math.min(muc.sl, ds.length);
    ketQua = ketQua.concat(ds.slice(0, soLuong));
  });
  return _shuffle_(ketQua);
}

// ================================================================
// LƯU/ĐỌC PHIÊN THI
// ----------------------------------------------------------------
// QUAN TRỌNG: dùng CacheService (KHÔNG dùng PropertiesService). Khi nhiều
// thí sinh cùng bấm "Bắt đầu làm bài" một lúc (đợt cao điểm), PropertiesService
// rất chậm và có quota lưu trữ tổng cộng chỉ 500KB — dễ bị nghẽn/lỗi, chính
// là nguyên nhân "tải câu hỏi rất lâu / báo lỗi máy chủ phản hồi quá chậm".
// CacheService nhanh hơn nhiều và tự động hết hạn sau thời gian đặt sẵn —
// đúng bản chất dữ liệu tạm thời của 1 phiên thi.
// ================================================================
var THOI_HAN_PHIEN_GIAY = 90 * 60; // 90 phút (đơn vị: giây, đúng như trước đây)

function _luuPhien(sessionId, questions) {
  var payload = JSON.stringify({
    questions: questions.map(function(q) {
      return { id: q.id, correctAnswer: q.correctAnswer };
    })
  });
  CacheService.getScriptCache().put('session_' + sessionId, payload, THOI_HAN_PHIEN_GIAY);
}

function _layPhien(sessionId) {
  var raw = CacheService.getScriptCache().get('session_' + sessionId);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function _xoaPhien(sessionId) {
  try { CacheService.getScriptCache().remove('session_' + sessionId); } catch (e) {}
}

// ================================================================
// doGet
// ================================================================
function doGet(e) {
  // Kiểm tra SĐT đã thi chưa (gọi trước khi vào làm bài)
  if (e && e.parameter && e.parameter.action === 'checkPhone') {
    var sdt = e.parameter.soDienThoai || '';
    if (!sdt) return jsonOk({ success: false, error: 'Thieu so dien thoai' });
    var daThi = kiemTraSoDienThoaiDaThi(sdt);
    return jsonOk({ success: true, daThi: daThi });
  }

  if (e && e.parameter && e.parameter.action === 'getQuestions') {
    try {
      var allQuestions = layNgauNhien50Cau_();
      var sessionId    = Utilities.getUuid();
      _luuPhien(sessionId, allQuestions);

      var forClient = allQuestions.map(function(q) {
        return { id: q.id, text: q.text, options: q.options };
      });

      return jsonOk({ success: true, sessionId: sessionId, questions: forClient });
    } catch (err) {
      ghiLog('doGet.getQuestions', err.message);
      return jsonOk({ success: false, error: err.message });
    }
  }

  if (e && e.parameter && e.parameter.action === 'getRanking') {
    try {
      var ss = getSpreadsheet();
      var rSheet = ss.getSheetByName(RESULT_SHEET);

      var totalBai = 0;
      var chiBoNhieuBai = '';
      var soLuongMax = 0;
      var chiBoBaiNhat = '';

      if (rSheet && rSheet.getLastRow() > 1) {
        var data = rSheet.getRange(2, 1, rSheet.getLastRow() - 1, 4).getValues();
        totalBai = data.length;

        // Chi bộ có nhiều bài dự thi nhất (đếm số lần xuất hiện)
        var chiBoCount = {};
        data.forEach(function(row) {
          var cb = String(row[3]).trim();
          if (cb) chiBoCount[cb] = (chiBoCount[cb] || 0) + 1;
        });
        Object.keys(chiBoCount).forEach(function(cb) {
          if (chiBoCount[cb] > soLuongMax) {
            soLuongMax = chiBoCount[cb];
            chiBoNhieuBai = cb;
          }
        });

        // Cá nhân tạm xếp đầu: hàng đầu tiên trong KetQuaThi (đã sắp xếp theo điểm/thời gian)
        chiBoBaiNhat = String(data[0][3]).trim();
      }

      return jsonOk({
        success: true,
        totalBai: totalBai,
        chiHoiNhieuBai: chiBoNhieuBai,
        soLuongBai: soLuongMax,
        chiHoiBaiNhat: chiBoBaiNhat
      });
    } catch (err) {
      ghiLog('doGet.getRanking', err.message);
      return jsonOk({ success: false, error: err.message });
    }
  }

  return jsonOk({ status: 'ok', message: 'API dang hoat dong' });
}

// ================================================================
// GHI VÀO HÀNG CHỜ
// ================================================================
function writeToQueue(data) {
  var ss    = getSpreadsheet();
  var sheet = ss.getSheetByName(QUEUE_SHEET);
  if (!sheet) sheet = taoSheet(ss, QUEUE_SHEET, QUEUE_HEADERS);

  var now            = new Date();
  var thoiGianLamBai = formatTimeToText(data.thoiGianLamBai);

  var cauHoiPhu;
  if (data.cauHoiPhu !== undefined && data.cauHoiPhu !== null && data.cauHoiPhu !== '') {
    var parsed = Number(data.cauHoiPhu);
    cauHoiPhu  = isNaN(parsed) ? String(data.cauHoiPhu).trim() : parsed;
  } else {
    cauHoiPhu = 0;
  }

  var cauSai = String(data.cauSai || '').trim();

  // Ép cột SĐT (cột 6) và Câu hỏi phụ (cột 11) về TEXT trước khi ghi
  var lastRowBefore = sheet.getLastRow();
  sheet.getRange(lastRowBefore + 1, 6).setNumberFormat('@');
  sheet.getRange(lastRowBefore + 1, 11).setNumberFormat('@');

  var cauHoiPhuStr = String(isNaN(Number(cauHoiPhu)) ? 0 : Number(cauHoiPhu));

  sheet.appendRow([
    Utilities.getUuid(),
    now,
    'PENDING',
    String(data.id || '').trim(),
    String(data.hoTen).trim(),
    String(data.soDienThoai).trim(),
    String(data.chiBo).trim(),
    Number(data.soCauDung),
    cauSai,
    thoiGianLamBai,
    cauHoiPhuStr,
    String(data.thoiGianNop || now.toLocaleString('vi-VN'))
  ]);

  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 10).setNumberFormat('@');
}

// ================================================================
// GHI VÀO SHEET DỰ PHÒNG
// ================================================================
function writeToBackup(data) {
  var ss    = getSpreadsheet();
  var sheet = ss.getSheetByName(BACKUP_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(BACKUP_SHEET);
    sheet.appendRow(['Thời gian nhận', 'Họ và tên', 'Số điện thoại', 'Chi bộ',
                     'Số câu đúng', 'Câu sai', 'Thời gian làm bài', 'Câu hỏi phụ',
                     'Thời gian nộp', 'Trạng thái']);
    sheet.setFrozenRows(1);
  }
  // Ép cột SĐT (cột 3), Thời gian làm bài (cột 7) và Câu hỏi phụ (cột 8) về
  // TEXT trước khi ghi. QUAN TRỌNG: nếu không ép cột 7 về TEXT, Google Sheets
  // sẽ tự hiểu chuỗi "MM:SS" (vd "05:30") là GIỜ TRONG NGÀY (5 giờ 30 phút
  // sáng) thay vì "thời lượng làm bài", khiến khi chuyển từ DuPhong sang
  // HangCho/KetQuaThi thời gian làm bài bị đọc sai (đây là nguyên nhân gây
  // lỗi "thời gian thi hiển thị khác khi chuyển từ dự phòng qua").
  var lastRowBefore = sheet.getLastRow();
  sheet.getRange(lastRowBefore + 1, 3).setNumberFormat('@');
  sheet.getRange(lastRowBefore + 1, 7).setNumberFormat('@');
  sheet.getRange(lastRowBefore + 1, 8).setNumberFormat('@');

  var now            = new Date();
  var thoiGianLamBai = formatTimeToText(data.thoiGianLamBai);

  var cauHoiPhu;
  if (data.cauHoiPhu !== undefined && data.cauHoiPhu !== null && data.cauHoiPhu !== '') {
    var parsed = Number(data.cauHoiPhu);
    cauHoiPhu  = isNaN(parsed) ? 0 : parsed;
  } else {
    cauHoiPhu = 0;
  }

  sheet.appendRow([
    now.toLocaleString('vi-VN'),
    String(data.hoTen || '').trim(),
    String(data.soDienThoai || '').trim(),
    String(data.chiBo || '').trim(),
    Number(data.soCauDung) || 0,
    String(data.cauSai || '').trim(),
    thoiGianLamBai,
    String(cauHoiPhu),
    String(data.thoiGianNop || now.toLocaleString('vi-VN')),
    'PENDING'
  ]);
}

// ================================================================
// FLUSH BACKUP (chuyển DuPhong -> HangCho)
// ================================================================
function flushBackup() {
  var ss = getSpreadsheet();
  var lock = LockService.getScriptLock();
  var gotLock = false;
  try { gotLock = lock.tryLock(5000); } catch (le) {}
  if (!gotLock) return;

  try {
    var sheet = ss.getSheetByName(BACKUP_SHEET);
    if (!sheet || sheet.getLastRow() < 2) return;

    var lastCol   = Math.max(sheet.getLastColumn(), 10);
    var allValues = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).getValues();

    var pending = [], rowIndexes = [];
    allValues.forEach(function(row, i) {
      var status = String(row[9] || '').toUpperCase();
      if (status !== 'DONE') {
        pending.push(row);
        rowIndexes.push(i + 2);
      }
    });
    if (pending.length === 0) return;

    var existingSdt = {};
    var qSheet = ss.getSheetByName(QUEUE_SHEET);
    if (qSheet && qSheet.getLastRow() >= 2) {
      qSheet.getRange(2, 6, qSheet.getLastRow() - 1, 1).getValues()
        .forEach(function(r) { if (r[0]) existingSdt[chuanHoaSdt(r[0])] = true; });
    }

    var flushed = 0;
    pending.forEach(function(row, idx) {
      // QUAN TRỌNG: bọc try/catch cho TỪNG HÀNG — nếu không, một hàng dữ liệu
      // lỗi/bất thường sẽ làm forEach dừng ngang, khiến TẤT CẢ các hàng dự
      // phòng phía sau không bao giờ được tự động chuyển sang HangCho/KetQuaThi
      // (đây là nguyên nhân gây lỗi "ghi vào dự phòng nhưng không tự chuyển qua").
      try {
        var sdtRow = chuanHoaSdt(String(row[2] || ''));
        if (sdtRow && existingSdt[sdtRow]) {
          sheet.getRange(rowIndexes[idx], 10).setValue('DONE');
          ghiLog('flushBackup', 'Bo qua trung SDT: ' + sdtRow);
          return;
        }

        // Xử lý cauHoiPhu: ô cũ có thể bị đọc thành Date object do lỗi định dạng
        var rawCHP = row[7];
        var chpNum = 0;
        if (rawCHP !== '' && rawCHP !== null && rawCHP !== undefined) {
          if (rawCHP instanceof Date) {
            var epoch = new Date(1899, 11, 30);
            chpNum = Math.round((rawCHP - epoch) / 86400000);
          } else {
            var p = Number(rawCHP);
            chpNum = isNaN(p) ? 0 : p;
          }
        }

        writeToQueue({
          hoTen:          row[1],
          soDienThoai:    row[2],
          chiBo:          row[3],
          soCauDung:      row[4],
          cauSai:         row[5],
          thoiGianLamBai: row[6],
          cauHoiPhu:      chpNum,
          thoiGianNop:    row[8]
        });

        sheet.getRange(rowIndexes[idx], 10).setValue('DONE');
        flushed++;
      } catch (rowErr) {
        // Đánh dấu lỗi để KHÔNG lặp vô hạn ở lần chạy tiếp theo, đồng thời vẫn
        // giữ tính "đã tham gia" cho SĐT này (tránh bị thi lại), và ghi log để
        // người quản trị kiểm tra thủ công dòng này trong sheet DuPhong.
        ghiLog('flushBackup.row' + rowIndexes[idx], rowErr.message);
        try { sheet.getRange(rowIndexes[idx], 10).setValue('ERROR: ' + rowErr.message); } catch (setErr) {}
      }
    });

    ghiLog('flushBackup', 'Da chuyen ' + flushed + '/' + pending.length + ' bai tu DuPhong sang HangCho');

    if (flushed > 0) processQueue();

  } catch (err) {
    ghiLog('flushBackup', err.message + '\n' + (err.stack || ''));
  } finally {
    try { lock.releaseLock(); } catch (re) {}
  }
}

// ================================================================
// PROCESS QUEUE
// ================================================================
function processQueue() {
  var ss     = getSpreadsheet();
  var qSheet = ss.getSheetByName(QUEUE_SHEET);
  if (!qSheet || qSheet.getLastRow() < 2) return;

  var allRows = qSheet.getRange(2, 1, qSheet.getLastRow() - 1, QUEUE_HEADERS.length).getValues();

  var pending = [], indexes = [];
  allRows.forEach(function(row, i) {
    if (row[2] === 'PENDING') {
      pending.push(row);
      indexes.push(i + 2);
    }
  });
  if (pending.length === 0) return;

  var rSheet = ss.getSheetByName(RESULT_SHEET);
  if (!rSheet) rSheet = taoSheet(ss, RESULT_SHEET, RESULT_HEADERS);

  var newRows = pending.map(function(row) {
    return [
      0,
      row[4],
      row[5],
      row[6],
      row[7],
      row[8],
      row[9],
      row[10],
      row[11]
    ];
  });

  var startRow = rSheet.getLastRow() + 1;
  rSheet.getRange(startRow, 3, newRows.length, 1).setNumberFormat('@');
  rSheet.getRange(startRow, 7, newRows.length, 1).setNumberFormat('@');
  rSheet.getRange(startRow, 8, newRows.length, 1).setNumberFormat('@');
  var outputRange = rSheet.getRange(startRow, 1, newRows.length, RESULT_HEADERS.length);
  outputRange.setValues(newRows);

  indexes.forEach(function(r) {
    qSheet.getRange(r, 3).setValue('DONE');
  });

  sapXepVaTinhHang(rSheet, ss);
}

// ================================================================
// SẮP XẾP VÀ TÍNH HẠNG
// ================================================================
function sapXepVaTinhHang(rSheet, ss) {
  var lastRow = rSheet.getLastRow();
  if (lastRow < 2) return;

  var range = rSheet.getRange(2, 1, lastRow - 1, RESULT_HEADERS.length);
  var vals  = range.getValues();

  var dapAnPhu = vals.length;

  vals.sort(function(a, b) {
    var diemA = Number(a[4]) || 0;
    var diemB = Number(b[4]) || 0;
    if (diemA !== diemB) return diemB - diemA;

    var tgA = mmssTextToSeconds(String(a[6]));
    var tgB = mmssTextToSeconds(String(b[6]));
    if (tgA !== tgB) return tgA - tgB;

    var duDoanA = Math.abs(Number(a[7]) - dapAnPhu);
    var duDoanB = Math.abs(Number(b[7]) - dapAnPhu);
    return duDoanA - duDoanB;
  });

  vals.forEach(function(r, i) { r[0] = i + 1; });

  range.setValues(vals);

  range.offset(0, 2, vals.length, 1).setNumberFormat('@'); // cột SĐT
  range.offset(0, 6, vals.length, 1).setNumberFormat('@'); // cột Thời gian làm bài
  range.offset(0, 7, vals.length, 1).setNumberFormat('@'); // cột Câu hỏi phụ

  thongKeChiBo(ss, rSheet);
}

// ================================================================
// THỐNG KÊ CHI BỘ
// ================================================================
function thongKeChiBo(ss, rSheet) {
  var sSheet = ss.getSheetByName(STATS_SHEET);
  if (!sSheet) sSheet = ss.insertSheet(STATS_SHEET);
  sSheet.clearContents();
  try { sSheet.showColumns(1, 5); } catch(e) {}

  sSheet.appendRow(['Hạng', 'Chi bộ', 'Số ĐV thi', 'Tổng hạng', 'Hạng TB']);

  var rSheetFresh = ss.getSheetByName(RESULT_SHEET);
  if (!rSheetFresh) { _dinhDangBangChiBo(sSheet, 1); return; }

  var lr = rSheetFresh.getLastRow();
  if (lr < 2) { _dinhDangBangChiBo(sSheet, 1); return; }

  var numRows  = lr - 1;
  var colHang  = rSheetFresh.getRange(2, 1, numRows, 1).getValues();
  var colChiBo = rSheetFresh.getRange(2, 4, numRows, 1).getValues();

  var map = {};
  for (var i = 0; i < numRows; i++) {
    var ten  = String(colChiBo[i][0] || '').trim();
    var hang = Number(colHang[i][0])   || 0;
    if (!ten) continue;
    if (!map[ten]) map[ten] = { count: 0, tongHang: 0, hangTotNhat: 999999 };
    map[ten].count++;
    map[ten].tongHang += hang;
    if (hang > 0 && hang < map[ten].hangTotNhat) map[ten].hangTotNhat = hang;
  }

  var hangChiBo  = 1;
  var tongDVAll  = 0;
  var tongHangAll = 0;

  Object.keys(map)
    .sort(function(a, b) {
      if (map[b].count !== map[a].count) return map[b].count - map[a].count;
      var tbA = map[a].tongHang / map[a].count;
      var tbB = map[b].tongHang / map[b].count;
      if (tbA !== tbB) return tbA - tbB;
      return map[a].hangTotNhat - map[b].hangTotNhat;
    })
    .forEach(function(ten) {
      var c      = map[ten].count;
      var tHang  = map[ten].tongHang;
      var tbHang = (tHang / c).toFixed(1);
      sSheet.appendRow([hangChiBo++, ten, c, tHang, tbHang]);
      tongDVAll   += c;
      tongHangAll += tHang;
    });

  var tbChung = tongDVAll > 0 ? (tongHangAll / tongDVAll).toFixed(1) : '-';
  sSheet.appendRow(['', 'TỔNG CỘNG', tongDVAll, tongHangAll, tbChung]);

  var lastDataRow = sSheet.getLastRow();
  _dinhDangBangChiBo(sSheet, lastDataRow);
}

function _dinhDangBangChiBo(sSheet, lastDataRow) {
  var numCols = 5;

  sSheet.getRange(1, 1, 1, numCols)
    .setFontWeight('bold')
    .setBackground('#8B0000')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setFontSize(11);

  if (lastDataRow >= 2) {
    var dataRows = lastDataRow - 1;
    if (dataRows >= 1) {
      sSheet.getRange(2, 1, dataRows, numCols)
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setFontSize(10);

      sSheet.getRange(2, 2, dataRows, 1).setHorizontalAlignment('left');

      var chiBoRows = dataRows - 1;
      for (var i = 0; i < chiBoRows; i++) {
        var row = i + 2;
        var bg  = (i % 2 === 0) ? '#ffffff' : '#fff3e0';
        sSheet.getRange(row, 1, 1, numCols).setBackground(bg);
      }

      sSheet.getRange(lastDataRow, 1, 1, numCols)
        .setFontWeight('bold')
        .setBackground('#fff8e1')
        .setFontColor('#8B0000')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle');
      sSheet.getRange(lastDataRow, 2, 1, 1).setHorizontalAlignment('left');
    }
  }

  sSheet.setColumnWidth(1, 60);
  sSheet.setColumnWidth(2, 220);
  sSheet.setColumnWidth(3, 100);
  sSheet.setColumnWidth(4, 100);
  sSheet.setColumnWidth(5, 90);
  sSheet.setFrozenRows(1);
  sSheet.hideColumns(4);
}

// ================================================================
// HÀM TIỆN ÍCH
// ================================================================
function formatTimeToText(val) {
  if (val === undefined || val === null) return '00:00';

  if (val instanceof Date) {
    // Lưới an toàn cho dữ liệu CŨ lỡ bị Sheets đọc nhầm "MM:SS" thành giờ
    // trong ngày (vd "05:30" → 5 giờ 30 phút sáng). Cộng dồn giờ*60+phút để
    // không bị mất phần "giờ" khi quy đổi ngược lại thành thời lượng thi.
    var tongPhut = val.getHours() * 60 + val.getMinutes();
    return tongPhut.toString().padStart(2, '0') + ':' +
           val.getSeconds().toString().padStart(2, '0');
  }

  var str = String(val).trim();
  if (!str) return '00:00';

  if (str.indexOf(' ') !== -1) str = str.split(' ')[1] || '00:00';

  var parts = str.split(':');
  if (parts.length === 3) {
    return parts[1].padStart(2, '0') + ':' + parts[2].padStart(2, '0');
  }
  if (parts.length === 2) {
    return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
  }

  return '00:00';
}

function mmssTextToSeconds(text) {
  var parts = String(text || '').trim().split(':');
  if (parts.length === 2) {
    return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
  }
  return 9999;
}

var _cachedSS = null;
function getSpreadsheet() {
  if (!SPREADSHEET_ID) throw new Error('Chua dat SPREADSHEET_ID!');
  if (!_cachedSS) _cachedSS = SpreadsheetApp.openById(SPREADSHEET_ID);
  return _cachedSS;
}

function ghiLog(ham, loi) {
  try {
    var ss    = getSpreadsheet();
    var sheet = ss.getSheetByName(LOG_SHEET);
    if (!sheet) sheet = taoSheet(ss, LOG_SHEET, ['Thời gian', 'Hàm', 'Lỗi']);
    sheet.appendRow([new Date(), ham, String(loi)]);
  } catch (e) {}
}

function jsonOk(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
// TẠO SHEET
// ================================================================
function taoSheet(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  var laMoi = false;

  if (!sh) {
    sh = ss.insertSheet(name);
    laMoi = true;
  }

  // QUAN TRỌNG: KHÔNG bao giờ xoá dữ liệu của sheet đã có sẵn. Trước đây mỗi
  // lần chạy lại setup() sẽ clearContents() toàn bộ sheet — nghĩa là dữ liệu
  // bài thi cũ (HangCho, KetQuaThi, NhatKy...) bị XOÁ SẠCH nếu vô tình chạy
  // lại setup(). Giờ chỉ ghi hàng tiêu đề khi sheet thực sự đang TRỐNG; nếu
  // đã có dữ liệu thì giữ nguyên, chỉ ghi thêm ở các lần thi sau.
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }

  var headerRange = sh.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold')
    .setBackground('#8B0000')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setFontSize(11);

  if (name === QUEUE_SHEET) {
    sh.setColumnWidth(1,  240);
    sh.setColumnWidth(2,  160);
    sh.setColumnWidth(3,  100);
    sh.setColumnWidth(4,  100);
    sh.setColumnWidth(5,  200);
    sh.setColumnWidth(6,  120);
    sh.setColumnWidth(7,  200);
    sh.setColumnWidth(8,  100);
    sh.setColumnWidth(9,  220);
    sh.setColumnWidth(10, 140);
    sh.setColumnWidth(11, 100);
    sh.setColumnWidth(12, 160);
    sh.getRange(1, 6,  sh.getMaxRows(), 1).setNumberFormat('@'); // Số điện thoại → TEXT (giữ số 0 đầu)
    sh.getRange(1, 10, sh.getMaxRows(), 1).setNumberFormat('@'); // Thời gian làm bài
    sh.getRange(1, 11, sh.getMaxRows(), 1).setNumberFormat('@'); // Câu hỏi phụ → TEXT
  }

  else if (name === RESULT_SHEET) {
    sh.setColumnWidth(1, 60);
    sh.setColumnWidth(2, 200);
    sh.setColumnWidth(3, 120);
    sh.setColumnWidth(4, 200);
    sh.setColumnWidth(5, 100);
    sh.setColumnWidth(6, 220);
    sh.setColumnWidth(7, 140);
    sh.setColumnWidth(8, 100);
    sh.setColumnWidth(9, 160);
    sh.getRange(1, 3, sh.getMaxRows(), 1).setNumberFormat('@'); // Số điện thoại → TEXT (giữ số 0 đầu)
    sh.getRange(1, 7, sh.getMaxRows(), 1).setNumberFormat('@'); // Thời gian làm bài
    sh.getRange(1, 8, sh.getMaxRows(), 1).setNumberFormat('@'); // Câu hỏi phụ → TEXT
  }

  else if (name === STATS_SHEET) {
    sh.setColumnWidth(1, 60);
    sh.setColumnWidth(2, 220);
    sh.setColumnWidth(3, 100);
    sh.setColumnWidth(4, 100);
    sh.setColumnWidth(5, 90);
  }

  else if (name === LOG_SHEET) {
    sh.setColumnWidth(1, 160);
    sh.setColumnWidth(2, 150);
    sh.setColumnWidth(3, 500);
    sh.getRange(1, 3, sh.getMaxRows(), 1).setHorizontalAlignment('left');
  }

  return sh;
}

// ================================================================
// XOÁ SHEET TRỐNG MẶC ĐỊNH (Sheet1 / Trang tính1...) do Google Sheets tự
// tạo khi tạo file mới. Chỉ xoá khi:
//  • Đúng là sheet mặc định (không phải 5 sheet nghiệp vụ ta đang dùng)
//  • Sheet đó THỰC SỰ trống (không có dữ liệu) — an toàn tuyệt đối, không
//    bao giờ xoá nhầm sheet đã có dữ liệu
//  • Không phải là sheet duy nhất còn lại trong file (Sheets không cho phép
//    xoá hết sheet)
// ================================================================
function xoaSheetTrongMacDinh(ss) {
  var tenNghiepVu = [QUEUE_SHEET, RESULT_SHEET, STATS_SHEET, LOG_SHEET, BACKUP_SHEET];
  var tenMacDinhThuongGap = ['Sheet1', 'Trang tính1', 'Trang tinh1', 'Sheet 1'];

  ss.getSheets().forEach(function(sh) {
    var ten = sh.getName();
    var laSheetNghiepVu = tenNghiepVu.indexOf(ten) !== -1;
    var coTheLaMacDinh  = tenMacDinhThuongGap.indexOf(ten) !== -1;
    var dangTrong       = sh.getLastRow() === 0 && sh.getLastColumn() === 0;

    if (!laSheetNghiepVu && coTheLaMacDinh && dangTrong && ss.getSheets().length > 1) {
      try {
        ss.deleteSheet(sh);
        ghiLog('xoaSheetTrongMacDinh', 'Da xoa sheet trong mac dinh: ' + ten);
      } catch (delErr) {
        ghiLog('xoaSheetTrongMacDinh', delErr.message);
      }
    }
  });
}

// ================================================================
// HÀM CHẠY THỦ CÔNG
// ================================================================
function setup() {
  var ss = getSpreadsheet();
  taoSheet(ss, QUEUE_SHEET,  QUEUE_HEADERS);
  taoSheet(ss, RESULT_SHEET, RESULT_HEADERS);
  taoSheet(ss, STATS_SHEET,  ['Hạng','Chi bộ','Số ĐV thi','Tổng hạng','Hạng TB']);
  taoSheet(ss, LOG_SHEET,    ['Thời gian','Hàm','Lỗi']);

  createBackupSheet();

  // Dọn sheet trống mặc định (Sheet1/Trang tính1) SAU KHI các sheet nghiệp vụ
  // đã chắc chắn tồn tại — chỉ chạy 1 lần hiệu quả vào lần setup() đầu tiên,
  // các lần sau sheet mặc định không còn nên sẽ không làm gì cả.
  xoaSheetTrongMacDinh(ss);

  ScriptApp.getProjectTriggers().forEach(function(t) {
    var fn = t.getHandlerFunction();
    if (fn === 'processQueue' || fn === 'flushBackup') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('flushBackup').timeBased().everyMinutes(1).create();
  ScriptApp.newTrigger('processQueue').timeBased().everyMinutes(1).create();

  SpreadsheetApp.getUi().alert('✅ Setup xong!\n\n• Đã thêm kiểm tra trùng số điện thoại\n• Mỗi người chỉ được thi 1 lần duy nhất\n• Đã bỏ "Tuần thi", chỉ còn 1 đợt thi duy nhất\n• Dữ liệu cũ (nếu có) được GIỮ NGUYÊN, không bị xoá khi chạy lại setup()');
}

function createBackupSheet() {
  var ss = getSpreadsheet();
  var bSheet = ss.getSheetByName(BACKUP_SHEET);

  if (!bSheet) {
    bSheet = ss.insertSheet(BACKUP_SHEET);
  }

  // Giống taoSheet(): CHỈ ghi tiêu đề nếu sheet đang trống, tuyệt đối không
  // clearContents() dữ liệu bài thi dự phòng đã có nếu chạy lại setup().
  if (bSheet.getLastRow() === 0) {
    bSheet.appendRow(['Thời gian nhận', 'Họ và tên', 'Số điện thoại', 'Chi bộ',
                      'Số câu đúng', 'Câu sai', 'Thời gian làm bài', 'Câu hỏi phụ',
                      'Thời gian nộp', 'Trạng thái']);
    bSheet.setFrozenRows(1);
  }

  var headerRange = bSheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight('bold')
    .setBackground('#ff9800')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setFontSize(11);

  bSheet.setColumnWidth(1,  160);
  bSheet.setColumnWidth(2,  200);
  bSheet.setColumnWidth(3,  120);
  bSheet.setColumnWidth(4,  200);
  bSheet.setColumnWidth(5,  100);
  bSheet.setColumnWidth(6,  220);
  bSheet.setColumnWidth(7,  140);
  bSheet.setColumnWidth(8,  100);
  bSheet.setColumnWidth(9,  160);
  bSheet.setColumnWidth(10, 100);

  // Ép TOÀN BỘ cột (không chỉ vài ô) về TEXT ngay từ lúc tạo sheet, để BẤT KỲ
  // dữ liệu nào ghi vào sau này cũng không bị Google Sheets tự "thông minh"
  // chuyển đổi định dạng — đây là cách khắc phục triệt để lỗi hiển thị sai:
  //  • Cột 3 (Số điện thoại)      → tránh mất số 0 đầu / hiện ký hiệu khoa học
  //  • Cột 7 (Thời gian làm bài)  → tránh "MM:SS" bị hiểu nhầm thành giờ trong ngày
  //  • Cột 8 (Câu hỏi phụ)        → tránh bị hiểu thành ngày/giờ
  bSheet.getRange(1, 3, bSheet.getMaxRows(), 1).setNumberFormat('@');
  bSheet.getRange(1, 7, bSheet.getMaxRows(), 1).setNumberFormat('@');
  bSheet.getRange(1, 8, bSheet.getMaxRows(), 1).setNumberFormat('@');
}

function processNow() {
  processQueue();
  SpreadsheetApp.getUi().alert('✅ Đã xử lý hàng chờ!');
}

function fixExistingData() {
  var ss    = getSpreadsheet();
  var fixed = 0;

  [[RESULT_SHEET, 7], [QUEUE_SHEET, 10]].forEach(function(pair) {
    var sh = ss.getSheetByName(pair[0]);
    if (!sh || sh.getLastRow() < 2) return;
    var r = sh.getRange(2, pair[1], sh.getLastRow() - 1, 1);
    var v = r.getValues();
    v.forEach(function(row) {
      var fix = formatTimeToText(row[0]);
      if (fix !== String(row[0])) { row[0] = fix; fixed++; }
    });
    r.setValues(v);
    r.setNumberFormat('@');
  });

  SpreadsheetApp.getUi().alert('✅ Đã sửa ' + fixed + ' ô thời gian thành TEXT!');
}

function kiemTraHeThong() {
  var ss = getSpreadsheet();
  var report = [];

  report.push('═══════════════════════════════════');
  report.push('KIỂM TRA HỆ THỐNG');
  report.push('═══════════════════════════════════\n');

  var sheets = [QUEUE_SHEET, RESULT_SHEET, STATS_SHEET, LOG_SHEET, BACKUP_SHEET];
  report.push('📊 CÁC SHEET:');
  sheets.forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (sh) {
      var rows = sh.getLastRow() - 1;
      report.push('  ✅ ' + name + ': ' + rows + ' hàng dữ liệu');
    } else {
      report.push('  ❌ ' + name + ': KHÔNG TỒN TẠI');
    }
  });

  report.push('\n⏱️ TRIGGER:');
  var triggers = ScriptApp.getProjectTriggers();
  var hasFlush = false, hasProcess = false;
  triggers.forEach(function(t) {
    var fn = t.getHandlerFunction();
    if (fn === 'flushBackup')  { hasFlush   = true; report.push('  ✅ flushBackup (mỗi phút)'); }
    if (fn === 'processQueue') { hasProcess = true; report.push('  ✅ processQueue (mỗi phút)'); }
  });
  if (!hasFlush)   report.push('  ❌ THIẾU trigger flushBackup');
  if (!hasProcess) report.push('  ❌ THIẾU trigger processQueue');

  var bSheet = ss.getSheetByName(BACKUP_SHEET);
  if (bSheet && bSheet.getLastRow() > 1) {
    var pending = 0;
    var bData = bSheet.getRange(2, 1, bSheet.getLastRow() - 1, 10).getValues();
    bData.forEach(function(row) {
      if (String(row[9]).toUpperCase() === 'PENDING') pending++;
    });
    report.push('\n⚠️ HÀNG CHỜ DỰ PHÒNG:');
    report.push('  • ' + pending + ' bài chưa xử lý trong DuPhong');
    if (pending > 0) report.push('  → Trigger 1 phút sẽ tự động chuyển sang HangCho');
  }

  var qSheet = ss.getSheetByName(QUEUE_SHEET);
  var rSheet = ss.getSheetByName(RESULT_SHEET);
  if (qSheet && qSheet.getLastRow() > 1) {
    var qData = qSheet.getRange(2, 1, qSheet.getLastRow() - 1, 3).getValues();
    var qPending = 0;
    qData.forEach(function(r) { if (r[2] === 'PENDING') qPending++; });
    if (qPending > 0) {
      report.push('\n📋 HÀNG CHỜ CHÍNH:');
      report.push('  • ' + qPending + ' bài chưa xử lý trong HangCho');
    }
  }
  if (rSheet && rSheet.getLastRow() > 1) {
    var totalTests = rSheet.getLastRow() - 1;
    report.push('\n✅ KẾT QUẢ:');
    report.push('  • Tổng: ' + totalTests + ' bài đã hoàn thành');
  }

  report.push('\n═══════════════════════════════════');
  report.push('Thời gian kiểm tra: ' + new Date().toLocaleString('vi-VN'));
  report.push('═══════════════════════════════════');

  var msg = report.join('\n');
  Logger.log(msg);
  SpreadsheetApp.getUi().alert(msg);
}

function resetAll() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('Xóa hết dữ liệu?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  var ss = getSpreadsheet();
  [QUEUE_SHEET, RESULT_SHEET, STATS_SHEET, LOG_SHEET, BACKUP_SHEET].forEach(function(name) {
    var sh = ss.getSheetByName(name);
    if (sh && sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
  });
  ui.alert('✅ Đã xóa sạch dữ liệu!');
}
