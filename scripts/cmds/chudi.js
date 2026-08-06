module.exports.config = {
    name: "chudi",
    version: "1.6",
    role: 2,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    description: "Fast tag Banglish list (1-2 seconds gap)",
    category: "nsfw",
    guide: "{pn} @mention ba message-e reply din",
    coolDown: 10
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID, mentions, type, messageReply } = event;

    let targetID, name;

    if (type === "message_reply") {
        targetID = messageReply.senderID;
    } 
    else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
    }

    if (!targetID) {
        return api.sendMessage("বস যে মেয়েকে চুদ্দে চাউ তার আইডি @ম্যানশন দেউ", threadID, messageID);
    }

    const userInfo = await api.getUserInfo(targetID);
    name = userInfo[targetID].name;

    const arraytag = [{ id: targetID, tag: name }];
    const a = (msg) => api.sendMessage(msg, threadID);

    a("বস 𓆩亗𝐃𝐒 乂𝐒𝐈𝐘𝐀𝐌亗𓆪 এর চুদা লো-🖕🥵");

    // Fast Banglish List (1-2 seconds interval)
setTimeout(() => {a({body: "খাংকির মেয়ে তর মারে চুদি 🥰।" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "খাংকির মেয়ে তর কচি বোন রে চুদি 😍.." + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "মাদারচোদ তর আম্মু পম পম খাংকির পো 🐰" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "খাংকির মেয়ে তর কচি ভুদায় ভুদায় কামর দিমু  💔!" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "খাংকি মাগির মেয়ে কথা ক কম কম তর আম্মু রে চুদে বানামু আইটেম বোম " + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "তর আম্মু রে আচার এর লোভ দেখি চুদি মাগির মেয়ে🤬" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "বান্দির মেয়ে তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "বান্দি মাগির মেয়ে তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে  🤝" + " " + name, mentions: arraytag})},23000);
setTimeout(() => {a({body: "উফফফ খাদ্দামা মাগির মেয়ে তর আম্মুর কালা ভুদায় আমার মাল আউট তর কচি বোন রে উপ্তা করে এবার চুদবো  💉।" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "অনলাইনে গালি বাজ হয়ে গেছত মাগির মেয়ে এমন চুদা দিমু লাইফ টাইম মনে রাখবি ফারহান বস তর বাপ মাগির মেয়ে 😘।" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋" + " " + name, mentions: arraytag})},31000);
setTimeout(() => {a({body: " হাই মাদারচোদ তর তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি " + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a("~ চুদা কি আরো খাবি মাগির পোল 🤖")} , 39000);
setTimeout(() => {a({body: "খাংকির মেয়ে 🥰।" + " " + name, mentions: arraytag})}, 42000);
setTimeout(() => {a({body: "মাদারচোদ😍.." + " " + name, mentions: arraytag})}, 48000);
setTimeout(() => {a({body: "ব্যাস্যার মেয়ে 🐰" + " " + name, mentions: arraytag})}, 51000);
setTimeout(() => {a({body: "ব্যাশ্যা মাগির মেয়ে  💔!" + " " + name, mentions: arraytag})}, 54000);
setTimeout(() => {a({body: "পতিতা মাগির মেয়ে " + " " + name, mentions: arraytag})}, 57000);
setTimeout(() => {a({body: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + name, mentions: arraytag})}, 59400);
setTimeout(() => {a({body: "তর মারে চুদি" + " " + name, mentions: arraytag})}, 63000);
setTimeout(() => {a({body: "নাট বল্টু মাগির মেয়ে🤟" + " " + name, mentions: arraytag})}, 66000);
setTimeout(() => {a({body: "তর বোন রে পায়জামা খুলে চুদি 🤣" + " " + name, mentions: arraytag})},69000);
setTimeout(() => {a({body: "উম্মম্মা তর বোন এরকচি ভুদায়💉।" + " " + name, mentions: arraytag})}, 72000);
setTimeout(() => {a({body: "DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম।" + " " + name, mentions: arraytag})}, 75000);
setTimeout(() => {a({body: "কামলা মাগির মেয়ে  ✋" + " " + name, mentions: arraytag})},81000);
setTimeout(() => {a({body: " বাস্ট্রাড এর বাচ্ছা বস্তির মেয়ে " + " " + name, mentions: arraytag})}, 87000);
setTimeout(() => {a("~ আমার জারজ শন্তান🤖")} , 93000);
setTimeout(() => {a({body: "Welcome মাগির মেয়ে 🥰।" + " " + name, mentions: arraytag})}, 99000);
setTimeout(() => {a({body: "তর কচি বোন এর পম পম😍.." + " " + name, mentions: arraytag})}, 105000);
setTimeout(() => {a({body: "ব্যাস্যার মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰" + " " + name, mentions: arraytag})}, 111000);
setTimeout(() => {a({body: "Hi ফারহান এর জারজ মাগির মেয়ে  💔!" + " " + name, mentions: arraytag})}, 114000);
setTimeout(() => {a({body: "২০ টাকা এ পতিতা মাগির মেয়ে " + " " + name, mentions: arraytag})}, 120000);
setTimeout(() => {a({body: "depression থেকেও তর মাইরে চু*** দি 🤬 " + " " + name, mentions: arraytag})}, 126000);
setTimeout(() => {a({body: "বস্তির মেয়ে অনলাইনের কিং" + " " + name, mentions: arraytag})}, 132000);
setTimeout(() => {a({body: "টুকাই মাগির মেয়ে🤟" + " " + name, mentions: arraytag})}, 138000);
setTimeout(() => {a({body: "তর আম্মু রে পায়জামা খুলে চুদি 🤣" + " " + name, mentions: arraytag})},144000);
setTimeout(() => {a({body: "উম্মম্মা তর বোন এরকচি ভুদায়💉।" + " " + name, mentions: arraytag})}, 150000);
setTimeout(() => {a({body: "DNA টেষ্ট করা দেখবি আমার চুদা তেই তর জন্ম।" + " " + name, mentions: arraytag})}, 156000);
setTimeout(() => {a({body: "হিজলা মাগির মেয়ে  ✋" + " " + name, mentions: arraytag})},162000);
setTimeout(() => {a({body: " বস্তিরন্দালাল এর বাচ্ছা বস্তির মেয়ে " + " " + name, mentions: arraytag})}, 168000);
setTimeout(() => {a("~ আমার জারজ শন্তান জা ভাগ🤖")} , 171000);
setTimeout(() => {a({body: "Welcome শুয়োরের বাচ্চা 🥰।" + " " + name, mentions: arraytag})}, 174000);
setTimeout(() => {a({body: "কুত্তার বাচ্ছা তর কচি বোন এর পম পম😍.." + " " + name, mentions: arraytag})}, 177000);
setTimeout(() => {a({body: "খাঙ্কির মেয়ে মেয়ে কথা শুন তর আম্মু রে চুদি গামছা পেচিয়ে🐰" + " " + name, mentions: arraytag})}, 180000);
setTimeout(() => {a({body: "Hi বস ফারহান এর জারজ মেয়ে মাগির মেয়ে  💔!" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "খান্কি মাগির মেয়ে " + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "তোর বাপে তোর নানা। 🤬 " + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "বস্তির মেয়ে তোর বইনরে মুসলমানি দিমু।" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "টুকাই মাগির মেয়ে মোবাইল ভাইব্রেশন কইরা তুর কচি বোন এর পুকটিতে ভরবো।🤟" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "তোর মুখে হাইগ্যা দিমু। 🤣" + " " + name, mentions: arraytag})},23000);
setTimeout(() => {a({body: "কুত্তার পুকটি চাটামু💉।" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "তর আম্মুর হোগা দিয়া ট্রেন ভইরা দিমু।।" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "হিজলা মাগির মেয়ে হাতির ল্যাওড়া দিয়া তর মায়েরে চুদুম।  ✋" + " " + name, mentions: arraytag})},31000);
setTimeout(() => {a({body: "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু। " + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a("~ আমার ফাটা কন্ডমের ফসল। জা ভাগ🤖")} , 39000);
setTimeout(() => {a({body: "Welcome শুয়োরের বাচ্চা 🥰।" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "কুত্তার বাচ্ছা তর বৌন ভোদায় মাগুর মাছ চাষ করুম।😍.." + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "খাঙ্কিরমেয়ে মেয়ে তর বোনের  হোগায় ইনপুট, তর মায়ের ভোদায় আউটপুট।🐰" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "তর মায়ের ভোদা বোম্বাই মরিচ দিয়া চুদামু।💔!" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "খান্কি মাগির মেয়ে তর মায়ের ভোদা শিরিষ কাগজ দিয়া ঘইষা দিমু। " + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "জং ধরা লোহা দিয়া পাকিস্তানের মানচিত্র বানাই্য়া তোদের পিছন দিয়া ঢুকামু।🤬 " + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "বস্তির মেয়ে তর মায়ের ভুদাতে পোকা।" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "টুকাই মাগির মেয়ে তর মার ভোদায় পাব্লিক টয়লেট।🤟" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "তোর মুখে হাইগ্যা দিমু। ভুস্কি মাগির মেয়ে 🤣" + " " + name, mentions: arraytag})},23000);
setTimeout(() => {a({body: "কান্দে ফালাইয়া তর মায়েরে চুদি💉।" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "তর আম্মুর উপ্তা কইরা চুদা দিমু।।" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "হিজলা মাগির মেয়ে বালি দিয়া চুদমু তরে খাঙ্কি মাগী!তর মাকে।  ✋" + " " + name, mentions: arraytag})},31000);
setTimeout(() => {a({body: "তর বোন ভোদা ছিল্লা লবণ লাগায় দিমু। " + " " + name, mentions: arraytag})}, 36000);
setTimeout(() => {a("~ আমার মেয়ে। জা ভাগ🤖")} , 39000);




    } 
