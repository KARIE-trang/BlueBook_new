const connection = require("../config/database.js");

const LoginUsers = async (taikhoan, matkhau) => {
  let [results] = await connection.query(
    "SELECT * FROM users WHERE taikhoan = ?",
    [taikhoan]
  );
  if (results.length === 0) {
    return { status: "NOT_FOUND" };
  }
  const user = results[0];
  if (user.trangthai_user !== "ACTIVE") {
    return { status: "LOCKED" };
  }
  if (user.matkhau !== matkhau) {
    return { status: "WRONG_PASSWORD" };
  }
  return { status: "SUCCESS", user };
};

const SignUp = async (taikhoan, matkhau, hoten, email) => {
  let [results] = await connection.query(
    "SELECT * FROM users WHERE taikhoan = ? OR email = ?",
    [taikhoan, email]
  );

  if (results.length === 0) {
    await connection.query(
      "INSERT INTO users(taikhoan, matkhau, hoten, email) VALUES (?,?,?,?)",
      [taikhoan, matkhau, hoten, email]
    );
    return 1;
  }

  return 0;
};

const DanhSachUsers = async () => {
  let [results] = await connection.query("SELECT * FROM users");
  return results;
};

const getUser = async (user_id) => {
  let [result] = await connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id]
  );
  return result[0];
};

const EditUser = async (taikhoan, matkhau, hoten, email, user_id) => {
  let [check] = await connection.query(
    "SELECT * FROM users WHERE (taikhoan = ? OR email = ?) AND user_id != ?",
    [taikhoan, email, user_id]
  );

  if (check.length > 0) {
    return 0;
  }

  await connection.query(
    "UPDATE users SET taikhoan=?, matkhau=?, hoten=?, email=? WHERE user_id=?",
    [taikhoan, matkhau, hoten, email, user_id]
  );

  return 1;
};

const BlockUser = async (user_id) => {
  await connection.query(
    "UPDATE users SET trangthai_user='BLOCKED' WHERE user_id=?",
    [user_id]
  );
};

const UnlockUser = async (user_id) => {
  await connection.query(
    "UPDATE users SET trangthai_user='ACTIVE' WHERE user_id=?",
    [user_id]
  );
};

const doimatkhau = async (
  matkhauhientai,
  matkhaumoi,
  nhaplaimatkhau,
  user_id
) => {
  if (matkhaumoi !== nhaplaimatkhau) {
    return "matkhaukhongkhop";
  } else {
    let [kq] = await connection.query(
      "select matkhau from users where user_id = ?",
      [user_id]
    );
    if (kq[0].matkhau !== matkhauhientai) {
      return "matkhaucusai";
    } else {
      await connection.query(`update users set matkhau = ? where user_id = ?`, [
        matkhaumoi,
        user_id,
      ]);
      return "thanhcong";
    }
  }
};

module.exports = {
  LoginUsers,
  SignUp,
  DanhSachUsers,
  getUser,
  EditUser,
  BlockUser,
  UnlockUser,
  doimatkhau,
};
