const fs = require("fs");
const path = __dirname + "/adminData.json";

if (!fs.existsSync(path)) {
	fs.writeFileSync(path, JSON.stringify({}));
}

module.exports = {
	config: {
		name: "admin",
		version: "3.0",
		author: "SIYAM",
		countDown: 3,
		role: 1,
		shortDescription: "Admin system",
		category: "box chat",
		guide: {
			en: "admin add/remove/list"
		}
	},

	onStart: async function ({ api, event, args, message, usersData }) {
		let data = JSON.parse(fs.readFileSync(path));
		const threadID = event.threadID;

		if (!data[threadID]) data[threadID] = [];

		// ================= ADD =================
		if (args[0] == "add") {
			let uid;

			if (event.messageReply) {
				uid = event.messageReply.senderID;
			}
			else if (Object.keys(event.mentions).length > 0) {
				uid = Object.keys(event.mentions)[0];
			}
			else if (!isNaN(args[1])) {
				uid = args[1];
			}
			else {
				return message.reply("❌ 𝐔𝐬𝐞𝐫 𝐬𝐞𝐥𝐞𝐜𝐭 𝐜𝐨𝐫𝐨 (𝐑𝐞𝐩𝐥𝐲/𝐌𝐞𝐧𝐭𝐢𝐨𝐧/𝐔𝐈𝐃)");
			}

			if (data[threadID].includes(uid)) {
				return message.reply("⚠️ 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐢𝐧 𝐀𝐝𝐦𝐢𝐧 𝐋𝐢𝐬𝐭");
			}

			data[threadID].push(uid);
			fs.writeFileSync(path, JSON.stringify(data, null, 2));

			// ===== GET NAME =====
			let name = "Unknown";
			try {
				name = await usersData.getName(uid);
				if (!name) {
					const info = await api.getUserInfo(uid);
					name = info[uid].name;
				}
			} catch (e) {}

			return message.reply({
				body: `『 ✅ 𝐀𝐃𝐌𝐈𝐍 𝐀𝐏𝐏𝐑𝐎𝐕𝐄𝐃 』
👤 𝐔𝐬𝐞𝐫: ${uid}
📌 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐀𝐜𝐭𝐢𝐯𝐞
🛡️ 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: 𝐆𝐫𝐚𝐧𝐭𝐞𝐝

👤 𝐍𝐚𝐦𝐞: ${name}`,
				mentions: [{
					id: uid,
					tag: name
				}]
			});
		}

		// ================= REMOVE =================
		else if (args[0] == "remove") {
			let uid;

			if (event.messageReply) {
				uid = event.messageReply.senderID;
			}
			else if (Object.keys(event.mentions).length > 0) {
				uid = Object.keys(event.mentions)[0];
			}
			else if (!isNaN(args[1])) {
				uid = args[1];
			}
			else {
				return message.reply("❌ 𝐔𝐬𝐞𝐫 𝐬𝐞𝐥𝐞𝐜𝐭 𝐜𝐨𝐫𝐨 (𝐑𝐞𝐩𝐥𝐲/𝐌𝐞𝐧𝐭𝐢𝐨𝐧/𝐔𝐈𝐃)");
			}

			if (!data[threadID].includes(uid)) {
				return message.reply("❌ 𝐔𝐬𝐞𝐫 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐀𝐝𝐦𝐢𝐧 𝐋𝐢𝐬𝐭");
			}

			data[threadID] = data[threadID].filter(id => id != uid);
			fs.writeFileSync(path, JSON.stringify(data, null, 2));

			return message.reply("❌ 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘");
		}

		// ================= LIST =================
		else if (args[0] == "list") {
			if (data[threadID].length === 0) {
				return message.reply("📭 𝐍𝐨 𝐀𝐝𝐦𝐢𝐧 𝐅𝐨𝐮𝐧𝐝");
			}

			let msg = "👑 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓\n\n";

			for (let i = 0; i < data[threadID].length; i++) {
				const uid = data[threadID][i];
				let name = "Unknown";

				try {
					name = await usersData.getName(uid);
					if (!name) {
						const info = await api.getUserInfo(uid);
						name = info[uid].name;
					}
				} catch (e) {}

				msg += `${i + 1}. 👤 𝐍𝐚𝐦𝐞: ${name}
🆔 𝐔𝐈𝐃: ${uid}

`;
			}

			return message.reply(msg);
		}

		// ================= DEFAULT =================
		else {
			return message.reply(`⚙️ 𝐀𝐃𝐌𝐈𝐍 𝐏𝐀𝐍𝐄𝐋

➤ 𝐚𝐝𝐦𝐢𝐧 𝐚𝐝𝐝
➤ 𝐚𝐝𝐦𝐢𝐧 𝐫𝐞𝐦𝐨𝐯𝐞
➤ 𝐚𝐝𝐦𝐢𝐧 𝐥𝐢𝐬𝐭`);
		}
	}
};
