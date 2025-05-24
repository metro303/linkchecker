import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const EXPECTED_REDIRECT = 'https://t.ly/pang555'; // 🎯 Your expected redirect

const linkCache = new Map(); // 🧠 Simple memory cache

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
    const isRedirect = status >= 300 && status < 400;
    const isOK = status >= 200 && status < 300;
    const redirectedTo = res.headers.get('location') || null;

    const label = isRedirect ? 'redirect' : String(status);
    const cacheKey = target;
    const last = linkCache.get(cacheKey);
    const isNew = !last;

    const response = {
      status: label,
      code: status,
      target,
      redirectedTo,
      time: timestamp,
    };

    const hasChanged =
      isNew || last.status !== label || last.redirectedTo !== redirectedTo;

    if (hasChanged) {
      linkCache.set(cacheKey, { status: label, redirectedTo });

      let text = isNew
        ? `🆕 *New Link Added*\n🔗 ${target}\n📦 Status: ${label}` +
          (redirectedTo ? `\n➡️ Redirects to: ${redirectedTo}` : '') +
          `\n🕒 ${timestamp}`
        : [
            `📡 *Link Status Update*`,
            `🔗 ${target}`,
            `📦 Status: ${label}`,
            redirectedTo ? `➡️ Redirects to: ${redirectedTo}` : '',
            `🕒 ${timestamp}`,
          ]
            .filter(Boolean)
            .join('\n');

      // 🚨 Redirect mismatch warning
      if (isRedirect && redirectedTo && !redirectedTo.includes(EXPECTED_REDIRECT)) {
        text = `🚨 *REDIRECT MISMATCH*` +
               `\n🔗 ${target}` +
               `\n➡️ Went to: ${redirectedTo}` +
               `\n❌ Expected: ${EXPECTED_REDIRECT}` +
               `\n🕒 ${timestamp}`;
      }

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      });
    }

    return Response.json(response);
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
