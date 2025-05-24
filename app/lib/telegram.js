import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send alert to Telegram
 * @param {string} message - The text message to send
 */
export async function sendTelegramAlert(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram credentials are missing. Check your .env setup.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: `🚨 *KHAB555 Alert*\n${message}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
    console.log('✅ Telegram alert sent.');
  } catch (error) {
    console.error('❌ Failed to send Telegram alert:', error.response?.data || error.message);
  }
}
