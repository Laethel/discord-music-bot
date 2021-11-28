const YouTube = require("youtube-sr").default;

module.exports.isURL = (url) => {
  if (!url) return false;
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))|" +
      "localhost" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return pattern.test(url);
};

module.exports.getURL = async (words) => {
  stringOfWords = words.join(" ");
  lookingOnYtb = new Promise(async (resolve) => {
    YouTube.search(stringOfWords, { limit: 1 }).then((result) => {
      resolve("https://www.youtube.com/watch?v=" + result[0].id);
    });
  });

  let link = await lookingOnYtb;
  return link;
};

module.exports.log = (log) => {
  
}
