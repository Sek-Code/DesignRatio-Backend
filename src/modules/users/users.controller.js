import { users } from "../../mock-db/userMockData";
import { TeaUser } from "./users.model";

export const getMockUser = (req, res) => {
  res.status(200).json(users);
};

export const deleteMockUser = (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);
  //หาตำแหน่ง index ของuser ในarray users ที่มีid เหมือนกับuserId

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    res.status(200).send(`User with ID ${userId} deleted ✅`);
  } else {
    res.status(404).send("User not found.");
  }
  //ถ้าเจอ user
  //array.splice(startIndex, deleteCount); ลบuserออก 1 คน ตามตำแหน่ง index
  //     const users = [
  //   { id: "1", name: "Boat" },
  //   { id: "2", name: "Ann" },
  //   { id: "3", name: "Mike" }
  // ];
  // users.splice(userIndex, 1);
  // userIndex = 1;
  // [
  //   { id: "1", name: "Boat" },
  //   { id: "3", name: "Mike" }
  // ]
};

export const createMockUser = (req, res) => {
  const { img, userName, userLast, email, phoneNumber, address } = req.body;

  const newUser = {
    id: String(users.length + 1),
    img: img,
    userName: userName,
    userLast: userLast,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
  };

  users.push(newUser);

  res.status(200).json(newUser);
};
// client ส่ง request มา
// POST /users
// Content-Type: application/json

// {
//   "name": "Boat",
//   "email": "boat@example.com"
// }
// Express เอามาเก็บ
// req.body = {
//   name: "Boat",
//   email: "boat@example.com"
// };
// แบบปกติ
// const name = req.body.name;
// const email = req.body.email;
// แบบ destructuring
// const { name, email } = req.body;

// id: String(users.length + 1), คือการ สร้างค่า id ให้ user ใหม่ โดยดูจากจำนวน user ที่มีอยู่ใน users ตอนนั้น

// users.push(newUser); push() = เพิ่มข้อมูลเข้าไปท้าย array
