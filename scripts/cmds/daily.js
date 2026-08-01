module.exports.config = {
  name: "daily",
  aliases: ["claim"],
  version: "1.0",
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  countDown: 5,
  role: 0,
  shortDescription: "Claim daily reward",
  category: "economy"
};

module.exports.onStart = async function ({ api, event, usersData }) {
  const { senderID, threadID, messageID } = event;

  const cooldown = 24 * 60 * 60 * 1000; // 24h
  const reward = Math.floor(Math.random() * 5000) + 1000;

  const userData = await usersData.get(senderID);

  if (!userData.data) userData.data = {};

  const lastClaim = userData.data.lastDaily || 0;
  const now = Date.now();

  if (now - lastClaim < cooldown) {
    const remaining = cooldown - (now - lastClaim);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⏳ 𝑾𝑨𝑰𝑻 𝑨 𝑴𝑶𝑴𝑬𝑵𝑻
» 🎁 আপনি ইতিমধ্যে আজকের
» ✅  রিওয়ার্ড সংগ্রহ করেছেন!
» ⏱️ আবার চেষ্টা করুন: ${hours}
» 🐦‍🔥 ঘণ্টা ${minutes} মিনিট পর।
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }

  const currentMoney = userData.data.money || 0;
  const newBalance = currentMoney + reward;

  await usersData.set(senderID, {
    data: {
      ...userData.data,
      money: newBalance,
      lastDaily: now
    }
  });

  api.sendMessage(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎁 𝑫𝑨𝑰𝑳𝒀 𝑹𝑬𝑾𝑨𝑹𝑫
» 🎉 অভিনন্দন! আপনি 
» 📡 দৈনিক বোনাস পেয়েছেন।
» 💵 প্রাপ্তি: ${reward}
» 🏦 নতুন ব্যালেন্স: 
» 🛡️ ${newBalance}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
    threadID,
    messageID
  );
};
