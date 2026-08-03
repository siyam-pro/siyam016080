const fs = require("fs-extra");
const path = require("path");
const { loadImage, createCanvas } = require("canvas");

/* =========================
   🔒 AUTHOR LOCK
========================= */
const ORIGINAL_AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const LOCK_KEY = "TTT_v3.0_LOCK";

if (module.exports?.config && module.exports.config?.author && module.exports.config.author !== ORIGINAL_AUTHOR) {
  throw new Error("❌ Author Lock Triggered: Unauthorized author change detected!");
}

const AIMove = { current: null };

function startBoard(isX) {
  return {
    board: Array.from({ length: 3 }, () => Array(3).fill(0)),
    isX,
    gameOn: true,
    gameOver: false,
    lock: LOCK_KEY
  };
}

/* =========================
   BOARD RENDER
========================= */
async function displayBoard(data) {
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  const imgPath = path.join(cacheDir, `ttt-${Date.now()}.png`);
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
  const O = await loadImage("https://i.postimg.cc/rFP6xLXQ/O.png");
  const X = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

  ctx.drawImage(bg, 0, 0, 1200, 1200);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const piece = data.board[i][j];
      const x = 54 + 366 * j;
      const y = 54 + 366 * i;

      if (piece === 1) ctx.drawImage(data.isX ? O : X, x, y, 360, 360);
      if (piece === 2) ctx.drawImage(data.isX ? X : O, x, y, 360, 360);
    }
  }

  fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));
  return fs.createReadStream(imgPath);
}

/* =========================
   GAME LOGIC
========================= */
function getAvailable(data) {
  const moves = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!data.board[i][j]) moves.push([i, j]);
  return moves;
}

function placeMove(point, player, data) {
  data.board[point[0]][point[1]] = player;
}

function checkWin(board, player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(v => v === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  if ([0, 1, 2].every(i => board[i][i] === player)) return true;
  if ([0, 1, 2].every(i => board[i][2 - i] === player)) return true;
  return false;
}

function solveAIMove(depth, turn, data) {
  if (checkWin(data.board, 1)) return 1;
  if (checkWin(data.board, 2)) return -1;

  const moves = getAvailable(data);
  if (!moves.length) return 0;

  let max = -Infinity;
  let min = Infinity;

  for (const move of moves) {
    placeMove(move, turn, data);
    const score = solveAIMove(depth + 1, turn === 1 ? 2 : 1, data);

    if (turn === 1) {
      if (score > max) {
        max = score;
        if (depth === 0) AIMove.current = move;
      }
    } else {
      min = Math.min(min, score);
    }

    placeMove(move, 0, data);
  }

  return turn === 1 ? max : min;
}

function movePlayer(x, y, data) {
  if (data.board[x][y] !== 0) return "This box is already taken!";
  placeMove([x, y], 2, data);
  if (!checkWin(data.board, 2) && getAvailable(data).length > 0) {
    solveAIMove(0, 1, data);
    if (AIMove.current) placeMove(AIMove.current, 1, data);
  }
  return null;
}

function checkDraw(data) {
  return getAvailable(data).length === 0 &&
    !checkWin(data.board, 1) &&
    !checkWin(data.board, 2);
}

function AIStart(data) {
  const move = [
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3)
  ];
  placeMove(move, 1, data);
}

/* =========================
   EXPORT MODULE
========================= */
module.exports = {
  config: {
    name: "ttt",
    version: "3.2",
    author: ORIGINAL_AUTHOR,
    role: 0,
    shortDescription: "Play Tic Tac Toe vs AI or Friend",
    longDescription: "Interactive Tic Tac Toe game with canvas graphics",
    category: "game",
    guide: "{p}ttt x|o OR {p}ttt --mode 2 @mention OR {p}ttt delete"
  },

  onStart: async function ({ message, args, event }) {
    const { threadID, senderID, mentions, body } = event;

    // 🛑 অতিরিক্ত লেখা থাকলে বট চুপ থাকবে
    if (body) {
      const validCommands = [this.config.name];
      const isExactMatch = validCommands.some(cmd => {
        const regex = new RegExp(`^(\\W+)?${cmd}(\\s+.*)?$`, "i");
        return regex.test(body.trim());
      });

      if (!isExactMatch) return;
    }

    global.GoatBot.tictactoe ??= new Map();
    global.GoatBot.tictactoeMultiplayer ??= new Map();

    if (args[0] === "delete") {
      global.GoatBot.tictactoe.delete(threadID);
      global.GoatBot.tictactoeMultiplayer.delete(threadID);
      const delMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🗑️ 𝐆𝐚𝐦𝐞 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐝𝐞𝐥𝐞𝐭𝐞𝐝!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(delMsg);
    }

    if (args[0] === "--mode" && args[1] === "2") {
      const mentionID = Object.keys(mentions || {})[0];
      if (!mentionID || mentionID === senderID) {
        const mentionError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 
» 🦉 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐮𝐬𝐞𝐫!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
        return message.reply(mentionError);
      }

      const data = {
        board: Array.from({ length: 3 }, () => Array(3).fill(0)),
        player1: senderID,
        player2: mentionID,
        currentTurn: senderID,
        gameOn: true
      };

      global.GoatBot.tictactoeMultiplayer.set(threadID, data);
      const img = await displayBoard(data);

      const startMultiMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎮 𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫 
» ⚔️ 𝐆𝐚𝐦𝐞 𝐒𝐭𝐚𝐫𝐭𝐞𝐝!
» 📌 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 (𝟏-𝟗) 
» 🦃 𝐭𝐨 𝐦𝐚𝐤𝐞 a 𝐦𝐨𝐯𝐞.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply({ body: startMultiMsg, attachment: img }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "ttt",
          multiplayer: true,
          author: senderID
        });
      });
    }

    if (global.GoatBot.tictactoe.get(threadID)?.gameOn) {
      const runningError = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐀 𝐠𝐚𝐦𝐞 𝐢𝐬 
» ☑️ 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐫𝐮𝐧𝐧𝐢𝐧𝐠!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(runningError);
    }

    const choice = (args[0] || "").toLowerCase();
    const isX = choice === "x";
    const data = startBoard(isX);

    if (!isX) AIStart(data);

    global.GoatBot.tictactoe.set(threadID, data);
    const img = await displayBoard(data);

    const startAIMsg = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🎮 𝐆𝐚𝐦𝐞 𝐒𝐭𝐚𝐫𝐭𝐞𝐝 𝐯𝐬 𝐀𝐈!
» 📌 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 (𝟏-𝟗) 𝐭𝐨 
» 🎰 𝐦𝐚𝐤𝐞 a 𝐦𝐨𝐯𝐞.
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply({ body: startAIMsg, attachment: img }, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "ttt",
        multiplayer: false,
        author: senderID
      });
    });
  },

  onReply: async function ({ message, event, Reply }) {
    const { threadID, senderID, body } = event;

    const num = parseInt(body.trim());
    if (isNaN(num) || num < 1 || num > 9) {
      const invalidNum = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐨𝐨𝐬𝐞 a 
» 🎀 𝐧𝐮𝐦𝐛𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟏-𝟗!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(invalidNum);
    }

    const row = Math.floor((num - 1) / 3);
    const col = (num - 1) % 3;

    /* ================= AI MODE ================= */
    if (!Reply.multiplayer) {
      const data = global.GoatBot.tictactoe.get(threadID);
      if (!data) return;

      const res = movePlayer(row, col, data);
      if (res) return message.reply(res);

      let statusMsg = "» 📌 Your Move!";

      if (checkWin(data.board, 2)) {
        statusMsg = "» 🏆 🎉 𝐘𝐨𝐮 𝐖𝐨𝐧 𝐚𝐠𝐚𝐢𝐧𝐬𝐭 𝐀𝐈!";
        global.GoatBot.tictactoe.delete(threadID);
      } else if (checkWin(data.board, 1)) {
        statusMsg = "» 🤖 🤖 𝐀𝐈 𝐖𝐨𝐧 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞!";
        global.GoatBot.tictactoe.delete(threadID);
      } else if (checkDraw(data)) {
        statusMsg = "» 🤝 𝐈𝐭'𝐬 𝐚 𝐃𝐫𝐚𝐰!";
        global.GoatBot.tictactoe.delete(threadID);
      }

      const img = await displayBoard(data);

      const aiResponse = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
${statusMsg}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      return message.reply({ body: aiResponse, attachment: img }, (err, info) => {
        if (global.GoatBot.tictactoe.has(threadID)) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "ttt",
            multiplayer: false,
            author: senderID
          });
        }
      });
    }

    /* ================= MULTIPLAYER ================= */
    const data = global.GoatBot.tictactoeMultiplayer.get(threadID);
    if (!data) return;

    if (senderID !== data.currentTurn) {
      const notTurn = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐈𝐭 𝐢𝐬 𝐧𝐨𝐭 𝐲𝐨𝐮𝐫 𝐭𝐮𝐫𝐧!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(notTurn);
    }

    if (data.board[row][col] !== 0) {
      const takenBox = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ 𝐓𝐡𝐢𝐬 𝐛𝐨𝐱 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐭𝐚𝐤𝐞𝐧!
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;
      return message.reply(takenBox);
    }

    const currentPlayerNum = data.currentTurn === data.player1 ? 1 : 2;
    data.board[row][col] = currentPlayerNum;

    let statusMsg = "» 🎲 Next turn!";

    if (checkWin(data.board, currentPlayerNum)) {
      statusMsg = `» 🏆 🎉 Player <@${senderID}> 𝐖𝐨𝐧!`;
      global.GoatBot.tictactoeMultiplayer.delete(threadID);
    } else if (checkDraw(data)) {
      statusMsg = "» 🤝 𝐈𝐭'𝐬 𝐚 𝐃𝐫𝐚𝐰!";
      global.GoatBot.tictactoeMultiplayer.delete(threadID);
    } else {
      data.currentTurn = data.currentTurn === data.player1 ? data.player2 : data.player1;
    }

    const img = await displayBoard(data);

    const multiResponse = 
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
${statusMsg}
───────────────
» 🧚‍♀️ ‿𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    return message.reply({ body: multiResponse, attachment: img }, (err, info) => {
      if (global.GoatBot.tictactoeMultiplayer.has(threadID)) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "ttt",
          multiplayer: true,
          author: senderID
        });
      }
    });
  }
};
