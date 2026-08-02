const axios = require("axios");
const fs = require('fs');
const path = require('path');
const GoatStor = "https://goatstore.vercel.app";

module.exports = {
  config: {
    name: "goatstore",
    aliases: ["gs", "market", "cmdstore"],
    version: "0.0.1",
    role: 2,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    shortDescription: {
      en: "📌 Goatstore - Your Command Marketplace"
    },
    longDescription: {
      en: "📌 Browse, search, upload, and manage your commands in the GoatStore marketplace with easy sharing cmds."
    },
    category: "𝗠𝗮𝗿𝗸𝗲𝘁",
    cooldowns: 0,
  },

  onStart: async ({ api, event, args, message }) => {
    const sendBeautifulMessage = (content) => {
      const formatted = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
${content}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(formatted);
    };

    try {
      if (!args[0]) {
        return sendBeautifulMessage(
          `» 📦 𝐬𝐡𝐨𝐰 𝐈𝐃 : কমান্ড কোড দেখুন\n` +
          `» 📄 𝐩𝐚𝐠𝐞 𝐧𝐮𝐦𝐛𝐞𝐫 : কমান্ড লিস্ট ব্রাউজ করুন\n` +
          `» 🔍 𝐬𝐞𝐚𝐫𝐜𝐡 𝐪𝐮𝐞𝐫𝐲 : কমান্ড সার্চ করুন\n` +
          `» 🔥 𝐭𝐫𝐞𝐧𝐝𝐢𝐧𝐠 : ট্রেন্ডিং কমান্ড দেখুন\n` +
          `» 📊 𝐬𝐭𝐚𝐭𝐮𝐬 : মার্কেটপ্লেস স্ট্যাটিস্টিকস\n` +
          `» 💝 𝐥𝐢𝐤𝐞 𝐈𝐃 : কমান্ডে লাইক দিন\n` +
          `» ⬆️ 𝐮𝐩𝐥𝐨𝐚𝐝 𝐧𝐚𝐦𝐞 : কমান্ড আপলোড করুন`
        );
      }

      const command = args[0].toLowerCase();

      switch (command) {
        case "show": {
          const itemID = parseInt(args[1]);
          if (isNaN(itemID)) return sendBeautifulMessage("» ⚠️ একটি সঠিক item ID প্রদান করুন।");
          const response = await axios.get(`${GoatStor}/api/item/${itemID}`);
          const item = response.data;
          
          const bangladeshTime = new Date(item.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

          return sendBeautifulMessage(
            `» 👑 𝐍𝐚𝐦𝐞: ${item.itemName}\n` +
            `» 🆔 𝐈𝐃: ${item.itemID}\n` +
            `» ⚙️ 𝐓𝐲𝐩𝐞: ${item.type || 'Unknown'}\n` +
            `» 📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${item.description}\n` +
            `» 👨‍💻 𝐀𝐮𝐭𝐡𝐨𝐫: ${item.authorName}\n` +
            `» 📅 𝐀𝐝𝐝𝐞𝐝: ${bangladeshTime}\n` +
            `» 👀 𝐕𝐢𝐞𝐰𝐬: ${item.views}\n` +
            `» 💝 𝐋𝐢𝐤𝐞𝐬: ${item.likes}\n` +
            `» 🔗 𝐑𝐚𝐰 𝐋𝐢𝐧𝐤: ${GoatStor}/raw/${item.rawID}`
          );
        }

        case "page": {
          const page = parseInt(args[1]) || 1;
          const { data: { items, total } } = await axios.get(`${GoatStor}/api/items?page=${page}&limit=5`);
          const totalPages = Math.ceil(total / 5);
          if (page <= 0 || page > totalPages) {
            return sendBeautifulMessage("» ⚠️ ভুল পেজ নম্বর দেওয়া হয়েছে।");
          }
          const itemsList = items.map((item, index) =>
            `» ${index + 1}. 📦 ${item.itemName}\n` +
            `» 🆔 𝐈𝐃: ${item.itemID}\n` +
            `» ⚙️ 𝐓𝐲𝐩𝐞: ${item.type}\n` +
            `» 📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${item.description}\n` +
            `» 👀 𝐕𝐢𝐞𝐰𝐬: ${item.views}\n` +
            `» 💝 𝐋𝐢𝐤𝐞𝐬: ${item.likes}\n` +
            `» 👨‍💻 𝐀𝐮𝐭𝐡𝐨𝐫: ${item.authorName}`
          ).join("\n───────────────\n");
          return sendBeautifulMessage(`» 📄 𝐏𝐚𝐠𝐞 ${page}/${totalPages}\n───────────────\n${itemsList}`);
        }

        case "search": {
          const query = args.slice(1).join(" ");
          if (!query) return sendBeautifulMessage("» ⚠️ একটি সার্চ কিউয়ারি প্রদান করুন।");
          const { data } = await axios.get(`${GoatStor}/api/items?search=${encodeURIComponent(query)}`);
          const results = data.items;
          if (!results.length) return sendBeautifulMessage("» ❌ কোনো ম্যাচিং রেজাল্ট পাওয়া যায়নি।");
          const searchList = results.slice(0, 5).map((item, index) =>
            `» ${index + 1}. 📦 ${item.itemName}\n` +
            `» 🆔 𝐈𝐃: ${item.itemID}\n` +
            `» ⚙️ 𝐓𝐲𝐩𝐞: ${item.type}\n` +
            `» 👀 𝐕𝐢𝐞𝐰𝐬: ${item.views}\n` +
            `» 💝 𝐋𝐢𝐤𝐞𝐬: ${item.likes}\n` +
            `» 👨‍💻 𝐀𝐮𝐭𝐡𝐨𝐫: ${item.authorName}`
          ).join("\n───────────────\n");
          return sendBeautifulMessage(`» 📝 𝐐𝐮𝐞𝐫𝐲: "${query}"\n───────────────\n${searchList}`);
        }

        case "trending": {
          const { data } = await axios.get(`${GoatStor}/api/trending`);
          const trendingList = data.slice(0, 5).map((item, index) =>
            `» ${index + 1}. 🔥 ${item.itemName}\n` +
            `» 💝 𝐋𝐢𝐤𝐞𝐬: ${item.likes}\n` +
            `» 👀 𝐕𝐢𝐞𝐰𝐬: ${item.views}`
          ).join("\n───────────────\n");
          return sendBeautifulMessage(trendingList);
        }

        case "status": {
          const { data: stats } = await axios.get(`${GoatStor}/api/stats`);
          const { hosting, totalCommands, totalLikes, dailyActiveUsers, popularTags, topAuthors, topViewed } = stats;
          const uptimeStr = `${hosting?.uptime?.years}y ${hosting?.uptime?.months}m ${hosting?.uptime?.days}d ${hosting?.uptime?.hours}h ${hosting?.uptime?.minutes}m ${hosting?.uptime?.seconds}s`;
          
          const authorList = topAuthors.map((a, i) =>
            `» ${i + 1}. ${a._id || 'Unknown'} (${a.count})`
          ).join('\n');
          const viewedList = topViewed.map((v, i) =>
            `» ${i + 1}. ${v.itemName} (𝐈𝐃: ${v.itemID}) - 𝐕𝐢𝐞𝐰𝐬: ${v.views}`
          ).join('\n');

          return sendBeautifulMessage(
            `» 📦 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${totalCommands}\n` +
            `» 💝 𝐓𝐨𝐭𝐚𝐥 𝐋𝐢𝐤𝐞𝐬: ${totalLikes}\n` +
            `» 👥 𝐃𝐚𝐢𝐥𝐲 𝐔𝐬𝐞𝐫𝐬: ${dailyActiveUsers}\n` +
            `» ⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeStr}\n` +
            `───────────────\n` +
            `» 🌟 𝐓𝐨𝐩 𝐀𝐮𝐭𝐡𝐨𝐫𝐬:\n${authorList}\n` +
            `───────────────\n` +
            `» 🔥 𝐌𝐨𝐬𝐭 𝐕𝐢𝐞𝐰𝐞𝐝:\n${viewedList}\n` +
            `───────────────\n` +
            `» 💻 𝐒𝐲𝐬𝐭𝐞𝐦: ${hosting.system.platform} (${hosting.system.arch})\n` +
            `» 📌 𝐍𝐨𝐝𝐞: ${hosting.system.nodeVersion}\n` +
            `» 🖥️ 𝐂𝐏𝐔 𝐂𝐨𝐫𝐞𝐬: ${hosting.system.cpuCores}`
          );
        }

        case "like": {
          const likeItemId = parseInt(args[1]);
          if (isNaN(likeItemId)) return sendBeautifulMessage("» ⚠️ একটি সঠিক item 𝐈𝐃 প্রদান করুন।");
          const { data } = await axios.post(`${GoatStor}/api/items/${likeItemId}/like`);
          if (data.success) {
            return sendBeautifulMessage(
              `» ✨ 𝐒𝐭𝐚𝐭𝐮𝐬: Successfully liked!\n` +
              `» 💝 𝐓𝐨𝐭𝐚𝐥 𝐋𝐢𝐤𝐞𝐬: ${data.likes}`
            );
          } else {
            return sendBeautifulMessage("» ⚠️ লাইক করতে ব্যর্থ হয়েছে।");
          }
        }

        case "upload": {
          const commandName = args[1];
          if (!commandName) return sendBeautifulMessage("» ⚠️ একটি কমান্ডের নাম দিন।");
          const commandPath = path.join(process.cwd(), 'scripts', 'cmds', `${commandName}.js`);
          if (!fs.existsSync(commandPath)) return sendBeautifulMessage(`» ❌ '${commandName}.js' ফাইলটি পাওয়া যায়নি।`);
          try {
            const code = fs.readFileSync(commandPath, 'utf8');
            let commandFile;
            try {
              commandFile = require(commandPath);
            } catch (err) {
              return sendBeautifulMessage("» ⚠️ অকার্যকর কমান্ড ফাইল।");
            }
            const uploadData = {
              itemName: commandFile.config?.name || commandName,
              description: commandFile.config?.longDescription?.en || commandFile.config?.shortDescription?.en || "No description",
              type: "GoatBot",
              code,
              authorName: commandFile.config?.author || event.senderID || "Unknown"
            };
            const response = await axios.post(`${GoatStor}/v1/paste`, uploadData);
            if (response.data.success) {
              const { itemID, link } = response.data;
              return sendBeautifulMessage(
                `» ✅ 𝐒𝐭𝐚𝐭𝐮𝐬: Command uploaded successfully\n` +
                `» 👑 𝐍𝐚𝐦𝐞: ${uploadData.itemName}\n` +
                `» 🆔 𝐈𝐃: ${itemID}\n` +
                `» 👨‍💻 𝐀𝐮𝐭𝐡𝐨𝐫: ${uploadData.authorName}\n` +
                `» 🔗 𝐑𝐚𝐰 𝐋𝐢𝐧𝐤: ${link}`
              );
            }
            return sendBeautifulMessage("» ⚠️ আপলোড করতে ব্যর্থ হয়েছে।");
          } catch (error) {
            console.error("Upload error:", error);
            return sendBeautifulMessage("» ⚠️ আপলোড করার সময় একটিunexpected সমস্যা হয়েছে।");
          }
        }

        default:
          return sendBeautifulMessage("» ⚠️ ভুল সাব-কমান্ড দেওয়া হয়েছে।");
      }
    } catch (err) {
      console.error("GoatStore Error:", err);
      return sendBeautifulMessage("» ⚠️ একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।");
    }
  }
};
