const os = require("os");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "chakrun",
    version: "15.0.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "system",
    usePrefix: false
  },

  onStart: async function ({ api, event, message }) {

    const width = 1000;
    const height = 550;

    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `final_${Date.now()}.png`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const wait = await message.reply("⚡ Creating Premium Card...");

    try {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 🌌 Background Gradient
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#0f2027");
      bg.addColorStop(1, "#2c5364");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 🧊 Glass Card
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.strokeStyle = "#00f7ff";
      ctx.lineWidth = 2;
      ctx.fillRect(40, 40, 920, 470);
      ctx.strokeRect(40, 40, 920, 470);

      // 🔥 Title
      const titleGrad = ctx.createLinearGradient(0, 0, 400, 0);
      titleGrad.addColorStop(0, "#00f7ff");
      titleGrad.addColorStop(1, "#00ff99");

      ctx.font = "bold 40px sans-serif";
      ctx.fillStyle = titleGrad;
      ctx.fillText("NIJHUM BOT SYSTEM", 80, 100);

      // 📊 System Info
      const uptime = process.uptime();
      const d = Math.floor(uptime / 86400);
      const h = Math.floor((uptime % 86400) / 3600);
      const m = Math.floor((uptime % 3600) / 60);

      const stats = [
        `🌐 Host: ${os.platform()}`,
        `⚙️ OS: ${os.platform()} (${os.arch()})`,
        `⏳ Uptime: ${d}d ${h}h ${m}m`,
        `🧠 RAM: ${(os.totalmem()/1e9).toFixed(2)} GB`,
        `📡 Ping: ${Date.now() - event.timestamp} ms`,
        `🟢 Node: ${process.version}`
      ];

      let y = 170;
      stats.forEach(line => {
        const grad = ctx.createLinearGradient(0, 0, 300, 0);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#00f7ff");

        ctx.font = "28px sans-serif";
        ctx.fillStyle = grad;
        ctx.fillText(line, 80, y);
        y += 55;
      });

      // 🟢 Footer
      ctx.font = "bold 26px sans-serif";
      ctx.fillStyle = "#00ff99";
      ctx.fillText("POWERED BY SIYAM HASAN", 80, 480);

      // =========================
      // 👤 PROFILE IMAGE (CIRCLE)
      // =========================

      const imgUrl = "https://files.catbox.moe/41hfau.jpg";

      const imgBuffer = (await axios.get(imgUrl, {
        responseType: "arraybuffer"
      })).data;

      const profile = await loadImage(imgBuffer);

      const circleX = 800;
      const circleY = 250;
      const radius = 90;

      // ✂️ Circle Crop
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(profile, circleX - radius, circleY - radius, radius * 2, radius * 2);
      ctx.restore();

      // 🔵 Glow Border
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "#00f7ff";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#00f7ff";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // =========================

      fs.writeFileSync(filePath, canvas.toBuffer());

      api.unsendMessage(wait.messageID);

      await message.reply({
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error creating premium card!");
    }
  }
};
