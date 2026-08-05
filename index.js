/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const express = require("express");
const log = require("./logger/log.js");

// ==========================================
// ১. Uptime Server (বটকে ২৪/৭ অনলাইন রাখার জন্য)
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Bot is running active & online with Self-ID Command Support!");
});

app.listen(PORT, () => {
	console.log(`[ UPTIME ] Server running on port ${PORT}`);
});

// ==========================================
// ২. Self-ID Command Auto-Fix (স্বয়ংক্রিয় মডিফিকেশন)
// ==========================================
function applySelfIDPatch() {
	try {
		const targetFiles = [
			path.join(__dirname, "bot", "handler", "handlerCheckData.js"),
			path.join(__dirname, "bot", "handler", "handlerEvents.js"),
			path.join(__dirname, "bot", "handler", "handlerAction.js")
		];

		targetFiles.forEach((filePath) => {
			if (fs.existsSync(filePath)) {
				let content = fs.readFileSync(filePath, "utf-8");
				
				// বটের নিজস্ব আইডি ইগনোর করার লাইনগুলোকে নিষ্ক্রিয় (Comment out) বা বাইপাস করা
				if (content.includes("senderID == api.getCurrentUserID()") || content.includes("senderID === api.getCurrentUserID()")) {
					content = content.replace(
						/if\s*\(\s*senderID\s*===?\s*api\.getCurrentUserID\(\)\s*\)\s*return;/g,
						"/* Self-ID check bypassed by index.js */"
					);
					content = content.replace(
						/if\s*\(\s*event\.senderID\s*===?\s*api\.getCurrentUserID\(\)\s*\)\s*return;/g,
						"/* Self-ID check bypassed by index.js */"
					);
					fs.writeFileSync(filePath, content, "utf-8");
				}
			}
		});
		log.info("Self-ID Command Patch applied successfully!");
	} catch (err) {
		// ফাইল প্যাচ করতে সমস্যা হলে সাধারণ নিয়ম অনুসরণ করবে
	}
}

// ==========================================
// ৩. মূল বট প্রসেস স্টার্টার
// ==========================================
function startProject() {
	// প্রজেক্ট শুরু করার আগেই স্বয়ংক্রিয়ভাবে প্যাচ অ্যাপ্লাই হবে
	applySelfIDPatch();

	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code === 2) {
			log.info("Restarting Project...");
			startProject();
		}
	});
}

startProject();
