import fs from 'fs';
import 'dotenv/config';

// Берём токен из .env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

// Проверка токена при старте
if (!TELEGRAM_TOKEN) {
    console.log("TELEGRAM_TOKEN is not defined in .env");
    process.exit(1);
}

let lastProcessedUpdateId = 0;

async function checkTelegramMessages() {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastProcessedUpdateId}`;

        const response = await fetch(url);

        const data = await response.json();


        // если Telegram вернул ошибку
        if (!data.ok) {
            console.log("Telegram API error:", data);
            return;
        }

        const updates = data.result;

        // защита от "not iterable"
        if (!Array.isArray(updates)) {
            console.log("updates is not array:", updates);
            return;
        }

        // если обновлений нет
        if (updates.length === 0) {
            return;
        }

        for (const update of updates) {

            lastProcessedUpdateId = update.update_id + 1;

            const messageText = update.message?.text;

            console.log("Message:", messageText);

            if (messageText === '/stop') {
                fs.writeFileSync('status.txt', 'disabled');
                console.log('Bot disabled via Telegram');
            }

            if (messageText === '/start') {
                fs.writeFileSync('status.txt', 'enabled');
                console.log('Bot enabled via Telegram');
            }
        }

    } catch (error) {
        console.log(`Listener error: ${error.message}`);
    }
}

// Запуск каждые 5 секунд
setInterval(checkTelegramMessages, 5000);