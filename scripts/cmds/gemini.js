const a = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "gemini",
    aliases: ["ai","chat"],
    version: "0.0.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 3,
    role: 0,
    shortDescription: "Ask Gemini AI",
    longDescription: "Talk with Gemini AI using Aryan's updated API",
    category: "AI",
    guide: "/gemini [your question]"
  },

  onStart: async function({ api, event, args }) {
    let e;
    try {
      const apiConfig = await a.get(nix);
      e = apiConfig.data && apiConfig.data.api;
      if (!e) throw new Error("Configuration Error: Missing API in GitHub JSON.");
    } catch (error) {
      api.sendMessage("❌ Failed to fetch API configuration from GitHub.", event.threadID, event.messageID);
      return;
    }

    const p = args.join(" ");
    if (!p) return api.sendMessage("❌ Please provide a question or prompt.", event.threadID, event.messageID);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const r = await a.get(`${e}/gemini?prompt=${encodeURIComponent(p)}`);
      const reply = r.data?.response; 
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, i) => {
        if (!i) return;
        global.GoatBot.onReply.set(i.messageID, { commandName: this.config.name, author: event.senderID, baseApi: e });
      }, event.messageID);

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("⚠ Gemini API theke response pawa jachchhe na.", event.threadID, event.messageID);
    }
  },

  onReply: async function({ api, event, Reply }) {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
    const { baseApi: e } = Reply;
    if (!e) return api.sendMessage("❌ Session expired. Please start a new conversation.", event.threadID, event.messageID);

    const p = event.body;
    if (!p) return;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const r = await a.get(`${e}/gemini?prompt=${encodeURIComponent(p)}`);
      const reply = r.data?.response; 
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, i) => {
        if (!i) return;
        global.GoatBot.onReply.set(i.messageID, { commandName: this.config.name, author: event.senderID, baseApi: e });
      }, event.messageID);

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("⚠ Gemini API er response dite somossa hocchhe.", event.threadID, event.messageID);
    }
  }
};
