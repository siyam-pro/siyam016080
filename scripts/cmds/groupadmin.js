module.exports = {
  config: {
    name: "gcadmin",
    aliases: ["groupadmin", "admingc", "admingroup", "gcadminlist", "gcremove"],
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌",
    countDown: 5,
    role: 1,
    shortDescription: "Manage group admins with list and remove features",
    category: "box chat",
    guide: {
      en: "{p}{n} add [uid/mention/reply/self] | {p}{n} remove [uid/mention/reply/self]\n{p}gcadminlist - Show admin list\n{p}gcremove [number] - Remove admin by list number"
    }
  },

  onStart: async function ({ api, event, args, commandName }) {
    const tID = event.threadID;

    if (commandName === "gcadminlist") {
      return global.gcAdminList(api, event, tID);
    }
    if (commandName === "gcremove") {
      const index = parseInt(args[0]) - 1;
      return global.gcRemoveByIndex(api, event, tID, index);
    }

    const cmd = args[0];
    const target = args.slice(1).join(" ");

    if (cmd === "add" || cmd === "-a")
      return addAdmin(api, event, tID, target);

    if (cmd === "remove" || cmd === "-r")
      return removeAdmin(api, event, tID, target);

    if (cmd === "list")
      return global.gcAdminList(api, event, tID);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗

➥ gcadmin add @user
➥ gcadmin remove @user
➥ gcadminlist (অ্যাডমিন তালিকা দেখতে)
➥ gcremove [নাম্বার] (তালিকা থেকে অ্যাডমিন সরাতে)

💡 [ ব্যবহারের নিয়ম ]: 
গ্রুপে কাউকে এডমিন বানাতে চাইলে 'gcadmin add' লিখে মেনশন বা রিপ্লাই করুন। অ্যাডমিনদের তালিকা দেখতে 'gcadminlist' লিখুন এবং তালিকা থেকে বাদ দিতে 'gcremove [নাম্বার]' লিখুন।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
};

global.gcAdminSession = global.gcAdminSession || {};

global.gcAdminList = async function (api, event, tID) {
  try {
    const threadInfo = await api.getThreadInfo(tID);
    const adminIDs = threadInfo.adminIDs.map(item => item.id);
    
    if (adminIDs.length === 0) {
      return api.sendMessage("❌ এই গ্রুপে কোনো অ্যাডমিন খুঁজে পাওয়া যায়নি।", tID);
    }

    let userInfo = {};
    try {
      userInfo = await api.getUserInfo(adminIDs);
    } catch (e) {}

    const userInfoMap = threadInfo.userInfo ? threadInfo.userInfo.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {}) : {};

    let msg = `👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n\n✦ 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 𝗟𝗜𝗦𝗧\n\n`;
    
    const currentAdmins = [];

    let index = 1;
    for (const id of adminIDs) {
      let name = userInfo[id]?.name || userInfoMap[id];
      
      if (!name || name === "Facebook User") {
        try {
          const singleInfo = await api.getUserInfo(id);
          if (singleInfo[id]?.name) name = singleInfo[id].name;
        } catch (e) {}
      }
      
      if (!name || name === "Facebook User") {
        name = `User (${id})`;
      }

      msg += `${index}. ${name}\n`;
      currentAdmins.push({ id, name });
      index++;
    }

    msg += `\n━━━━━━━━━━━━\n💡 অ্যাডমিন রিমুভ করতে লিখুন:\ngcremove [নাম্বার]\n\n✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`;
    
    global.gcAdminSession[tID] = currentAdmins;

    api.sendMessage(msg, tID);
  } catch (err) {
    api.sendMessage("❌ অ্যাডমিন তালিকা লোড করতে সমস্যা হয়েছে।", tID);
  }
};

global.gcRemoveByIndex = async function (api, event, tID, index) {
  const session = global.gcAdminSession[tID];
  
  if (!session || session.length === 0) {
    return api.sendMessage("⚠️ অনুগ্রহ করে আগে 'gcadminlist' লিখে তালিকাটি সচল করুন।", tID);
  }

  if (isNaN(index) || index < 0 || index >= session.length) {
    return api.sendMessage("⚠️ ভুল নাম্বার! তালিকা অনুযায়ী সঠিক নাম্বারটি দিন।", tID);
  }

  const targetAdmin = session[index];

  try {
    await api.changeAdminStatus(tID, targetAdmin.id, false);
    
    global.gcAdminSession[tID].splice(index, 1);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
➥ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗙𝗿𝗼𝗺 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻
👤 ${targetAdmin.name}

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`, 
      tID 
    );
  } catch {
    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

❌ 𝗙𝗔𝗜𝗟𝗘𝗗
➥ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗥𝗲𝗺𝗼𝘃𝗲 𝗔𝗱𝗺𝗶𝗻
🔒 🇨🇭𝗲𝗰𝗸 𝗕𝗼𝘁 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻

💡 【 👑-𝐒𝐈𝐘𝐀𝐌-👑 】⚠️ এই সদস্যকে Remove করা গেল না!
🚫 Bot Admin নেই অথবা যাকে Remove করা হচ্ছে তার ক্ষমতা বটের চেয়ে বেশি।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
};

async function addAdmin(api, event, tID, target) {
  try {
    const uID = await getUID(api, event, target);
    let userInfo = {};
    try { userInfo = await api.getUserInfo(uID); } catch(e){}
    const name = userInfo[uID]?.name || uID;

    await api.changeAdminStatus(tID, uID, true);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝗔𝗦𝗔𝗡 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
➥ 𝗣𝗿𝗼𝗺𝗼𝘁𝗲𝗱 𝘁𝗼 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻
👤 ${name}

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`, 
      tID 
    );
  } catch {
    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

❌ 𝗙𝗔𝗜𝗟𝗘𝗗
➥ 𝗕𝗼𝘁 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗻 𝗔𝗱𝗺𝗶𝗻
🔒 𝗚𝗿𝗮𝗻𝘁 𝗔𝗱𝗺𝗶𝗻 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝗙𝗶𝗿𝘀𝘁

💡 [ মনে রাখুন ]: বটের এই কমান্ডটি কাজ করার জন্য অবশ্যই বটকে প্রথমে ওই গ্রুপের এডমিন (Admin) বানাতে হবে।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
}

async function removeAdmin(api, event, tID, target) {
  try {
    const uID = await getUID(api, event, target);
    let userInfo = {};
    try { userInfo = await api.getUserInfo(uID); } catch(e){}
    const name = userInfo[uID]?.name || uID;

    await api.changeAdminStatus(tID, uID, false);

    api.sendMessage(
`👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
➥ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗙𝗿𝗼𝗺 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻
👤 ${name}

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`, 
      tID 
    );
  } catch {
    api.sendMessage(
`👑 𝗢𝗪𝗡𝗘𝗥 ⇢ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝗔𝗡 👑

✦ 𝗔𝗗𝗠𝗜𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗥

❌ 𝗙𝗔𝗜𝗟𝗘𝗗
➥ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗥𝗲𝗺𝗼𝘃𝗲 𝗔𝗱𝗺𝗶𝗻
🔒 🇨🇭𝗲𝗰𝗸 𝗕𝗼𝘁 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶 OR 𝗠𝗶𝘀𝘀𝗶𝗼𝗻

💡 【 👑-𝐒𝐈𝐘𝐀𝐌-👑 】⚠️ এই সদস্যকে Remove করা গেল না!
🚫 Bot Admin নেই
🔰 অথবা যাকে Remove করা হচ্ছে, সে 🔰এডমিন🔰তার ক্ষমতা 💠Bot-এর চেয়ে বেশি✅।
✅ আগে Bot-কে Admin দিন, তারপর আবার চেষ্টা করুন।

━━━━━━━━━━━━
✦ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧 𝗕𝗢𝗧`,
      tID
    );
  }
}

async function getUID(api, event, target) {
  if (event.type === "message_reply")
    return event.messageReply.senderID;

  if (event.mentions && Object.keys(event.mentions).length > 0)
    return Object.keys(event.mentions)[0];

  if (target)
    return target;

  return event.senderID;
}
