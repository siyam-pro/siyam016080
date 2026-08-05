const fs = require("fs");
const path = require("path");

// ১. tmp ফোল্ডারের সঠিক পথ (Path) নির্ণয়
const tmpFolderPath = path.join(__dirname, "tmp");

// ২. GoatBot-এর গ্লোবাল মেমোরিতে কমান্ড লোড করার ফাংশন
function loadTmpFolderCommands() {
  try {
    if (!fs.existsSync(tmpFolderPath)) {
      console.log("❌ tmp ফোল্ডার পাওয়া যায়নি!");
      return;
    }

    const files = fs.readdirSync(tmpFolderPath).filter(file => file.endsWith(".js"));

    files.forEach(file => {
      const filePath = path.join(tmpFolderPath, file);

      try {
        delete require.cache[require.resolve(filePath)];

        const command = require(filePath);

        // কমান্ড স্ট্রাকচার চেক
        if (!command || !command.config || !command.config.name) {
          console.log(`⚠️ Invalid command file: ${file}`);
          return;
        }

        const cmdName = command.config.name;

        // GoatBot এর মূল গ্লোবাল ম্যাপে কমান্ড যোগ করা
        global.GoatBot.commands.set(cmdName, command);

        // কমান্ডের এলিয়াস (Aliases) থাকলে যুক্ত করা
        if (command.config.aliases && Array.isArray(command.config.aliases)) {
          for (const alias of command.config.aliases) {
            global.GoatBot.aliases.set(alias, cmdName);
          }
        }

        // eventCommands / onChat / onEvent থাকলে সেগুলো সেভ করা
        if (command.config.category === "events" || command.onEvent) {
          global.GoatBot.eventCommands.set(cmdName, command);
        }

        console.log(`✅ [TMP LOADER] Loaded: ${cmdName}`);
      } catch (err) {
        console.log(`❌ Error loading ${file}:`, err.message);
      }
    });

  } catch (error) {
    console.log("❌ Folder read error:", error.message);
  }
}

// বট চালুর সাথে সাথে স্বয়ংক্রিয়ভাবে একবার রান হবে
loadTmpFolderCommands();

module.exports = {
  config: {
    name: "tmploader",
    version: "1.0.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    category: "system"
  },

  // ইউজার যদি মেসেঞ্জারে ম্যানুয়ালি /tmploader কমান্ড দেয় তবে আবার নতুন করে রি-লোড হবে
  onStart: async function ({ message }) {
    loadTmpFolderCommands();
    return message.reply("✅ `tmp` ফোল্ডারের সমস্ত কমান্ড আবার রি-লোড করা হয়েছে!");
  }
};
