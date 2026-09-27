// ================================================================
// thele.js - Modal Thể lệ Cuộc thi (toàn màn hình)
// Layout: Header gọn (cố định) + Nội dung chính (flex 1) + Footer chỉ có nút Đã hiểu
// Chữ ký "Ban Tổ chức Cuộc thi" nằm CUỐI nội dung, trượt theo khi cuộn
// ================================================================
(function () {
  'use strict';

  if (typeof window.openTheLeModal === 'function') {
    console.log('[thele.js] Đã có hàm mở modal, bỏ qua.');
    return;
  }

  // 1. Inject CSS
  if (!document.getElementById('thele-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'thele-modal-styles';
    style.textContent = `
      /* ===== MODAL THỂ LỆ TOÀN MÀN HÌNH ===== */
      .thele-modal {
        display: none !important;
        position: fixed;
        inset: 0;
        z-index: 100001;
        background: rgba(20, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        animation: theleFadeIn .25s ease;
      }
      .thele-modal.open { display: flex !important; }
      @keyframes theleFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes theleSlideUp {
        from { transform: translateY(20px); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }

      .thele-dialog {
        position: relative;
        flex: 1 1 auto;
        margin: 14px;
        background: #fdf6ec;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: theleSlideUp .3s ease;
        max-height: calc(100vh - 28px);
      }

      /* ===== HEADER GỌN ===== */
      .thele-header {
        flex: 0 0 auto;
        background: linear-gradient(135deg, #8B0000, #b71c1c);
        color: #fff;
        padding: 10px 12px 10px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.22);
        z-index: 6;
      }
      .thele-header-title {
        flex: 1 1 auto;
        min-width: 0;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: .3px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .thele-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .thele-toc-btn {
        height: 36px;
        padding: 0 14px;
        border-radius: 18px;
        border: 1.5px solid rgba(255,255,255,.75);
        background: rgba(255,255,255,.12);
        color: #fff;
        font-size: .85rem;
        font-weight: 600;
        cursor: pointer;
        transition: .2s;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .thele-toc-btn:hover { background: rgba(255,255,255,.3); }
      .thele-close {
        width: 36px; height: 36px;
        padding: 0;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,.75);
        background: rgba(255,255,255,.12);
        color: #fff;
        font-size: 1.05rem;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        transition: .2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thele-close:hover { background: rgba(255,255,255,.3); transform: rotate(90deg); }

      /* ===== BODY ===== */
      .thele-body {
        flex: 1 1 auto;
        position: relative;
        overflow: hidden;
        min-height: 0;
      }

      /* ===== NỘI DUNG CHÍNH ===== */
      .thele-content {
        position: absolute;
        inset: 0;
        padding: 20px 22px 24px;
        overflow-y: auto;
        scroll-behavior: smooth;
        color: #333;
        line-height: 1.7;
        font-size: 15px;
        -webkit-overflow-scrolling: touch;
      }
      .thele-content::-webkit-scrollbar { width: 10px; }
      .thele-content::-webkit-scrollbar-thumb {
        background: #b8860b; border-radius: 5px;
      }
      .thele-content::-webkit-scrollbar-track { background: #fdf6ec; }

      .thele-inner { max-width: 900px; margin: 0 auto; }

      .thele-content h1.thele-main-title {
        text-align: center;
        color: #8B0000;
        font-size: 1.35rem;
        font-weight: 800;
        margin: 0 0 8px;
        line-height: 1.35;
        text-transform: uppercase;
        letter-spacing: .5px;
      }
      .thele-content .thele-sub-title {
        text-align: center;
        color: #b71c1c;
        font-style: italic;
        margin: 0 0 18px;
        font-size: .98rem;
        line-height: 1.5;
      }
      .thele-content .thele-decree {
        text-align: center;
        font-size: .93rem;
        color: #5d3a1a;
        margin: 0 auto 22px;
        padding: 12px 16px;
        background: #fff8e1;
        border: 2px solid #b8860b;
        border-radius: 10px;
        max-width: 600px;
        line-height: 1.6;
      }

      .thele-content .dieu {
        margin-bottom: 18px;
        padding: 16px 20px;
        background: #fff;
        border-radius: 12px;
        border-left: 4px solid #b8860b;
        border-right: 4px solid #b8860b;
        box-shadow: 0 2px 8px rgba(184,134,11,0.1);
        scroll-margin-top: 16px;
      }
      .thele-content .dieu-title {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #8B0000;
        font-size: 1.05rem;
        font-weight: 700;
        margin: 0 0 12px;
        padding-bottom: 10px;
        border-bottom: 2px dashed #e0c98a;
        text-transform: uppercase;
        letter-spacing: .3px;
      }
      .thele-content .dieu-title .dieu-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px; height: 32px;
        background: linear-gradient(135deg, #8B0000, #b71c1c);
        color: #ffe259;
        border-radius: 50%;
        font-size: .9rem;
        font-weight: 700;
        flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(139,0,0,0.3);
      }
      .thele-content .dieu p { margin: 6px 0; }
      .thele-content .dieu ol,
      .thele-content .dieu ul { margin: 6px 0 6px 4px; padding-left: 22px; }
      .thele-content .dieu li { margin-bottom: 6px; }
      .thele-content .dieu li::marker { color: #b8860b; font-weight: 700; }
      .thele-content .dieu .sub-list { padding-left: 22px; margin-top: 4px; }
      .thele-content .dieu .sub-list li::marker { color: #c62828; }
      .thele-content .highlight {
        background: #fff3cd;
        padding: 1px 6px;
        border-radius: 3px;
        color: #8B0000;
        font-weight: 600;
      }
      .thele-content .formula {
        display: block;
        background: #f8f1dc;
        padding: 10px 14px;
        border-radius: 6px;
        border-left: 3px solid #8B0000;
        margin: 8px 0;
        font-family: 'Consolas', monospace;
        font-size: .92rem;
        color: #5d3a1a;
      }

      /* ===== CHỮ KÝ CUỐI NỘI DUNG (trượt theo) ===== */
      .thele-sign-block {
        margin: 26px 0 8px;
        padding: 18px 0 6px;
        text-align: center;
        border-top: 2px dashed #e0c98a;
      }
      .thele-sign-block .thele-sign-label {
        font-style: italic;
        color: #555;
        font-size: .9rem;
        margin-bottom: 6px;
      }
      .thele-sign-block .thele-sign-name {
        color: #8B0000;
        font-weight: 800;
        font-size: 1rem;
        letter-spacing: .5px;
        text-transform: uppercase;
      }

      /* ===== PANEL MỤC LỤC TRƯỢT ===== */
      .thele-toc-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(20,0,0,.35);
        opacity: 0;
        pointer-events: none;
        transition: opacity .25s ease;
        z-index: 4;
      }
      .thele-toc-backdrop.show {
        opacity: 1;
        pointer-events: auto;
      }
      .thele-toc-panel {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 340px;
        max-width: 88%;
        background: #fff8e1;
        border-left: 2px solid #e0c98a;
        box-shadow: -10px 0 30px rgba(0,0,0,.2);
        transform: translateX(105%);
        transition: transform .28s cubic-bezier(.4,0,.2,1);
        z-index: 5;
        display: flex;
        flex-direction: column;
      }
      .thele-toc-panel.open { transform: translateX(0); }
      .thele-toc-panel-head {
        flex: 0 0 auto;
        padding: 12px 14px;
        background: linear-gradient(135deg, #8B0000, #b71c1c);
        color: #fff;
        font-weight: 700;
        font-size: .95rem;
        letter-spacing: .5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .thele-toc-panel-close {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1.15rem;
        font-weight: 700;
        cursor: pointer;
        padding: 2px 6px;
        line-height: 1;
      }
      .thele-toc-list {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 10px;
        -webkit-overflow-scrolling: touch;
      }
      .thele-toc-list a {
        display: block;
        padding: 10px 12px;
        color: #5d3a1a;
        text-decoration: none;
        font-size: .9rem;
        border-radius: 8px;
        margin-bottom: 4px;
        background: #fff;
        border: 1px solid #f0e6cc;
        transition: .15s;
        line-height: 1.35;
      }
      .thele-toc-list a:hover,
      .thele-toc-list a:active {
        background: #ffe259;
        color: #8B0000;
        border-color: #b8860b;
      }
      .thele-toc-list a strong {
        color: #8B0000;
        margin-right: 4px;
      }

      /* ===== FOOTER CHỈ CÒN NÚT ĐÃ HIỂU (RẤT GỌN) ===== */
      .thele-footer {
        flex: 0 0 auto;
        padding: 8px 16px;
        background: #fff8e1;
        border-top: 1px solid #f0e6cc;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,.05);
        z-index: 6;
      }
      .thele-ok-btn {
        padding: 10px 34px;
        background: linear-gradient(135deg, #8B0000, #b71c1c);
        color: #fff;
        border: none;
        border-radius: 30px;
        font-size: .92rem;
        font-weight: 700;
        letter-spacing: .5px;
        cursor: pointer;
        transition: .25s;
        box-shadow: 0 4px 12px rgba(139,0,0,0.3);
      }
      .thele-ok-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(139,0,0,0.45);
        background: linear-gradient(135deg, #a00000, #d32f2f);
      }
      .thele-ok-btn:active { transform: translateY(0); }

      /* ===== NÚT MỞ THỂ LỆ Ở TRANG CHÍNH ===== */
      .the-le-link {
        display: block;
        text-align: center;
        padding: 14px 18px;
        margin: 14px 0 20px;
        background: linear-gradient(135deg, #fff8e1, #fff3cd);
        border: 2px dashed #b8860b;
        border-radius: 10px;
        cursor: pointer;
        transition: .25s;
        color: #8B0000;
      }
      .the-le-link:hover {
        background: linear-gradient(135deg, #ffe259, #ffd700);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(184,134,11,0.25);
      }
      .the-le-link strong { font-size: 1.05rem; letter-spacing: .3px; }
      .the-le-link small { color: #8B0000; opacity: .85; }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 700px) {
        .thele-dialog { margin: 0; border-radius: 0; max-height: 100vh; }
        .thele-header { padding: 8px 10px 8px 14px; }
        .thele-header-title { font-size: .88rem; }
        .thele-toc-btn { padding: 0 10px; font-size: .78rem; height: 34px; }
        .thele-close { width: 34px; height: 34px; font-size: 1rem; }
        .thele-content { padding: 16px 14px 20px; font-size: 14px; }
        .thele-content h1.thele-main-title { font-size: 1.1rem; }
        .thele-content .dieu { padding: 12px 14px; }
        .thele-content .dieu-title { font-size: .95rem; }
        .thele-content .dieu-title .dieu-num { width: 26px; height: 26px; font-size: .8rem; }
        .thele-footer { padding: 6px 12px; }
        .thele-ok-btn { padding: 9px 26px; font-size: .85rem; }
        .thele-toc-panel { width: 300px; }
        .thele-sign-block { margin: 20px 0 6px; padding: 14px 0 4px; }
        .thele-sign-block .thele-sign-name { font-size: .92rem; }
      }
      @media (max-width: 420px) {
        .thele-header-title { font-size: .82rem; }
        .thele-toc-btn { padding: 0 8px; font-size: .72rem; }
        .thele-toc-btn span.thele-toc-text { display: none; }
      }
    `;
    document.head.appendChild(style);
    console.log('[thele.js] ✅ Đã inject CSS');
  }

  // 2. Tạo HTML modal
  function buildModal() {
    if (document.getElementById('theleModal')) {
      console.log('[thele.js] Modal đã tồn tại, không build lại.');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'theleModal';
    modal.className = 'thele-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Thể lệ cuộc thi');

    modal.innerHTML = `
      <div class="thele-dialog">

        <!-- ===== HEADER GỌN (CỐ ĐỊNH TRÊN) ===== -->
        <div class="thele-header">
          <div class="thele-header-title">📜 THỂ LỆ CUỘC THI TRỰC TUYẾN</div>
          <div class="thele-header-actions">
            <button type="button" class="thele-toc-btn" id="theleTocBtn" aria-label="Mở mục lục">
              📋 <span class="thele-toc-text">Mục lục</span>
            </button>
            <button type="button" class="thele-close" id="theleCloseBtn" aria-label="Đóng">✕</button>
          </div>
        </div>

        <!-- ===== BODY: NỘI DUNG CHÍNH + PANEL MỤC LỤC ===== -->
        <div class="thele-body">

          <div class="thele-content" id="theleContent">
            <div class="thele-inner">

              <h1 class="thele-main-title">THỂ LỆ CUỘC THI TRỰC TUYẾN</h1>
              <p class="thele-sub-title">
                "Tìm hiểu các quy định về công tác kiểm tra, giám sát, kỷ luật của Đảng,
                những điều đảng viên không được làm và truyền thống Ngành Kiểm tra Đảng" tại Đảng bộ phường Thanh Khê
              </p>
              <div class="thele-decree">
                (Ban hành kèm theo Kế hoạch số <span class="highlight">176-KH/ĐU</span><br>
                ngày <span class="highlight">22/9/2026</span> của Ban Thường vụ Đảng ủy phường Thanh Khê)
              </div>

              <div class="dieu" id="tl-d1">
                <h2 class="dieu-title"><span class="dieu-num">I</span>Điều 1. Mục đích, yêu cầu</h2>
                <ol>
                  <li>Thể lệ này quy định về đối tượng, nội dung, hình thức, thời gian, cách thức tham gia, nguyên tắc chấm điểm, xét giải, khen thưởng và xử lý vi phạm đối với Cuộc thi.</li>
                  <li>Cuộc thi được tổ chức thiết thực, nghiêm túc, công khai, minh bạch, tiết kiệm, hiệu quả; bảo đảm thuận tiện cho đảng viên tham gia và phù hợp với điều kiện thực tế của Đảng bộ phường Thanh Khê.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d2">
                <h2 class="dieu-title"><span class="dieu-num">II</span>Điều 2. Đối tượng tham gia</h2>
                <ol>
                  <li>Toàn thể đảng viên đang sinh hoạt tại các tổ chức đảng trực thuộc Đảng ủy phường Thanh Khê.</li>
                  <li>Không thuộc đối tượng tham gia Cuộc thi:
                    <ul class="sub-list">
                      <li>Đảng viên đang được miễn sinh hoạt đảng theo quy định;</li>
                      <li>Đảng viên đang trong thời gian bị đình chỉ sinh hoạt đảng;</li>
                      <li>Đảng viên đang sinh hoạt tạm thời ngoài Đảng bộ phường hoặc không thuộc phạm vi quản lý của các tổ chức đảng trực thuộc Đảng ủy phường tại thời điểm tổ chức Cuộc thi;</li>
                      <li>Các trường hợp đặc biệt khác do Ban Tổ chức Cuộc thi xem xét, quyết định.</li>
                    </ul>
                  </li>
                  <li>Các tổ chức đảng trực thuộc có trách nhiệm rà soát, xác định danh sách đảng viên thuộc diện tham gia, các trường hợp không thuộc đối tượng tham gia bảo đảm chính xác, đầy đủ, phục vụ việc cấp tài khoản và xác định tỷ lệ tham gia Cuộc thi.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d3">
                <h2 class="dieu-title"><span class="dieu-num">III</span>Điều 3. Nội dung thi</h2>
                <ol>
                  <li>Tìm hiểu những nội dung cơ bản về quá trình hình thành, xây dựng và trưởng thành; truyền thống vẻ vang của Ngành Kiểm tra Đảng; vị trí, vai trò, ý nghĩa của công tác kiểm tra, giám sát và thi hành kỷ luật của Đảng.</li>
                  <li>Tìm hiểu những nội dung cơ bản, cốt lõi của <span class="highlight">Quy định số 21-QĐ/TW ngày 11/4/2026</span> của Ban Chấp hành Trung ương về công tác kiểm tra, giám sát và kỷ luật của Đảng, trọng tâm là những nội dung liên quan trực tiếp đến cấp ủy, tổ chức đảng và đảng viên.</li>
                  <li>Tìm hiểu <span class="highlight">Quy định số 207-QĐ/TW ngày 26/7/2026</span> của Ban Chấp hành Trung ương về những điều đảng viên không được làm; trách nhiệm của đảng viên trong chấp hành Điều lệ Đảng, các quy định của Đảng, giữ gìn phẩm chất, uy tín, kỷ luật, kỷ cương của Đảng.</li>
                  <li>Tìm hiểu <span class="highlight">Quy định số 212-QĐ/TW ngày 17/8/2026</span> của Bộ Chính trị về kỷ luật tổ chức đảng, đảng viên vi phạm.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d4">
                <h2 class="dieu-title"><span class="dieu-num">IV</span>Điều 4. Tài liệu nghiên cứu, tham khảo</h2>
                <ul>
                  <li>Quy định số 21-QĐ/TW ngày 11/4/2026 của Ban Chấp hành Trung ương về công tác kiểm tra, giám sát và kỷ luật của Đảng;</li>
                  <li>Quy định số 207-QĐ/TW ngày 26/7/2026 của Ban Chấp hành Trung ương về những điều đảng viên không được làm;</li>
                  <li>Quy định số 212-QĐ/TW ngày 17/8/2026 của Bộ Chính trị về kỷ luật tổ chức đảng, đảng viên vi phạm;</li>
                  <li>Kết luận số 34-KL/TW ngày 18/4/2022 của Bộ Chính trị về Chiến lược công tác kiểm tra, giám sát của Đảng đến năm 2030;</li>
                  <li>Các tài liệu chính thống về lịch sử, truyền thống Ngành Kiểm tra Đảng;</li>
                  <li>Các tài liệu có liên quan do Ban Tổ chức Cuộc thi cung cấp.</li>
                </ul>
              </div>

              <div class="dieu" id="tl-d5">
                <h2 class="dieu-title"><span class="dieu-num">V</span>Điều 5. Hình thức và cấu trúc bài thi</h2>
                <ol>
                  <li>Cuộc thi được tổ chức bằng hình thức trắc nghiệm trực tuyến trên hệ thống do Ban Tổ chức Cuộc thi lựa chọn và thiết lập.</li>
                  <li>Mỗi bài thi gồm <span class="highlight">40 câu hỏi trắc nghiệm</span>; mỗi câu hỏi có 04 phương án trả lời, trong đó có 01 phương án đúng.</li>
                  <li>Cơ cấu câu hỏi gồm:
                    <ul class="sub-list">
                      <li>Quy định số 21-QĐ/TW: <strong>18 câu</strong>, chiếm 45%;</li>
                      <li>Quy định số 207-QĐ/TW: <strong>08 câu</strong>, chiếm 20%;</li>
                      <li>Quy định số 212-QĐ/TW: <strong>08 câu</strong>, chiếm 20%;</li>
                      <li>Truyền thống Ngành Kiểm tra Đảng: <strong>06 câu</strong>, chiếm 15%.</li>
                    </ul>
                  </li>
                  <li>Câu hỏi được lựa chọn từ ngân hàng câu hỏi đã được xây dựng, rà soát, thẩm định và quản lý theo quy định; bảo đảm chính xác, khách quan, phù hợp với đối tượng dự thi và bám sát nội dung Cuộc thi.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d6">
                <h2 class="dieu-title"><span class="dieu-num">VI</span>Điều 6. Thời gian và cách thức tham gia</h2>
                <ol>
                  <li>Thời gian thi chính thức: từ ngày <span class="highlight">01/10/2026</span> đến hết ngày <span class="highlight">06/10/2026</span>.</li>
                  <li>Ban Tổ chức chuẩn bị <span class="highlight">03 bộ đề thi</span>; mỗi bộ đề thi gồm 40 câu. Mỗi đảng viên được lựa chọn 1 trong 3 bộ đề để thực hiện phần thi của mình.</li>
                  <li>Thời gian làm bài: <span class="highlight">40 phút</span> kể từ thời điểm hệ thống ghi nhận người dự thi bắt đầu làm bài.</li>
                  <li>Người dự thi sử dụng tài khoản hoặc thông tin đăng nhập được cung cấp theo hướng dẫn để tham gia Cuộc thi; tự chịu trách nhiệm về việc bảo quản, sử dụng tài khoản và tính chính xác của thông tin cá nhân.</li>
                  <li>Người dự thi phải hoàn thành và nộp bài trong thời gian quy định. Hết thời gian làm bài, hệ thống tự động ghi nhận kết quả.</li>
                  <li>Trường hợp xảy ra sự cố kỹ thuật khách quan làm ảnh hưởng đến việc tham gia Cuộc thi, người dự thi phải thông báo ngay cho tổ chức đảng trực thuộc để tổng hợp, báo cáo Ủy ban Kiểm tra Đảng ủy. Ban Tổ chức Cuộc thi căn cứ dữ liệu hệ thống và tình hình thực tế để xem xét, quyết định việc xử lý.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d7">
                <h2 class="dieu-title"><span class="dieu-num">VII</span>Điều 7. Chấm điểm và xác định kết quả cá nhân</h2>
                <ol>
                  <li>Mỗi câu trả lời đúng được tính <span class="highlight">01 điểm</span>; câu trả lời sai hoặc không trả lời được tính 0 điểm. Tổng điểm tối đa của bài thi là <span class="highlight">40 điểm</span>.</li>
                  <li>Hệ thống thi trực tuyến tự động chấm điểm và ghi nhận kết quả sau khi người dự thi hoàn thành bài thi.</li>
                  <li>Kết quả chính thức của người dự thi được xác định trên cơ sở dữ liệu do hệ thống ghi nhận và được Ban Tổ chức Cuộc thi kiểm tra, xác nhận.</li>
                  <li>Xếp hạng cá nhân được xác định theo thứ tự các tiêu chí sau:
                    <ul class="sub-list">
                      <li><strong>Thứ nhất — Điểm số:</strong> Người có tổng số điểm cao hơn xếp trên;</li>
                      <li><strong>Thứ hai — Thời gian:</strong> Người có thời gian hoàn thành bài thi ngắn hơn xếp trên; thời gian được tính từ thời điểm hệ thống ghi nhận người dự thi bắt đầu làm bài đến thời điểm hệ thống ghi nhận nộp bài;</li>
                      <li><strong>Thứ ba — Dự đoán số người tham gia</strong> (chỉ xét khi bằng cả điểm và thời gian): Người có kết quả dự đoán số người tham gia dự thi sát với số người thực tế tham gia Cuộc thi hơn thì xếp trên.</li>
                      <li><strong>Thứ tư:</strong> Trường hợp các tiêu chí trên vẫn không xác định được thứ hạng, Ban Tổ chức Cuộc thi xem xét, quyết định.</li>
                    </ul>
                  </li>
                  <li>Người dự thi không thực hiện nội dung dự đoán số người tham gia dự thi thì không được xét ưu tiên theo tiêu chí thứ ba khoản 4 Điều này.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d8">
                <h2 class="dieu-title"><span class="dieu-num">VIII</span>Điều 8. Tiêu chí xét trao giải tập thể</h2>
                <ol>
                  <li><strong>Đối tượng xét giải:</strong> Các tổ chức đảng trực thuộc Đảng ủy phường Thanh Khê có đảng viên thuộc diện tham gia Cuộc thi.</li>
                  <li><strong>Điều kiện xét giải:</strong> Tập thể được xét giải khi đáp ứng đủ các điều kiện sau:
                    <ul class="sub-list">
                      <li>Có tỷ lệ đảng viên thuộc diện tham gia hoàn thành bài thi đạt từ <span class="highlight">70% trở lên</span>;</li>
                      <li>Không có vi phạm nghiêm trọng trong quá trình tham gia Cuộc thi.</li>
                    </ul>
                    <span class="formula">Tỷ lệ (%) = (Số đảng viên hoàn thành bài thi / Tổng số đảng viên thuộc diện tham gia) × 100</span>
                    Trong đó:
                    <ul class="sub-list">
                      <li>Tổng số đảng viên thuộc diện tham gia được xác định theo danh sách chốt tại thời điểm Ban Tổ chức Cuộc thi công bố, sau khi đã loại trừ các trường hợp quy định tại khoản 2 Điều 2 của Thể lệ này;</li>
                      <li>Kết quả tính toán được làm tròn đến 02 chữ số thập phân.</li>
                    </ul>
                  </li>
                  <li>Các tập thể đủ điều kiện xét giải được xếp hạng theo thứ tự các tiêu chí sau:
                    <ul class="sub-list">
                      <li><strong>Tiêu chí 1 (Số lượng):</strong> Tập thể có tỷ lệ đảng viên hoàn thành bài thi chính thức cao hơn xếp trên;</li>
                      <li><strong>Tiêu chí 2 (Chất lượng):</strong> Trường hợp các tập thể có tỷ lệ đảng viên hoàn thành bài thi bằng nhau, tiếp tục xét theo điểm trung bình kết quả thi của các đảng viên tham gia (tập thể có điểm trung bình cao hơn xếp trên).
                        <span class="formula">Điểm trung bình = Tổng điểm của các đảng viên đã hoàn thành bài thi / Số đảng viên đã hoàn thành bài thi</span>
                        Kết quả được làm tròn đến 02 chữ số thập phân.
                      </li>
                      <li>Trường hợp đã áp dụng các tiêu chí trên mà vẫn bằng nhau, Ban Tổ chức Cuộc thi xem xét và ra quyết định cuối cùng.</li>
                    </ul>
                  </li>
                  <li>Các trường hợp đảng viên không thuộc đối tượng tham gia theo Điều 2 của Thể lệ không tính vào tổng số đảng viên thuộc diện tham gia khi xác định tỷ lệ hoàn thành của tập thể.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d9">
                <h2 class="dieu-title"><span class="dieu-num">IX</span>Điều 9. Cơ cấu giải thưởng</h2>
                <ol>
                  <li><strong>Giải tập thể:</strong>
                    <ul class="sub-list">
                      <li>01 giải nhất: <span class="highlight">1.500.000 đồng</span>/giải</li>
                      <li>03 giải nhì: <span class="highlight">1.000.000 đồng</span>/giải</li>
                      <li>07 giải ba: <span class="highlight">700.000 đồng</span>/giải</li>
                      <li>10 giải khuyến khích: <span class="highlight">500.000 đồng</span>/giải</li>
                    </ul>
                  </li>
                  <li><strong>Giải cá nhân:</strong>
                    <ul class="sub-list">
                      <li>01 giải nhất: <span class="highlight">700.000 đồng</span>/giải</li>
                      <li>05 giải nhì: <span class="highlight">500.000 đồng</span>/giải</li>
                      <li>10 giải ba: <span class="highlight">400.000 đồng</span>/giải</li>
                      <li>15 giải khuyến khích: <span class="highlight">300.000 đồng</span>/giải</li>
                    </ul>
                  </li>
                  <li>Ban Tổ chức Cuộc thi căn cứ kết quả thi và các tiêu chí quy định tại Thể lệ để lựa chọn, đề nghị công nhận các tập thể, cá nhân đạt giải.</li>
                  <li>Mức thưởng thực hiện theo quyết định của Ban Thường vụ Đảng ủy phường và quy định hiện hành.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d10">
                <h2 class="dieu-title"><span class="dieu-num">X</span>Điều 10. Quy định đối với người dự thi</h2>
                <ol>
                  <li>Tham gia Cuộc thi với tinh thần nghiêm túc, tự giác, trung thực; chủ động nghiên cứu tài liệu và hoàn thành bài thi đúng thời gian quy định.</li>
                  <li>Sử dụng đúng tài khoản và thông tin cá nhân để tham gia Cuộc thi; không cho người khác sử dụng tài khoản của mình và không nhờ người khác làm bài thi thay.</li>
                  <li>Không thực hiện các hành vi gian lận, can thiệp trái phép vào hệ thống thi, làm sai lệch dữ liệu hoặc ảnh hưởng đến tính khách quan, công bằng và nghiêm túc của Cuộc thi.</li>
                  <li>Khi phát hiện sự cố hoặc vấn đề bất thường trong quá trình thi, phải kịp thời thông báo cho tổ chức đảng trực thuộc hoặc bộ phận được Ban Tổ chức phân công để được hướng dẫn, xử lý.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d11">
                <h2 class="dieu-title"><span class="dieu-num">XI</span>Điều 11. Xử lý vi phạm</h2>
                <ol>
                  <li>Người dự thi vi phạm Thể lệ, có hành vi gian lận, nhờ người khác thi thay, sử dụng tài khoản của người khác hoặc can thiệp trái phép vào hệ thống thi thì tùy theo mức độ vi phạm, Ban Tổ chức Cuộc thi quyết định hủy kết quả bài thi hoặc không công nhận thành tích.</li>
                  <li>Trường hợp vi phạm được phát hiện sau khi đã công bố kết quả hoặc trao giải, Ban Tổ chức Cuộc thi có quyền hủy kết quả, thu hồi giải thưởng và xem xét trách nhiệm của cá nhân, tổ chức có liên quan.</li>
                  <li>Tổ chức, cá nhân cố ý cung cấp thông tin không chính xác hoặc có hành vi làm sai lệch kết quả Cuộc thi thì tùy tính chất, mức độ sẽ bị xem xét, xử lý theo thẩm quyền.</li>
                </ol>
              </div>

              <div class="dieu" id="tl-d12">
                <h2 class="dieu-title"><span class="dieu-num">XII</span>Điều 12. Tổ chức thực hiện</h2>
                <ol>
                  <li>Ban Tổ chức Cuộc thi, Ủy ban Kiểm tra Đảng ủy phường, các cơ quan, đơn vị, tổ chức đảng trực thuộc và các cá nhân có liên quan thực hiện nhiệm vụ theo Kế hoạch, Quyết định thành lập Ban Tổ chức, Tổ Thư ký và Thể lệ Cuộc thi.</li>
                  <li>Trong quá trình thực hiện, nếu có khó khăn, vướng mắc hoặc phát sinh nội dung cần điều chỉnh, bổ sung, Ủy ban Kiểm tra Đảng ủy tổng hợp, báo cáo Ban Tổ chức Cuộc thi xem xét, quyết định hoặc tham mưu Ban Thường vụ Đảng ủy phường xem xét, quyết định đối với những nội dung thuộc thẩm quyền.</li>
                </ol>
              </div>

              <!-- CHỮ KÝ NẰM CUỐI NỘI DUNG, TRƯỢT THEO KHI CUỘN -->
              <div class="thele-sign-block">
                <div class="thele-sign-name">BAN TỔ CHỨC CUỘC THI</div>
              </div>

            </div>
          </div>

          <!-- BACKDROP + PANEL MỤC LỤC TRƯỢT -->
          <div class="thele-toc-backdrop" id="theleTocBackdrop"></div>
          <nav class="thele-toc-panel" id="theleTocPanel" aria-label="Mục lục thể lệ">
            <div class="thele-toc-panel-head">
              <span>📋 MỤC LỤC</span>
              <button type="button" class="thele-toc-panel-close" id="theleTocClose" aria-label="Đóng mục lục">✕</button>
            </div>
            <div class="thele-toc-list">
              <a href="#tl-d1"><strong>Điều 1.</strong> Mục đích, yêu cầu</a>
              <a href="#tl-d2"><strong>Điều 2.</strong> Đối tượng tham gia</a>
              <a href="#tl-d3"><strong>Điều 3.</strong> Nội dung thi</a>
              <a href="#tl-d4"><strong>Điều 4.</strong> Tài liệu tham khảo</a>
              <a href="#tl-d5"><strong>Điều 5.</strong> Hình thức &amp; cấu trúc</a>
              <a href="#tl-d6"><strong>Điều 6.</strong> Thời gian &amp; cách thức</a>
              <a href="#tl-d7"><strong>Điều 7.</strong> Chấm điểm cá nhân</a>
              <a href="#tl-d8"><strong>Điều 8.</strong> Giải tập thể</a>
              <a href="#tl-d9"><strong>Điều 9.</strong> Cơ cấu giải thưởng</a>
              <a href="#tl-d10"><strong>Điều 10.</strong> Quy định người thi</a>
              <a href="#tl-d11"><strong>Điều 11.</strong> Xử lý vi phạm</a>
              <a href="#tl-d12"><strong>Điều 12.</strong> Tổ chức thực hiện</a>
            </div>
          </nav>

        </div>

        <!-- ===== FOOTER RẤT GỌN – CHỈ CÒN NÚT ĐÃ HIỂU ===== -->
        <div class="thele-footer">
          <button type="button" class="thele-ok-btn" id="theleOkBtn">✓ ĐÃ HIỂU</button>
        </div>

      </div>
    `;
    document.body.appendChild(modal);
    console.log('[thele.js] ✅ Đã build modal HTML');

    // ---- Các tham chiếu ----
    const closeBtn     = document.getElementById('theleCloseBtn');
    const okBtn        = document.getElementById('theleOkBtn');
    const tocBtn       = document.getElementById('theleTocBtn');
    const tocPanel     = document.getElementById('theleTocPanel');
    const tocClose     = document.getElementById('theleTocClose');
    const tocBackdrop  = document.getElementById('theleTocBackdrop');
    const content      = document.getElementById('theleContent');

    // ---- Đóng / mở modal ----
    if (closeBtn) closeBtn.addEventListener('click', closeTheLeModal);
    if (okBtn)    okBtn.addEventListener('click',    closeTheLeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeTheLeModal();
    });

    // ---- Mở / đóng panel mục lục ----
    function openToc() {
      if (!tocPanel) return;
      tocPanel.classList.add('open');
      if (tocBackdrop) tocBackdrop.classList.add('show');
    }
    function closeToc() {
      if (!tocPanel) return;
      tocPanel.classList.remove('open');
      if (tocBackdrop) tocBackdrop.classList.remove('show');
    }
    if (tocBtn)      tocBtn.addEventListener('click', openToc);
    if (tocClose)    tocClose.addEventListener('click', closeToc);
    if (tocBackdrop) tocBackdrop.addEventListener('click', closeToc);

    // ---- Click mục lục -> cuộn mượt tới điều tương ứng + đóng panel ----
    modal.querySelectorAll('.thele-toc-list a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = a.getAttribute('href').slice(1);
        const target   = document.getElementById(targetId);
        if (target && content) {
          const top = target.offsetTop - content.offsetTop;
          content.scrollTo({ top: top - 10, behavior: 'smooth' });
        }
        closeToc();
      });
    });

    // ---- Phím ESC ----
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (tocPanel && tocPanel.classList.contains('open')) {
        closeToc();
        return;
      }
      if (modal.classList.contains('open')) closeTheLeModal();
    });
  }

  // 3. Hàm mở / đóng modal
  function openTheLeModal() {
    console.log('[thele.js] Mở modal thể lệ');
    buildModal();
    const modal = document.getElementById('theleModal');
    if (!modal) {
      console.error('[thele.js] ❌ Không tìm thấy modal sau khi build!');
      return;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const tocPanel = document.getElementById('theleTocPanel');
    const tocBd    = document.getElementById('theleTocBackdrop');
    if (tocPanel) tocPanel.classList.remove('open');
    if (tocBd)    tocBd.classList.remove('show');

    const content = document.getElementById('theleContent');
    if (content) content.scrollTop = 0;
  }

  function closeTheLeModal() {
    const modal = document.getElementById('theleModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';

    const tocPanel = document.getElementById('theleTocPanel');
    const tocBd    = document.getElementById('theleTocBackdrop');
    if (tocPanel) tocPanel.classList.remove('open');
    if (tocBd)    tocBd.classList.remove('show');
  }

  window.openTheLeModal  = openTheLeModal;
  window.closeTheLeModal = closeTheLeModal;

  // 4. Tự động gắn sự kiện cho nút .the-le-link
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[thele.js] DOM ready, tìm nút .the-le-link...');
    document.querySelectorAll('.the-le-link').forEach(el => {
      console.log('[thele.js] Tìm thấy nút:', el);
      if (!el.getAttribute('onclick')) {
        el.addEventListener('click', openTheLeModal);
      }
    });
  });
})();