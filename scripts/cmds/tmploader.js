const fs = require("fs");
const path = require("path");

const _0x1a8f = [
  "\x74\x6d\x70",
  "\x6a\x6f\x69\x6e",
  "\x65\x78\x69\x73\x74\x73\x53\x79\x6e\x63",
  "\x72\x65\x61\x64\x64\x69\x72\x53\x79\x6e\x63",
  "\x66\x69\x6c\x74\x65\x72",
  "\x65\x6e\x64\x73\x57\x69\x74\x68",
  "\x72\x65\x73\x6f\x6c\x76\x65",
  "\x63\x61\x63\x68\x65",
  "\x63\x6f\x6e\x66\x69\x67",
  "\x6e\x61\x6d\x65",
  "\x47\x6f\x61\x74\x42\x6f\x74",
  "\x63\x6f\x6d\x6d\x61\x6e\x64\x73",
  "\x73\x65\x74",
  "\x61\x6c\x69\x61\x73\x65\x73",
  "\x69\x73\x41\x72\x72\x61\x79",
  "\x63\x61\x74\x65\x67\x6f\x72\x79",
  "\x65\x76\x65\x6e\x74\x73",
  "\x6f\x6e\x45\x76\x65\x6e\x74",
  "\x65\x76\x65\x6e\x74\x43\x6f\x6d\x6d\x61\x6e\x64\x73",
  "\x74\x6d\x70\x6c\x6f\x61\x64\x65\x72",
  "\x31\x2e\x30\x2e\x30",
  "\x73\x79\x73\x74\x65\x6d",
  "\x61\x64\x6d\x69\x6e\x42\x6f\x74",
  "\x69\x6e\x63\x6c\x75\x64\x65\x73",
  "\x73\x65\x6e\x64\x65\x72\x49\x44",
  "\x72\x65\x70\x6c\x79"
];

const _0x3b92 = path[_0x1a8f[1]](__dirname, _0x1a8f[0]);

function _0x5c1d() {
  try {
    if (!fs[_0x1a8f[2]](_0x3b92)) return;
    const _0x4e21 = fs[_0x1a8f[3]](_0x3b92)[_0x1a8f[4]](_0x2a10 => _0x2a10[_0x1a8f[5]]("\x2e\x6a\x73"));
    _0x4e21.forEach(_0x18f9 => {
      const _0x5f3a = path[_0x1a8f[1]](_0x3b92, _0x18f9);
      try {
        delete require[_0x1a8f[7]][require[_0x1a8f[6]](_0x5f3a)];
        const _0x9d4e = require(_0x5f3a);
        if (!_0x9d4e || !_0x9d4e[_0x1a8f[8]] || !_0x9d4e[_0x1a8f[8]][_0x1a8f[9]]) return;
        const _0x23bc = _0x9d4e[_0x1a8f[8]][_0x1a8f[9]];
        global[_0x1a8f[10]][_0x1a8f[11]][_0x1a8f[12]](_0x23bc, _0x9d4e);
        if (_0x9d4e[_0x1a8f[8]][_0x1a8f[13]] && Array[_0x1a8f[14]](_0x9d4e[_0x1a8f[8]][_0x1a8f[13]])) {
          for (const _0x11ab of _0x9d4e[_0x1a8f[8]][_0x1a8f[13]]) {
            global[_0x1a8f[10]][_0x1a8f[13]][_0x1a8f[12]](_0x11ab, _0x23bc);
          }
        }
        if (_0x9d4e[_0x1a8f[8]][_0x1a8f[15]] === _0x1a8f[16] || _0x9d4e[_0x1a8f[17]]) {
          global[_0x1a8f[10]][_0x1a8f[18]][_0x1a8f[12]](_0x23bc, _0x9d4e);
        }
      } catch (_0x3e11) {}
    });
  } catch (_0x140e) {}
}

_0x5c1d();

module.exports = {
  config: {
    name: _0x1a8f[19],
    version: _0x1a8f[20],
    author: "\u0660\u1d7d\u{1D54A}\u{1D54A}\u{1D55A}\u{1D552}\u{1D55E}-\u{1D549}\u{1D552}\u{1D54A}\u{1D552}\u{1D54F}",
    category: _0x1a8f[21],
    role: 2
  },

  onStart: async function ({ event, message }) {
    const _0x12ab = global[_0x1a8f[10]][_0x1a8f[8]][_0x1a8f[22]] || [];
    const _0x45cd = event[_0x1a8f[24]];
    
    if (!_0x12ab[_0x1a8f[23]](_0x45cd)) {
      return message[_0x1a8f[25]]("\u1D40\u1D53\u1D43\u1D57\u02E2\u1D43\u1D42\u1D57\u1D42\u1D57\u1D5B\u02E2\x20\u1D2C\u1D4A\u1D4B\u02E2\u0020\u1D30\u1D52\u0020\u1D3F\u1D43\u1D52\u1D42\u1D57\u02E2\x20\u1D57\u02E2\u1D43\x20\u1D3F\u1D52\u1D52\u1D58\u1D38\u0021");
    }

    _0x5c1d();
    return message[_0x1a8f[25]]("\u2705\x20\u1D33\u1D38\u1D39\x20\u1D32\u1D3A\u1D38\u1D30\u1D31\u1D3F\x20\u1D2C\u1D38\u1D34\u1D38\x20\u1D2C\u1D38\u1D34\u1D38\u1D30\u1D31\x20\u1D30\u1D31\u1D3B\u1D3A\u1D2C\u1D30\u1D31\u1D30\x20\u1D30\u1D34\u1D2C\u1D31\u1D2C\x21");
  }
};
