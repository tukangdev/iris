import {
  faPlay,
  faRecordVinyl,
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
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
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
        <div className="z-10 absolute bottom-10">
          <RecordButton
            capturing={capturing}
            download={recordedChunks.length > 0}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
