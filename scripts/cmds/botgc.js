module.exports = {
  config: {
    name: "botgc",
    version: "1.0",
    author: "Samir*DRG",
    role: 0,
    shortDescription: {
      en: "Adds the user to support group chat "
    },
    longDescription: {
      en: "Adds the user to the support group chat"
    },
    category: "SUPPORT GROUP CHAT",
    guide: {
      en: "#supportgc"
    }
  },
  onStart: async function ({ api,  event, args }) {
    const threadID = "6804378702981392"; // ID of the thread to add the user to

    try {
      await api.addUserToGroup(event.senderID, threadID);
      api.sendMessage("🎉 You have been added to Shawn's  group chat😊.Check your msg requests or spam if you cannot find the chat in your inbox. After joining the group, use #rules command to view the group rules. ", event.senderID);
    } catch (error) {
      api.sendMessage("❌Error. Either you are already in the group or you have blocked me. ", event.senderID);
    }
  }
};