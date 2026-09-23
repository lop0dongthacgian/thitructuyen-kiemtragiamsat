// ================================================================
// CHIBO.GS — SỐ ĐẢNG VIÊN CỦA TỪNG CHI BỘ (dùng để tính % dự thi)
// ----------------------------------------------------------------
// ⚠️ SỐ LIỆU TẠM: tất cả đang để = 10 đảng viên/chi bộ (CHƯA ĐÚNG THỰC TẾ).
// Ban Tổ chức cần sửa lại đúng số đảng viên thật của từng Chi bộ trước khi
// dùng để xếp hạng tập thể chính thức — chỉ cần sửa SỐ ở phía sau mỗi tên,
// KHÔNG cần đổi tên Chi bộ (phải viết ĐÚNG Y HỆT tên trong chibo.js ở client,
// nếu không sẽ không khớp được lúc thống kê).
//
// Cấu trúc giữ nguyên theo nhóm như chibo.js (client) để dễ đối chiếu/sửa.
// ================================================================

var DS_NHOM_SO_DANG_VIEN = [
  {
    "id": "nhom1",
    "ten": "I. ĐẢNG ỦY CƠ SỞ",
    "danhSach": [
      {
        "ten": "Đảng ủy các cơ quan Đảng",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy UBND phường",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công an phường",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Trung tâm Y tế khu vực Thanh Khê",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Trường Thể dục Thể Thao Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Trường Cao đẳng Thương Mại",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công ty Cổ phần xây dựng công trình 512",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công ty Cổ phần Dược DANAPHA",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công ty Cổ phần Dệt May 29/3",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công ty Cổ phần In và Dịch vụ Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Bưu điện thành phố Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Công ty TNHH MTV Thương Mại Quảng Nam - Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Đảng ủy Ngân hàng TMCP Công Thương Việt Nam - Chi nhánh Đà Nẵng",
        "soDangVien": 10
      }
    ]
  },
  {
    "id": "nhom2",
    "ten": "II. UBKT ĐẢNG ỦY CƠ SỞ",
    "danhSach": [
      {
        "ten": "UBKT Đảng ủy các cơ quan Đảng",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy UBND phường",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công an phường",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Trung tâm Y tế khu vực Thanh Khê",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Trường Thể dục Thể Thao Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Trường Cao đẳng Thương Mại",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công ty Cổ phần xây dựng công trình 512",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công ty Cổ phần Dược DANAPHA",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công ty Cổ phần Dệt May 29/3",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công ty Cổ phần In và Dịch vụ Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Bưu điện thành phố Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Công ty TNHH MTV Thương Mại Quảng Nam - Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "UBKT Đảng ủy Ngân hàng TMCP Công Thương Việt Nam - Chi nhánh Đà Nẵng",
        "soDangVien": 10
      }
    ]
  },
  {
    "id": "nhom3",
    "ten": "III. CHI BỘ CƠ SỞ",
    "danhSach": [
      {
        "ten": "Chi bộ Trường THPT Thanh Khê",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THPT Thái Phiên",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trung tâm Giáo dục thường xuyên số 2",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trung tâm Huấn luyện Vận động viên trẻ Quốc gia Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THPT Quang Trung (tư thục)",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Cổ phần Xây lắp Điện và Cơ khí mạ Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Cổ phần Dịch vụ bảo vệ An Ninh",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty CP Tư vấn và Phát triển kỹ thuật Tài nguyên nước",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Cổ phần Túi xách Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty TNHH Dịch vụ Bảo vệ an ninh Quốc Đô",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Cổ phần Tư vấn xây dựng và Đầu tư Trường Định",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Ngân hàng TMCP An Bình Chi nhánh Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Bảo hiểm PJICO Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Ngân hàng TMCP Tiên Phong Chi nhánh Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ VPĐD Miền Trung Ngân Hàng TMCP Kỹ Thương VN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Cty Bảo Minh Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ quân sự phường",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trạm Y tế",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Cẩm Tú",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Tuổi Hoa",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Mẫu Đơn",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Phong Lan",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Hải Đường",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Thủy Tiên",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Cẩm Nhung",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Hoàng Mai",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Mầm non Tường Vy",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Đoàn Thị Điểm",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Lê Quang Sung",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Huỳnh Ngọc Huệ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Lê Văn Tám",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Dũng Sĩ Thanh Khê",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Nguyễn Đức Cảnh",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Hà Huy Tập",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Nguyễn Trung Trực",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Đinh Bộ Lĩnh",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Điện Biên Phủ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Trần Cao Vân",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Nguyễn Bá Ngọc",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Hàm Nghi",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Tiểu học Hoa Lư",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Phan Đình Phùng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Huỳnh Thúc Kháng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Đỗ Đăng Tuyển",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Nguyễn Chơn",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Hoàng Diệu",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Lê Thị Hồng Gấm",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Nguyễn Duy Hiệu",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Nguyễn Trãi",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Chu Văn An",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường THCS Nguyễn Thị Minh Khai",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ BIDV Văn phòng đại diện tại TP Đà Nẵng",
        "soDangVien": 10
      }
    ]
  },
  {
    "id": "nhom4",
    "ten": "IV. CHI BỘ TRỰC THUỘC",
    "danhSach": [
      {
        "ten": "Chi bộ 1 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 2 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 3 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 4 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 5 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 6 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 7 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 8 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 9 TAM THUẬN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 10 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 11 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 12 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 13 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 14 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 15 TÂN CHÍNH",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 16 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 17 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 18 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 19 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 20 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 21 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 22 VĨNH TRUNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 23 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 24 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 25 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 26 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 27 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 28 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 29 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 30 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 31 THẠC GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 32 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 33 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 34 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 35 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 36 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 37 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 38 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 39 XUÂN HÀ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 40 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 41 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 42 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 43 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 44 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 45 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 46 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 47 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 48 CHÍNH GIÁN",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 49 THANH KHÊ ĐÔNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 50 THANH KHÊ ĐÔNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 51 THANH KHÊ ĐÔNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 52 THANH KHÊ ĐÔNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 53 THANH KHÊ ĐÔNG",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 54 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 55 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 56 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 57 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 58 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 59 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 60 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 61 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 62 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 63 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 64 HÒA KHÊ",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 65 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 66 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 67 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 68 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 69 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 70 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 71 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 72 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 73 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 74 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 75 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 76 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 77 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 78 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 79 THANH KHÊ TÂY",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ 80 THANH KHÊ TÂY",
        "soDangVien": 10
      }
    ]
  },
  {
    "id": "nhom5",
    "ten": "V. CHI BỘ DOANH NGHIỆP",
    "danhSach": [
      {
        "ten": "Chi bộ Công ty Cổ phần Xây dựng Giao thông 503",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Trường Trung cấp Chuyên nghiệp Ý Việt",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Công ty Cổ phần Sinh học Minh Hồng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Tổng Công ty Miền Trung - CTCP",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Công ty TNHH Kiểm toán & Dịch vụ tin học Moore Aisc tại Đà Nẵng",
        "soDangVien": 10
      },
      {
        "ten": "Chi bộ Công ty Cổ phần Giám định Á Việt",
        "soDangVien": 10
      }
    ]
  }
];

// Map phẳng TÊN CHI BỘ -> SỐ ĐẢNG VIÊN, dùng để tra cứu nhanh trong Code.gs
var CHI_BO_SO_DANG_VIEN = (function () {
  var map = {};
  DS_NHOM_SO_DANG_VIEN.forEach(function (nhom) {
    nhom.danhSach.forEach(function (item) {
      map[item.ten] = item.soDangVien;
    });
  });
  return map;
})();

// Tra số đảng viên của 1 chi bộ theo tên; nếu không tìm thấy tên trong danh
// sách (VD: chi bộ nhập tự do/gõ sai, hoặc chưa cập nhật vào đây) -> trả về
// null để Code.gs tự xử lý (ghi log cảnh báo, KHÔNG làm sập thống kê).
function laySoDangVienChiBo(tenChiBo) {
  var ten = String(tenChiBo || '').trim();
  if (CHI_BO_SO_DANG_VIEN.hasOwnProperty(ten)) return CHI_BO_SO_DANG_VIEN[ten];
  return null;
}
