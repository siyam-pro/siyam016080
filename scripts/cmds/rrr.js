const axios = require("axios");

const warningData = new Map();

const MAX_WARNING = 3;
const SPAM_WINDOW = 7000;
const SPAM_LIMIT = 5;
const REPEAT_LIMIT = 3;

const badWords = [
	"গালি",
	"খানকি",
	"চোদ",
	"চুদ",
	"চুদা",
	"চোদন",
	"বাল",
	"হারামি",
	"হারামজাদা",
	"কুত্তা",
	"শালা",
	"শালী",
	"মাদারচোদ",
	"বোকাচোদা",
	"fuck",
	"fucking",
	"motherfucker",
	"bitch",
	"asshole",
	"shit",
	"dick",
	"pussy"
];

module.exports = {

	config: {
		name: "rrr",
		version: "1.0.0",
		author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 0,
		role: 0,
		description: {
			en: "𝐏𝐫𝐨𝐟𝐞𝐬𝐬𝐢𝐨𝐧𝐚𝐥 𝐆𝐫𝐨𝐮𝐩 𝐖𝐚𝐫𝐧𝐢𝐧𝐠 𝐒𝐲𝐬𝐭𝐞𝐦",
			vi: "Hệ thống cảnh báo nhóm chuyên nghiệp"
		},
		category: "events"
	},

	onStart: async function () {},

	onChat: async function ({
		event,
		api,
		usersData,
		threadsData
	}) {

		if (!event || !event.isGroup)
			return;

		if (!event.senderID)
			return;

		if (!event.body)
			return;

		const uid = event.senderID;
		const threadID = event.threadID;
		const text = event.body.trim();

		if (!text)
			return;

		const botID =
			global.GoatBot &&
			global.GoatBot.botID
				? global.GoatBot.botID.toString()
				: null;

		if (botID && uid.toString() === botID)
			return;

		const key = `${threadID}_${uid}`;

		if (!warningData.has(key)) {
			warningData.set(key, {
				count: 0,
				messages: [],
				lastMessage: 0,
				repeatedText: "",
				repeatedCount: 0,
				finished: false
			});
		}

		const data = warningData.get(key);

		if (data.finished)
			return;

		const now = Date.now();

		data.messages = data.messages.filter(
			item => now - item.time <= SPAM_WINDOW
		);

		data.messages.push({
			text,
			time: now
		});

		const normalizedText = normalizeText(text);

		if (
			normalizedText &&
			normalizedText === data.repeatedText
		) {
			data.repeatedCount++;
		}
		else {
			data.repeatedText = normalizedText;
			data.repeatedCount = 1;
		}

		let reason = null;

		if (containsBadWord(text)) {
			reason = "𝐁𝐚𝐝 𝐋𝐚𝐧𝐠𝐮𝐚𝐠𝐞";
		}

		else if (
			data.repeatedCount >= REPEAT_LIMIT
		) {
			reason = "𝐑𝐞𝐩𝐞𝐚𝐭𝐞𝐝 𝐌𝐞𝐬𝐬𝐚𝐠𝐞";
		}

		else if (
			data.messages.length >= SPAM_LIMIT
		) {
			reason = "𝐒𝐩𝐚𝐦𝐦𝐢𝐧𝐠";
		}

		if (!reason)
			return;

		data.messages = [];
		data.repeatedCount = 0;

		const userData = await getUserData(
			api,
			usersData,
			uid
		);

		const threadInfo =
			await api.getThreadInfo(threadID);

		const isGroupAdmin =
			threadInfo &&
			Array.isArray(threadInfo.adminIDs) &&
			threadInfo.adminIDs.some(
				item =>
					item.id.toString() ===
					uid.toString()
			);

		const botAdmins =
			getBotAdmins();

		const isBotAdmin =
			botAdmins.includes(
				uid.toString()
			);

		const warningNumber = data.count + 1;

		data.count = warningNumber;

		const warningType =
			getWarningType(warningNumber);

		const warningText =
			createWarningMessage({
				name: userData.name,
				uid,
				date: getDate(),
				reason,
				text,
				warningNumber,
				warningType,
				isAdmin:
					isGroupAdmin ||
					isBotAdmin
			});

		const imageStream =
			await createWarningImage(
				userData.profileUrl,
				warningNumber
			);

		try {

			if (imageStream) {

				await api.sendMessage(
					{
						body: warningText,
						attachment: imageStream
					},
					threadID
				);

			}
			else {

				await api.sendMessage(
					warningText,
					threadID
				);

			}

		}
		catch (error) {

			try {

				await api.sendMessage(
					warningText,
					threadID
				);

			}
			catch (e) {}

		}

		if (warningNumber < MAX_WARNING)
			return;

		data.finished = true;

		if (isGroupAdmin || isBotAdmin)
			return;

		try {

			await api.removeUserFromGroup(
				uid,
				threadID
			);

		}
		catch (error) {}

		warningData.set(key, data);
	}
};

function normalizeText(text) {

	return text
		.toLowerCase()
		.replace(/\s+/g, "")
		.replace(/[!！?？.,，。]/g, "")
		.trim();
}

function containsBadWord(text) {

	const value =
		text.toLowerCase();

	return badWords.some(
		word =>
			value.includes(
				word.toLowerCase()
			)
	);
}

function getWarningType(number) {

	if (number === 1)
		return "𝐅𝐈𝐑𝐒𝐓 𝐖𝐀𝐑𝐍𝐈𝐍𝐆";

	if (number === 2)
		return "𝐒𝐄𝐂𝐎𝐍𝐃 𝐖𝐀𝐑𝐍𝐈𝐍𝐆";

	return "𝐓𝐇𝐈𝐑𝐃 𝐖𝐀𝐑𝐍𝐈𝐍𝐆";
}

function getDate() {

	const date =
		new Date();

	const pad =
		number =>
			number
				.toString()
				.padStart(2, "0");

	return (
		`${pad(date.getDate())}/` +
		`${pad(date.getMonth() + 1)}/` +
		`${date.getFullYear()} ` +
		`${pad(date.getHours())}:` +
		`${pad(date.getMinutes())}:` +
		`${pad(date.getSeconds())}`
	);
}

function getBotAdmins() {

	const admins = [];

	try {

		if (
			global.GoatBot &&
			global.GoatBot.config &&
			Array.isArray(
				global.GoatBot.config.adminBot
			)
		) {

			admins.push(
				...global.GoatBot.config.adminBot
					.map(
						id => id.toString()
					)
			);
		}

	}
	catch (e) {}

	return admins;
}

async function getUserData(
	api,
	usersData,
	uid
) {

	let name = "𝐔𝐧𝐤𝐧𝐨𝐰𝐧";
	let profileUrl = null;

	try {

		const info =
			await api.getUserInfo(uid);

		if (
			info &&
			info[uid]
		) {

			name =
				info[uid].name ||
				name;

			profileUrl =
				info[uid].thumbSrc ||
				info[uid].profileUrl ||
				null;
		}

	}
	catch (e) {

		try {

			const data =
				await usersData.get(uid);

			name =
				data.name ||
				name;

		}
		catch (error) {}

	}

	return {
		name,
		profileUrl
	};
}

function createWarningMessage({
	name,
	uid,
	date,
	reason,
	text,
	warningNumber,
	warningType,
	isAdmin
}) {

	let statusText;

	if (warningNumber < MAX_WARNING) {

		statusText =
			"» ⚠️ পরবর্তী একই ধরনের আচরণে আরও একটি Warning দেওয়া হবে।";

	}
	else if (isAdmin) {

		statusText =
			"» 🛡️ আপনি Group Admin তাই Kick করা হবে না।\n» 🔕 এই ইউজারের জন্য Warning System এখানেই বন্ধ থাকবে।";

	}
	else {

		statusText =
			"» 🚫 ৩টি Warning পূর্ণ হলে।\n» 👢 ইউজারকে Group থেকে Remove করার হবে।";
	}

	return `

» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐖𝐀𝐑𝐍𝐈𝐍𝐆

» 👤 𝐍𝐚𝐦𝐞:
» ${name}

» 🆔 𝐑𝐞𝐚𝐥 𝐔𝐈𝐃:
» ${uid}

» ⏰ 𝐃𝐚𝐭𝐞 & 𝐓𝐢𝐦𝐞:
» ${date}

» 📌 𝐑𝐞𝐚𝐬𝐨𝐧:
» ${reason}

» 💬 𝐎𝐟𝐟𝐞𝐧𝐝𝐢𝐧𝐠 𝐌𝐞𝐬𝐬𝐚𝐠𝐞:
» ${text}

» 🚨 ${warningType}
» 📊 𝐖𝐚𝐫𝐧𝐢𝐧𝐠: ${warningNumber}/3

${statusText}

───────────────
» 🛡️ 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 𝐒𝐘𝐒𝐓𝐄𝐌
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧
`;
}

async function createWarningImage(
	profileUrl,
	warningNumber
) {

	if (!profileUrl)
		return null;

	try {

		const sharp =
			require("sharp");

		const response =
			await axios.get(
				profileUrl,
				{
					responseType: "arraybuffer"
				}
			);

		const image =
			await sharp(
				Buffer.from(
					response.data
				)
			)
			.resize(
				900,
				900,
				{
					fit: "cover"
				}
			)
			.jpeg()
			.toBuffer();

		return global.utils.getStreamFromBuffer(
			image,
			`warning-${warningNumber}.jpg`
		);

	}
	catch (error) {

		try {

			return global.utils.getStreamFromURL(
				profileUrl
			);

		}
		catch (e) {

			return null;
		}
	}
}
