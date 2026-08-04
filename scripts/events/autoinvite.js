const { getTime } = global.utils;
const axios = require("axios");

module.exports = {
  config: {
    name: "autoinvite",
    version: "2.5",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    category: "events"
  },

  onStart: async ({ api, event, usersData, message }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;
    const leftID = logMessageData.leftParticipantFbId;

    // যদি কেউ নিজের ইচ্ছায় লিভ নেয় (kick না)
    if (leftID === author) {
      const userName = await usersData.getName(leftID);

      // Messenger-friendly bold font map
      const boldMap = {
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
        K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
        U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
        a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷",
        k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁",
        u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇"
      };

      const boldName = userName.split("").map(c => boldMap[c] || c).join("");

      // ভিডিও লিংক ইউআরএল অ্যারে
      const successVideos = [
        "https://files.catbox.moe/enthzq.mp4",
        "https://files.catbox.moe/h5c9pv.mp4"
      ];

      const failVideos = [
        "https://files.catbox.moe/uxku65.mp4",
        "https://files.catbox.moe/ol92rr.mp4"
      ];

      // র্যান্ডমলি ভিডিও বাছাই করার ফাংশন
      const getRandomVideo = (arr) => arr[Math.floor(Math.random() * arr.length)];

      try {
        await api.addUserToGroup(leftID, threadID);

        const randomSuccessUrl = getRandomVideo(successVideos);
        const videoStream = (await axios.get(randomSuccessUrl, { responseType: "stream" })).data;

        const form = {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🫣 পলাইছে রে পলাইছে...!!
» 🙆 『 ${boldName} 』
» 🤡 এই বলদ পলাইছে.! 😹
» 👑 আমি বস『 𝆠፝𝐒𝐈𝐘𝐀𝐌 』এর
» 🤖 বট থাকতে.!
» ☠️ তুই পালাতে পারবি না..😋
» 🥋 তোকে সিয়াম বসের...
» 🥵 খাটে কুংফু খেলার স্টাইলে
» 🧚 ধরে নিয়ে আসলাম 😹
» 🚫 👑𝆠፝𝐒𝐈𝐘𝐀𝐌- বসের 👈
» 🥱 পারমিশন ছাড়া গ্রুপ থেকে 
» 🛡️ লিভ নেওয়া যায় না...😹🙄
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: videoStream
        };

        await message.send(form);
      } catch (err) {
        const randomFailUrl = getRandomVideo(failVideos);
        const failVideoStream = (await axios.get(randomFailUrl, { responseType: "stream" })).data;

        const failForm = {
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 😹 দুঃখিত সিয়াম ভাই...
» 🚫 এই ইউজারটাকে 
» 📡 এড করতে পারলাম না
» 💀 মনে হয় উনি মারা গেছেন!
» 🍽️ চলো চলিশা খেয়ে আসি 🤣
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: failVideoStream
        };

        await message.send(failForm);
      }
    }
  }
};
