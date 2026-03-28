'use strict';

async function sendEventConfirmation(user, event) {
  // Simulated email - in production replace with nodemailer / SES / SendGrid
  await new Promise(resolve => setTimeout(resolve, 0));
  console.log(`[Email] Sent to ${user.email} for event "${event.title}" on ${event.date} at ${event.time}`);
}

module.exports = { sendEventConfirmation };
