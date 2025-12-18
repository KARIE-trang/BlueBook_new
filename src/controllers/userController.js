const connection = require("../config/database.js");
const {
  ThemGioHang,
  SpTrongGioHang,
  updatesoluong,
  xoaSanPham,
  TongTienGioHang,
} = require("../services/giohang.js");

const {
  DonhangUser,
  CapNhatTrangThai,
} = require("../services/CRUD_donhang.js");
const { getUser, EditUser, doimatkhau } = require("../services/CRUD_user.js");
const {
  ThanhToan,
  ThongTinDon,
  SanPhamTrongDon,
  ThanhTien,
} = require("../services/CRUD_donhang.js");
const { getEditSach } = require("../services/CRUD_sach.js");

const getGioHang = async (req, res) => {
  let user_id = req.session.users.user_id;
  let sanpham = await SpTrongGioHang(user_id);
  let tongtien = { tongtien: 0 };
  if (sanpham && sanpham.length > 0) {
    tongtien = await TongTienGioHang(user_id);
    if (!tongtien || tongtien.tongtien == null) {
      tongtien = { tongtien: 0 };
    }
  }
  res.render("user/giohang", {
    users: req.session.users,
    sanpham,
    error: req.query.error,
    masachloi: req.query.masachloi,
    tongtien,
  });
};

const postThemGioHang = async (req, res) => {
  const user_id = req.session.users.user_id;
  const masach = req.params.masach;
  const ok = await ThemGioHang(user_id, masach);
  if (!ok) {
    if (req.body.source === "detail") {
      return res.redirect(`/sanpham/book/${masach}?msg=OUT_OF_STOCK`);
    }
    return res.redirect(
      (req.get("referer") || "/sanpham?filter=tatca") + "?msg=OUT_OF_STOCK"
    );
  }
  if (req.body.source === "detail") {
    return res.redirect(`/sanpham/book/${masach}?msg=ADD_OK`);
  }
  return res.redirect(req.get("referer") || "/sanpham?filter=tatca");
};

const getUpdateSoLuong = async (req, res) => {
  let { masach, magiohang, update } = req.query;
  let kq = await updatesoluong(magiohang, masach, update);
  if (kq == 1) {
    res.redirect("/user/giohang");
  } else {
    return res.redirect(`/user/giohang?error=het-hang&masachloi=${kq}`);
  }
};

const getXoaSanPham = async (req, res) => {
  let { magiohang, masach } = req.params;
  await xoaSanPham(magiohang, masach);
  res.redirect("/user/giohang");
};

const getThanhToan = async (req, res) => {
  const user_id = req.session.users.user_id;
  const sach = await SpTrongGioHang(user_id);
  const tongtien = await TongTienGioHang(user_id);
  return res.render("user/thanhtoan", { sach, tongtien });
};

const postThanhToan = async (req, res) => {
  let user_id = req.session.users.user_id;
  let { tennguoinhan, sdt_giao, diachi_giao, ghichu } = req.body;
  let kq = await ThanhToan(
    user_id,
    tennguoinhan,
    sdt_giao,
    diachi_giao,
    ghichu
  );
  res.redirect(`/user/dathangthanhcong/${kq}`);
};
const getDatHangThanhCong = async (req, res) => {
  let madonhang = req.params.madonhang;
  res.render("user/dathangthanhcong", { madonhang });
};

const editProfile = async (req, res) => {
  let user_id = req.session.users.user_id;
  let user = await getUser(user_id);
  if (req.method === "POST") {
    const hoten = (req.body.hoten || "").trim();
    const email = (req.body.email || "").trim();
    let kq = await EditUser(user.taikhoan, user.matkhau, hoten, email, user_id);
    if (kq == 0) {
      return res.render("user/edit_profile", {
        users: req.session.users,
        user,
        error: "emailtontai",
        success: null,
      });
    }
    let userNew = await getUser(user_id);
    req.session.users = userNew;

    return res.render("user/edit_profile", {
      users: req.session.users,
      user: userNew,
      error: null,
      success: "thanhcong",
    });
  }
  return res.render("user/edit_profile", {
    users: req.session.users,
    user,
    error: null,
    success: null,
  });
};

const getDonMua = async (req, res) => {
  let rows = await DonhangUser(req.session.users.user_id);
  let orders = [];
  for (let i = 0; i < rows.length; i++) {
    let r = rows[i];
    let order = orders.find((o) => o.madonhang === r.madonhang);
    if (!order) {
      order = {
        madonhang: r.madonhang,
        ngaymua: r.ngaymua,
        trangthai: r.trangthai,
        products: [],
        tongtien: 0,
      };
      orders.push(order);
    }
    let soluong = Number(r.soluong) || 0;
    let gia = Number(r.gia) || 0;
    order.products.push({
      masach: r.masach,
      tensach: r.tensach,
      soluong: soluong,
      gia: gia,
      hinhanh: r.hinhanh,
    });
    order.tongtien += soluong * gia;
  }

  res.render("user/donmua", {
    users: req.session.users,
    orders,
  });
};

const getChiTietDonHang = async (req, res) => {
  let madonhang = req.params.madonhang;
  let thongtindon = await ThongTinDon(madonhang);
  let sanpham = await SanPhamTrongDon(madonhang);
  let thanhtien = await ThanhTien(madonhang);
  res.render("user/chitietdonhang", {
    users: req.session.users,
    thongtindon,
    sanpham,
    thanhtien,
  });
};
const getDoiMatKhau = (req, res) => {
  res.render("user/doimatkhau", {
    users: req.session.users,
    success: req.query.success || null,
    error: req.query.error || null,
  });
};

const postDoiMatKhau = async (req, res) => {
  let user_id = req.session.users.user_id;
  let { matkhauhientai, matkhaumoi, nhaplaimatkhau } = req.body;
  let kq = await doimatkhau(
    matkhauhientai,
    matkhaumoi,
    nhaplaimatkhau,
    user_id
  );
  if (kq === "thanhcong") {
    return res.redirect("/user/doimatkhau?success=thanhcong");
  } else if (kq === "matkhaukhongkhop") {
    return res.redirect("/user/doimatkhau?error=matkhaukhongkhop");
  } else if (kq === "matkhaucusai") {
    return res.redirect("/user/doimatkhau?error=matkhaucusai");
  }
};

const postHuyDonHang = async (req, res) => {
  const madonhang = req.params.madonhang;
  await CapNhatTrangThai(madonhang, "HUY");
  res.redirect("/user/donmua");
};

module.exports = {
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
};
