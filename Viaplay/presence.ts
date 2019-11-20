let  presence : Presence = new Presence({
    clientId: "632618001824219167",
    mediaKeys: true
}),
strings = presence.getStrings({
  play: "presence.playback.playing",
  pause: "presence.playback.paused"
}),
startTimestamp = Math.floor(Date.now() / 1000);
presence.on("UpdateData", async () => {
    let presenceData: presenceData = {
        largeImageKey: "large_img",
        startTimestamp
    };
    const url = window.location.href;
    if (url.includes("/player/"))
    {
      let video: HTMLVideoElement = document.getElementsByTagName("video")[0],
      timestamps = getTimestamps(
        Math.floor(video.currentTime),
        Math.floor(video.duration)),
      tokens = url.split("/");
      const title = capitalise(tokens[6].split("-"));
      presenceData = {
        details: title,
        largeImageKey: "large_img",
        smallImageKey: video.paused ? "pause" : "play",
        smallImageText: video.paused
          ? (await strings).pause
          : (await strings).play,
        startTimestamp: timestamps[0],
        endTimestamp: timestamps[1]
      };

      if (tokens.length > 8)
      {
        presenceData.state = capitalise(tokens[7].split("-")) + " " + capitalise(tokens[8].split("-"));
      }

      if (video.paused) {
        delete presenceData.startTimestamp;
        delete presenceData.endTimestamp;
      }
    }
    else if (url.includes("#search"))
    {
      presenceData.details = "Searching...";
      presenceData.smallImageKey = "search";
    }
    else
    {
      presenceData.details = "Browsing";
    }

    presence.setActivity(presenceData, true);
});

function getTimestamps(videoTime: number, videoDuration: number) {
  var startTime = Date.now();
  var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
  return [Math.floor(startTime / 1000), endTime];
}

function capitalise(splitStr)
{
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    splitStr[i] = splitStr[i].replace("Sesong", "Season").replace("Avsnitt", "Episode");
  }
  return splitStr.join(" ");
}
