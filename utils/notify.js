// Mock email/SMS notifications
function sendNotification({ to, type='email', subject, message }) {
  // For mock: just console log. In real app integrate nodemailer / Twilio.
  console.log(`[Notification] to:${to} type:${type} subject:${subject}\n${message}`);
}

module.exports = { sendNotification };
