/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

// Lưu ý Brevo là tên thương hiệu mới của sib - Sendinblue
// Vì thế trong phần hướng dẫn trên github có thể nó vẫn còn giữ tên biến SibApiV3Sdk
// https://github.com/getbrevo/brevo-node
// cách cũ
// const SibApiV3Sdk = require('@getbrevo/brevo')
// cách mới
const Brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'

/**
 * Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy dự án ở Brevo Dashboard > Account > SMTP & API > API Keys
 * http://brevo.com
 * Với Nodejs thì tốt nhất cứ lên github repo là nhanh nhất:
 *  https://github.com/getbrevo/brevo-node
*/
// Cách cũ
// let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
// let apiKey = apiInstance.authentications['api-key']
// apiKey.apiKey = env.BREVO_API_KEY
// Cách mới
let apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  env.BREVO_API_KEY
)


const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Khởi tạo một cái sendSmtpEmail với những thông tin cần thiết
  // cách cũ
  // let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  // cách mới
  let sendSmtpEmail = new Brevo.SendSmtpEmail()

  // Tài khoản gửi mail: lưu ý địa chỉ admin email phải là cái email mà đã tạo tài khoản trên Brevo
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Những tài khoản nhận email
  // 'to' phải là một Array để sau có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề của email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = customHtmlContent

  // Gọi hành động gửi mail
  // sendTransacEmail của thư viện sẽ trả về một Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}