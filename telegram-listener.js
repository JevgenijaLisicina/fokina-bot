import fs from 'fs';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

let lastProcessedUpdateId = 0;

async function checkTelegramMessages() {
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastProcessedUpdateId}`
        );

        const data = await response.json();

        const updates = data.result;

        for (const update of updates) {

            lastProcessedUpdateId = update.update_id + 1;

            const messageText = update.message?.text;

            if (messageText === '/stop') {
                fs.writeFileSync('status.txt', 'disabled');
                console.log('⛔ Bot disabled via Telegram');
            }

            if (messageText === '/start') {
                fs.writeFileSync('status.txt', 'enabled');
                console.log('✅ Bot enabled via Telegram');
            }
        }

    } catch (error) {
        console.log(`❌ Listener error: ${error.message}`);
    }
}

setInterval(checkTelegramMessages, 5000);