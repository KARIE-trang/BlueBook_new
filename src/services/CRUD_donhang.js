const connection = require("../config/database.js");
const { SpTrongGioHang, XoaGioHang } = require("../services/giohang.js");

const DanhSachDonHang = async (trangthai = "", from = null, to = null) => {
  let [kq] = await connection.query(
    `
    SELECT 
      donhang.madonhang,
      donhang.ngaymua,
      users.taikhoan,
      donhang.trangthai,
      SUM(donhang_sach.soluong * donhang_sach.gia) AS tongtien
    FROM donhang
    JOIN donhang_sach 
      ON donhang.madonhang = donhang_sach.madonhang
    JOIN users 
      ON users.user_id = donhang.user_id
    WHERE ( ? = '' OR donhang.trangthai = ? )
      AND ( ? IS NULL OR DATE(donhang.ngaymua) >= ? )
      AND ( ? IS NULL OR DATE(donhang.ngaymua) <= ? )
    GROUP BY donhang.madonhang, donhang.ngaymua, users.taikhoan, donhang.trangthai
    ORDER BY donhang.ngaymua DESC
    `,
    [trangthai, trangthai, from, from, to, to]
  );

  return kq;
};

const CapNhatTrangThai = async (madonhang, trangthai) => {
  const [kq] = await connection.query(
    "SELECT trangthai FROM donhang WHERE madonhang = ?",
    [madonhang]
  );

  if (!kq.length) return;
  const trangThaiCu = kq[0].trangthai;

  await connection.query(
    "UPDATE donhang SET trangthai = ? WHERE madonhang = ?",
    [trangthai, madonhang]
  );

  if (trangthai === "HUY" && trangThaiCu !== "HUY") {
    const [items] = await connection.query(
      "SELECT masach, soluong FROM donhang_sach WHERE madonhang = ?",
      [madonhang]
    );

    for (let sp of items) {
      await connection.query(
        "UPDATE sach SET sl_tonkho = sl_tonkho + ? WHERE masach = ?",
        [sp.soluong, sp.masach]
      );
    }
  }
};

const ThongTinDon = async (madonhang) => {
  let [kq] = await connection.query(
    "select madonhang, ngaymua, trangthai , ghichu, tennguoinhan, sdt_giao,  diachi_giao from donhang where madonhang = ?",
    [madonhang]
  );
  if (!kq.length) return null;
  if (kq[0].ngaymua) {
    kq[0].ngaymua = kq[0].ngaymua.toISOString().split("T")[0];
  }
  return kq[0];
};

const SanPhamTrongDon = async (madonhang) => {
  let [kq] = await connection.query(
    "select hinhanh,tensach, gia, soluong, (gia*soluong) as tongtien from sach join donhang_sach on sach.masach = donhang_sach.masach where madonhang = ?",
    [madonhang]
  );
  return kq;
};

const ThanhTien = async (madonhang) => {
  let [kq] = await connection.query(
    "select madonhang, sum(gia*soluong) as thanhtien from sach join donhang_sach on sach.masach = donhang_sach.masach where madonhang = ? group by madonhang",
    [madonhang]
  );
  return kq[0];
};

const ThanhToan = async (
  user_id,
  tennguoinhan,
  sdt_giao,
  diachi_giao,
  ghichu
) => {
  let [kq] = await connection.query(
    `insert into donhang(user_id, tennguoinhan, sdt_giao, diachi_giao, ghichu)
    values(?,?,?,?,?)`,
    [user_id, tennguoinhan, sdt_giao, diachi_giao, ghichu]
  );
  let madonhang = kq.insertId;
  let items = await SpTrongGioHang(user_id);
  for (let i of items) {
    await connection.query(
      `insert into donhang_sach(madonhang, masach, soluong, gia) values (?,?,?,?)`,
      [madonhang, i.masach, i.soluong, i.giaban]
    );
    await connection.query(
      `UPDATE sach SET sl_tonkho = sl_tonkho - ? WHERE masach = ?`,
      [i.soluong, i.masach]
    );
  }
  await XoaGioHang(user_id);
  return madonhang;
};

const DonhangUser = async (user_id) => {
  let [kq] = await connection.query(
    `select donhang.madonhang, ngaymua, trangthai, sach.masach, soluong, gia , 
      tensach, hinhanh from donhang join donhang_sach on donhang.madonhang = donhang_sach.madonhang 
      join sach on sach.masach = donhang_sach.masach where user_id = ? order by ngaymua desc`,
    [user_id]
  );
  return kq;
};
module.exports = {
  DanhSachDonHang,
  CapNhatTrangThai,
  ThongTinDon,
  SanPhamTrongDon,
  ThanhTien,
  ThanhToan,
  DonhangUser,
};
