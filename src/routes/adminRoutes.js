const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads.js");
const { requireAdmin } = require("../middleware/auth.js");

const {
  getHome,
  getDangXuat,

  // Users
  getQuanLyKhachHang,
  getEditUser,
  postEditUser,
  blockUser,
  unlockUser,
  getAddUser,
  postAddUser,

  // Books
  getQuanLySach,
  getAddSach,
  postAddBook,
  getEditBook,
  postEditBook,
  hideBook,
  showBook,
  getThongKeTonKho,

  // Thể loại
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

  //doanh thu
  getDoanhThu,
} = require("../controllers/adminController.js");
//home
router.get("/admin/home", requireAdmin, getHome);
router.get("/logout", getDangXuat);

//khachhang
router.get("/quanlykhachhang", requireAdmin, getQuanLyKhachHang);
router.get("/edit_user/:user_id", requireAdmin, getEditUser);
router.post("/edit_user/:user_id", requireAdmin, postEditUser);
router.get("/block_user/:user_id", requireAdmin, blockUser);
router.get("/unlock_user/:user_id", requireAdmin, unlockUser);
router.get("/add_user", requireAdmin, getAddUser);
router.post("/add_user", requireAdmin, postAddUser);

//sach
router.get("/admin/quanlysach", requireAdmin, getQuanLySach);

router.get("/admin/add_book", requireAdmin, getAddSach);
router.post(
  "/admin/add_book",
  requireAdmin,
  upload.single("hinhanh"),
  postAddBook
);

router.get("/admin/edit_book/:masach", requireAdmin, getEditBook);
router.post(
  "/admin/edit_book/:masach",
  requireAdmin,
  upload.single("hinhanh"),
  postEditBook
);

router.get("/admin/hide_book/:masach", requireAdmin, hideBook);
router.get("/admin/show_book/:masach", requireAdmin, showBook);
router.get("/admin/thongke-tonkho", requireAdmin, getThongKeTonKho);

// theloai
router.get("/admin/theloai", requireAdmin, getDanhSachTheLoai);
router.get("/admin/add_theloai", requireAdmin, getThemTheLoai);
router.post("/admin/add_theloai", requireAdmin, postThemTheLoai);
router.get("/admin/edit_theloai/:matheloai", requireAdmin, getSuaTheLoai);
router.post("/admin/edit_theloai/:matheloai", requireAdmin, postSuaTheLoai);
router.get("/admin/hide_theloai/:matheloai", requireAdmin, hideTheLoai);
router.get("/admin/show_theloai/:matheloai", requireAdmin, showTheLoai);

// don hang
router.get("/admin/quanlydonhang", requireAdmin, getQuanLyDonHang);

router.post(
  "/admin/quanlydonhang/capnhattrangthai/:madonhang",
  requireAdmin,
  postCapNhatTrangThai
);

router.get(
  "/admin/quanlydonhang/chitietdonhang/:madonhang",
  requireAdmin,
  getChiTietDonHang
);
//doanhthu
router.get("/admin/doanhthu", requireAdmin, getDoanhThu);

module.exports = router;
