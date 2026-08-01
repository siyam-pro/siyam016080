const axios = require('axios');

module.exports = {
  config: {
    name: "ifter",
    aliases: ["roza", "iftertime", "ramadan"],
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Schedules for Sehri and Iftar based on city",
    longDescription: "Get real-time Ramadan timings (Sehri and Iftar) for any city.",
    category: "Islamic",
    guide: {
      en: "{pn} [city_name]"
    }
  },

  onStart: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const city = args.join(" ") || "Dhaka";

    try {
      const res = await axios.get(`http://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city: city,
          country: "Bangladesh",
          method: 1 
        }
      });

      const { timings, date } = res.data.data;

      const infoMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🌙 𝐑𝐀𝐌𝐀𝐃𝐀𝐍 𝐒𝐂𝐇𝐄𝐃𝐔𝐋𝐄

📍 𝐂𝐢𝐭𝐲: ${city.toUpperCase()}
📅 𝐃𝐚𝐭𝐞: ${date.readable}
🕋 𝐇𝐢𝐣𝐫𝐢: ${date.hijri.date}

⚪ 𝐒𝐞𝐡𝐫𝐢 𝐄𝐧𝐝𝐬: ${timings.Fajr}
🟠 𝐈𝐟𝐭𝐚𝐫 𝐓𝐢𝐦𝐞: ${timings.Maghrib}

👑 𝐃𝐮𝐚 (𝐈𝐟𝐭𝐚𝐫): "𝐀𝐥𝐥𝐚𝐡𝐮𝐦𝐦𝐚 𝐥𝐚𝐤𝐚 𝐬𝐮𝐦𝐭𝐮 𝐰𝐚 𝐚𝐥𝐚 𝐫𝐢𝐳𝐪𝐢𝐤𝐚 𝐚𝐟𝐭𝐚𝐫𝐭𝐮."
 May Allah accept your fasts. 🤲
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓`;

      return api.sendMessage(infoMsg, threadID, messageID);

    } catch (error) {
      const errorMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ '${city}' শহরের 
» ☠️ তথ্য পাওয়া যায়নি!
» 💡 ইংরেজিতে সঠিক 
» ⏳ শহরের নাম লিখুন 
» 🎀 যেমন: {pn} Dhaka
───────────────
» 🧚‍♀️ ‿𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓`;
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
