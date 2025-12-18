const connection = require("../config/database.js");

const getDanhSach = async () => {
  let [kq] = await connection.query(
    "SELECT sach.*, tentheloai FROM sach JOIN theloai ON theloai.matheloai = sach.matheloai where trangthai_sach = 'HIEN'"
  );
  return kq;
};

const getDanhSachAdmin = async () => {
  let [kq] = await connection.query(
    "SELECT sach.*, tentheloai FROM sach JOIN theloai ON theloai.matheloai = sach.matheloai"
  );
  return kq;
};

const addBook = async (
  tensach,
  tentacgia,
  matheloai,
  ngayphathanh,
  giaban,
  sl_tonkho,
  mota,
  hinhanh
) => {
  await connection.query(
    "INSERT INTO sach(tensach, tentacgia, matheloai, ngayphathanh, giaban, sl_tonkho, mota, hinhanh) VALUES (?,?,?,?,?,?,?,?)",
    [
      tensach,
      tentacgia,
      matheloai,
      ngayphathanh,
      giaban,
      sl_tonkho,
      mota,
      hinhanh,
    ]
  );
  return 1;
};

const getEditSach = async (masach) => {
  let [kq] = await connection.query(
    "SELECT sach.*, tentheloai FROM sach JOIN theloai ON theloai.matheloai = sach.matheloai WHERE masach = ?",
    [masach]
  );

  if (kq[0].ngayphathanh) {
    kq[0].ngayphathanh = kq[0].ngayphathanh.toISOString().split("T")[0];
  }
  return kq[0];
};

const postEditSach = async (
  tensach,
  tentacgia,
  matheloai,
  ngayphathanh,
  giaban,
  sl_tonkho,
  mota,
  hinhanh,
  masach
) => {
  await connection.query(
    "UPDATE sach SET tensach = ?, tentacgia = ?, matheloai = ?, ngayphathanh = ?, giaban = ?, sl_tonkho = ?, mota = ?, hinhanh = ? WHERE masach = ?",
    [
      tensach,
      tentacgia,
      matheloai,
      ngayphathanh,
      giaban,
      sl_tonkho,
      mota,
      hinhanh,
      masach,
    ]
  );
};

const HideSach = async (masach) => {
  await connection.query(
    "UPDATE sach SET trangthai_sach = 'AN' WHERE masach = ?",
    [masach]
  );
  return 1;
};

const ShowSach = async (masach) => {
  await connection.query(
    "UPDATE sach SET trangthai_sach = 'HIEN' WHERE masach = ?",
    [masach]
  );
  return 1;
};

const TongSLSach = async () => {
  let [kq] = await connection.query(
    "SELECT SUM(sl_tonkho) AS soluong FROM sach where trangthai_sach = 'HIEN'"
  );
  return kq[0];
};

const SachTonItNhat = async () => {
  let [kq] = await connection.query(
    "SELECT * FROM sach ORDER BY sl_tonkho ASC LIMIT 1"
  );
  return kq[0];
};

const SachENhieuNhat = async () => {
  let [kq] = await connection.query(
    "SELECT * FROM sach ORDER BY sl_tonkho DESC LIMIT 1"
  );
  return kq[0];
};

const TheLoaiNhieuSachNhat = async () => {
  let [kq] = await connection.query(
    `SELECT theloai.matheloai, tentheloai, SUM(sl_tonkho) AS sl 
     FROM theloai 
     JOIN sach ON sach.matheloai = theloai.matheloai 
     GROUP BY theloai.matheloai, tentheloai 
     ORDER BY sl DESC LIMIT 1`
  );
  return kq[0];
};

const Top5SachTonIt = async () => {
  let [rows] = await connection.query(
    "SELECT * FROM sach ORDER BY sl_tonkho ASC LIMIT 5"
  );
  return rows;
};

module.exports = {
  addBook,
  getDanhSach,
  getEditSach,
  postEditSach,
  HideSach,
  ShowSach,
  TongSLSach,
  SachENhieuNhat,
  SachTonItNhat,
  TheLoaiNhieuSachNhat,
  Top5SachTonIt,
  getDanhSachAdmin,
};
