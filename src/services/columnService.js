/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";

const createNew = async (reqBody) => {
  try {
    // xử lí logic dữ liệu tùy đặc thù dự án
    const newColumn = {
      ...reqBody,
    };
    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);

    if (getNewColumn) {
      // xử lí cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = [];

      // cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
};
