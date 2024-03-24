const { config } = global.GoatBot;
const path = require("path");
const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");

const folderPath = "scripts/cmds";

module.exports = {
  config: {
    name: "prefix",
    version: "1.6",
    author: "NTKhang & Shikaki",
    countDown: 10,
    role: 0,
    shortDescription: "Thay đổi prefix của bot",
    longDescription:
      "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
    category: "config",
    guide: {
      en:
        "   {pn} <new prefix>: change new prefix in your box chat" +
        "\n   Example:" +
        "\n    {pn} #" +
        "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)" +
        "\n   Example:" +
        "\n    {pn} # -g" +
        "\n\n   {pn} reset: change prefix in your box chat to default" +
        "\n\n Only for me(Shikaki)\naddatt, delatt, listatt, addgreet and delgreet",
    },
  },
  langs: {
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal:
        "Please react to this message to confirm change prefix of system bot",
      confirmThisThread:
        "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your group chat to: %1",
      myPrefix: "\n🌐 System prefix: %1\n🛸Prefix for your Group Chat: %2",
    },
  },

  onStart: async function ({
    message,
    role,
    args,
    commandName,
    event,
    threadsData,
    getLang,
  }) {
    if (!args[0]) return message.SyntaxError();

    if (args[0] == "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    } else if (args[0] == "addatt") {
      const isAdmin = config.adminBot.includes(event.senderID);
      if (!isAdmin) {
        return message.reply("❌ You need to be an admin of the bot.");
      } else {
        const attachments =
          event.messageReply && event.messageReply.attachments;
        if (!attachments || attachments.length === 0) {
          return message.reply("❌ No valid attachments found.");
        }
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        try {
          const baseName = path.basename(attachments[0].url);
          const ext = path.extname(baseName);
          const fileSavePath = path.join(folderPath, baseName);
          const response = await axios.get(attachments[0].url, {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(fileSavePath, Buffer.from(response.data, "binary"));

          message.reply(
            `✅ Attachment "${baseName}${ext}" saved successfully.`
          );
        } catch (error) {
          return message.reply("❌ Error saving attachment: " + error);
        }
      }
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
    };

    if (args[1] === "-g") {
      if (role < 2) return message.reply(getLang("onlyAdmin"));
      else formSet.setGlobal = true;
    } else formSet.setGlobal = false;

    return message.reply(
      args[1] === "-g"
        ? getLang("confirmGlobal")
        : getLang("confirmThisThread"),
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({
    message,
    threadsData,
    event,
    Reaction,
    getLang,
  }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(
        global.client.dirConfig,
        JSON.stringify(global.GoatBot.config, null, 2)
      );
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const files = await fs.readdir(folderPath);

    if (files.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];
    const filePath = path.join(folderPath, randomFile);
    const fileStream = fs.createReadStream(filePath);

    const messageContent = {
      attachment: [fileStream],
    };

    if (event.body) {
      const prefixesToCheck = ["rein", "bot", "prefix"];

      const lowercasedMessage = event.body.toLowerCase();

      if (prefixesToCheck.includes(lowercasedMessage.trim())) {
        const shouldSendAttachment = Math.random() < 0.4; // 40% chance for attachment

        const replyMessage = `${getLang(
          "myPrefix",
          global.GoatBot.config.prefix,
          utils.getPrefix(event.threadID)
        )}`;
        message.reply({
          body: replyMessage,
          attachment: messageContent.attachment,
        });
      }
    }
  },
};
