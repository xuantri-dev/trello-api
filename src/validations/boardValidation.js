/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  /**
   * Mặc định chúng ta không cần custom message ở phí BE làm gì vì để cho FE tự validate và custom message phía FE cho đẹp
   * BE chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trọng : validation dữ liệu BẮT BUỘC phải có ở BE vì đây là điểm cuối để lưu dữ liệu vào database
   * Thông thường, trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả FE và BE
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "title is a required (xuantridev)",
      "string.empty": "title cannot be an empty field (xuantridev)",
      "string.min": "length must be at least 3 characters long (xuantridev)",
      "string.max": "length must be less than or equal to 5 characters long(xuantridev)",
      "string.trim": "title must not have leading or trailing whitespace (xuantridev)",
    }),

    description: Joi.string().required().min(3).max(256).trim().strict(),
  });
  try {
    console.log("req.body: ", req.body);
    // chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi (vid 52)
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // next()
    res.status(StatusCodes.CREATED).json({ message: "POST from validation: API create new board" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = { createNew };
