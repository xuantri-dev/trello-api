/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "./config/mongodb.js";

const START_SERVER = () => {
  const app = express();

  const hostname = "localhost";
  const port = 8017;

  app.get("/", async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(port, hostname, () => {
    console.log(`3. Hello Xuan Tri Dev!, I am running at http://${hostname}:${port}/`);
  });

  // thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas"');
    CLOSE_DB();
    console.log('5. Disconnected from MongoDB Cloud Atlas"');
  });
};

// Chỉ khi kết nối tới database thành công thì mới start server back-end lên
// Immediately-invoked / Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log("1. Connecting to MongoDB Cloud Atlas...");
    await CONNECT_DB();
    console.log("2. Connected to MongoDB Cloud Atlas!");

    // Khởi động server back-end sau khi connect database thành công
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// // Chỉ khi kết nối tới database thành công thì mới start server back-end lên
// console.log("1. Connecting to MongoDB Cloud Atlas...");
// CONNECT_DB()
//   .then(() => console.log("2. Connected to MongoDB Cloud Atlas!"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });
