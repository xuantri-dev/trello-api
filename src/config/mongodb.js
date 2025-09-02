/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

// Username;
// tranxuantridev;
// Password;
// il1QT6PJQdEAagCQ;

// const MONGODB_URI =
//   "mongodb+srv://tranxuantridev:il1QT6PJQdEAagCQ@cluster0-xuantridev.mqlkmhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-XuanTriDev";
const MONGODB_URI = "mongodb://localhost:27017/";

const DATABASE_NAME = "trello-xuantridev-mern-stack-pro";

import { MongoClient, ServerApiVersion } from "mongodb";

// khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null;

// khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  // lưu ý: cái serverApi có từ phiên bản 5.0.0 trở lên, có thể không cần dùng nó, còn nếu dùng nó là chúng ta sẽ chỉ định một cái Stable API version của MongoDB
  // serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

// kết nối tới Database
export const CONNECT_DB = async () => {
  // gọi kết nối tới MongoDB
  await mongoClientInstance.connect();

  // kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào cái biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME);
};

// đóng kết nối tới Database khi cần
export const CLOSE_DB = async () => {
  console.log("code chạy vào chỗ close này");
  await mongoClientInstance.close();
};

// function GET_DB (không async) này có nhiệm vụ export ra cái Trello Database Instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// lưu ý phải đảm bảo chỉ luôn gọi cái getDB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to Database first!");
  return trelloDatabaseInstance;
};
