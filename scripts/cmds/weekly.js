const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "weekly",
    version: "1.2",
    author: "Shikaki",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Nhận quà hàng tuần",
      en: "Receive weekly gift",
    },
    longDescription: {
      vi: "Nhận quà hàng tuần",
      en: "Receive weekly gift",
    },
    category: "game",
    guide: {
      vi: "   {pn}: Nhận quà hàng tuần" + "\n   {pn} info: Xem thông tin quà hàng tuần",
      en: "   {pn}" + "\n   {pn} info: View weekly gift information",
    },
  },

  langs: {
    vi: {
      alreadyReceived: "Bạn đã nhận quà hàng tuần",
      received: "Bạn đã nhận được %1 coin và %2 exp",
      monday: "Thứ Hai",
    },
    en: {
      alreadyReceived: "You have already received the weekly gift.",
      received: "You have received $ %1 and %2 exp.",
      monday: "Monday",
    },
  },

  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const reward = {
      coin: 50000,
      exp: 5000,
    };

    if (args[0] === "info") {
      const day = getLang("monday");
      const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** 0);
      const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** 0);
      const msg = `
📆 ${day} Weekly Reward:
💰 ${getCoin} coin
🌟 ${getExp} exp
`;
      return message.reply(msg);
    }

    const { senderID } = event;
    const userData = await usersData.get(senderID);

    // Calculate the time difference between now and the last reward time
    const lastRewardTime = userData.data.lastTimeGetWeeklyReward || 0; // Initialize to 0 if not set
    const currentTime = moment.tz("Asia/Ho_Chi_Minh");
    const timeDifference = currentTime.diff(lastRewardTime, "hours");

    // Check if enough time has passed for the weekly reward
    if (timeDifference < 7 * 24) {
      const remainingHours = 7 * 24 - timeDifference;
      return message.reply(`⏳ You can claim the weekly reward again in ${remainingHours} hours.`);
    }

    const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** 0);
    const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** 0);

    // Update last reward time and grant rewards
    userData.data.lastTimeGetWeeklyReward = currentTime;
    await usersData.set(senderID, {
      money: userData.money + getCoin,
      exp: userData.exp + getExp,
      data: userData.data,
    });

    const msg = `
🎉 Congratulations! You have received the weekly reward:
💰 ${getCoin} coin
🌟 ${getExp} exp
`;
    message.reply(msg);
  },
};
