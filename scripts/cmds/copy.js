const REAL_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

function checkAuthorLock(config, api, event) {
  if (config.author !== REAL_AUTHOR) {
    api.sendMessage(
      "⛔ You are not authorized to change the author name. Locked by 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍!",
      event.threadID,
      event.messageID
    );
    return false;
  }
  return true;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  config: {
    name: "copy",
    aliases: ["repeat", "spamtext"],
    version: "2.0.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
      en: "Smart repeat text/emoji without numbers and safe delivery"
    },
    guide: {
      en: "{pn} <count> <text> OR {pn} <text> <count>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (!checkAuthorLock(module.exports.config, api, event)) return;

    const { senderID, threadID } = event;

    const adminList = global.GoatBot?.config?.adminBot || global.GoatBot?.config?.ADMINBOT || [];
    const isBotAdmin = Array.isArray(adminList) && adminList.includes(senderID);

    if (args.length < 2) {
      const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ সঠিকভাবে ইনপুট দিন!
» 💡 ব্যবহারের নিয়ম:
» 🤦 copy সংখ্যা মেসেজ
» 📝 উদাহরণ:copy 😎 20
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(invalidMsg);
    }

    let countInput = NaN;
    let textToCopy = "";

    if (!isNaN(parseInt(args[0]))) {
      countInput = parseInt(args[0]);
      textToCopy = args.slice(1).join(" ");
    } else if (!isNaN(parseInt(args[args.length - 1]))) {
      countInput = parseInt(args[args.length - 1]);
      textToCopy = args.slice(0, -1).join(" ");
    } else {
      const invalidMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অবশ্যই একটি সংখ্যা 
» 👑 লিখতে হবে!
» 🎀 যেমন 70
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(invalidMsg);
    }

    if (!isBotAdmin && countInput > 70) {
      const userWarningMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🫡 আগে লেবেলে আয় 
» 😹 সর্বোচ্চ 70 বার কপি 
» 🏟️ করতে পারবেন।
» 📌 আপনার সংখ্যা: ${countInput}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(userWarningMsg);
    }

    if (isBotAdmin && countInput > 10000) {
      const adminWarningMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ বট এডমিনদের জন্য 
» ✅ সর্বোচ্চ লিমিট 10k!
» 📌 আপনার সংখ্যা: ${countInput}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛AltaBOT`;
      return message.reply(adminWarningMsg);
    }

    let fullText = "";
    for (let i = 1; i <= countInput; i++) {
      fullText += `${textToCopy} `;
      if (i % 4 === 0) {
        fullText += "\n";
      }
    }

    const MAX_CHAR_PER_MSG = 2000;
    
    if (fullText.length <= MAX_CHAR_PER_MSG) {
      return message.reply(fullText.trim());
    } else {
      const chunks = [];
      for (let i = 0; i < fullText.length; i += MAX_CHAR_PER_MSG) {
        chunks.push(fullText.substring(i, i + MAX_CHAR_PER_MSG));
      }

      for (let i = 0; i < chunks.length; i++) {
        await api.sendMessage(chunks[i].trim(), threadID);
        if (i < chunks.length - 1) {
          await sleep(2500);
        }
      }
    }
  }
};
