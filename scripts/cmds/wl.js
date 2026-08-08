const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "wl",
		version: "2.0",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 2,
		longDescription: {
			en: "Manage whiteListIds"
		},
		category: "owner",
		guide: {
			en:
				"{pn} add <uid | @tag>\n" +
				"{pn} remove <uid | @tag>\n" +
				"{pn} list\n" +
				"{pn} on / off"
		}
	},

	langs: {
		en: {
			added: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝐀𝐝𝐝𝐞𝐝:\n%1\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			removed: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝐑𝐞𝐦𝐨𝐯𝐞𝐝:\n%1\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			listAdmin: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 👑 𝐖𝐡𝐢𝐭𝐞𝐋𝐢𝐬𝐭 𝐔𝐬𝐞𝐫𝐬:\n%1\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			missingIdAdd: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝐆𝐢𝐯𝐞 𝐈𝐃 𝐨𝐫 𝐭𝐚𝐠!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
			missingIdRemove: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝐆𝐢𝐯𝐞 𝐈𝐃 𝐨𝐫 𝐭𝐚𝐠!\n───────────────\n» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		switch (args[0]) {

			// ================= ADD =================
			case "add":
			case "-a": {
				if (!args[1]) return message.reply(getLang("missingIdAdd"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				const added = [];

				for (const uid of uids) {
					if (!config.whiteListMode.whiteListIds.includes(uid)) {
						config.whiteListMode.whiteListIds.push(uid);
						added.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					added.map(uid => usersData.getName(uid).then(name => `• ${name} (${uid})`))
				);

				return message.reply(getLang("added", names.join("\n")));
			}

			// ================= REMOVE =================
			case "remove":
			case "-r": {
				if (!args[1]) return message.reply(getLang("missingIdRemove"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else
					uids = args.filter(arg => !isNaN(arg));

				const removed = [];

				for (const uid of uids) {
					if (config.whiteListMode.whiteListIds.includes(uid)) {
						config.whiteListMode.whiteListIds.splice(
							config.whiteListMode.whiteListIds.indexOf(uid),
							1
						);
						removed.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					removed.map(uid => usersData.getName(uid).then(name => `• ${name} (${uid})`))
				);

				return message.reply(getLang("removed", names.join("\n")));
			}

			// ================= LIST =================
			case "list":
			case "-l": {
				const names = await Promise.all(
					config.whiteListMode.whiteListIds.map(uid =>
						usersData.getName(uid).then(name => `• ${name} (${uid})`)
					)
				);

				return message.reply(getLang("listAdmin", names.join("\n")));
			}

			// ================= ON =================
			case "on": {
				config.whiteListMode.enable = true;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const time = moment().tz("Asia/Dhaka").format("hh:mm A");
				const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

				const msg = `
👑  𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍  👑

𝆠፝𝐖𝐇𝐈𝐓𝐄 𝐋𝐈𝐒𝐓 𝐌𝐎𝐃𝐄 𝐄𝐍𝐀𝐁𝐋𝐄𝐃

🔐  𝆠፝𝐀𝐂𝐂𝐄𝐒𝐒 :
   𝆠፝🐸এখন শুধু আমার বস সিয়াম🪬
   𝆠፝বট ব্যবহার করতে পারবে 👑

📅  𝆠፝𝐃𝐚𝐭𝐞 : ${date}
⏰  𝆠፝𝐓𝐢𝐦𝐞 : ${time}

👑  𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓  👑
`;

				return message.reply(msg);
			}

			// ================= OFF =================
			case "off": {
				config.whiteListMode.enable = false;
				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const time = moment().tz("Asia/Dhaka").format("hh:mm A");
				const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

				const msg = `
👑  𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍  👑

𝆠፝𝐖𝐇𝐈𝐓𝐄 𝐋𝐈𝐒𝐓 𝐌𝐎𝐃𝐄 𝐃𝐈𝐒𝐀𝐁𝐋𝐄𝐃

🌐  𝆠፝𝐀𝐂𝐂𝐄𝐒𝐒 :
   𝆠፝এখন সবাই বট ব্যবহার🪬
   𝆠፝করতে পারবে 🎉

📅  𝆠፝𝐃𝐚𝐭𝐞 : ${date}
⏰  𝆠፝𝐓𝐢𝐦𝐞 : ${time}

👑  𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓  👑
`;

				return message.reply(msg);
			}

			default:
				return message.SyntaxError();
		}
	}
};
