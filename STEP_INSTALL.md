𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 V2
STEP-BY-STEP INSTALL GUIDE

এই গাইডে 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 V2 সেটআপ, Render-এ ডিপ্লয় এবং UptimeRobot দিয়ে মনিটর করার সম্পূর্ণ নিয়ম দেখানো হয়েছে।

১) Github Repository Import

১. Github-এ লগইন করুন।
২. New Repository → Import Repository নির্বাচন করুন।
৩. Repository Link:
"https://github.com/mdakashproject/GOAT-BOT-AKASH-V2.git"
৪. Private Repository নির্বাচন করুন।
৫. Begin Import-এ ক্লিক করুন।

নোট: আপনার নিজস্ব Private Repository তৈরি হয়ে যাবে।

২) Config.json Setup

config.json ফাইলটি এডিট করে নিচের তথ্য বসান:

{
  "nickNameBot": "𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓",
  "adminBot": [
    "100078049308655",
    "61577213967981"
  ],
  "uid": "YOUR_FB_UID"
}

nickNameBot → বটের নাম
adminBot → অ্যাডমিনদের Facebook ID
uid → আপনার Facebook UID

৩) Facebook Cookie Export

১. C3C FBState Utility Extension ইনস্টল করুন।
২. বট চালানোর Facebook Account-এ লগইন করুন।
৩. Extension দিয়ে JSON Cookie Export করুন।
৪. Copy করা JSON টি account.txt-এ Paste করুন।

নোট: account.txt কখনো কারও সাথে শেয়ার করবেন না।

৪) Deploy on Render

১. Render.com-এ লগইন করুন।
২. New Web Service → Connect Github Repo নির্বাচন করুন।
৩. প্রয়োজনে .env Variables সেট করুন।
৪. Deploy-এ ক্লিক করুন।
৫. Deploy সম্পন্ন হলে Render URL কপি করুন।

৫) Monitor with UptimeRobot

১. UptimeRobot.com-এ লগইন করুন।
২. Add New Monitor → HTTP(S) নির্বাচন করুন।
৩. Render URL Paste করুন।
৪. Check Interval (যেমন 5 Minutes) সেট করুন।
৫. Create Monitor-এ ক্লিক করুন।

নোট: আপনার বট 24/7 চালু থাকবে এবং UptimeRobot দ্বারা মনিটর হবে।

অভিনন্দন!
আপনি সফলভাবে 𝐒𝐈𝐘𝐌-𝐇𝐀𝐒𝐀𝐍 V2 সেটআপ করেছেন। আপনার Bot এখন Running এবং Admin ID সক্রিয়।

━━━━━━━━━━━━━━━━━━━━

𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 V2
STEP-BY-STEP INSTALL GUIDE

SET UP 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 V2, DEPLOY ON RENDER & MONITOR WITH UPTIMEROBOT

1. IMPORT REPOSITORY
• Log in to Github
• Open New Repository → Import Repository
• Repository:
"https://github.com/mdakashproject/GOAT-BOT-AKASH-V2.git"
• Select Private Repository
• Click Begin Import

2. CONFIGURE CONFIG.JSON

{
  "nickNameBot": "𝆠፝𝐍𝐈𝐉𝐇𝐔𝐌-𝐂𝐇𝐀𝐓-𝐁𝐎𝐓",
  "adminBot": [
    "100078049308655",
    "61577213967981"
    ],
  "uid": "YOUR_FB_UID"
}

nickNameBot → Bot Name
adminBot → Admin Facebook IDs
uid → Your Facebook UID

3. EXPORT FACEBOOK COOKIE
• Install C3C FBState Utility Extension
• Log in to your Facebook Account
• Export JSON Cookie
• Paste it into account.txt

Keep account.txt private.

4. DEPLOY ON RENDER
• Log in to Render.com
• New Web Service → Connect Github Repo
• Set .env Variables if needed
• Click Deploy
• Copy your Render URL

5. MONITOR WITH UPTIMEROBOT
• Log in to UptimeRobot.com
• Add New Monitor → HTTP(S)
• Paste Render URL
• Set Check Interval (5 Minutes)
• Click Create Monitor

CONGRATULATIONS!
𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 V2 is now successfully installed and running.
