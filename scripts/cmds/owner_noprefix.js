const OWNER_UID = "61592677587804";
// Global Memory State and Garbage Collection Initialization

if (!global.__SiyamSpamRegistry) global.__SiyamSpamRegistry = new Map();

if (!global.__SiyamCacheState) {

  global.__SiyamCacheState = {

    commandsList: [],

    lastCount: 0

  };

}
// Single Interval Memory Cleaner (Memory Leak & Pressure Protection)

if (!global.__SiyamGcInterval) {

  global.__SiyamGcInterval = setInterval(() => {

    const now = Date.now();

    for (const [key, timestamp] of global.__SiyamSpamRegistry.entries()) {

      if (now - timestamp > 10000) {

        global.__SiyamSpamRegistry.delete(key);

      }

    }

  }, 60000); // Sweeps background memory every 1 minute

}
/**

 * Professional Level-Based Logging System

 */

const logger = {

  info: (msg) => console.log(`\x1b[36m[OWNER_NOPREFIX][INFO]\x1b[0m ${msg}`),

  warn: (msg) => console.warn(`\x1b[33m[OWNER_NOPREFIX][WARN]\x1b[0m ${msg}`),

  error: (msg, err) => console.error(`\x1b[31m[OWNER_NOPREFIX][ERROR]\x1b[0m ${msg}`, err || "")

};
/**

 * Dynamic and Validated Unique Command Cache Refresher

 */

function validateAndRefreshCache(commands) {

  const currentCount = commands.size;

  

  if (global.__SiyamCacheState.lastCount === currentCount && global.__SiyamCacheState.commandsList.length > 0) {

    return;

  }

  const uniqueCmdSet = new Set();

  commands.forEach((cmd) => {

    const name = cmd.config?.name?.trim()?.toLowerCase();

    if (name) uniqueCmdSet.add(name);

    if (Array.isArray(cmd.config?.aliases)) {

      cmd.config.aliases.forEach((alias) => {

        const cleanAlias = alias?.trim()?.toLowerCase();

        if (cleanAlias) uniqueCmdSet.add(cleanAlias);

      });

    }

  });

  global.__SiyamCacheState.commandsList = Array.from(uniqueCmdSet);

  global.__SiyamCacheState.lastCount = currentCount;

  logger.info(`Dynamic Command Cache Rebuilt. Total Unique Entries: ${uniqueCmdSet.size}`);

}
module.exports = {

  config: {

    name: "owner_noprefix",

    version: "3.0.3",

    author: "👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",

    role: 0,

    shortDescription: "Enterprise Owner No-Prefix Engine",

    longDescription: "Production ready system with dynamic caching and strict duplicate prevention filters.",

    category: "system"

  },

  langs: {
    en: {
      returnListClean: " "
    },
    vi: {
      returnListClean: " "
    }
  },

  onStart: async function () {

    return;

  },

  onChat: async function (O) {

    const { event } = O;

    const rawBody = event.body;

    // Input Sanitization

    if (!rawBody || typeof rawBody !== "string") return;

    const body = rawBody.trim();

    if (!body) return;

    const senderID = String(event.senderID);

    const botAdmins = (global.GoatBot?.config?.adminBot || []).map(id => String(id));

    // Instantly exit if sender is not the Owner or a Bot Admin

    if (senderID !== OWNER_UID && !botAdmins.includes(senderID)) return;

    // 🛑 প্রিফিক্স থাকলে এই ফাইলের কোনো কাজ থাকবে না (ডাবল রেসপন্স রিমুভ)

    const botPrefix = global.GoatBot?.config?.prefix || "/";

    if (body.startsWith(botPrefix)) return;

    try {

      if (!global.GoatBot || !global.GoatBot.commands) {

        logger.error("Critical core error: global.GoatBot.commands execution tree is unavailable");

        return;

      }

      // ডিরেক্ট মেসেজ বডি থেকে কমান্ড ও আর্গুমেন্ট আলাদা করা

      const args = body.split(/\s+/);

      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      const commands = global.GoatBot.commands;

      // Case-insensitive command and alias resolution

      const command = commands.get(commandName) || [...commands.values()].find(

        cmd => Array.isArray(cmd.config?.aliases) && 

        cmd.config.aliases.map(a => String(a).toLowerCase()).includes(commandName)

      );

      // ────────────────────────────────────────────────────────

      // 🚫 COMMAND NOT FOUND (Silent Exit - No Message, Completely Silent)

      // ────────────────────────────────────────────────────────

      if (!command) {

        const currentTime = Date.now();

        const spamKey = `${senderID}_${commandName}`;

        if (global.__SiyamSpamRegistry.has(spamKey)) {

          const lastTime = global.__SiyamSpamRegistry.get(spamKey);

          if (currentTime - lastTime < 10000) {

            return;

          }

        }

        global.__SiyamSpamRegistry.set(spamKey, currentTime);

        validateAndRefreshCache(commands);

        

        return; 

      }

      // ────────────────────────────────────────────────────────

      // ⚠️ DISABLED COMMAND GATEWAY

      // ────────────────────────────────────────────────────────

      const disabledCommands = global.GoatBot?.config?.commandDisabled || [];

      if (disabledCommands.includes(command.config?.name)) {

        return;

      }

      // ────────────────────────────────────────────────────────

      // 🚀 SECURE COMMAND EXECUTION PIPELINE

      // ────────────────────────────────────────────────────────

      if (typeof command.onStart !== "function") {

        logger.warn(`Execution blocked: onStart function is missing in [${commandName}] module.`);

        return;

      }

      // Context preservation using GoatBot parameters

      const clonedParams = {

        ...O,

        args,

        commandName: command.config?.name || commandName

      };

      try {

        await command.onStart(clonedParams);

        logger.info(`SUCCESS: No-Prefix [${commandName}] successfully invoked by: ${senderID}`);

      } catch (execError) {

        logger.error(`Core crash caught inside command [${commandName}] ->`, execError);

      }

    } catch (err) {

      logger.error("Unhandled runtime exception safely caught ->", err.message || err);

    }

  }

};
