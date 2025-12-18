const connection = require("../config/database.js");
const upload = require("../middleware/uploads.js");

const {
  DanhSachUsers,
  getUser,
  EditUser,
  BlockUser,
  UnlockUser,
  SignUp,
} = require("../services/CRUD_user.js");

const {
  addBook,
  getDanhSach,
  postEditSach,
  getEditSach,
  ShowSach,
  HideSach,
  TongSLSach,
  SachENhieuNhat,
  SachTonItNhat,
  TheLoaiNhieuSachNhat,
  Top5SachTonIt,
  getDanhSachAdmin,
} = require("../services/CRUD_sach.js");

const {
  DanhSachTheLoai,
  getAllTheLoai,
  ThemTheLoai,
  layTheLoai,
  SuaTheLoai,
  HideTheLoai,
  ShowTheLoai,
  TonKhoTheoTheLoai,
} = require("../services/CRUD_theloai.js");

const {
  DanhSachDonHang,
  CapNhatTrangThai,
  ThongTinDon,
  SanPhamTrongDon,
  ThanhTien,
} = require("../services/CRUD_donhang.js");

const {
  DoanhThuLoc,
  SoDonHuy,
  DonHoanThanh,
  TopSachBanChay,
  TopTheLoaiMuaNhieu,
  TongDoanhThu,
  TongNguoiDung,
  TongSach,
  TongSoDon,
  Top5DonHangMoiNhat,
  Top6SachBanChay,
  Top5NguoiDungMoi,
} = require("../services/thongke.js");

// dashboard
const getHome = async (req, res) => {
  let tonkho = await Top5SachTonIt();
  let tongdoanhthu = await TongDoanhThu();
  let tongnguoidung = await TongNguoiDung();
  let tongsach = await TongSach();
  let tongsodon = await TongSoDon();
  let top5donhangmoi = await Top5DonHangMoiNhat();
  let top6sachbanchay = await Top6SachBanChay();
  let top5nguoidungmoi = await Top5NguoiDungMoi();
  res.render("admin/home", {
    tonkho,
    tongsach,
    tongdoanhthu,
    tongnguoidung,
    tongsodon,
    top5donhangmoi,
    top5nguoidungmoi,
    top6sachbanchay,
  });
};

const getDangXuat = (req, res) => {
  req.session.destroy();
  res.redirect("/home");
};

// ------------------- KHÁCH HÀNG ---------------------------
const getQuanLyKhachHang = async (req, res) => {
  const kq = await DanhSachUsers();
  res.render("admin/QL_users/quanlykhachhang", { user: kq });
};

const getEditUser = async (req, res) => {
  const user_id = req.params.user_id;
  let user = await getUser(user_id);

  res.render("admin/QL_users/edit_user", {
    users: user,
    error: req.query.error,
  });
};

const postEditUser = async (req, res) => {
  const user_id = req.params.user_id;
  let { taikhoan, matkhau, hoten, email } = req.body;

  let kq = await EditUser(taikhoan, matkhau, hoten, email, user_id);

  if (kq === 1) return res.redirect("/quanlykhachhang");

  return res.redirect(`/edit_user/${user_id}?error=1`);
};

const blockUser = async (req, res) => {
  await BlockUser(req.params.user_id);
  res.redirect("/quanlykhachhang");
};

const unlockUser = async (req, res) => {
  await UnlockUser(req.params.user_id);
  res.redirect("/quanlykhachhang");
};

const getAddUser = (req, res) => {
  res.render("admin/QL_users/add_user", { error: req.query.error });
};

const postAddUser = async (req, res) => {
  let { taikhoan, matkhau, hoten, email } = req.body;
  let kq = await SignUp(taikhoan, matkhau, hoten, email);

  if (kq === 0) return res.redirect("/add_user?error=2");

  res.redirect("/quanlykhachhang");
};

// ------------------- SÁCH ---------------------------
const getQuanLySach = async (req, res) => {
  let sach = await getDanhSachAdmin();
  let theloai = await DanhSachTheLoai();
  let sachtonitnhat = await SachTonItNhat();
  let sachtonnhieunhat = await SachENhieuNhat();
  let tongsach = await TongSLSach();
  let theloainhieusach = await TheLoaiNhieuSachNhat();
  let sachtonitnhat_list = await Top5SachTonIt();

  res.render("admin/QL_sach/quanlysach", {
    sach,
    theloai,
    sachtonnhieunhat,
    sachtonitnhat,
    tongsach,
    theloainhieusach,
    sachtonitnhat_list,
  });
};

const getAddSach = async (req, res) => {
  let theloai = await getAllTheLoai();
  res.render("admin/QL_sach/add_sach", { theloai });
};

const postAddBook = async (req, res) => {
  let hinhanh = req.file.filename;

  let { tensach, tentacgia, ngayphathanh, giaban, sl_tonkho, matheloai, mota } =
    req.body;

  await addBook(
    tensach,
    tentacgia,
    matheloai,
    ngayphathanh,
    giaban,
    sl_tonkho,
    mota,
    hinhanh
  );

  res.redirect("/admin/quanlysach");
};

const getEditBook = async (req, res) => {
  let masach = req.params.masach;
  let sach = await getEditSach(masach);
  let theloai = await getAllTheLoai();

  res.render("admin/QL_sach/edit_sach", { sach, theloai });
};

const postEditBook = async (req, res) => {
  let masach = req.params.masach;
  let hinhanh = req.file ? req.file.filename : req.body.oldImage;

  let { tensach, tentacgia, ngayphathanh, giaban, sl_tonkho, matheloai, mota } =
    req.body;

  await postEditSach(
    tensach,
    tentacgia,
    matheloai,
    ngayphathanh,
    giaban,
    sl_tonkho,
    mota,
    hinhanh,
    masach
  );

  res.redirect("/admin/quanlysach");
};

const hideBook = async (req, res) => {
  await HideSach(req.params.masach);
  res.redirect("/admin/quanlysach");
};

const showBook = async (req, res) => {
  await ShowSach(req.params.masach);
  res.redirect("/admin/quanlysach");
};
const getThongKeTonKho = async (req, res) => {
  let sach = await getDanhSach();
  let sachtonitnhat = await SachTonItNhat();
  let sachtonnhieunhat = await SachENhieuNhat();
  let tongsach = await TongSLSach();
  let theloainhieusach = await TheLoaiNhieuSachNhat();
  let theloai = await TonKhoTheoTheLoai();
  let sachtonitnhat_list = await Top5SachTonIt();
  res.render("admin/QL_sach/thongke_tonkho", {
    sach,
    sachtonitnhat,
    sachtonnhieunhat,
    tongsach,
    theloainhieusach,
    theloai,
    sachtonitnhat_list,
  });
};

// ------------------- THỂ LOẠI ---------------------------
const getDanhSachTheLoai = async (req, res) => {
  let theloai = await DanhSachTheLoai();
  res.render("admin/QL_theloai/theloai", { theloai });
};

const getThemTheLoai = (req, res) => {
  res.render("admin/QL_theloai/add_theloai", { error: req.query.error });
};

const postThemTheLoai = async (req, res) => {
  let kq = await ThemTheLoai(req.body.tentheloai);

  if (kq === 0) return res.redirect("/admin/add_theloai?error=1");

  res.redirect("/admin/theloai");
};

const getSuaTheLoai = async (req, res) => {
  let theloai = await layTheLoai(req.params.matheloai);
  res.render("admin/QL_theloai/edit_theloai", {
    theloai,
    error: req.query.error,
  });
};

const postSuaTheLoai = async (req, res) => {
  let kq = await SuaTheLoai(req.params.matheloai, req.body.tentheloai);

  if (kq === 0) {
    let theloai = await layTheLoai(req.params.matheloai);
    return res.render("admin/QL_theloai/edit_theloai", {
      theloai,
      error: 2,
    });
  }

  res.redirect("/admin/theloai");
};

const hideTheLoai = async (req, res) => {
  await HideTheLoai(req.params.matheloai);
  res.redirect("/admin/theloai");
};

const showTheLoai = async (req, res) => {
  await ShowTheLoai(req.params.matheloai);
  res.redirect("/admin/theloai");
};

// ------------------- ĐƠN HÀNG ---------------------------
const getQuanLyDonHang = async (req, res) => {
  let trangthai = req.query.trangthai || "";
  let from = req.query.from || null;
  let to = req.query.to || null;
  let DS_donhang = await DanhSachDonHang(trangthai, from, to);
  res.render("admin/QL_donhang/quanlydonhang", {
    DS_donhang,
    trangthai,
    from,
    to,
  });
};

const postCapNhatTrangThai = async (req, res) => {
  await CapNhatTrangThai(req.params.madonhang, req.body.trangthai);
  res.redirect("/admin/quanlydonhang");
};

const getChiTietDonHang = async (req, res) => {
  let madonhang = req.params.madonhang;
  let thongtindon = await ThongTinDon(madonhang);
  let sanpham = await SanPhamTrongDon(madonhang);
  let thanhtien = await ThanhTien(madonhang);

  res.render("admin/QL_donhang/donhang_chitiet", {
    thongtindon,
    sanpham,
    thanhtien,
  });
};

//doanh thu
const getDoanhThu = async (req, res) => {
  let preset = req.query.preset;
  console.log("-->ne: ", preset);
  let batdau, ketthuc;
  let today = new Date();
  const formatDate = (date) => date.toISOString().slice(0, 10);
  if (preset === "7days") {
    ketthuc = formatDate(today);
    const ngaytruoc = new Date();
    ngaytruoc.setDate(ngaytruoc.getDate() - 6);
    batdau = formatDate(ngaytruoc);
  } else if (preset === "month") {
    ketthuc = formatDate(today);
    let ngaydau = new Date(today.getFullYear(), today.getMonth(), 1);
    batdau = formatDate(ngaydau);
  } else if (preset === "year") {
    ketthuc = formatDate(today);
    let ngaydau = new Date(today.getFullYear(), 0, 1);
    batdau = formatDate(ngaydau);
  } else if (req.query.from && req.query.to) {
    batdau = req.query.from;
    ketthuc = req.query.to;
  } else {
    batdau = ketthuc = formatDate(today);
  }
  let doanhthu = await DoanhThuLoc(batdau, ketthuc);
  let sodonhuy = await SoDonHuy(batdau, ketthuc);
  let donhoanthanh = await DonHoanThanh(batdau, ketthuc);
  let topsachbanchay = await TopSachBanChay(batdau, ketthuc);
  let toptheloaimuanhieu = await TopTheLoaiMuaNhieu(batdau, ketthuc);
  res.render("admin/doanhthu", {
    preset,
    doanhthu,
    sodonhuy,
    donhoanthanh,
    topsachbanchay,
    toptheloaimuanhieu,
    batdau,
    ketthuc,
  });
};

module.exports = {
  getHome,
  getDangXuat,
  getQuanLyKhachHang,
  getEditUser,
  postEditUser,
  blockUser,
  unlockUser,
  getAddUser,
  postAddUser,
  getQuanLySach,
  getAddSach,
  postAddBook,
  getEditBook,
  postEditBook,
  hideBook,
  showBook,
  getThongKeTonKho,

  getDanhSachTheLoai,
  getThemTheLoai,
  postThemTheLoai,
  getSuaTheLoai,
  postSuaTheLoai,
  hideTheLoai,
  showTheLoai,

  getQuanLyDonHang,
  getChiTietDonHang,
  postCapNhatTrangThai,
  getDoanhThu,
};
