const fs = require("fs");
const path = __dirname + "/cache/son.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

const AUTHOR = "♦ Siyam_YT ♦";

module.exports.config = {
  name: "siyam5",
  version: "3.0",
  author: "♦ Siyam_YT ♦",
  category: "automation",
  role: 0
};

// 🔒 Author check
function checkAuthor() {
  if (module.exports.config.author !== AUTHOR) {
    throw new Error("❌ Author changed! Command locked.");
  }
}

// ===================== ON START =====================
module.exports.onStart = async function ({ api, event, args }) {

  checkAuthor();

  const admins = global.GoatBot.config.adminBot || [];

  if (!admins.includes(event.senderID)) {
    return api.sendMessage(
      "❌ Only my boss 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑can use this command!",
      event.threadID,
      event.messageID
    );
  }

  let data = JSON.parse(fs.readFileSync(path));

  if (args[0] === "off") {
    delete data[event.threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    return api.sendMessage(
      "✅ ওকে 𝆠፝𝐒𝐈𝐘𝐀𝐌-বস ওর চুদা বন্ধ করা হয়েছে!",
      event.threadID,
      event.messageID
    );
  }

  if (args[0] === "on") {

    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage(
        "❌ বস একজনকে মেনশন করুন!",
        event.threadID,
        event.messageID
      );
    }

    let name = event.mentions[mention];

    try {
      const info = await api.getUserInfo(mention);
      name = info[mention]?.name || name;
    } catch (e) {}

    data[event.threadID] = {
      uid: mention,
      name: name,
      index: 0
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    const msg = `✅ ওকে সিয়াম বস 𓆩»${name}«𓆪\nএই খানকির পোলা SMS করলেই চুদা ফ্রী`;

    return api.sendMessage(
      {
        body: msg,
        mentions: [
          {
            tag: name,
            id: mention,
            fromIndex: msg.indexOf(name)
          }
        ]
      },
      event.threadID,
      event.messageID
    );
  }

  return api.sendMessage(
    "Usage:\nsiyam5 on @user\nsiyam5 off",
    event.threadID,
    event.messageID
  );
};


// ===================== ON CHAT =====================
module.exports.onChat = async function ({ api, event }) {

  checkAuthor();

  if (!event.body) return;

  let data = JSON.parse(fs.readFileSync(path));

  if (!data[event.threadID]) return;

  const target = data[event.threadID];

  if (event.senderID !== target.uid) return;

  const text = event.body.toLowerCase().trim();
  if (text.startsWith("son ")) return;

  const messages = [
    "\nখাংকির পোলা তোর মার ভোদা তে গাধার মাল ফালাবো! 😈",  
    "\nআমার সিয়াম বস তোর মা কে চুদে পল্টি মারবো! 😡",  
    "\nতোর মার গুদে ফুল ট্যাবলেট পুশ করবো! 🤡",  
    "\nতোর মার ভোদায় সিয়াম বস গাধার মতো মাল ফালিয়ে দিবে!🔥",  
    "\nসিয়াম বস তোর মাকে গাধার মতো চুদে বলবো এটা কার মাল? 😂",  
    "\nএই খানকির পোলা বেশ্যার পোলা তোর মাকে চুদে আমার বস momin সারা বেলা,🖕💯",  
    "\nবস সিয়াম বস তোর মার গুদে ইনপুট দিয়ে আউটপুট নেবো! 💀",  
    "\nআম পাতা জোড়া জোড়া তোর মাকে চূদে আমার বস সিয়াম উরাধুরা..!🖕💯",
    "\nতুই নাকি অনলাইনের কিং তোর মায়ের ভোদা মধ্যে বাজামু সাপের বিন বিনের তালে তালে চুদতে চুদতে নিয়া যামু খালে খালে নাই সাপ আমার বস সিয়াম তোর অবৈধ বাপ💦👅..",
    "\nরাম চুদলাম লখোন চুদলাম চুদলাম হনুমান তোর মায়েরে অনলাইনে চুইদা হইছি আমি বট গালিবাজ শুয়ারের বাচ্চা💦😈..",
    "\nআমি বট গালি জানি না গালি গেছি ভুইলা তোর মায়ের চুদমু ছায়া বেলাউুজ খুইলা তোর আাবল জাতের মায়ের চুদি খাংকির পোলা..",
    "\nখাংকির পোলা তোর hmm সাথে আড়ি তোর মায়েরে চুদতে চুদতে নিয়া যামু নানার বাড়ি,,সেখানে আছে ছাগল তোর মায়েরে চুদে রাস্তা রাম ছাগল,,ছাগলের আছে নাকি পশম,,তোর মায়ের ভোদার শয়তানের কসম বান্দির বাচ্ছা...",
    "\nচুইদ্দা তোর মার বোদা দিয়া বাইর করমু রক্ত রক্তের কালার যদি হয় লাল তোর মারে চুদবো মেন্টাল ক চিরকাল শুয়ারের বাচচা..",
    "\nআমি বট! 👉করলাম শুরু তোর মার পুটকিতে ডুকামু ২টা গরু গরু নাকি ডাকে হাম্বা তোর মার ভোদায় ডুকামু ২টা ইলেক্ট্রিকের খাম্বা🙏🫦!",
    "\nকিরে ফকিন্নি মাগীর পোলা 🐸। মুরগী তোর মায়ের চুদতে চুদতে নিয়া যামু তুর্কী তুর্কীকে আছে নাকি কী মামু তোর বোনের কচি🫦💋👅💦!!",
    "\nজারজ মাগির পোলা তর কচি বোনের ভুদায় উম্মম্মম্মম্মা 🫦 😋। ওয়াক থু তর বোনের ভুদায় গন্ধ কাইল্লা মাগির পুত 🤬🤬",
    "\nএই মুরগি খাংকির পোলা সিয়াম বস তর আম্মুর বাতার লাগে বাস্ট্রাডের বাচ্ছা গালি বাজ হয়ে গেসিস..!!",
    "\nখাংকির পোলা তুই সিয়াম  বস কে গালি দেস তুই তো রাস্তার পতিতার পুত ছোডো ভাই তর আম্মু রে টুস করে চুদে দিয়ে দূর দিভো 🐒🙈?",
    "\nকিরে বস্তির পোলা তর আম্মু রে তর দুলাভাই এর কান্দে ফেলে আর তর কচি বোন রে তর বাপের কান্দে রেখে চুদি উফফফ!!",
    "\n‎জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬",
    "\n‎বান্দির পোলা তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟",
    "\n‎বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋!",
    "\n‎হিজলা মাগির পোলা বালি দিয়া চুদমু তরে খাঙ্কি মাগী!তর মাকে।  ✋!"
  ];

  let index = target.index || 0;

  const msg = messages[index % messages.length];

  target.index = (index + 1) % messages.length;
  data[event.threadID] = target;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));

  return api.sendMessage(msg, event.threadID, event.messageID);
};
