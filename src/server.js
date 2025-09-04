/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb.js";
import { env } from "~/config/environment.js";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const app = express();

  // enable req.body json data
  app.use(express.json());

  // use APIs V1
  app.use("/v1", APIs_V1);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hi ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`);
  });

  // thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log("4. Server is shutting down");
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
