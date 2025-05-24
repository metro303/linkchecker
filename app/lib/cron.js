import cron from 'node-cron';

export function startCron(origin = '') {
  // Prevent multiple cron jobs from being registered
  if (global.__CRON_RUNNING__) return;
  global.__CRON_RUNNING__ = true;

  if (!origin) {
    console.warn('[CRON] No origin provided. Skipping scheduler.');
    return;
  }

  const url = `${origin}/api/check?url=https://t.ly/pang555`;

  console.log(`[CRON] Scheduled ping every 60s: ${url}`);

  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('[CRON] Executing ping...');
      const res = await fetch(url);
      const json = await res.json();
      console.log('[CRON] Response:', json);
    } catch (err) {
      console.error('[CRON] Ping failed:', err.message);
    }
  });
}
