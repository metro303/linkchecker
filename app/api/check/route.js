import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const EXPECTED_REDIRECT = 'https://t.ly/pang555';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');
  const timestamp = new Date().toISOString();

  if (!target) {
    return Response.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(target, {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const status = res.status;
    const redirectedTo = res.headers.get('location');
    const isRedirect = status >= 300 && status < 400;
    const isOK = status >= 200 && status < 300;

    const result = {
      status: isRedirect ? 'redirect' : String(status),
      code: status,
      target,
      redirectedTo: isRedirect ? redirectedTo : null,
      time: timestamp,
    };

    if (isRedirect && redirectedTo !== EXPECTED_REDIRECT) {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: `⚠️ *Unexpected Redirect*\n🔗 ${target}\n↪️ ${redirectedTo}\n🕒 ${timestamp}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }

    if (!isOK && !isRedirect) {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: `🚨 *Redirect Check Failed*\n🔗 ${target}\n❌ Status: ${status}\n🕒 ${timestamp}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    }

    // Alert on new URL checked regardless of result
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `🆕 *URL Checked*\n🔗 ${target}\n↪️ ${redirectedTo || 'No redirect'}\n🕒 ${timestamp}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });

    return Response.json(result);
  } catch (err) {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `❌ *Error Checking URL*\n🔗 ${target}\n🧠 ${err.message}\n🕒 ${timestamp}`,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });

    return Response.json({
      status: 'error',
      code: 0,
      message: err.message,
      time: timestamp,
    });
  }
}
