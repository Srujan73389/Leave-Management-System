const sendEmail = async (to, subject, text) => {
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
  // implement actual email sending logic later
};

module.exports = { sendEmail };