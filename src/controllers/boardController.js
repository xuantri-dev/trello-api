/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { StatusCodes } from "http-status-codes";

const createNew = (req, res, next) => {
  try {
    console.log("req.body: ", req.body);

    // Điều hướng dữ liệu sang tầng Service

    // có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json({ message: "POST from Controller: API create new board" });
  } catch (error) {
    next(error);
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //   errors: error.message,
    // });
  }
};

export const boardController = { createNew };
