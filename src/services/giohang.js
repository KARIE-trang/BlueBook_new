const connection = require("../config/database");

//them vao gio hang
const ThemGioHang = async (user_id, masach) => {
  let [kt] = await connection.query(
    `SELECT * FROM giohang 
     WHERE trangthai = 'DANG_MO' AND user_id = ?`,
    [user_id]
  );
  if (kt[0]) {
    let magiohang = kt[0].magiohang;
    let [sach] = await connection.query(
      `SELECT * FROM chi_tietgiohang 
       WHERE masach = ? AND magiohang = ?`,
      [masach, magiohang]
    );
    let [ton] = await connection.query(
      `SELECT sl_tonkho FROM sach WHERE masach = ?`,
      [masach]
    );
    let slTon = ton[0]?.sl_tonkho ?? 0;
    if (sach[0]) {
      if (sach[0].soluong >= slTon) return false;
      await connection.query(
        `UPDATE chi_tietgiohang 
         SET soluong = soluong + 1 
         WHERE masach = ? AND magiohang = ?`,
        [masach, magiohang]
      );
    } else {
      if (slTon <= 0) return false;
      await connection.query(
        `INSERT INTO chi_tietgiohang(magiohang, masach, soluong)
         VALUES (?,?,1)`,
        [magiohang, masach]
      );
    }
  } else {
    const [kq] = await connection.query(
      `INSERT INTO giohang(user_id) VALUES (?)`,
      [user_id]
    );
    let magiohang = kq.insertId;

    let [ton] = await connection.query(
      `SELECT sl_tonkho FROM sach WHERE masach = ?`,
      [masach]
    );
    let slTon = ton[0]?.sl_tonkho ?? 0;
    if (slTon <= 0) return false;

    await connection.query(
      `INSERT INTO chi_tietgiohang(magiohang, masach, soluong)
       VALUES (?,?,1)`,
      [magiohang, masach]
    );
  }
  return true;
};

const SpTrongGioHang = async (user_id) => {
  let [kq] = await connection.query(
    `select sach.masach, sach.hinhanh, sach.tensach, sach.tentacgia, sach.giaban, soluong, giohang.magiohang,
    chi_tietgiohang.thoigianthem, (soluong * giaban) as thanhtien from sach join chi_tietgiohang on 
    sach.masach = chi_tietgiohang.masach join giohang on giohang.magiohang = chi_tietgiohang.magiohang 
    where user_id = ?  and giohang.trangthai = 'DANG_MO' order by chi_tietgiohang.thoigianthem desc`,
    [user_id]
  );
  return kq;
};

const updatesoluong = async (magiohang, masach, update) => {
  if (update === "tang") {
    let [kq] = await connection.query(
      `select sl_tonkho from sach where masach = ?`,
      [masach]
    );
    let [sl_hientai] = await connection.query(
      `select chi_tietgiohang.soluong from chi_tietgiohang where magiohang = ? 
      and masach = ?`,
      [magiohang, masach]
    );
    if (sl_hientai[0].soluong < kq[0].sl_tonkho) {
      await connection.query(
        `update chi_tietgiohang set soluong = soluong + 1 where masach = ?
    and magiohang = ?`,
        [masach, magiohang]
      );
      return 1;
    } else {
      return masach;
    }
  } else if (update === "giam") {
    await connection.query(
      `update chi_tietgiohang set soluong = soluong - 1 where masach = ?
    and magiohang = ? and soluong > 1`,
      [masach, magiohang]
    );
    return 1;
  }
};

const xoaSanPham = async (magiohang, masach) => {
  await connection.query(
    `delete from chi_tietgiohang where masach = ? and magiohang = ?`,
    [masach, magiohang]
  );
};

const TongTienGioHang = async (user_id) => {
  let [kq] = await connection.query(
    `select sum(soluong * giaban) as tongtien from chi_tietgiohang join sach on sach.masach = chi_tietgiohang.masach
  where magiohang = (select magiohang from giohang where user_id = ? and trangthai = 'DANG_MO')`,
    [user_id]
  );
  return kq[0];
};

const XoaGioHang = async (user_id) => {
  await connection.query(
    `delete from chi_tietgiohang where magiohang = (select magiohang from giohang where user_id = ? 
    and trangthai = 'DANG_MO')`,
    [user_id]
  );
  await connection.query(
    `update giohang set trangthai = "DA_THANH_TOAN" where user_id = ? AND trangthai = 'DANG_MO'`,
    [user_id]
  );
};
module.exports = {
  ThemGioHang,
  SpTrongGioHang,
  updatesoluong,
  xoaSanPham,
  TongTienGioHang,
  XoaGioHang,
};
