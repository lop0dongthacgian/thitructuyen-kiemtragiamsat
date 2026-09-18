// ================================================================
// DANH SÁCH CHI BỘ — dùng để chấm chính xác giải tập thể
// ⚠️ CHỈNH SỬA DANH SÁCH NÀY CHO ĐÚNG VỚI THỰC TẾ ĐƠN VỊ CỦA BẠN.
// Đây chỉ là dữ liệu mẫu (dựa theo cấu trúc chi hội cũ) để bạn test giao diện.
// ================================================================
const DS_CHI_BO = [
  "1 TAM THUẬN", "2 TAM THUẬN", "3 TAM THUẬN", "4 TAM THUẬN", "5 TAM THUẬN",
  "6 TAM THUẬN", "7 TAM THUẬN", "8 TAM THUẬN", "9 TAM THUẬN", "10 TÂN CHÍNH",
  "11 TÂN CHÍNH", "12 TÂN CHÍNH", "13 TÂN CHÍNH", "14 TÂN CHÍNH", "15 TÂN CHÍNH",
  "16 VĨNH TRUNG", "17 VĨNH TRUNG", "18 VĨNH TRUNG", "19 VĨNH TRUNG", "20 VĨNH TRUNG",
  "21 VĨNH TRUNG", "22 VĨNH TRUNG", "23 THẠC GIÁN", "24 THẠC GIÁN", "25 THẠC GIÁN",
  "26 THẠC GIÁN", "27 THẠC GIÁN", "28 THẠC GIÁN", "29 THẠC GIÁN", "30 THẠC GIÁN",
  "31 THẠC GIÁN", "32 XUÂN HÀ", "33 XUÂN HÀ", "34 XUÂN HÀ", "35 XUÂN HÀ",
  "36 XUÂN HÀ", "37 XUÂN HÀ", "38 XUÂN HÀ", "39 XUÂN HÀ", "40 CHÍNH GIÁN",
  "41 CHÍNH GIÁN", "42 CHÍNH GIÁN", "43 CHÍNH GIÁN", "44 CHÍNH GIÁN", "45 CHÍNH GIÁN",
  "46 CHÍNH GIÁN", "47 CHÍNH GIÁN", "48 CHÍNH GIÁN", "49 THANH KHÊ ĐÔNG", "50 THANH KHÊ ĐÔNG",
  "51 THANH KHÊ ĐÔNG", "52 THANH KHÊ ĐÔNG", "53 THANH KHÊ ĐÔNG", "54 HÒA KHÊ", "55 HÒA KHÊ",
  "56 HÒA KHÊ", "57 HÒA KHÊ", "58 HÒA KHÊ", "59 HÒA KHÊ", "60 HÒA KHÊ",
  "61 HÒA KHÊ", "62 HÒA KHÊ", "63 HÒA KHÊ", "64 HÒA KHÊ", "65 THANH KHÊ TÂY",
  "66 THANH KHÊ TÂY", "67 THANH KHÊ TÂY", "68 THANH KHÊ TÂY", "69 THANH KHÊ TÂY", "70 THANH KHÊ TÂY",
  "71 THANH KHÊ TÂY", "72 THANH KHÊ TÂY", "73 THANH KHÊ TÂY", "74 THANH KHÊ TÂY", "75 THANH KHÊ TÂY",
  "76 THANH KHÊ TÂY", "77 THANH KHÊ TÂY", "78 THANH KHÊ TÂY", "79 THANH KHÊ TÂY", "80 THANH KHÊ TÂY"
];

// ================= HÀM TIỆN ÍCH =================

// Chuẩn hóa chuỗi tiếng Việt: bỏ dấu, viết thường, dùng để so khớp khi tìm kiếm
function normalizeChiBoText(str) {
  const map = {
    'á':'a','à':'a','ả':'a','ã':'a','ạ':'a',
    'ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a',
    'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
    'đ':'d','é':'e','è':'e','ẻ':'e','ẽ':'e','ẹ':'e',
    'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
    'í':'i','ì':'i','ỉ':'i','ĩ':'i','ị':'i',
    'ó':'o','ò':'o','ỏ':'o','õ':'o','ọ':'o',
    'ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
    'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
    'ú':'u','ù':'u','ủ':'u','ũ':'u','ụ':'u',
    'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
    'ý':'y','ỳ':'y','ỷ':'y','ỹ':'y','ỵ':'y'
  };

  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const lowerChar = char.toLowerCase();
    if (map[lowerChar]) {
      result += map[lowerChar];
    } else if (/[a-z0-9]/i.test(char)) {
      result += char.toLowerCase();
    } else if (char === ' ') {
      result += ' ';
    }
  }
  return result.trim().toLowerCase();
}

// Kiểm tra chi bộ có hợp lệ (nằm trong danh sách) không
function isValidChiBo(chiBo) {
  return DS_CHI_BO.includes(chiBo);
}

// Tìm chi bộ gợi ý gần giống (khi gõ tìm kiếm)
function findSimilarChiBo(inputText) {
  if (!inputText) return DS_CHI_BO.slice();
  const normalizedInput = normalizeChiBoText(inputText);
  return DS_CHI_BO.filter(function(cb) {
    return normalizeChiBoText(cb).indexOf(normalizedInput) !== -1;
  });
}

// ================================================================
// KHỞI TẠO Ô CHỌN/TÌM KIẾM CHI BỘ (combobox)
// options: {
//   inputId:    id của ô input hiển thị/gõ tìm kiếm (bắt buộc)
//   hiddenId:   id của input ẩn lưu giá trị đã chọn để submit form (tuỳ chọn)
//   dropdownId: id của thẻ div chứa danh sách xổ xuống (bắt buộc)
//   list:       mảng danh sách chi bộ, mặc định dùng DS_CHI_BO
//   onSelect:   callback(value) khi người dùng chọn 1 chi bộ (tuỳ chọn)
// }
// ================================================================
function initChiBoCombo(options) {
  const inputId    = options.inputId;
  const hiddenId   = options.hiddenId;
  const dropdownId = options.dropdownId;
  const list       = options.list || DS_CHI_BO;
  const onSelect   = options.onSelect;

  const input    = document.getElementById(inputId);
  const hidden   = hiddenId ? document.getElementById(hiddenId) : null;
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown) return;

  function renderList(filterText) {
    const filtered = findSimilarChiBo.call(null, filterText).filter(function(cb) {
      return list.includes(cb);
    });
    dropdown.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'combo-item combo-empty';
      empty.textContent = '⚠️ Không tìm thấy Chi bộ phù hợp';
      dropdown.appendChild(empty);
    } else {
      filtered.forEach(function(name) {
        const item = document.createElement('div');
        item.className = 'combo-item';
        item.textContent = name;
        item.addEventListener('mousedown', function(e) {
          e.preventDefault();
          input.value = name;
          if (hidden) hidden.value = name;
          closeDropdown();
          if (typeof onSelect === 'function') onSelect(name);
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.style.display = 'block';
  }

  function closeDropdown() {
    dropdown.style.display = 'none';
  }

  input.addEventListener('focus', function() {
    renderList(input.value);
  });

  input.addEventListener('input', function() {
    if (hidden) hidden.value = ''; // buộc phải chọn lại từ danh sách để hợp lệ
    renderList(input.value);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDropdown();
  });

  document.addEventListener('click', function(e) {
    if (e.target !== input && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });
}

// Export các hàm để sử dụng (nếu dùng module / test ngoài trình duyệt)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DS_CHI_BO,
    normalizeChiBoText,
    isValidChiBo,
    findSimilarChiBo,
    initChiBoCombo
  };
}
