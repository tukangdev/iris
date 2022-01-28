import {
  faRedo,
  faSave,
  faStop,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Helmet } from "react-helmet";
import Webcam from "react-webcam";

function App() {
  const webcamRef = React.useRef<any>(null);
  const mediaRecorderRef = React.useRef<any>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [timeRecording, setTimeRecording] = React.useState(0);
  const increment = React.useRef<any>(null);

  const handleStart = () => {
    setCapturing(true);
    increment.current = setInterval(() => {
      setTimeRecording((timer) => timer + 1);
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(increment.current);
    setTimeRecording(0);
  };

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    increment.current = setInterval(() => {
      setTimeRecording((timer) => timer + 1);
    }, 1000);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    clearInterval(increment.current);
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    setTimeRecording(0);
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none");
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const handleResetCaptureClick = React.useCallback(() => {
    setTimeRecording(0);
    if (recordedChunks.length) {
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const RecordButton = ({
    capturing,
    download,
  }: {
    capturing: boolean;
    download: boolean;
  }) => {
    if (download) {
      return (
        <button onClick={handleDownload}>
          <div className="h-16 w-16 bg-red-500 rounded-full text-white text-2xl flex justify-center items-center">
            <FontAwesomeIcon icon={faSave} />
          </div>
        </button>
      );
    }

    if (capturing) {
      return (
        <button onClick={handleStopCaptureClick}>
          <div className="h-16 w-16 bg-red-500 rounded-full text-white text-2xl flex justify-center items-center">
            <FontAwesomeIcon icon={faStop} />
          </div>
        </button>
      );
    }
    return (
      <button onClick={handleStartCaptureClick}>
        <div className="h-16 w-16 bg-red-500 rounded-full text-white text-2xl flex justify-center items-center">
          <FontAwesomeIcon icon={faVideo} />
        </div>
      </button>
    );
  };

  const ResetButton = ({ disabled }: { disabled: boolean }) => {
    return (
      <button onClick={handleResetCaptureClick} disabled={disabled}>
        <div
          className={`h-16 w-16 ${
            disabled ? "bg-gray-500" : "bg-blue-500"
          } rounded-full text-white text-2xl flex justify-center items-center`}
        >
          <FontAwesomeIcon icon={faRedo} />
        </div>
      </button>
    );
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Iris</title>
      </Helmet>
      <div
        className="w-screen h-screen bg-gray-900 flex justify-center items-center flex-col"
        id="video-stream"
      >
        <Webcam
          audio
          muted
          videoConstraints={videoConstraints}
          ref={webcamRef}
        />
        <div className="z-10 absolute bottom-10 bg-white py-2 px-6 rounded-md w-96 flex flex-row justify-evenly items-center gap-2">
          <RecordButton
            capturing={capturing}
            download={recordedChunks.length > 0}
          />
          <ResetButton disabled={recordedChunks.length === 0} />
          <p className="font-thin text-2xl text-gray-500">
            <span>{("0" + Math.floor(timeRecording / 3600)).slice(-2)}:</span>
            <span>
              {("0" + Math.floor((timeRecording / 60) % 60)).slice(-2)}:
            </span>
            <span>{("0" + (timeRecording % 60)).slice(-2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
