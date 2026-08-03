const fs = require("fs-extra");

module.exports = {
  config: {
    name: "getfbstate",
    aliases: ["getstate", "getcookie"],
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    description: {
      vi: "Lấy fbstate hiện tại",
      en: "Get current fbstate"
    },
    category: "owner",
    guide: {
      en: "   {pn}: get fbstate (appState)\n"
        + "   {pn} [cookies|cookie|c]: get fbstate with cookies format\n"
        + "   {pn} [string|str|s]: get fbstate with string format\n",
      vi: "   {pn}: get fbstate (appState)\n"
        + "   {pn} [cookies|cookie|c]: get fbstate dạng cookies\n"
        + "   {pn} [string|str|s]: get fbstate dạng string\n"
    }
  },

  langs: {
    vi: {
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 𝐅𝐛𝐬𝐭𝐚𝐭𝐞 পাঠানো হয়েছে!
» 📥 ইনবক্স চেক করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    },
    en: {
      success: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 𝐒𝐞𝐧𝐭 𝐟𝐛𝐬𝐭𝐚𝐭𝐞 𝐭𝐨 𝐲𝐨𝐮!
» 📥 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 
» 🫡 𝐩𝐫𝐢𝐯𝐚𝐭𝐞 𝐦𝐞𝐬𝐬𝐚𝐠𝐞.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    }
  },

  onStart: async function ({ message, api, event, args, getLang }) {
    let fbstate;
    let fileName;

    if (["cookie", "cookies", "c"].includes(args[0])) {
      fbstate = JSON.stringify(api.getAppState().map(e => ({
        name: e.key,
        value: e.value
      })), null, 2);
      fileName = "cookies.json";
    }
    else if (["string", "str", "s"].includes(args[0])) {
      fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
      fileName = "cookiesString.txt";
    }
    else {
      fbstate = JSON.stringify(api.getAppState(), null, 2);
      fileName = "appState.json";
    }

    const pathSave = `${__dirname}/tmp/${fileName}`;
    fs.writeFileSync(pathSave, fbstate);

    if (event.senderID != event.threadID)
      message.reply(getLang("success"));

    const privateMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔑 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐟𝐛𝐬𝐭𝐚𝐭𝐞
» ☠️:${fbstate}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    api.sendMessage({
      body: privateMsg,
      attachment: fs.createReadStream(pathSave)
    }, event.senderID, () => fs.unlinkSync(pathSave));
  }
};
