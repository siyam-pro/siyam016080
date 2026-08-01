if (!global.siyamTextCooldown) {
    global.siyamTextCooldown = {};
}

module.exports = {
    config: {
        name: "copy2",
        version: "7.0.0",
        author: "SIYAM HASAN",
        role: 0,
        countDown: 5,
        category: "UTILITY",
        shortDescription: "Multiplies text safely with smart per-text cooldown",
        longDescription: "এডমিনের জন্য আনলিমিটেড এবং সাধারণ ইউজারের জন্য একই টেক্সটে ৩ মিনিটের কুলডাউন সিস্টেম।",
        guide: "copy [text/emoji] [count]\nExample: copy 🔪 5000"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, senderID } = event;

        try {
            if (args.length < 2) {
                return api.sendMessage("⚠️ copy [টেক্সট/ইমোজি] [সংখ্যা]\nউদাহরণ: copy আমার বস সিয়াম 100", threadID, messageID);
            }

            const countStr = args[args.length - 1];
            const count = parseInt(countStr);

            if (isNaN(count) || count <= 0) {
                return api.sendMessage("❌ ভুল সংখ্যা! দয়া করে একটি সঠিক সংখ্যা দিন (যেমন: ১ থেকে ১০,০০০)।", threadID, messageID);
            }

            if (count > 10000) {
                return api.sendMessage("⚠️ গরিবের দল😖 একসাথে সর্বোচ্চ ১০,০০০ বার কপি করা যাবে।", threadID, messageID);
            }

            args.pop();
            const targetText = args.join(" ");

            if (!targetText) {
                return api.sendMessage("❌ দয়া করে কপি করার জন্য কোনো টেক্সট বা ইমোজি দিন।", threadID, messageID);
            }

            // বটের এডমিন লিস্ট চেক করা (GoatBot বা সাধারণ ফ্রেমওয়ার্ক অনুযায়ী)
            const botAdmins = global.GoatBot?.config?.adminBot || global.config?.ADMINBOT || [];
            const isBotAdmin = botAdmins.includes(senderID);

            // যদি এডমিন না হয়, তবে টেক্সট-ভিত্তিক স্মার্ট কুলডাউন চেক হবে
            if (!isBotAdmin) {
                const currentTime = Date.now();
                const cooldownTime = 3 * 60 * 1000; // ৩ মিনিট
                
                // ইউজারের আইডি এবং ওই নির্দিষ্ট টেক্সটের জন্য ইউনিক কি (Key) তৈরি করা
                const cooldownKey = `${senderID}_${Buffer.from(targetText).toString("hex").slice(0, 30)}`;

                if (global.siyamTextCooldown[cooldownKey] && (currentTime - global.siyamTextCooldown[cooldownKey] < cooldownTime)) {
                    const remainingTime = Math.ceil((cooldownTime - (currentTime - global.siyamTextCooldown[cooldownKey])) / 1000);
                    return api.sendMessage(` 🚫 𝗗𝘂𝗽𝗹𝗶𝗰𝗮𝘁𝗲 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 ⏳ 𝗧𝗿𝘆 𝗔𝗴𝗮𝗶𝗻 𝗜𝗻 ${remainingTime} 💎 Try Another Text)`, threadID, messageID);
                }

                // এই নির্দিষ্ট টেক্সটটির জন্য টাইমস্ট্যাম্প সেট করা
                global.siyamTextCooldown[cooldownKey] = currentTime;
            }

            // টেক্সট রিপিট তৈরি করা
            let repeatedResult = Array(count).fill(targetText).join(" ");
            
            // অটো-স্প্লিটার (মেসেঞ্জারের লিমিট সেফটি)
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

            // বিরতি দিয়ে স্প্লিট মেসেজগুলো সেন্ড করা
            for (let i = 0; i < messageChunks.length; i++) {
                await api.sendMessage(messageChunks[i], threadID);
                if (messageChunks.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); 
                }
            }

        } catch (err) {
            console.error("Copy Command Error:", err);
            api.sendMessage("❌ অভ্যন্তরীণ সমস্যা! ফাইল ক্রাশ এড়ানো হয়েছে: " + err.message, threadID, messageID);
        }
    }
};
