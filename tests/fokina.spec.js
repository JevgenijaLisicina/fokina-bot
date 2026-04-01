import { test } from '@playwright/test';
import fs from 'fs';
import 'dotenv/config';


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;


async function sendTelegramMessage(text) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            console.log(`Telegram API error: ${data.description}`);
        }

    } catch (error) {
        console.log(`Network error: ${error.message}`);
    }
}

test('check Fokina slots', async ({ page }) => {

    try {
        console.log("=== START CHECK ===");

        // проверка Status


        let botStatus = 'enabled';

        if (fs.existsSync('status.txt')) {
            botStatus = fs.readFileSync('status.txt', 'utf-8');
        }

        if (botStatus.includes('disabled')) {
            console.log('Bot is disabled');
            return;
        }

        await page.goto('https://stradini.lv/lv/pieteikuma-forma');
        console.log("Page opened");

        const acceptBtn = page.getByRole('button', { name: /pieņemt/i });

        if (await acceptBtn.isVisible().catch(() => false)) {
            console.log("Accepting cookies");
            await acceptBtn.click();
        }

        const frame = page.frameLocator('iframe[src*="epieraksts"]');

        console.log("Waiting for iframe...");
        await frame.locator('body').waitFor();

        console.log("Selecting doctor...");
        const specialistBtn = frame.getByRole('button', { name: 'SPECIĀLISTS' });
        await specialistBtn.waitFor();
        await specialistBtn.click();

        await frame.locator('#SpecialistParentSearchList').fill('fokina');
        await frame.getByRole('option', { name: /Natālija Fokina/i }).click();

        console.log("Selecting consultation...");
        const consultationBtn = frame.getByRole('button', { name: 'KLĀTIENES KONSULTĀCIJA' });
        await consultationBtn.waitFor();
        await consultationBtn.click();

        console.log("Applying filter...");
        const stateBtn = frame.getByRole('button', { name: /VALSTS/i });
        await stateBtn.waitFor();
        await stateBtn.click();

        console.log("Checking slots...");

        const subsidizedBlock = frame.locator('#colesestSubsidizedTime');

        const isBlockVisible = await subsidizedBlock
            .waitFor({ timeout: 10000 })
            .then(() => true)
            .catch(() => false);

        if (!isBlockVisible) {
            console.log("Блок не появился");
            return;
        }

        const text = await subsidizedBlock.innerText();

        const hasSlot =
            text.includes('valsts līdzfinansētais') &&
            /\d{4}/.test(text);

        if (hasSlot) {
            console.log('Есть слот!');
            await sendTelegramMessage('Появился слот к Фокиной!');
        } else {
            console.log('Нет слотов');
        }

    } catch (error) {
        console.log(`TEST ERROR: ${error.message}`);
    }

});