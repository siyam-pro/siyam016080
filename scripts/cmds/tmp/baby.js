const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

const typing = async (api, threadID, ms = 3000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

const getCustomResponse = (text) => {
  const cleanText = text.toLowerCase().trim();

  if (cleanText === "সিয়াম কে" || cleanText === "siyam ke") {
    return `╭─╼👑 𝐁𝐨𝐬𝐬 𝐈𝐧𝐟𝐨 👑\n├ আমার বস 💋\n╰─╼👑`;
  }

  if (
    cleanText.includes("বট ওনার") || 
    cleanText.includes("বট কার") || 
    cleanText.includes("bot owner") || 
    cleanText.includes("bot kar")
  ) {
    return `╭─╼🤖 𝐁𝐨𝐭 𝐈𝐧𝐟𝐨 🤖\n├ আমি বস‌➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 \n├ ─꯭─⃝‌‌🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧─⃝‌‌🧚‍♀️\n╰─╼👑`;
  }

  if (
    cleanText.includes("গ্রুপ কার") || 
    cleanText.includes("এটা কার গ্রুপ") || 
    cleanText.includes("group kar") || 
    cleanText.includes("eta kar group")
  ) {
    return `╭─╼🛡️ 𝐆𝐫𝐨𝐮𝐩 𝐈𝐧𝐟𝐨 🛡️\n├ 𝐇𝐄 𝐈𝐒 𝐎𝐍𝐋𝐘 𝐁𝐎𝐒𝐒👑এর 𝐆𝐑𝐎𝐔𝐏\n╰─╼🍁`;
  }

  return null;
};

const fetchSimsimi = async (query, senderName) => {
  try {
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });
    return res.data.response;
  } catch {
    return null;
  }
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz"],
    version: "4.5.0",
    author: "rX (fixed by GPT)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Custom Triggers",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + typing + boss safety layer",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim();

    try {
      if (!query) {
        await typing(api, threadID, 2000);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      const customReply = getCustomResponse(query);
      if (customReply) {
        await typing(api, threadID, 1500);
        return message.reply(customReply, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");

        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(
`╭─╼👑 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
╰─╼👑 𝐃𝐞𝐯: rX 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡`
        );
      }

      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");

        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");

        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      if (args[0] === "teach") {
        const parts = query.replace(/^teach\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      await typing(api, threadID, 2000);
      const simResponse = await fetchSimsimi(query, senderName);
      const responses = Array.isArray(simResponse) ? simResponse : [simResponse || "Hmm baby 😚"];
      
      for (const r of responses) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("Baby command error:", err.message);
      message.reply("❌ Error: " + (err.message.includes("404") ? "Feature not available (backend issue)" : err.message));
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      const customReply = getCustomResponse(text);
      if (customReply) {
        await typing(api, event.threadID, 1500);
        return message.reply(customReply, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      await typing(api, event.threadID, 2000);
      const simResponse = await fetchSimsimi(text, senderName);
      const replies = Array.isArray(simResponse) ? simResponse : [simResponse || "Hmm baby 😚"];
      
      for (const r of replies) {
        await message.reply(r, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    if (event.messageReply) {
      try {
        const setting = await axios.get(`${simsim}/setting`, { timeout: 8000 });
        if (setting.data?.autoTeach) {
          const ask = event.messageReply.body?.toLowerCase().trim();
          const ans = raw.trim();
          const senderName = await usersData.getName(event.senderID);
          if (ask && ans && ask !== ans) {
            setTimeout(async () => {
              try {
                await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 10000 });
              } catch {}
            }, 500);
          }
        }
      } catch {}
      return; 
    }

    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot"];
    
      if (triggers.includes(raw)) {
        await typing(api, threadID, 2000);
        const funny = [
          "𝗜 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂 😻🙈Ummmmma😘😘 ৬ তানি করলাম 🐸🤣", "𝘌𝘵𝘰 𝘋𝘢𝘬𝘰 𝘒𝘦นน 𝘚𝘶𝘯𝘴𝘪 𝘛𝘰 🙆‍♀️", "𝘌𝘵𝘰 𝘉𝘰𝘵 𝘉𝘰𝘵 𝘒𝘰𝘳𝘭𝘦 𝘓𝘦𝘢verify 𝘕𝘪𝘮𝘶 🙂",
          "𝘛𝘶𝘮ι 𝘋𝘢𝘬𝘭𝘦ι 𝘊𝘰𝘭𝘦 𝘈𝘴ι 🙆‍♀️", "ওই জান এতোবার ডাকো কেন 🥹", "আমাকে না ডেকে সিয়াম ভাই কে প্রোপোজ কর 🌷🫶",
          "হুম বলো পাখি 🫶🐤 ", "tumare raite bhalobashi 😘", "আমাকে ডাকছো? 🙂"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }


      const customReply = getCustomResponse(raw);
      if (customReply) {
        await typing(api, threadID, 1500);
        return message.reply(customReply, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      
      if (prefix) {
        const cleanQuery = raw.replace(prefix, "").trim();

        if (cleanQuery) {
          const customPrefixReply = getCustomResponse(cleanQuery);
          if (customPrefixReply) {
            await typing(api, threadID, 1500);
            return message.reply(customPrefixReply, (err, info) => {
              if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
            });
          }

          await typing(api, threadID, 2000);
          const simResponse = await fetchSimsimi(cleanQuery, senderName);
          
          if (simResponse) {
            const replies = Array.isArray(simResponse) ? simResponse : [simResponse];
            for (const r of replies) {
              await message.reply(r, (err, info) => {
                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
              });
            }
            return;
          }
        }
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
