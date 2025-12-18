const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/auth.js");
const {
  getHome,
  getDangNhap,
  getDangKy,
  postDangKy,
  postDangNhap,
  getDangXuat,
  getSanPham,
  getSach,
} = require("../controllers/homeControllers.js");

const {
  getGioHang,
  postThemGioHang,
  getThanhToan,
  getDatHangThanhCong,
  editProfile,
  getDonMua,
  getDoiMatKhau,
  getUpdateSoLuong,
  getXoaSanPham,
  postThanhToan,
  getChiTietDonHang,
  postHuyDonHang,
  postDoiMatKhau,
} = require("../controllers/userController.js");

router.get("/home", getHome);
router.get("/login", getDangNhap);
router.post("/login", postDangNhap);
router.get("/register", getDangKy);
router.post("/register", postDangKy);
router.get("/logout", getDangXuat);
router.get("/sanpham", getSanPham);
router.get("/sanpham/book/:masach", getSach);

router.get("/user/giohang", requireLogin, getGioHang);
router.post("/user/add_giohang/:masach", requireLogin, postThemGioHang);
router.get("/user/sanpham/updatesoluong", requireLogin, getUpdateSoLuong);
router.get(
  "/user/sanpham/xoasanpham/:magiohang/:masach",
  requireLogin,
  getXoaSanPham
);
router.get("/user/thanhtoan", requireLogin, getThanhToan);
router.post("/user/postthanhtoan", requireLogin, postThanhToan);
router.get(
  "/user/dathangthanhcong/:madonhang",
  requireLogin,
  getDatHangThanhCong
);
router.get("/user/chitietdonhang/:madonhang", requireLogin, getChiTietDonHang);
router.get("/edit_profile", requireLogin, editProfile);
router.post("/edit_profile", requireLogin, editProfile);
router.get("/user/donmua", requireLogin, getDonMua);
router.post("/donhang/huy/:madonhang", requireLogin, postHuyDonHang);

router.get("/user/doimatkhau", requireLogin, getDoiMatKhau);
router.post("/user/doimatkhau", requireLogin, postDoiMatKhau);
module.exports = router;
