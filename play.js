const ytdl = require("ytdl-core");
const utils = require("./utils.js");

module.exports.run = async (message, args) => {
    var url;
    if (!args[0]) {
      return message.channel.send(
        "Provide an URL or a few words to search a song"
      );
    }

    if (utils.isURL(args)) {
      url = args;
      message.channel.send(
        "URL detected : " + url
      );
    } else {
        message.channel.send(
            "Fetching URL for these words : " + args
          );
      url = await utils.getURL(args);
      message.channel.send(
        "URL : " + url
      );
    }

    const songInfo = await ytdl.getBasicInfo(url);

    const song = {
      title: songInfo.videoDetails.title,
      duration: songInfo.videoDetails.lengthSeconds,
      url: url,
      requestedby: message.author.tag,
    };

    message.channel.send(song.title);
};


