module.exports = {
	config: {
		name: "kick", 
		version: "1.7", 
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5, 
		role: 1, 
		description: {
			en: "Group member kick command." 
		},
		category: "Group Management", 
		guide: {
			en: "Usage:\n1. Mention target: {pn} @name\n2. Reply to message: {pn}" 
		}
	},

	langs: {
		en: {
			needAdmin: "বোটকে আগে গ্রুপের এডমিন বানান, নাহলে আমি কাউকে বের করতে পারবো না! ⚠️",
			noTarget: "যাকে বের করবেন তাকে মেনশন দিন অথবা তার মেসেজে রিপ্লাই দিন। 🧐",
			adminKick: "🛡️সিয়াম বস📂, 💁গ্রুপ এডমিন 🤔তোমার 🥵ধ*ন চু*সা 🦵কামলা হিসাবে রাইখা দাও😂! ❌",
			error: "🫶সিয়াম বস🛡️ বের করতে সমস্যা হচ্ছে😔। হয়তো আমার পারমিশন নেই🤧 বা ইউজারটি গ্রুপে নেই। ⚠️"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		const { threadID, messageReply, mentions } = event;

		try {
			const threadInfo = await api.getThreadInfo(threadID);
			
			const adminIDs = threadInfo.adminIDs.map(item => item.id);
			
			const botID = api.getCurrentUserID();

			if (!adminIDs.includes(botID)) {
				return message.reply(getLang("needAdmin"));
			}

			const kickUser = async (uid) => {
				if (adminIDs.includes(uid)) {
					return message.reply(getLang("adminKick"));
				}
				try {
					await api.removeUserFromGroup(uid, threadID);
				} catch (e) {
					return message.reply(getLang("error"));
				}
			};

			if (event.type === "message_reply") {
				return await kickUser(messageReply.senderID);
			}

			const uids = Object.keys(mentions);
			if (uids.length > 0) {
				for (const uid of uids) {
					await kickUser(uid);
				}
			} else {
				return message.reply(getLang("noTarget"));
			}
		} catch (err) {
			console.error(err);
			return message.reply("একটি অজানা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
		}
	}
};
