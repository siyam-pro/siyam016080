const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "ck",
  version: "1.2.1",
  permission: 0,
  credits: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  prefix: true,
  description: "Reply or tag to get user info",
  category: "Media",
  usages: "[reply/tag/box/admin]",
  cooldowns: 4,
  dependencies: {
    axios: "",
    "fs-extra": "",
    request: "",
  },
};

// MAIN HANDLER (FIXED STRUCTURE)
async function handle({ api, event, args }) {
  const { threadID, messageID, senderID, type, messageReply, mentions } =
    event;

  let id;

  if (type === "message_reply") {
    id = messageReply.senderID;
  } else if (Object.keys(mentions || {}).length > 0) {
    id = Object.keys(mentions)[0];
  } else if (args[0] === "box") {
    return getBoxInfo(api, event, args);
  } else if (args[0] === "admin") {
    return getAdminInfo(api, event);
  } else {
    id = senderID;
  }

  try {
    let info = await api.getUserInfo(id);
    let user = info[id];

    if (!user)
      return api.sendMessage(
        "ইউজার ইনফো পাওয়া যায়নি।",
        threadID,
        messageID
      );

    let name = user.name || "Unknown";
    let gender =
      user.gender === 2
        ? "Male"
        : user.gender === 1
        ? "Female"
        : "Unknown";

    let friend = user.isFriend ? "Yes" : "No";
    let vanity = user.vanity || "None";

    let path = __dirname + `/cache/info_${id}.png`;

    let msg = `📝 𝐍𝐚𝐦𝐞: ${name}\n🆔 𝐔𝐈𝐃: ${id}\n🔗 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${vanity}\n🚻 𝐆𝐞𝐧𝐝𝐞𝐫: ${gender}\n🤝 𝐁𝐨𝐭 𝐅𝐫𝐢𝐞𝐧𝐝: ${friend}\n🌐 fb.com/${id}`;

    let callback = () => {
      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(path),
        },
        threadID,
        () => fs.unlinkSync(path),
        messageID
      );
    };

    return request(
      encodeURI(
        `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      )
    )
      .pipe(fs.createWriteStream(path))
      .on("close", callback);
  } catch (err) {
    return api.sendMessage(
      "ইউজার আইডি পাওয়া যায়নি।",
      threadID,
      messageID
    );
  }
}

// ================= BOX INFO =================
async function getBoxInfo(api, event, args) {
  try {
    let targetTID = args[1] || event.threadID;
    let threadInfo = await api.getThreadInfo(targetTID);

    let male = (threadInfo.userInfo || []).filter(
      (u) => u.gender === "MALE"
    ).length;

    let female = (threadInfo.userInfo || []).filter(
      (u) => u.gender === "FEMALE"
    ).length;

    let msg = `🏠 𝐆𝐫𝐨𝐮𝐩: ${threadInfo.threadName}\n🆔 𝐓𝐈𝐃: ${targetTID}\n📊 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${threadInfo.participantIDs.length}\n👦 𝐌𝐚𝐥𝐞: ${male} | 👧 𝐅𝐞𝐦𝐚𝐥𝐞: ${female}`;

    if (!threadInfo.imageSrc) {
      return api.sendMessage(msg, event.threadID);
    }

    let path = __dirname + "/cache/box.png";

    return request(encodeURI(threadInfo.imageSrc))
      .pipe(fs.createWriteStream(path))
      .on("close", () => {
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(path),
          },
          event.threadID,
          () => fs.unlinkSync(path)
        );
      });
  } catch (e) {
    return api.sendMessage("তথ্য মেলেনি।", event.threadID);
  }
}

// ================= ADMIN INFO =================
async function getAdminInfo(api, event) {
  let msg = `👤 𝐀𝐝𝐦𝐢𝐧: Joy Ahmed\n🔗 fb.com/100003661522127`;
  let path = __dirname + "/cache/admin.png";

  return request(
    encodeURI(
      `https://graph.facebook.com/100003661522127/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
    )
  )
    .pipe(fs.createWriteStream(path))
    .on("close", () => {
      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(path),
        },
        event.threadID,
        () => fs.unlinkSync(path)
      );
    });
}

// IMPORTANT FRAMEWORK FIX (THIS IS THE KEY)
module.exports.run = handle;
module.exports.onStart = handle;
