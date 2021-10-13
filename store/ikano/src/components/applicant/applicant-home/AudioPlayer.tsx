import React, { useState, useEffect } from "react";
import Replay from "../../../assets/Images/replay.png";
import Mute from "../../../assets/Images/mute.png";
import Unmute from "../../../assets/Images/unmute.png";
import Play from "../../../assets/Images/play.png";
import HidePlay from "../../../assets/Images/hideplay.png";
import Pause from "../../../assets/Images/pause.png";
import HidePause from "../../../assets/Images/hidepause.png";
function AudioPlayer({ pages, type }: any) {
  const [flag, setFlag]: any = useState(false);
  const [play, setPlay]: any = useState(true);
  const [pause, setPause]: any = useState(false);
  const [audio, setAudio]: any = useState("");
  const [paused, setPaused]: any = useState(false);
  useEffect(() => {
    let audioTag: any = document.getElementById("audioContainer");
    if (audioTag && !audioTag.paused) {
      audioTag.pause();
      // setPlay(true);
      // setPause(false);
    }
    setPlay(true);
    setPause(false);
    setAudioPlayer();
  }, [pages]);
  const setAudioPlayer = () => {
    if (type === "manager") {
      switch (pages) {
        case 1:
          setAudio(require("../../../assets/audio/001_spanish.mp3"));
          break;
        case 2:
          setAudio(require("../../../assets/audio/002_spanish.mp3"));
          break;
        case 3:
          setAudio(require("../../../assets/audio/003_spanish.mp3"));
          break;
        case 4:
          setAudio(require("../../../assets/audio/004_spanish.mp3"));
          break;
        case 5:
          setAudio(require("../../../assets/audio/005_spanish.mp3"));
          break;
        case 6:
          setAudio(require("../../../assets/audio/006_spanish.mp3"));
          break;
        case 7:
          setAudio(require("../../../assets/audio/007_spanish.mp3"));
          break;
        case 8:
          setAudio(require("../../../assets/audio/008_spanish.mp3"));
          break;
        case 9:
          setAudio(require("../../../assets/audio/009_spanish.mp3"));
          break;
      }
    } else if (type === "floor-operator") {
      switch (pages) {
        case 1:
          setAudio(require("../../../assets/audio/001_spanish.mp3"));
          break;
        case 2:
          setAudio(require("../../../assets/audio/005_spanish.mp3"));
          break;
        case 3:
          setAudio(require("../../../assets/audio/006_spanish.mp3"));
          break;
        case 4:
          setAudio(require("../../../assets/audio/008_spanish.mp3"));
          break;
        case 5:
          setAudio(require("../../../assets/audio/009_spanish.mp3"));
          break;
      }
    } else {
      setAudio(require("../../../assets/audio/010_spanish.mp3"));
    }
  };
  return (
    <>
      <div className="mask">
        {audio && (
          <audio id="audioContainer">
            <source src="" type="audio/mpeg" id="srcId" />
          </audio>
        )}
        {flag ? (
          <img
            src={Mute}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFlag(false);
              const audioContainer: any =
                document.getElementById("audioContainer");
              audioContainer.muted = false;
            }}
          />
        ) : (
          <img
            src={Unmute}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFlag(true);
              const audioContainer: any =
                document.getElementById("audioContainer");
              audioContainer.muted = true;
            }}
          />
        )}
        {play ? (
          <img
            src={Play}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setPause(true);
              setPlay(false);
              const audioContainer: any =
                document.getElementById("audioContainer");
              const src_id: any = document.getElementById("srcId");
              src_id.src = audio;
              if (paused === true) {
                audioContainer.play();
              } else {
                audioContainer.load();
                audioContainer.play();
              }
            }}
          />
        ) : (
          <img src={HidePlay} alt="" />
        )}
        {pause ? (
          <img
            src={Pause}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setPlay(true);
              setPause(false);
              const audioContainer: any =
                document.getElementById("audioContainer");
              audioContainer.pause();
              setPaused(audioContainer.paused);
            }}
          />
        ) : (
          <img src={HidePause} alt="" />
        )}
        <img
          src={Replay}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => {
            const audioContainer: any =
              document.getElementById("audioContainer");
            audioContainer.load();
            audioContainer.play();
            setPause(true);
            setPlay(false);
          }}
        />
      </div>
    </>
  );
}

export default AudioPlayer;
