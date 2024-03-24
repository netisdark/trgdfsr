const fs = require('fs');

module.exports = {
  config: {
    name: "todolist",
    version: "1.0",
    author: "Shikaki",
    shortDescription: "Manage your to-do list",
    longDescription: "Create, view, and delete tasks in your to-do list",
    category: "📅 To-Do List",
    guide: {
      en: "{pn} <task> -> Add a task to your to-do list.\n\n{pn} -> View your to-do list.\n\n{pn}del <task-number> -> Delete a task from your to-do list."
    },
  },

  onStart: async function ({ event, args, message }) {
    const userId = event.senderID;

    try {
      let todoList;

      try {
        todoList = JSON.parse(fs.readFileSync(`todolist_${userId}.json`, 'utf8'));
      } catch (readError) {
        fs.writeFileSync(`todolist_${userId}.json`, '[]');
        todoList = [];
      }

      if (!args[0]) {
        if (todoList.length === 0) {
          return message.reply("Your to-do list is empty.");
        } else {
          const formattedList = todoList.map((task, index) => `${index + 1}. ${task}`).join('\n');
          return message.reply(`Your to-do list:\n${formattedList}`);
        }
      }

      const command = args[0].toLowerCase();

      if (command === "del") {
        const taskNumber = parseInt(args[1]);

        if (isNaN(taskNumber) || taskNumber <= 0 || taskNumber > todoList.length) {
          return message.reply("Invalid task number. Please provide a valid task number from your to-do list.");
        }

        const taskToRemove = todoList[taskNumber - 1];
        todoList.splice(taskNumber - 1, 1);
        fs.writeFileSync(`todolist_${userId}.json`, JSON.stringify(todoList, null, 2), 'utf8');
        return message.reply(`Task "${taskToRemove}" (number ${taskNumber}) has been removed from your to-do list.`);
      } else {
        const newTask = args.join(' ');
        todoList.push(newTask);
        fs.writeFileSync(`todolist_${userId}.json`, JSON.stringify(todoList, null, 2), 'utf8');
        return message.reply(`New task "${newTask}" added to your to-do list.`);
      }
    } catch (err) {
      console.error('Error reading or writing to-do list file:', err.message);
      return message.reply("An error occurred while managing your to-do list. Please try again later.");
    }
  },
};