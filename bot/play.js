const { joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const utils = require("./utils");

module.exports.run = async (message, args) => {
  var url;
  if (!args[0]) {
    return message.channel.send(
      "Provide an URL or a few words to search a song"
    );
  }

  if (utils.isURL(args)) {
    url = args;
  } else {
    url = await utils.getURL(args);
  }

  let voiceChannel = message.member.voice.channel;
  const serverQueue = global.queue.get("queue");
  const songInfo = await ytdl.getBasicInfo(url);

  const song = {
    title: songInfo.videoDetails.title,
    duration: songInfo.videoDetails.lengthSeconds,
    url: url,
    requestedby: message.author.tag,
  };

  if (!serverQueue) {
    const queueConstruct = {
      textchannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1,
      playing: true,
      loop: false,
      skipped: false,
    };

    queue.set("queue", queueConstruct);
    queueConstruct.songs.push(song);

    if (voiceChannel != null) {
      message.channel.send(
        "'**SONG_TITLE**' started playing\n<url>"
          .replace("SONG_TITLE", song.title)
          .replace("url", song.url)
      );

      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      queueConstruct.connection = connection;

      play(queueConstruct.songs[0]);
    } else {
      queue.delete("queue");
      return message.reply("You have to be in a voice channel to do this");
    }
  } else {
    serverQueue.songs.push(song);
    log(`Added music to the queue : ${song.title}`);

    return message.channel.send(
      strings.songAddedToQueue
        .replace("SONG_TITLE", song.title)
        .replace("url", song.url)
    );
  }
};

function play(song) {
  const serverQueue = global.queue.get("queue");

  if (!song) {
    serverQueue.voiceChannel.leave();
    return queue.delete("queue");
  }

  console.log(`Started playing the music : ${song.title}`);

  const dispatcher = serverQueue.connection.play(
    ytdl(song.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    })
  );

  dispatcher.on("finish", () => {
    if (serverQueue.songs[0])
      log(`Finished playing the music : ${serverQueue.songs[0].title}`);
    else log(`Finished playing all musics, no more musics in the queue`);
    if (serverQueue.loop === false || serverQueue.skipped === true)
      serverQueue.songs.shift();
    if (serverQueue.skipped === true) serverQueue.skipped = false;
    _play(serverQueue.songs[0]);
  });

  dispatcher.on("error", (error) => {
    console.log(error);
  });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
