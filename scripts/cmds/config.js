const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "config",
    version: "1.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 2,
    shortDescription: "Bot account configuration and management",
    longDescription: "Bot account configuration and management (Admin Only)",
    category: "OPERATOR",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    const LOCKED_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      const lockMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⛔ 𝗙𝗜𝗟𝗘 𝗟𝗢𝗖𝗞𝗘𝗗
» ❌ সিয়াম ভাই এর নাম 
» 🤦 পরিবর্তন করা হয়েছে!
» ⚠️ এই কমান্ডটি নষ্ট করা হলো।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(lockMsg, threadID, messageID);
    }

    const { config } = global.GoatBot;
    const adminList = config.adminBot || [];
    const operatorList = config.operatorBot || [];
    const isAllowed = adminList.includes(senderID) || operatorList.includes(senderID);

    if (!isAllowed) {
      const noPermMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🛑 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗
» 🙅‍♂️ এই কমান্ডটি শুধু
» 👑 বট এডমিন ব্যবহার
» 🔐 করতে পারবে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return api.sendMessage(noPermMsg, threadID, messageID);
    }

    const menuMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚙️ 𝗕𝗢𝗧 𝗖𝗢𝗡𝗙𝗜𝗚 𝗠𝗘𝗡𝗨
───────────────
» 01. 📝 𝗘𝗱𝗶𝘁 𝗕𝗶𝗼
» 02. 🏷️ 𝗘𝗱𝗶𝘁 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲
» 03. 📩 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀
» 04. 👁️ 𝗨𝗻𝗿𝗲𝗮𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀
» 05. 🚫 𝗦𝗽𝗮𝗺 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀
» 06. 🖼️ 𝗖𝗵𝗮𝗻𝗴𝗲 𝗔𝘃𝗮𝘁𝗮𝗿
» 07. 🛡️ 𝗔𝘃𝗮𝘁𝗮𝗿 𝗦𝗵𝗶𝗲𝗹𝗱
» 08. 🔕 𝗕𝗹𝗼𝗰𝗸 𝗨𝘀𝗲𝗿
» 09. 🔔 𝗨𝗻𝗯𝗹𝗼𝗰𝗸 𝗨𝘀𝗲𝗿
» 10. 📌 𝗖𝗿𝗲𝗮𝘁𝗲 𝗣𝗼𝘀𝘁
» 11. 🗑️ 𝗗𝗲𝗹𝗲𝘁𝗲 𝗣𝗼𝘀𝘁
» 12. 💬 𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗣𝗼𝘀𝘁 (𝗨𝘀𝗲𝗿)
» 13. 👨‍👩‍👧‍👦 𝗖𝗼𝗺𝗺𝗲𝗻𝘁 𝗣𝗼𝘀𝘁 (𝗚𝗿𝗼𝘂𝗽)
» 14. 💖 𝗗𝗿𝗼𝗽 𝗙𝗲𝗲𝗹𝗶𝗻𝗴𝘀
» 15. 👥 𝗔𝗱𝗱 𝗙𝗿𝗶𝗲𝗻𝗱
» 16. ✅ 𝗔𝗰𝗰𝗲𝗽𝘁 𝗙𝗿𝗶𝗲𝗻𝗱 𝗥𝗲𝗾𝘂𝗲𝘀𝘁
» 17. ❌ 𝗗𝗲𝗰𝗹𝗶𝗻𝗲 𝗙𝗿𝗶𝗲𝗻𝗱 𝗥𝗲𝗾𝘂𝗲𝘀𝘁
» 18. 🚶 𝗨𝗻𝗳𝗿𝗶𝗲𝗻𝗱 𝗨𝗜𝗗
» 19. 📤 𝗦𝗲𝗻𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝘃𝗶𝗮 𝗨𝗜𝗗
» 20. 💻 𝗡𝗼𝘁𝗲 𝗖𝗼𝗱𝗲
» 21. 🚪 𝗟𝗼𝗴𝗼𝘂𝘁 𝗔𝗰𝗰𝗼𝘂𝗻𝘁
───────────────
» 💡 যে অপশনটি চান সেটির 
» 🔢 নম্বর দিয়ে 𝗥𝗲𝗽𝗹𝘆 করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return api.sendMessage(menuMsg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "menu"
      });
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;
    const { type, author } = Reply;
    const botID = api.getCurrentUserID();

    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") return;

    if (senderID !== author) {
      const wrongUserMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ আপনি এই মেনুটি 
» 🚫 সিলেক্ট করতে পারবেন না!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return api.sendMessage(wrongUserMsg, threadID, messageID);
    }

    if (type === 'menu') {
      const choice = body.trim();

      if (['1', '01'].includes(choice)) {
        const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📝 𝗕𝗜𝗢 𝗘𝗗𝗜𝗧𝗢𝗥
» ✍️ 𝗕𝗶𝗼 পরিবর্তন করতে টেক্সট লিখুন
» 🗑️ অথবা ডিলিট করতে '𝗱𝗲𝗹𝗲𝘁𝗲' লিখুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(msg, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeBio"
          });
        }, messageID);
      }

      else if (['2', '02'].includes(choice)) {
        const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🏷️ 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 𝗘𝗗𝗜𝗧𝗢𝗥
» ✍️ নতুন 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲 প্রদান করুন
» 🗑️ অথবা ডিলিট করতে '𝗱𝗲𝗹𝗲𝘁𝗲' লিখুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(msg, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeNickname"
          });
        }, messageID);
      }

      else if (['3', '03'].includes(choice)) {
        const pending = await api.getThreadList(50, null, ["PENDING"]);
        let txt = pending.map(t => `📌 𝗡𝗮𝗺𝗲: ${t.name}\n🆔 𝗜𝗗: ${t.threadID}\n💬 𝗠𝘀𝗴: ${t.snippet}`).join("\n\n") || "কোনো পেন্ডিং মেসেজ নেই।";
        
        const pendingMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📩 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 𝗟𝗜𝗦𝗧:
───────────────
${txt}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(pendingMsg, threadID, messageID);
      }

      else if (['6', '06'].includes(choice)) {
        const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🖼️ 𝗔𝗩𝗔𝗧𝗔𝗥 𝗖𝗛𝗔𝗡𝗚𝗘𝗥
» 📸 ছবির লিংক অথবা ছবি পাঠিয়েন 
» 🔁 এই মেসেজে 𝗥𝗲𝗽𝗹𝘆 করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(msg, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "changeAvatar"
          });
        }, messageID);
      }

      else if (['10'].includes(choice)) {
        const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📌 𝗖𝗥𝗘𝗔𝗧𝗘 𝗣𝗢𝗦𝗧
» ✍️ পোস্টের জন্য বিষয়বস্তু 
» ☹️ বা টেক্সট লিখে..
» 🔁 এই মেসেজে 𝗥𝗲𝗽𝗹𝘆 দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(msg, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "createPost"
          });
        }, messageID);
      }

      else if (['21'].includes(choice)) {
        const logoutMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚪 𝗟𝗢𝗚𝗚𝗜𝗡𝗚 𝗢𝗨𝗧
» ⚠️ বট অ্যাকাউন্টটি সফলভাবে 
» 🔐 লগআউট করা হচ্ছে...
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(logoutMsg, threadID, () => api.logout());
      }
    }

    else if (type === 'changeBio') {
      const bio = body.toLowerCase() === 'delete' ? '' : body;
      api.changeBio(bio, false, (err) => {
        if (err) {
          const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗕𝗜𝗢 𝗨𝗣𝗗𝗔𝗧𝗘 𝗙𝗔𝗜𝗟𝗘𝗗
» ☠️ 𝗕𝗶𝗼 পরিবর্তন করতে 
» 🚯 সমস্যা হয়েছে..!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return api.sendMessage(failMsg, threadID, messageID);
        }

        const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝗕𝗜𝗢 𝗨𝗣𝗗𝗔𝗧𝗘𝗗
» 📝 𝗕𝗶𝗼 সফলভাবে ${!bio ? "মুছে ফেলা হয়েছে" : "আপডেট করা হয়েছে!"}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(successMsg, threadID, messageID);
      });
    }

    else if (type === 'createPost') {
      const session_id = typeof getGUID === "function" ? getGUID() : Math.random().toString(36).substring(2);
      const form = {
        av: botID,
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4612917415497545",
        variables: JSON.stringify({
          input: {
            composer_entry_point: "inline_composer",
            composer_source_surface: "timeline",
            idempotence_token: session_id + "_FEED",
            source: "WWW",
            attachments: [],
            audience: { privacy: { base_state: "EVERYONE" } },
            message: { text: body },
            actor_id: botID,
            client_mutation_id: "1"
          }
        })
      };

      api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
        if (e) {
          const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗣𝗢𝗦𝗧 𝗙𝗔𝗜𝗟𝗘𝗗
» ☠️ পোস্ট তৈরি করতে 
» 🚳 সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return api.sendMessage(failMsg, threadID, messageID);
        }

        try {
          const data = JSON.parse(i);
          const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝗣𝗢𝗦𝗧 𝗖𝗥𝗘𝗔𝗧𝗘𝗗
» 🎀 পোস্ট সফলভাবে 
» 🫠 তৈরি হয়েছে!
» 🔗 𝗟𝗶𝗻𝗸: ${data.data.story_create.story.url}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return api.sendMessage(successMsg, threadID, messageID);
        } catch (err) {
          const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗘𝗥𝗥𝗢𝗥
» ☠️ পোস্টের ডেটা পার্স 
» 🤧 করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return api.sendMessage(failMsg, threadID, messageID);
        }
      });
    }

    else if (type === 'changeAvatar') {
      let url = (event.attachments && event.attachments[0] && event.attachments[0].url) || body;
      
      if (!url) {
        const noImgMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗜𝗡𝗣𝗨𝗧
» 📸 অনুগ্রহ করে একটি 
» 🚯 ছবি বা ছবির লিংক দিন!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(noImgMsg, threadID, messageID);
      }

      try {
        const stream = (await axios.get(url, { responseType: "stream" })).data;
        api.changeAvatar(stream, "", (err) => {
          if (err) {
            const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗔𝗩𝗔𝗧𝗔𝗥 𝗙𝗔𝗜𝗟𝗘𝗗
» ☠️ 𝗔𝘃𝗮𝘁𝗮𝗿 পরিবর্তন 
» 🧭 করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
            return api.sendMessage(failMsg, threadID, messageID);
          }

          const successMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎉 𝗔𝗩𝗔𝗧𝗔𝗥 𝗨𝗣𝗗𝗔𝗧𝗘𝗗
» 🎀 𝗔𝘃𝗮𝘁𝗮𝗿 সফলভাবে 
» 🆙 আপডেট করা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
          return api.sendMessage(successMsg, threadID, messageID);
        });
      } catch (e) {
        const failMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗘𝗥𝗥𝗢𝗥
» ☠️ ছবি ডাউনলোড 
» 🥺 করতে সমস্যা হয়েছে!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return api.sendMessage(failMsg, threadID, messageID);
      }
    }
  }
};
