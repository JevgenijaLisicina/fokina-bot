# Doctor Appointment Availability Bot

Simple automation bot that checks free (government-paid) available appointment slots on stradini.lv and sends a Telegram message when a slot appears.

## What it does

- Opens the website using Playwright  
- Searches for a specific doctor (can be easily changed in configuration)
- Checks if a free appointment slot is available  
- Sends a Telegram message if a slot is found  

## How it works

The project has two simple parts:

1. Telegram listener  
   - Runs continuously  
   - Receives commands:  
     - /start — start checking  
     - /stop — stop checking  

2. Playwright script  
   - Runs every 5 minutes (via cron)  
   - Checks the website  
   - Sends notification if a slot is available  

## Project Structure

    .
    ├── tests/
    ├── telegram-listener.js
    ├── config.js
    ├── status.txt
    ├── cron.log
    ├── .env
    ├── package.json

## Configuration

Doctor is configured in `config.js`:

    export const config = {
      doctorSearch: "Fokina",
      doctorName: "Natālija Fokina"
    };

## Setup

Clone repository:

    git clone https://github.com/JevgenijaLisicina/fokina-bot.git
    cd fokina-bot

Install dependencies:

    npm install

Install Playwright browsers:

    npx playwright install

Create Telegram Bot

1. Open Telegram and search for **@BotFather**  
2. Send command:  

    /start  

3. Then create a new bot:

    /newbot  

4. Follow instructions and copy your bot token  

5. Get your chat ID (for example, using @userinfobot)

6. Add both values to `.env`:

    TELEGRAM_TOKEN=your_token  
    CHAT_ID=your_chat_id  

## Run

Start Telegram listener:

    node telegram-listener.js

Run Playwright check manually:

    npx playwright test

## Deployment

The bot runs on AWS EC2.

- Telegram listener runs continuously  
- Playwright script runs every 5 minutes using cron  

## Notes

- Bot may send repeated notifications if the same slot is still available  
- Error handling is basic  
- State is stored in a simple text file (`status.txt`)  

## Technologies

- Node.js  
- Playwright  
- Telegram Bot API  
- AWS EC2  
