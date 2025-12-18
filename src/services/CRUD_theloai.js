const connection = require("../config/database.js");

const DanhSachTheLoai = async () => {
  let [kq] = await connection.query(
    `SELECT theloai.matheloai, tentheloai, trangthai_theloai,
            COUNT(sach.masach) AS soluongsach
     FROM theloai 
     LEFT JOIN sach ON sach.matheloai = theloai.matheloai
     GROUP BY theloai.matheloai, tentheloai, trangthai_theloai
     `
  );
  return kq;
};

const DanhSachTheLoaiSapXep = async () => {
  let [kq] = await connection.query(
    `SELECT 
        theloai.matheloai,
        theloai.tentheloai,
        theloai.trangthai_theloai,
        COUNT(sach.masach) AS soluongsach
     FROM theloai
     JOIN sach ON sach.matheloai = theloai.matheloai
     GROUP BY theloai.matheloai, theloai.tentheloai, theloai.trangthai_theloai
     ORDER BY soluongsach DESC`
  );
  return kq;
};

const getAllTheLoai = async () => {
  let [kq] = await connection.query("SELECT * FROM theloai");
  return kq;
};

const ThemTheLoai = async (tentheloai) => {
  let [kq] = await connection.query(
    "SELECT * FROM theloai WHERE tentheloai = ?",
    [tentheloai]
  );

  if (kq.length > 0) return 0;

  await connection.query("INSERT INTO theloai(tentheloai) VALUES (?)", [
    tentheloai,
  ]);
  return 1;
};

const layTheLoai = async (matheloai) => {
  let [kq] = await connection.query(
    "SELECT * FROM theloai WHERE matheloai = ?",
    [matheloai]
  );
  return kq[0];
};

const SuaTheLoai = async (matheloai, tentheloai) => {
  let [kq] = await connection.query(
    "SELECT * FROM theloai WHERE tentheloai = ?",
    [tentheloai]
  );

  if (kq.length > 0 && kq[0].matheloai != matheloai) return 0;

  await connection.query(
    "UPDATE theloai SET tentheloai = ? WHERE matheloai = ?",
    [tentheloai, matheloai]
  );
  return 1;
};

const HideTheLoai = async (matheloai) => {
  await connection.query(
    "UPDATE theloai SET trangthai_theloai = 'AN' WHERE matheloai = ?",
    [matheloai]
  );
  return 1;
};

const ShowTheLoai = async (matheloai) => {
  await connection.query(
    "UPDATE theloai SET trangthai_theloai = 'HIEN' WHERE matheloai = ?",
    [matheloai]
  );
  return 1;
};
const TonKhoTheoTheLoai = async () => {
  let [kq] = await connection.query(`
    SELECT 
        theloai.matheloai,
        theloai.tentheloai,
        SUM(sach.sl_tonkho) AS soluong
    FROM theloai
    JOIN sach ON sach.matheloai = theloai.matheloai
    GROUP BY theloai.matheloai, theloai.tentheloai
    order by soluong desc
  `);
  return kq;
};

module.exports = {
  DanhSachTheLoai,
  DanhSachTheLoaiSapXep,
  getAllTheLoai,
  ThemTheLoai,
  layTheLoai,
  SuaTheLoai,
  HideTheLoai,
  ShowTheLoai,
  TonKhoTheoTheLoai,
};
