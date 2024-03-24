const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "dalle3",
    aliases: [],
    version: "",
    author: "SiAM",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Latest DALL·E 3 image generator",
    },
    category: "AI",
    guide: {
      en: "{pn} 'prompt' ",
    },
    category: "s",
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) {
      await message.reply("Please provide a prompt.");
      return;
    }
    const prompt = encodeURIComponent(args.join(" "));
  
    //cookies ( get it from cookies editor )
    const _U = ""; // add _U value 
    
    const SRCHHPGUSR = ""; //add SRCHHPGUSR value
    
    const apiURL = `https://dalle-3.siam-apiproject.repl.co/generate`;

    try {
      const processingMessage = await message.reply("Your imagination is processing...");

      const response = await axios.get(apiURL, {
        params: {
          prompt: prompt,
          bing_cookie: encodeURIComponent(_U),
          auth_cookie_SRCHHPGUSR: encodeURIComponent(SRCHHPGUSR)

        }
      });

      const data = response.data;
      if (!data.images || Object.keys(data.images).length === 0) {
        await message.reply("The prompt has been Blocked by Bing. Please try again...");
        return;
      }

      if (data.images) {
        const imageKeys = Object.keys(data.images);
        const attachment = [];
        for (let i = 0; i < imageKeys.length; i++) {
          const imgURL = data.images[imageKeys[i]];
          const imgStream = await getStreamFromURL(imgURL);
          attachment.push(imgStream);
        }
        await message.reply({
          body: "Here are the images for your prompt:",
          attachment: attachment,
        });

        message.unsend((await processingMessage).messageID);
      } else {
        await message.reply("API response format is incorrect 🐸");
      }
    } catch (error) {
      console.error(error);
      await message.reply("An error occurred while processing your request.");
    }
  },
};
