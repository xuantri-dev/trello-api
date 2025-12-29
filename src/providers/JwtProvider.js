import JWT from 'jsonwebtoken'

/**
 * Function tạo mới một token - Cần 3 tham số đầu vào
 * userInfo: Nhưng thông tin muốn đính kèm vào token
 * secrectSignature: Chữ kí bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên là privateKey đều được
 * tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, secrectSignature, tokenLife) => {
  try {
    // Hàm sign của thư viện Jwt - Thuật toán mặc định là HS256 nếu không khai báo, cho vào code cho dễ nhìn
    return JWT.sign(userInfo, secrectSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Function kiểm tra một token có hợp lệ hay không
 * Hợp lệ ở đây đều hiểu đơn giản là cái token được tạo ra có đúng với cái chữ kí bí mật của dự án hay không
 */
const verifyToken = async (token, secrectSignature) => {
  try {
    // Hàm verify của thư viện Jwt
    return JWT.verify(token, secrectSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}