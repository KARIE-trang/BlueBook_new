const connection = require("../config/database.js");
const { LoginUsers, SignUp } = require("../services/CRUD_user.js");
const {
  Top6SachBanChay,
  Top6SachMoi,
  TongSach,
  LocTheoTheLoai,
  TimKiem,
} = require("../services/thongke.js");
const { getDanhSach, getEditSach } = require("../services/CRUD_sach.js");
const { DanhSachTheLoaiSapXep } = require("../services/CRUD_theloai.js");

const getHome = async (req, res) => {
  let top6sachbanchay = await Top6SachBanChay();
  let top6sachmoi = await Top6SachMoi();
  res.render("home", {
    users: req.session.users,
    top6sachbanchay,
    top6sachmoi,
  });
};
const getDangNhap = (req, res) => {
  res.render("log_in", {
    mode: "login",
    loginError: req.query.loginError || null,
    registerError: null,
  });
};

const postDangNhap = async (req, res) => {
  let { taikhoan, matkhau } = req.body;
  let result = await LoginUsers(taikhoan, matkhau);

  if (result.status === "NOT_FOUND")
    return res.redirect("/login?loginError=NOT_FOUND");

  if (result.status === "LOCKED")
    return res.redirect("/login?loginError=LOCKED");

  if (result.status === "WRONG_PASSWORD")
    return res.redirect("/login?loginError=WRONG_PASSWORD");
  req.session.users = result.user;
  if (result.user.role === "ADMIN") {
    return res.redirect("/admin/home");
  }
  return res.redirect("/home");
};

// ===== REGISTER PAGE =====
const getDangKy = (req, res) => {
  res.render("log_in", {
    mode: "register",
    loginError: null,
    registerError: req.query.registerError || null,
  });
};

const postDangKy = async (req, res) => {
  let { taikhoan, matkhau, nhaplaimatkhau, hoten, email } = req.body;
  if (matkhau !== nhaplaimatkhau) {
    return res.redirect("/register?registerError=PASSWORD_NOT_MATCH");
  }
  let created = await SignUp(taikhoan, matkhau, hoten, email);
  if (created === 0) return res.redirect("/register?registerError=USER_EXISTS");
  return res.redirect("/login?mode=login&loginSuccess=1");
};

// ===== LOGOUT =====
const getDangXuat = (req, res) => {
  req.session.destroy();
  res.redirect("/home");
};

const getSanPham = async (req, res) => {
  let theloai = await DanhSachTheLoaiSapXep();
  let tongsach = await TongSach();
  let matheloai = req.query.filter || "tatca";
  let listsach;
  let search = (req.query.search || "").trim();
  if (!search) {
    if (matheloai === "tatca") {
      listsach = await getDanhSach();
    } else {
      listsach = await LocTheoTheLoai(matheloai);
    }
  } else {
    listsach = await TimKiem(search);
  }
  res.render("sanpham", {
    users: req.session.users,
    listsach,
    theloai,
    tongsach,
    filter: matheloai,
  });
};

const getSach = async (req, res) => {
  let masach = req.params.masach;
  let sach = await getEditSach(masach);
  res.render("user/sach", {
    sach,
    msg: req.query.msg || null,
    users: req.session.users,
  });
};

module.exports = {
  getHome,
  getDangNhap,
  getDangKy,
  postDangKy,
  postDangNhap,
  getDangXuat,
  getSanPham,
  getSach,
};
