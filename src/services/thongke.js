const connection = require("../config/database.js");

const DoanhThuLoc = async (batdau, ketthuc) => {
  const [rows] = await connection.query(
    `
    SELECT
      SUM(ds.soluong * ds.gia) AS doanhthu,
      COUNT(DISTINCT d.madonhang) AS tongdon,
      IF(
        COUNT(DISTINCT d.madonhang) = 0,
        0,
        SUM(ds.soluong * ds.gia) / COUNT(DISTINCT d.madonhang)
      ) AS trungbinhdon
    FROM donhang d
    JOIN donhang_sach ds ON d.madonhang = ds.madonhang
    WHERE d.trangthai = 'HOAN_THANH'
      AND DATE(d.ngaymua) BETWEEN ? AND ?
    `,
    [batdau, ketthuc]
  );
  rows[0].doanhthu = Number(rows[0].doanhthu).toLocaleString("vi-VN");
  rows[0].trungbinhdon = Number(rows[0].trungbinhdon).toLocaleString("vi-VN");
  return rows[0] || { doanhthu: 0, tongdon: 0, trungbinhdon: 0 };
};

const SoDonHuy = async (batdau, ketthuc) => {
  const [kq] = await connection.query(
    `
      SELECT COUNT(*) AS sodonhuy
      FROM donhang
      WHERE trangthai = 'HUY'
        AND DATE(ngaymua) BETWEEN ? AND ?
    `,
    [batdau, ketthuc]
  );
  return kq[0];
};

const DonHoanThanh = async (batdau, ketthuc) => {
  let [kq] = await connection.query(
    `SELECT 
        donhang.madonhang,
        DATE_FORMAT(donhang.ngaymua, '%Y-%m-%d') AS ngaymua,
        users.taikhoan,
        SUM(donhang_sach.soluong * donhang_sach.gia) AS tongtien
     FROM donhang 
     JOIN donhang_sach ON donhang.madonhang = donhang_sach.madonhang
     JOIN users ON users.user_id = donhang.user_id
     WHERE donhang.trangthai = 'HOAN_THANH'
       AND DATE(donhang.ngaymua) BETWEEN ? AND ?
     GROUP BY donhang.madonhang, DATE(donhang.ngaymua), users.taikhoan
     ORDER BY donhang.ngaymua DESC`,
    [batdau, ketthuc]
  );
  return kq;
};

const TopSachBanChay = async (batdau, ketthuc) => {
  const [kq] = await connection.query(
    `SELECT 
        sach.masach,
        tensach,
        tentheloai,
        SUM(donhang_sach.soluong) AS sl,
        SUM(donhang_sach.soluong * donhang_sach.gia) AS doanhthu
     FROM sach
     JOIN theloai 
        ON sach.matheloai = theloai.matheloai 
     JOIN donhang_sach 
        ON donhang_sach.masach = sach.masach
     JOIN donhang 
        ON donhang.madonhang = donhang_sach.madonhang
     WHERE donhang.trangthai = 'HOAN_THANH'
       AND DATE(donhang.ngaymua) BETWEEN ? AND ?
     GROUP BY sach.masach, sach.tensach, theloai.tentheloai
     ORDER BY doanhthu DESC
     LIMIT 5`,
    [batdau, ketthuc]
  );
  return kq;
};

const TopTheLoaiMuaNhieu = async (batdau, ketthuc) => {
  const [kq] = await connection.query(
    `
    SELECT 
        theloai.tentheloai,
        SUM(ds.soluong) AS tongsl,
        SUM(ds.soluong * ds.gia) AS doanhthu
    FROM donhang d
    JOIN donhang_sach ds ON d.madonhang = ds.madonhang
    JOIN sach ON sach.masach = ds.masach
    JOIN theloai ON theloai.matheloai = sach.matheloai
    WHERE d.trangthai = 'HOAN_THANH'
      AND DATE(d.ngaymua) BETWEEN ? AND ?
    GROUP BY theloai.tentheloai
    ORDER BY tongsl DESC
    LIMIT 5
    `,
    [batdau, ketthuc]
  );
  return kq;
};

const TongDoanhThu = async () => {
  let [kq] =
    await connection.query(`select sum(soluong * gia) as tongtien from donhang join
    donhang_sach on donhang.madonhang = donhang_sach.madonhang where trangthai = 'HOAN_THANH'`);
  return kq[0] || { tongtien: 0 };
};

const TongSoDon = async () => {
  let [kq] = await connection.query(`select count(madonhang) as tongdon 
    from donhang where trangthai = 'HOAN_THANH'`);
  return kq[0] || { tongdon: 0 };
};

const TongSach = async () => {
  let [kq] = await connection.query(
    `select count(masach) as tongsach from sach where trangthai_sach = 'HIEN'`
  );
  return kq[0] || { tongsach: 0 };
};

const TongNguoiDung = async () => {
  let [kq] = await connection.query(
    `select count(user_id)  as tonguser from users where trangthai_user = 'ACTIVE'`
  );
  return kq[0] || { tonguser: 0 };
};

const Top5DonHangMoiNhat = async () => {
  let [kq] = await connection.query(`
    SELECT 
        donhang.madonhang,
        users.taikhoan,
        SUM(donhang_sach.gia * donhang_sach.soluong) AS tongtien,
        donhang.trangthai,
        donhang.ngaymua
    FROM donhang
    JOIN users 
        ON users.user_id = donhang.user_id
    JOIN donhang_sach 
        ON donhang.madonhang = donhang_sach.madonhang
    GROUP BY donhang.madonhang, users.taikhoan, donhang.trangthai, donhang.ngaymua
    ORDER BY donhang.ngaymua DESC
    LIMIT 5
  `);
  return kq;
};

const Top5NguoiDungMoi = async () => {
  let [kq] = await connection.query(
    `select * from users order by ngaytao desc limit 5`
  );
  return kq;
};

const Top6SachBanChay = async () => {
  let [kq] =
    await connection.query(`select sach.masach, tensach, hinhanh,tentheloai, giaban, sum(soluong) as sl, sum(gia*soluong)
    as doanhthu from sach join donhang_sach on sach.masach = donhang_sach.masach join theloai
    on theloai.matheloai = sach.matheloai join donhang on donhang.madonhang = 
    donhang_sach.madonhang where trangthai = 'HOAN_THANH' group by sach.masach, 
    tensach,hinhanh, tentheloai,giaban order by sl desc limit 6`);
  return kq;
};

const Top6SachMoi = async () => {
  const [kq] = await connection.query(`
    SELECT 
      sach.masach,
      sach.tensach,
      sach.tentacgia,
      sach.hinhanh,
      theloai.tentheloai,
      sach.giaban,
      sach.ngaytao_sach
    FROM sach
    JOIN theloai 
        ON sach.matheloai = theloai.matheloai
    WHERE sach.trangthai_sach = 'HIEN'
    ORDER BY sach.ngaytao_sach DESC
    LIMIT 6
  `);
  return kq;
};

const LocTheoTheLoai = async (matheloai) => {
  let [kq] = await connection.query(
    `select sach.*, theloai.matheloai from sach join theloai
    on sach.matheloai = theloai.matheloai where theloai.matheloai = ?`,
    [matheloai]
  );
  return kq;
};

const TimKiem = async (search) => {
  const keyword = `%${search}%`; // thêm % ở JS

  let [kq] = await connection.query(
    `SELECT sach.*, theloai.matheloai, theloai.tentheloai
     FROM sach 
     JOIN theloai ON sach.matheloai = theloai.matheloai
     WHERE sach.tensach LIKE ?`,
    [keyword]
  );
  return kq;
};

module.exports = {
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
  Top6SachMoi,
  LocTheoTheLoai,
  TimKiem,
};
