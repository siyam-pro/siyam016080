const axios = require('axios');
const fs = require('fs-extra');

const { getStreamFromURL } = global.utils;

const pathData = __dirname + '/assets/hubble/nasa.json';
if (!fs.existsSync(__dirname + '/assets/hubble'))
  fs.mkdirSync(__dirname + '/assets/hubble', { recursive: true });

let hubbleData;

module.exports = {
  config: {
    name: "hubble",
    version: "1.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    description: {
      vi: "Xem ảnh từ Hubble",
      en: "View Hubble images"
    },
    category: "owner",
    guide: {
      en: "{pn} <date (mm-dd)>"
    }
  },

  langs: {
    vi: {
      invalidDate: "Ngày tháng bạn nhập vào không hợp lệ, vui lòng nhập lại theo định dạng mm-dd",
      noImage: "Không có ảnh nào được tìm thấy trong ngày này"
    },
    en: {
      invalidDate: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ আপনার দেওয়া 
» 🥱 তারিখটি সঠিক নয়! 
» ✅ সঠিক ফরম্যাট (mm-dd) 
» 👑 দিয়ে আবার চেষ্টা করুন।
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      noImage: 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ এই তারিখে কোনো 
» ☠️ ছবি পাওয়া যায়নি!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
    }
  },

  onLoad: async function () {
    if (!fs.existsSync(pathData)) {
      const res = await axios.get('https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/scripts/cmds/assets/hubble/nasa.json');
      fs.writeFileSync(pathData, JSON.stringify(res.data, null, 2));
    }
    hubbleData = JSON.parse(fs.readFileSync(pathData));
  },

  onStart: async function ({ message, args, getLang }) {
    const date = args[0] || "";
    const dateText = checkValidDate(date);
    if (!date || !dateText)
      return message.reply(getLang('invalidDate'));

    const data = hubbleData.find(e => e.date.startsWith(dateText));
    if (!data)
      return message.reply(getLang('noImage'));

    const { image, name, caption, url } = data;
    const getImage = await getStreamFromURL('https://imagine.gsfc.nasa.gov/hst_bday/images/' + image);

    const msg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
📅 𝗗𝗮𝘁𝗲: ${dateText}
🌀 𝗡𝗮𝗺𝗲: ${name}
📖 𝗖𝗮𝗽𝘁𝗶𝗼𝗻: ${caption}
🔗 𝗦𝗼𝘂𝗿𝗰𝗲: ${url}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    message.reply({
      body: msg,
      attachment: getImage
    });
  }
};

const monthText = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function checkValidDate(date) {
  const dateArr = date.split(/[-/]/);
  if (dateArr.length != 2)
    return false;
  let day;
  let month;
  if (parseInt(dateArr[0]) < 13) {
    day = parseInt(dateArr[1]);
    month = parseInt(dateArr[0]);
  }
  else {
    day = parseInt(dateArr[0]);
    month = parseInt(dateArr[1]);
  }
  if (isNaN(month) || isNaN(day))
    return false;
  if (month < 1 || month > 12)
    return false;
  if (day < 1 || day > 31)
    return false;
  if (month === 2 && day > 29)
    return false;
  if ([4, 6, 9, 11].includes(month) && day > 30)
    return false;
  return monthText[month - 1] + ' ' + day;
								   }
