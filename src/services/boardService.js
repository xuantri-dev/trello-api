/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { DEFAULT_PAGE, DEFAULT_ITEM_PER_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  try {
    // xử lí logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // gọi tới tầng model để xử lí lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(userId, newBoard)

    // lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // deep clone board ra một cái mới để xử lí, không ảnh hưởng tới board ban đầu, tùy mục đích về sau mà có cần clone deep hay không (vid 63)
    const resBoard = cloneDeep(board)
    // đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // cách dùng .equals này là bởi vì ObjectId trong MongoDB có support method equals
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))

      // cách khác đơn giản là convert ObjectId về string bằng hàm toString() của JavaScript
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
    })

    // xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm cái _id của Card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // B3: Câp nhật lại trường columnId mới của cái Card đã kéo
    await cardModel.update(reqBody.currentCardId, { columnId: reqBody.nextColumnId })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    // Nếu không tồn tại page hoặc itemsPerPage từ phía BE thì BE sẽ cần phải luôn gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEM_PER_PAGE

    const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))

    return results
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}
