module.exports = {
    config: {
        name: "haha",
        version: "1.0",
        author: "Jaychris Garcia",
        countDown: 5,
        role: 0,
        shortDescription: "sarcasm",
        longDescription: "sarcasm",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "haha") return message.reply("What are u laughin at buddy huh 🔪👀 come on let me in on the joke 🍿😐💔");
}
};