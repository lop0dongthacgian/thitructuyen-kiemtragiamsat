// ============================================================
//  CHIBO.GS - DANH SÁCH TỔ CHỨC ĐẢNG (2 PHẦN) + SỐ ĐẢNG VIÊN
//  Nguồn: "DANH SÁCH CÁC CHI, ĐẢNG BỘ TRỰC THUỘC THAM GIA CUỘC THI
//  TRỰC TUYẾN" - Đảng ủy phường Thanh Khê (dữ liệu THỰC TẾ)
// ============================================================
const DS_NHOM = [
{
  id: "nhom1",
  ten: "I. ĐẢNG BỘ TRỰC THUỘC",
  danhSach: [
    "Đảng ủy Công an phường",
    "Đảng ủy Trung tâm Y tế khu vực Thanh Khê",
    "Đảng ủy Công Ty Cổ phần Xây dựng Công trình 512",
    "Đảng ủy Công ty Cổ phần In và Dịch vụ Đà Nẵng",
    "Đảng ủy Công ty Cổ phần Dệt may 29/3",
    "Đảng ủy Công ty Cổ phần Dược Danapha",
    "Đảng ủy Trường Cao đẳng Thương mại",
    "Đảng ủy Trường Đại học Thể dục thể thao Đà Nẵng",
    "Đảng bộ Bưu điện thành phố Đà Nẵng",
    "Đảng bộ Công ty TNHH MTV Thương Mại Quảng Nam - Đà Nẵng",
    "Đảng bộ Ngân hàng TMCP Công Thương Việt Nam - Chi nhánh Đà Nẵng",
  ]
},
{
  id: "nhom2",
  ten: "II. CHI BỘ TRỰC THUỘC",
  danhSach: [
    // --- Chi bộ khu dân cư (đưa lên đầu) ---
    "1 Tam Thuận",
    "2 Tam Thuận",
    "3 Tam Thuận",
    "4 Tam Thuận",
    "5 Tam Thuận",
    "6 Tam Thuận",
    "7 Tam Thuận",
    "8 Tam Thuận",
    "9 Tam Thuận",
    "10 Tân Chính",
    "11 Tân Chính",
    "12 Tân Chính",
    "13 Tân Chính",
    "14 Tân Chính",
    "15 Tân Chính",
    "16 Vĩnh Trung",
    "17 Vĩnh Trung",
    "18 Vĩnh Trung",
    "19 Vĩnh Trung",
    "20 Vĩnh Trung",
    "21 Vĩnh Trung",
    "22 Vĩnh Trung",
    "23 Thạc Gián",
    "24 Thạc Gián",
    "25 Thạc Gián",
    "26 Thạc Gián",
    "27 Thạc Gián",
    "28 Thạc Gián",
    "29 Thạc Gián",
    "30 Thạc Gián",
    "31 Thạc Gián",
    "32 Xuân Hà",
    "33 Xuân Hà",
    "34 Xuân Hà",
    "35 Xuân Hà",
    "36 Xuân Hà",
    "37 Xuân Hà",
    "38 Xuân Hà",
    "39 Xuân Hà",
    "40 Chính Gián",
    "41 Chính Gián",
    "42 Chính Gián",
    "43 Chính Gián",
    "44 Chính Gián",
    "45 Chính Gián",
    "46 Chính Gián",
    "47 Chính Gián",
    "48 Chính Gián",
    "49 Thanh Khê Đông",
    "50 Thanh Khê Đông",
    "51 Thanh Khê Đông",
    "52 Thanh Khê Đông",
    "53 Thanh Khê Đông",
    "54 Hòa Khê",
    "55 Hòa Khê",
    "56 Hòa Khê",
    "57 Hòa Khê",
    "58 Hòa Khê",
    "59 Hòa Khê",
    "60 Hòa Khê",
    "61 Hòa Khê",
    "62 Hòa Khê",
    "63 Hòa Khê",
    "64 Hòa Khê",
    "65 Thanh Khê Tây",
    "66 Thanh Khê Tây",
    "67 Thanh Khê Tây",
    "68 Thanh Khê Tây",
    "69 Thanh Khê Tây",
    "70 Thanh Khê Tây",
    "71 Thanh Khê Tây",
    "72 Thanh Khê Tây",
    "73 Thanh Khê Tây",
    "74 Thanh Khê Tây",
    "75 Thanh Khê Tây",
    "76 Thanh Khê Tây",
    "77 Thanh Khê Tây",
    "78 Thanh Khê Tây",
    "79 Thanh Khê Tây",
    "80 Thanh Khê Tây",
    // --- Chi bộ cơ quan, đơn vị, doanh nghiệp, trường học ---
    "Chi bộ Ban Xây dựng Đảng Đảng ủy phường",
    "Chi bộ Văn phòng Đảng ủy phường",
    "Chi bộ Cơ quan Ủy Ban Mặt trận Tổ quốc Việt Nam phường",
    "Chi bộ Hội đồng nhân dân phường",
    "Chi bộ Văn phòng Hội đồng nhân dân và Ủy ban nhân dân phường",
    "Chi bộ Phòng Văn hóa - Xã hội phường",
    "Chi bộ Phòng Kinh tế, Hạ tầng và Đô thị phường",
    "Chi bộ Trung tâm Phục vụ Hành chính công phường",
    "Chi bộ Trung tâm Cung ứng Dịch vụ Sự nghiệp công phường",
    "Chi bộ Ban Quản lý dự án đầu tư xây dựng phường",
    "Chi bộ Quân sự",
    "Chi bộ Trạm Y tế",
    "Chi bộ Công ty Cổ phần Túi xách Đà Nẵng",
    "Chi bộ BIDV Văn phòng đại diện tại thành phố Đà Nẵng",
    "Chi bộ Công ty Bảo hiểm PJICO Đà Nẵng",
    "Chi bộ Công ty CP Tư vấn XD và Đầu tư Trường Định",
    "Chi bộ Ngân hàng TMCP An Bình Chi nhánh Đà Nẵng",
    "Chi bộ Công ty Bảo Minh Đà Nẵng",
    "Chi bộ Ngân hàng TMCP Tiên Phong Chi nhánh ĐN",
    "Chi bộ Trường Trung học phổ thông Quang Trung (tư thục)",
    "Chi bộ VPĐD Miền Trung Ngân Hàng TMCP Kỹ Thương Việt Nam",
    "Chi bộ Công ty Cổ phần Dịch vụ bảo vệ An Ninh",
    "Chi bộ Công ty Cổ phần Tư vấn và Phát triển kỹ thuật Tài nguyên nước",
    "Chi bộ Công ty Cổ phần Xây lắp Điện và Cơ khí mạ Đà Nẵng",   
    "Chi bộ Trường Trung học phổ thông Thái Phiên",
    "Chi bộ Công ty Trách nhiệm hữu hạn Dịch vụ Bảo vệ an ninh Quốc Đô",
    "Chi bộ Trung tâm Huấn luyện VĐV trẻ Quốc gia",
    "Chi bộ Trường Trung học phổ thông Thanh Khê",
    "Chi bộ Trường Mầm non Mẫu Đơn",
    "Chi bộ Trường Mầm non Tuổi Hoa",
    "Chi bộ Trường Mầm non Hải Đường",
    "Chi bộ Trường Mầm non Cẩm Nhung",
    "Chi bộ Trường Mầm non Tường Vy",
    "Chi bộ Trường Tiểu học Đoàn Thị Điểm",
    "Chi bộ Trường Tiểu học Huỳnh Ngọc Huệ",
    "Chi bộ Trường Tiểu học Dũng Sĩ Thanh Khê",
    "Chi bộ Trường Tiểu học Đinh Bộ Lĩnh",
    "Chi bộ Trường Tiểu học Trần Cao Vân",
    "Chi bộ Trường Tiểu học Hoa Lư",
    "Chi bộ Trường Trung học cơ sở Phan Đình Phùng",
    "Chi bộ Trường Trung học cơ sở Nguyễn Chơn",
    "Chi bộ Trường Trung học cơ sở Nguyễn Trãi",
    "Chi bộ Trường Trung học cơ sở Chu Văn An",
    "Chi bộ Trường Trung học cơ sở Huỳnh Thúc Kháng",
    "Chi bộ Tổng Công ty Miền Trung - CTCP",
    "Chi bộ Cty TNHH Kiểm toán & DV tin học Moore Aisc tại ĐN",
    "Chi bộ Công ty Cổ phần Giám định Á Việt",
    "Chi bộ Công ty Cổ phần Xây dựng Giao thông 503",
    "Chi bộ Công ty Cổ phần Sinh học Minh Hồng",
    "Chi bộ Trường Trung cấp Chuyên nghiệp Ý Việt",
  ]
}
];

// Danh sách phẳng toàn bộ (dùng cho code.gs / dropdown chọn Chi bộ)
const DS_CHI_BO = DS_NHOM.flatMap(nhom => nhom.danhSach);

// Danh sách phẳng kèm nhóm (dùng cho giao diện dropdown nhóm)
const DS_CHI_BO_FULL = DS_NHOM.flatMap(nhom =>
  nhom.danhSach.map(ten => ({ nhom: nhom.ten, ten }))
);

// ============================================================
//  SỐ ĐẢNG VIÊN THỰC TẾ CỦA TỪNG CHI/ĐẢNG BỘ (dùng để tính
//  "Tỷ lệ dự thi (%)" trong sheet ThongKeChiBo bên code.gs).
//  Tên KEY phải khớp CHÍNH XÁC với tên hiển thị trong DS_NHOM ở trên
//  (là tên mà thí sinh chọn khi dự thi).
// ============================================================
const CHI_BO_SO_DANG_VIEN = {
  // --- I. ĐẢNG BỘ TRỰC THUỘC ---
  "Đảng ủy Công an phường": 165,
  "Đảng ủy Trung tâm Y tế khu vực Thanh Khê": 74,
  "Đảng ủy Công Ty Cổ phần Xây dựng Công trình 512": 166,
  "Đảng ủy Công ty Cổ phần In và Dịch vụ Đà Nẵng": 97,
  "Đảng ủy Công ty Cổ phần Dệt may 29/3": 33,
  "Đảng ủy Công ty Cổ phần Dược Danapha": 85,
  "Đảng ủy Trường Cao đẳng Thương mại": 92,
  "Đảng ủy Trường Đại học Thể dục thể thao Đà Nẵng": 32,
  "Đảng bộ Bưu điện thành phố Đà Nẵng": 227,
  "Đảng bộ Công ty TNHH MTV Thương Mại Quảng Nam - Đà Nẵng": 50,
  "Đảng bộ Ngân hàng TMCP Công Thương Việt Nam - Chi nhánh Đà Nẵng": 65,
  // --- II. CHI BỘ TRỰC THUỘC ---
  "Chi bộ Ban Xây dựng Đảng Đảng ủy phường": 11,
  "Chi bộ Văn phòng Đảng ủy phường": 13,
  "Chi bộ Cơ quan Ủy Ban Mặt trận Tổ quốc Việt Nam phường": 16,
  "Chi bộ Hội đồng nhân dân phường": 6,
  "Chi bộ Văn phòng Hội đồng nhân dân và Ủy ban nhân dân phường": 26,
  "Chi bộ Phòng Văn hóa - Xã hội phường": 18,
  "Chi bộ Phòng Kinh tế, Hạ tầng và Đô thị phường": 20,
  "Chi bộ Trung tâm Phục vụ Hành chính công phường": 13,
  "Chi bộ Trung tâm Cung ứng Dịch vụ Sự nghiệp công phường": 35,
  "Chi bộ Ban Quản lý dự án đầu tư xây dựng phường": 9,
  "Chi bộ Quân sự": 34,
  "Chi bộ Trạm Y tế": 53,
  "Chi bộ Công ty Cổ phần Túi xách Đà Nẵng": 8,
  "Chi bộ BIDV Văn phòng đại diện tại thành phố Đà Nẵng": 16,
  "Chi bộ Công ty Bảo hiểm PJICO Đà Nẵng": 5,
  "Chi bộ Công ty CP Tư vấn XD và Đầu tư Trường Định": 12,
  "Chi bộ Ngân hàng TMCP An Bình Chi nhánh Đà Nẵng": 10,
  "Chi bộ Công ty Bảo Minh Đà Nẵng": 10,
  "Chi bộ Ngân hàng TMCP Tiên Phong Chi nhánh ĐN": 5,
  "Chi bộ Trường Trung học phổ thông Quang Trung (tư thục)": 9,
  "Chi bộ VPĐD Miền Trung Ngân Hàng TMCP Kỹ Thương Việt Nam": 15,
  "Chi bộ Công ty Cổ phần Dịch vụ bảo vệ An Ninh": 16,
  "Chi bộ Công ty Cổ phần Tư vấn và Phát triển kỹ thuật Tài nguyên nước": 12,
  "Chi bộ Công ty Cổ phần Xây lắp Điện và Cơ khí mạ Đà Nẵng": 20,
  "Chi bộ Trường Trung học phổ thông Thái Phiên": 41,
  "Chi bộ Công ty Trách nhiệm hữu hạn Dịch vụ Bảo vệ an ninh Quốc Đô": 14,
  "Chi bộ Trung tâm Huấn luyện VĐV trẻ Quốc gia": 18,
  "Chi bộ Trường Trung học phổ thông Thanh Khê": 28,
  "Chi bộ Trường Mầm non Mẫu Đơn": 26,
  "Chi bộ Trường Mầm non Tuổi Hoa": 37,
  "Chi bộ Trường Mầm non Hải Đường": 35,
  "Chi bộ Trường Mầm non Cẩm Nhung": 42,
  "Chi bộ Trường Mầm non Tường Vy": 43,
  "Chi bộ Trường Tiểu học Đoàn Thị Điểm": 54,
  "Chi bộ Trường Tiểu học Huỳnh Ngọc Huệ": 74,
  "Chi bộ Trường Tiểu học Dũng Sĩ Thanh Khê": 94,
  "Chi bộ Trường Tiểu học Đinh Bộ Lĩnh": 81,
  "Chi bộ Trường Tiểu học Trần Cao Vân": 61,
  "Chi bộ Trường Tiểu học Hoa Lư": 57,
  "Chi bộ Trường Trung học cơ sở Phan Đình Phùng": 66,
  "Chi bộ Trường Trung học cơ sở Nguyễn Chơn": 61,
  "Chi bộ Trường Trung học cơ sở Nguyễn Trãi": 56,
  "Chi bộ Trường Trung học cơ sở Chu Văn An": 66,
  "Chi bộ Trường Trung học cơ sở Huỳnh Thúc Kháng": 61,
  "1 Tam Thuận": 43,
  "2 Tam Thuận": 108,
  "3 Tam Thuận": 36,
  "4 Tam Thuận": 28,
  "5 Tam Thuận": 31,
  "6 Tam Thuận": 39,
  "7 Tam Thuận": 43,
  "8 Tam Thuận": 36,
  "9 Tam Thuận": 34,
  "10 Tân Chính": 75,
  "11 Tân Chính": 117,
  "12 Tân Chính": 27,
  "13 Tân Chính": 114,
  "14 Tân Chính": 43,
  "15 Tân Chính": 103,
  "16 Vĩnh Trung": 39,
  "17 Vĩnh Trung": 39,
  "18 Vĩnh Trung": 30,
  "19 Vĩnh Trung": 55,
  "20 Vĩnh Trung": 72,
  "21 Vĩnh Trung": 92,
  "22 Vĩnh Trung": 150,
  "23 Thạc Gián": 59,
  "24 Thạc Gián": 75,
  "25 Thạc Gián": 36,
  "26 Thạc Gián": 45,
  "27 Thạc Gián": 80,
  "28 Thạc Gián": 104,
  "29 Thạc Gián": 85,
  "30 Thạc Gián": 39,
  "31 Thạc Gián": 103,
  "32 Xuân Hà": 30,
  "33 Xuân Hà": 68,
  "34 Xuân Hà": 49,
  "35 Xuân Hà": 65,
  "36 Xuân Hà": 75,
  "37 Xuân Hà": 41,
  "38 Xuân Hà": 19,
  "39 Xuân Hà": 168,
  "40 Chính Gián": 41,
  "41 Chính Gián": 41,
  "42 Chính Gián": 47,
  "43 Chính Gián": 28,
  "44 Chính Gián": 33,
  "45 Chính Gián": 63,
  "46 Chính Gián": 49,
  "47 Chính Gián": 62,
  "48 Chính Gián": 47,
  "49 Thanh Khê Đông": 32,
  "50 Thanh Khê Đông": 22,
  "51 Thanh Khê Đông": 66,
  "52 Thanh Khê Đông": 161,
  "53 Thanh Khê Đông": 117,
  "54 Hòa Khê": 123,
  "55 Hòa Khê": 60,
  "56 Hòa Khê": 72,
  "57 Hòa Khê": 68,
  "58 Hòa Khê": 50,
  "59 Hòa Khê": 100,
  "60 Hòa Khê": 85,
  "61 Hòa Khê": 54,
  "62 Hòa Khê": 77,
  "63 Hòa Khê": 47,
  "64 Hòa Khê": 25,
  "65 Thanh Khê Tây": 25,
  "66 Thanh Khê Tây": 21,
  "67 Thanh Khê Tây": 66,
  "68 Thanh Khê Tây": 11,
  "69 Thanh Khê Tây": 28,
  "70 Thanh Khê Tây": 58,
  "71 Thanh Khê Tây": 83,
  "72 Thanh Khê Tây": 66,
  "73 Thanh Khê Tây": 123,
  "74 Thanh Khê Tây": 25,
  "75 Thanh Khê Tây": 35,
  "76 Thanh Khê Tây": 58,
  "77 Thanh Khê Tây": 27,
  "78 Thanh Khê Tây": 41,
  "79 Thanh Khê Tây": 37,
  "80 Thanh Khê Tây": 35,
  "Chi bộ Tổng Công ty Miền Trung - CTCP": 5,
  "Chi bộ Cty TNHH Kiểm toán & DV tin học Moore Aisc tại ĐN": 7,
  "Chi bộ Công ty Cổ phần Giám định Á Việt": 7,
  "Chi bộ Công ty Cổ phần Xây dựng Giao thông 503": 11,
  "Chi bộ Công ty Cổ phần Sinh học Minh Hồng": 5,
  "Chi bộ Trường Trung cấp Chuyên nghiệp Ý Việt": 3,
};

// Tổng số chi/đảng bộ: 141 | Tổng số đảng viên: 7335

// ============================================================
//  HÀM TRA CỨU SỐ ĐẢNG VIÊN THEO TÊN CHI BỘ (dùng trong code.gs)
//  - Thử khớp chính xác trước.
//  - Nếu không có, thử khớp "rút gọn" (bỏ khoảng trắng thừa, không
//    phân biệt hoa/thường) để tránh lỗi vì gõ thừa dấu cách.
//  - Trả về null nếu không tìm thấy (code.gs sẽ tự xử lý: tạm coi
//    tỷ lệ dự thi = 100% và ghi log cảnh báo).
// ============================================================
function laySoDangVienChiBo(tenChiBo) {
  if (!tenChiBo) return null;
  var ten = String(tenChiBo).trim();

  if (Object.prototype.hasOwnProperty.call(CHI_BO_SO_DANG_VIEN, ten)) {
    return CHI_BO_SO_DANG_VIEN[ten];
  }

  // Khớp rút gọn: gộp khoảng trắng liên tiếp + bỏ dấu cách đầu/cuối,
  // không phân biệt hoa/thường.
  function rutGon(s) {
    return String(s).trim().replace(/\s+/g, ' ').toLowerCase();
  }
  var tenRutGon = rutGon(ten);
  for (var key in CHI_BO_SO_DANG_VIEN) {
    if (rutGon(key) === tenRutGon) return CHI_BO_SO_DANG_VIEN[key];
  }

  return null;
}
// ============================================================
//  XUẤT RA PHẠM VI TOÀN CỤC
//  Để tệp QuetTrungBai.html (chạy như <script> cổ điển) có thể
//  truy cập trực tiếp các biến/hàm này một cách chắc chắn.
// ============================================================
if (typeof window !== 'undefined') {
  window.DS_NHOM              = DS_NHOM;
  window.DS_CHI_BO            = DS_CHI_BO;
  window.DS_CHI_BO_FULL       = DS_CHI_BO_FULL;
  window.CHI_BO_SO_DANG_VIEN  = CHI_BO_SO_DANG_VIEN;
  window.laySoDangVienChiBo   = laySoDangVienChiBo;
}