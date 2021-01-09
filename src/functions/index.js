// ========================================================================================== \\
const ClientUtil = require('./ClientUtil'), hastebin = require('hastebin-gen'), config = require('../config.json');
/**
 * Utilities
 */

let util = {

  /**
   * Removing specific items from an array 
   */
  removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  },
  
  removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  },

  /**
   * Levenshtein distance
   * https://stackoverflow.com/a/36566052
   */
  similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
  },

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  },

  // haste-bin maker
  async haste(str) {
    let haste, i = 0;
    while (!haste && i < config.bins.length) {
      await hastebin(str, { url: config.bins[i] })
        .then(link => {
          haste = link;
        })
        .catch(e => {
          if(e) i++;
        });
    }
    // https://haste.red-panda.red/ puts a double // at the end for some reasons
    return haste ? haste.replace(/red\/\//, 'red/') : 'Try Again Later';
  },

  // Asynchronous order-wise message reactor
  async addReactions(msg, ...emojis) {
    for (const emoji of emojis) {
      await msg.react(emoji);
    }
    return msg;
  },

  // Psuedo random ID generator
  generateId(length = 5) { // Default Length = 5
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; // string
  },

  // Milliseconds to time converter
  msToTime(ms) {
    const years = Math.floor(ms / 31536000000); // 365*24*60*60*1000
    const yearsms = ms % 31536000000; // 365*24*60*60*1000
    const months = Math.floor(yearsms / 2592000000); // 30*24*60*60*1000
    const days = Math.floor((yearsms / 86400000) % 30); // 24*60*60*1000
    const daysms = ms % 86400000; // 24*60*60*1000
    const hours = Math.floor(daysms / 3600000); // 60*60*1000
    const hoursms = ms % 3600000; // 60*60*1000
    const minutes = Math.floor(hoursms / 60000); // 60*1000
    const minutesms = ms % 60000; // 60*1000
    const sec = Math.floor(minutesms / 1000);
    // boing boing
    let str = '';
    if (years) str = `${str + years} year${years > 1 ? 's' : ''} `;
    if (months) str = `${str + months} month${months > 1 ? 's' : ''} `;
    if (days) str = `${str + days} day${days > 1 ? 's' : ''} `;
    if (hours) str = `${str + hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes) str = `${str + minutes} minute${minutes > 1 ? 's' : ''} `;
    if (sec) str = `${str + sec} second${sec > 1 ? 's' : ''} `;

    return str;
  }
};

util = Object.assign(util, ClientUtil);

// ========================================================================================== \\

/**
 * Better Logging
 */
const
  betterLogging = require('better-logging'),
  chalk = require('chalk'),
  { MessageConstructionStrategy, Theme } = betterLogging;

// Logger settings
betterLogging(console, {
  format: ctx => `${ctx.STAMP(new Date().toUTCString(), chalk.blueBright)} | ${ctx.time12}${ctx.date}${ctx.unix} ${ctx.type} ${ctx.msg}`,
  saveToFile: './logs/.log',
  color: Theme.dark,
  messageConstructionStrategy: MessageConstructionStrategy.ALL
});

// Assign values
const
  defaultConfig = config,
  log = console.log,
  warn = console.warn,
  error = console.error,
  info = console.info,
  debug = console.debug,
  line = console.line;

// ========================================================================================== \\

/**
 * Exporting
 */
module.exports = {
  util,
  defaultConfig,
  log, warn, error, info, debug, line
};