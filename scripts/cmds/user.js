const { getTime } = global.utils;

const bannedWarningData = new Map();
const WARNING_INTERVAL = 3 * 60 * 1000;

module.exports = {
	config: {
		name: "user",
		version: "1.6",
		author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 2,
		description: {
			vi: "Quản lý người dùng trong hệ thống bot",
			en: "Manage users in bot system"
		},
		category: "owner"
	},

	langs: {
		vi: {
			noUserFound: "❌ Không tìm thấy người dùng nào có tên khớp với từ khóa: \"%1\" trong dữ liệu của bot",
			userFound: "🔎 Tìm thấy %1 người dùng có tên trùng với từ khóa \"%2\" trong dữ liệu của bot:\n%3",
			uidRequired: "Uid của người cần ban không được để trống, vui lòng nhập uid hoặc tag hoặc reply tin nhắn của 1 người theo cú pháp user ban <uid> <lý do>",
			reasonRequired: "Lý do ban người dùng không được để trống, vui lòng nhập uid hoặc tag hoặc reply tin nhắn của 1 người theo cú pháp user ban <uid> <lý do>",
			userHasBanned: "Người dùng mang id [%1 | %2] đã bị cấm từ trước:\n» Lý do: %3\n» Thời gian: %4",
			userBanned: "Đã cấm người dùng mang id [%1 | %2] sử dụng bot.\n» Lý do: %3\n» Thời gian: %4",
			uidRequiredUnban: "Uid của người cần unban không được để trống",
			userNotBanned: "Hiện tại người dùng mang id [%1 | %2] không bị cấm sử dụng bot",
			userUnbanned: "Đã bỏ cấm người dùng mang id [%1 | %2], hiện tại người này có thể sử dụng bot"
		},

		en: {
			noUserFound: "❌ No user found with name matching keyword: \"%1\" in bot data",
			userFound: "🔎 Found %1 user with name matching keyword \"%2\" in bot data:\n%3",
			uidRequired: "Uid of user to ban cannot be empty",
			reasonRequired: "Reason to ban user cannot be empty",
			userHasBanned: "User with id [%1 | %2] has been banned before:\n» Reason: %3\n» Date: %4",
			userBanned: "User with id [%1 | %2] has been banned:\n» Reason: %3\n» Date: %4",
			uidRequiredUnban: "Uid of user to unban cannot be empty",
			userNotBanned: "User with id [%1 | %2] is not banned",
			userUnbanned: "User with id [%1 | %2] has been unbanned"
		}
	},

	onStart: async function ({
		args,
		usersData,
		message,
		event,
		prefix,
		getLang
	}) {
		const type = (args[0] || "").toLowerCase();

		switch (type) {

			case "find":
			case "-f":
			case "search":
			case "-s": {
				const allUser = await usersData.getAll();
				const keyWord = args.slice(1).join(" ");

				const result = allUser.filter(item =>
					(item.name || "")
						.toLowerCase()
						.includes(keyWord.toLowerCase())
				);

				const msg = result.reduce(
					(i, user) =>
						i += `\n╭𝐍𝐚𝐦𝐞: ${user.name || "Unknown"}\n╰𝐈𝐃: ${user.userID}`,
					""
				);

				return message.reply(
					result.length === 0
						? getLang("noUserFound", keyWord)
						: getLang("userFound", result.length, keyWord, msg)
				);
			}

			case "ban":
			case "-b": {
				let uid;
				let reason;

				if (event.type === "message_reply") {
					uid = event.messageReply.senderID;
					reason = args.join(" ");
				}
				else if (
					event.mentions &&
					Object.keys(event.mentions).length > 0
				) {
					const mentions = event.mentions;
					uid = Object.keys(mentions)[0];

					reason = args
						.slice(1)
						.join(" ")
						.replace(mentions[uid] || "", "");
				}
				else if (args[1]) {
					uid = args[1];
					reason = args.slice(2).join(" ");
				}
				else {
					return message.SyntaxError();
				}

				if (!uid)
					return message.reply(getLang("uidRequired"));

				if (!reason || !reason.trim())
					return message.reply(getLang("reasonRequired", prefix));

				reason = reason.replace(/\s+/g, " ").trim();

				const userData = await usersData.get(uid);

				if (!userData)
					return message.reply(getLang("uidRequired"));

				const name = userData.name || "Unknown";
				const status =
					userData.banned &&
					userData.banned.status === true;

				if (status) {
					return message.reply(
						getLang(
							"userHasBanned",
							uid,
							name,
							userData.banned.reason || "No reason",
							userData.banned.date || "Unknown"
						)
					);
				}

				const time = getTime("DD/MM/YYYY HH:mm:ss");

				await usersData.set(uid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});

				bannedWarningData.delete(uid);

				const banSuccessMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐁𝐨𝐭 𝐒𝐲𝐬𝐭𝐞𝐦 𝐀𝐜𝐭𝐢𝐨𝐧
👤 𝐔𝐬𝐞𝐫 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭
🆔 𝐁𝐀𝐍-𝐒𝐔𝐂𝐂𝐄𝐒𝐒
━━━━━━━━━━━━━━━
» ✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐁𝐚𝐧𝐧𝐞𝐝!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
» 📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${reason}
» ⏰ 𝐃𝐚𝐭𝐞: ${time}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

				return message.reply(banSuccessMsg);
			}

			case "unban":
			case "-u": {
				let uid;

				if (event.type === "message_reply") {
					uid = event.messageReply.senderID;
				}
				else if (
					event.mentions &&
					Object.keys(event.mentions).length > 0
				) {
					uid = Object.keys(event.mentions)[0];
				}
				else if (args[1]) {
					uid = args[1];
				}
				else {
					return message.SyntaxError();
				}

				if (!uid)
					return message.reply(getLang("uidRequiredUnban"));

				const userData = await usersData.get(uid);

				if (!userData)
					return message.reply(getLang("uidRequiredUnban"));

				const name = userData.name || "Unknown";

				const status =
					userData.banned &&
					userData.banned.status === true;

				if (!status) {
					return message.reply(
						getLang(
							"userNotBanned",
							uid,
							name
						)
					);
				}

				await usersData.set(uid, {
					banned: {}
				});

				bannedWarningData.delete(uid);

				const unbanSuccessMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐁𝐨𝐭 𝐒𝐲𝐬𝐭𝐞𝐦 𝐀𝐜𝐭𝐢𝐨𝐧
👤 𝐔𝐬𝐞𝐫 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭
🆔 𝐔𝐍𝐁𝐀𝐍-𝐒𝐔𝐂𝐂𝐄𝐒𝐒
━━━━━━━━━━━━━━━
» ✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐔𝐧𝐛𝐚𝐧𝐧𝐞𝐝!
» 👤 𝐍𝐚𝐦𝐞: ${name}
» 🆔 𝐔𝐈𝐃: ${uid}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝗔𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

				return message.reply(unbanSuccessMsg);
			}

			case "list":
			case "-l": {
				const allUser = await usersData.getAll();

				const bannedUsers = allUser.filter(
					item =>
						item.banned &&
						item.banned.status === true
				);

				if (bannedUsers.length === 0) {
					const noBanMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐁𝐨𝐭 𝐒𝐲𝐬𝐭𝐞𝐦
👤 𝐀𝐝𝐦𝐢𝐧 𝐂𝐨𝐧𝐭𝐫𝐨𝐥
🆔 𝐁𝐀𝐍-𝟎𝟎
━━━━━━━━━━━━━━━
» ❌ বর্তমানে বট সিস্টেমে কোনো 
» 😭 ব্যান করা ইউজার নেই!
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

					return message.reply(noBanMsg);
				}

				let listText = "";

				bannedUsers.forEach((user, index) => {
					listText += `
[ ${index + 1} ] 👤 𝐍𝐚𝐦𝐞: ${user.name || "Unknown"}
     🆔 𝐔𝐈𝐃: ${user.userID}
     📌 𝐑𝐞𝐚𝐬𝐨𝐧: ${user.banned.reason || "No reason"}
     ⏰ 𝐃𝐚𝐭𝐞: ${user.banned.date || "Unknown"}
`;
				});

				const form = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐓𝐨𝐭𝐚𝐥 𝐁𝐚𝐧𝐧𝐞𝐝: ${bannedUsers.length}
👤 𝐔𝐬𝐞𝐫 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭
🆔 𝐁𝐀𝐍-𝐋𝐈𝐒𝐓
━━━━━━━━━━━━━━━
» ✅ নিচের লিস্ট থেকে যে ইউজারকে
» 🌚 আনব্যান করতে চান সেই নাম্বারটি
» 😂 যেমন: 1 2 বা 1) এই মেসেজে রিপ্লাই দিন:

${listText}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

				return message.reply(
					form,
					(err, info) => {
						if (err) return;

						global.client.SeptyhandleReply =
							global.client.SeptyhandleReply || {};

						global.client.SeptyhandleReply[
							info.messageID
						] = {
							name: module.exports.config.name,
							messageID: info.messageID,
							author: event.senderID,
							bannedUsers
						};
					}
				);
			}

			default:
				return message.SyntaxError();
		}
	},

	onChat: async function ({
		event,
		usersData,
		message
	}) {
		try {
			if (!event || !event.senderID)
				return;

			const uid = event.senderID;

			const userData = await usersData.get(uid);

			if (!userData)
				return;

			if (
				!userData.banned ||
				userData.banned.status !== true
			) {
				bannedWarningData.delete(uid);
				return;
			}

			const now = Date.now();

			let warningData = bannedWarningData.get(uid);

			if (!warningData) {
				warningData = {
					lastWarning: 0
				};

				bannedWarningData.set(uid, warningData);
			}

			// ৩ মিনিটের মধ্যে কোনো মেসেজ দিলে আর রিপ্লাই দিবে না (স্প্যাম প্রটেকশন)
			if (warningData.lastWarning && (now - warningData.lastWarning < WARNING_INTERVAL)) {
				return;
			}

			warningData.lastWarning = now;

			const warningMessage = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
🚫 𝐁𝐀𝐍𝐍𝐄𝐃 𝐔𝐒𝐄𝐑
❌ আপনি বট থেকে ব্যান্ড হয়েছেন!
❌ আপনি বটের কোনো কমান্ড ইউজ 
🥺 করতে পারবেন না।
━━━━━━━━━━━━━━━
📌 𝐑𝐞𝐚𝐬𝐨𝐧:
» ${userData.banned.reason || "No reason"}
⏰ 𝐁𝐚𝐧𝐧𝐞𝐝 𝐃𝐚𝐭𝐞:
» ${userData.banned.date || "Unknown"}
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

			return message.reply(warningMessage);
		}
		catch (error) {
			console.error("[USER BAN WARNING ERROR]", error);
		}
	},

	onReply: async function ({
		event,
		api,
		handleReply,
		usersData,
		message
	}) {
		if (
			event.senderID !==
			handleReply.author
		) {
			return;
		}

		const input =
			(event.body || "")
				.trim()
				.split(/\s+/);

		const bannedUsers =
			handleReply.bannedUsers || [];

		let successCount = 0;
		const failedNames = [];

		for (const numStr of input) {
			const cleanNumber =
				numStr.replace(/[^\d]/g, "");

			const index =
				parseInt(cleanNumber) - 1;

			if (
				!isNaN(index) &&
				bannedUsers[index]
			) {
				const targetUser =
					bannedUsers[index];

				await usersData.set(
					targetUser.userID,
					{
						banned: {}
					}
				);

				bannedWarningData.delete(
					targetUser.userID
				);

				successCount++;
			}
			else {
				failedNames.push(numStr);
			}
		}

		let resultMsg = `
━━━━━━━━━━━━━━━
👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
━━━━━━━━━━━━━━━
📸 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐒𝐭𝐚𝐭𝐮𝐬
👤 𝐀𝐝𝐦𝐢𝐧 𝐀𝐜𝐭𝐢𝐨𝐧
🆔 𝐔𝐍𝐁𝐀𝐍-𝐑𝐄𝐒
━━━━━━━━━━━━━━━
» ✅ সফলভাবে ${successCount} জন
» 🐸 User-কে আনব্যান করা হয়েছে!`;

		if (failedNames.length > 0) {
			resultMsg += `
» ⚠️ ভুল নাম্বার:
» ${failedNames.join(", ")}`;
		}

		resultMsg += `
━━━━━━━━━━━━━━━
🧚‍♀️ 𝐍𝐈𝐉𝐇𝐔𝐌 𝐂𝐇𝐀𝐓𝐁𝐎𝐓
━━━━━━━━━━━━━━━`;

		return message.reply(
			resultMsg,
			() => {
				try {
					api.unsendMessage(
						handleReply.messageID
					);
				}
				catch (e) {}
			}
		);
	}
};
