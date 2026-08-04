if (!global.siyamTextCooldown) {
    global.siyamTextCooldown = {};
}

module.exports = {
    config: {
        name: "copy2",
        version: "7.0.0",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        role: 0,
        countDown: 5,
        category: "UTILITY",
        shortDescription: "Multiplies text safely with smart per-text cooldown",
        longDescription: "এডমিনের জন্য আনলিমিটেড এবং সাধারণ ইউজারের জন্য একই টেক্সটে ৩ মিনিটের কুলডাউন সিস্টেম।",
        guide: "copy [text/emoji] [count]\nExample: copy 🔪 5000"
    },

    onStart: async function ({ api, event, args }) {
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

        try {
            if (args.length < 2) {
                const usageMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ ব্যবহার পদ্ধতি:
» 📝 copy [টেক্সট/ইমোজি]
» ☠️  [সংখ্যা]
───────────────
» 💡 উদাহরণ:
» 🙄 copy আমার বস সিয়াম 
» 🎰 70
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                return api.sendMessage(usageMsg, threadID, messageID);
            }

            const countStr = args[args.length - 1];
            const count = parseInt(countStr);

            if (isNaN(count) || count <= 0) {
                const invalidCountMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ভুল সংখ্যা!
» 🔢 একটি সঠিক সংখ্যা দিন
» ✅ (যেমন: 1 থেকে 10,000)।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                return api.sendMessage(invalidCountMsg, threadID, messageID);
            }

            if (count > 10000) {
                const maxCountMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ গরিবের দল😖
» ❌ একসাথে সর্বোচ্চ 10k
» 📉 বার কপি করা যাবে।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                return api.sendMessage(maxCountMsg, threadID, messageID);
            }

            args.pop();
            const targetText = args.join(" ");

            if (!targetText) {
                const noTextMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কোনো টেক্সট বা 
» ⚔️ ইমোজি দিন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                return api.sendMessage(noTextMsg, threadID, messageID);
            }

            const botAdmins = global.GoatBot?.config?.adminBot || global.config?.ADMINBOT || [];
            const isBotAdmin = botAdmins.includes(senderID);

            if (!isBotAdmin && targetText.length > 70) {
                const limitMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝗟𝗜𝗠𝗜𝗧 𝗪𝗔𝗥𝗡𝗜𝗡𝗚!
» ❌ তুই গরিব সর্বোচ্চ 𝟳𝟬
» 😏 ব্যবহার করতে পারবি।
» 📝 আপনার বর্তমান অক্ষর
» 🖥️  সংখ্যা: 
» 🎰 ${targetText.length}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                return api.sendMessage(limitMsg, threadID, messageID);
            }

            if (!isBotAdmin) {
                const currentTime = Date.now();
                const cooldownTime = 3 * 60 * 1000; 
                
                const cooldownKey = `${senderID}_${Buffer.from(targetText).toString("hex").slice(0, 30)}`;

                if (global.siyamTextCooldown[cooldownKey] && (currentTime - global.siyamTextCooldown[cooldownKey] < cooldownTime)) {
                    const remainingTime = Math.ceil((cooldownTime - (currentTime - global.siyamTextCooldown[cooldownKey])) / 1000);
                    const cooldownMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🚫 𝗗𝘂𝗽𝗹𝗶𝗰𝗮𝘁𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲
» ⏳ 𝗧𝗿𝘆 𝗔𝗴𝗮𝗶𝗻 𝗜𝗻 
» 📉 ${remainingTime}
» 😊 সেকেন্ড।
» 💎 অন্য কোনো টেক্সট ব্যবহার
» ✅ করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
                    return api.sendMessage(cooldownMsg, threadID, messageID);
                }

                global.siyamTextCooldown[cooldownKey] = currentTime;
            }

            let repeatedResult = Array(count).fill(targetText).join(" ");
            
            const MAX_LENGTH = 1900; 
            let messageChunks = [];

            while (repeatedResult.length > 0) {
                if (repeatedResult.length > MAX_LENGTH) {
                    let chunk = repeatedResult.substring(0, MAX_LENGTH);
                    messageChunks.push(chunk);
                    repeatedResult = repeatedResult.substring(MAX_LENGTH);
                } else {
                    messageChunks.push(repeatedResult);
                    repeatedResult = "";
                }
            }

            for (let i = 0; i < messageChunks.length; i++) {
                await api.sendMessage(messageChunks[i], threadID);
                if (messageChunks.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); 
                }
            }

        } catch (err) {
            console.error("Copy Command Error:", err);
            const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ অভ্যন্তরীণ সমস্যা!
» 💥 ফাইল ক্রাশ এড়ানো
» 🎀  হয়েছে: ${err.message}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
            api.sendMessage(errorMsg, threadID, messageID);
        }
    }
};
