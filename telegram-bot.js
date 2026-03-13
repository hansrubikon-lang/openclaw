import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("Missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("Telegram bot started");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const response = await fetch("http://localhost:10000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    await bot.sendMessage(chatId, data.reply || "No response");
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "⚠️ OpenClaw error");
  }
});
