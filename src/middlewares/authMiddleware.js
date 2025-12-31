import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

// Middleware này sẽ đảm nhiệm việuc quan trọng: Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizedAxios
  const clientAccessToken = req.cookies?.accessToken

  // Nếu như clientAccessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    // Bước 1: Thực hiện giải mã token xem có hợp lệ hay là không
    const accessTokenDecode = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    // console.log('accessTokenDecode: ', accessTokenDecode)

    // Bước 2: Quan trọng: Nếu như cái token hợp lệ, thì ta sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecode, để sử dụng cho các tầng cần xử lí ở phái sau
    req.jwtDecode = accessTokenDecode

    // Bước 3: Cho phép nó đi tiếp
    next()
  } catch (error) {
    // console.log('authMiddleware: ', error)

    // Nếu cái accessToken nó bị hết hạn (expired) thì mình cần trả về một cái mã lỗi GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }

    // Nếu như cái accessToken nó không hợp lệ do bất kì điều gì khoác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phí FE gọi api sign_out luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }