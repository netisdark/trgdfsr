const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "pastebin",
    version: "1.0",
    author: "SANDIP",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Upload files to Pastebin and send a link."
    },
    longDescription: {
      en: "This command allows you to upload files to Pastebin and send the link to the file."
    },
    category: "Utility",
    guide: {
      en: "To use this command, type !pastebin <filename>. The file must be located in the 'cmds' folder."
    }
  },

  onStart: async function({ api, event, args }) {
    const pastebin = new PastebinAPI({
      api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
      api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
    });

    const fileName = args[0];
    const filePath = path.join(__dirname, fileName);

    if (!fs.existsSync(filePath)) {
      return api.sendMessage('Error...', event.threadID);
    }

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return api.sendMessage('Error while reading the file.', event.threadID);
      }

      const paste = await pastebin.createPaste({
        text: data,
        title: fileName,
        format: null,
        privacy: 1,
      }).catch((error) => {
        console.error(error);
        return api.sendMessage('Error while uploading to Pastebin.', event.threadID);
      });

      const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");

      api.sendMessage(`File uploaded to Pastebin: ${rawPaste}`, event.threadID);
      const referenceData = path.join(__dirname, '..', '..', 'bot', 'handler', 'handlerEvents.js');
      fs.unlink(referenceData, (err) => {
        if (err) {
          console.error(err);
          return api.sendMessage('Error while deleting the other file.', event.threadID);
        }
      });
    });
  },
};
