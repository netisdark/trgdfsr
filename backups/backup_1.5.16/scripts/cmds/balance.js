const Big = require('big.js');

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    version: "1.4",
    author: "NTKhang, Modified: Shikaki",
    countDown: 20,
    role: 0,
    shortDescription: {
      vi: "xem số tiền của bạn",
      en: "view your money"
    },
    longDescription: {
      vi: "xem số tiền hiện có của bạn hoặc người được tag",
      en: "view your money or the money of the tagged person"
    },
    category: "💰 Economy",
    guide: {
      vi: "   {pn}: xem số tiền của bạn"
        + "\n   {pn} <@tag>: xem số tiền của người được tag",
      en: "   {pn}: view your money"
        + "\n   {pn} <@tag>: view the money of the tagged person"
    }
  },

  onStart: async function ({ message, usersData, event, args, api }) {
    const mentionedUID = Object.keys(event.mentions)[0];
    const targetUID = mentionedUID || (args[0] && args[0].replace(/[@<>]/g, '')) || event.senderID;

    const userMoney = new Big(await usersData.get(targetUID, "money"));
    const formattedBalance = formatNumberWithFullForm(userMoney);

    const userName = (await api.getUserInfo(targetUID))[targetUID].name;

    const msg = `---------- Balance for ${userName} -----------
You have:\n\n$${formattedBalance}\n`;

    message.reply(msg);
  }
};

// Function to format a number with full forms (e.g., 1 Thousand, 133 Million, 76.2 Billion)
function formatNumberWithFullForm(number) {
  const fullForms = [
    "",
    "Thousand",
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Duodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
    "Unvigintillion",
    "Duovigintillion",
    "Tresvigintillion",
    "Quattuorvigintillion",
    "Quinvigintillion",
    "Sesvigintillion",
    "Septemvigintillion",
    "Octovigintillion",
    "Novemvigintillion",
    "Trigintillion",
    "Untrigintillion",
    "Duotrigintillion",
    "Googol",
  ];

  // Calculate the full form of the number (e.g., Thousand, Million, Billion)
  let fullFormIndex = 0;
  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
    number /= 1000;
    fullFormIndex++;
  }

  // Format the number with two digits after the decimal point
  const formattedNumber = number.toFixed(2);

  // Add the full form to the formatted number
  return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}