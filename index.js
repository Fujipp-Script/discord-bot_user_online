// index.js
const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();

const tokens = Object.keys(process.env)
  .filter(k => k.startsWith('TOKEN_') && process.env[k])
  .map(k => process.env[k]);

tokens.forEach((token, i) => {
  const client = new Client();

  client.on('ready', () => {
    console.log(`✅ Bot [${i + 1}] Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ type: 4, name: 'Ticket Only' }], // ✅ name ต้องเป็น string
      status: 'idle' // 🟡 วงกลมเหลือง
    });
  });

  client.login(token).catch(err => {
    console.error(`❌ Bot [${i + 1}] Login failed: ${err.message}`);
  });
});
