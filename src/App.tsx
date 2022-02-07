import { Dialog, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Webcam from "react-webcam";
import Controls from "./components/Controls";

function App() {
  const webcamRef = React.useRef<any>(null);
  const mediaRecorderRef = React.useRef<any>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [timeRecording, setTimeRecording] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState("");
  const increment = React.useRef<any>(null);

  const isDoneRecording = !capturing && recordedChunks.length !== 0;

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

  const handlePauseCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.pause();
    clearInterval(increment.current);
    setCapturing(false);
    setIsPaused(true);
  }, [mediaRecorderRef, setIsPaused, setCapturing]);

  const handleResumeCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.resume();
    setCapturing(true);
    setIsPaused(false);
    increment.current = setInterval(() => {
      setTimeRecording((timer) => timer + 1);
    }, 1000);
  }, [mediaRecorderRef, setIsPaused, setCapturing]);

  const handleUpload = React.useCallback(() => {
    setTimeRecording(0);
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none");
      a.href = url;
      a.download = `iris-${dayjs().format("DDMMYYYYHHmm")}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
      setIsPaused(false);
    }
  }, [recordedChunks]);

  const handlePreview = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setOpenPreview(true);
    }
  }, [recordedChunks]);

  const handleResetCaptureClick = React.useCallback(() => {
    setTimeRecording(0);
    setIsPaused(false);
    setVideoUrl("");
    if (recordedChunks.length) {
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

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
        <Controls
          isCapturing={capturing}
          isDoneRecording={isDoneRecording}
          isPaused={isPaused}
          handlePause={handlePauseCaptureClick}
          handlePreview={handlePreview}
          handleReset={handleResetCaptureClick}
          handleResume={handleResumeCaptureClick}
          handleStart={handleStartCaptureClick}
          handleStop={handleStopCaptureClick}
          handleUpload={handleUpload}
          timeRecording={timeRecording}
          recordedChunks={recordedChunks}
        />
      </div>
      <Transition appear show={openPreview} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpenPreview(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Preview video recording
                </Dialog.Title>
                <div className="mt-2">
                  <video width="1280" height="720" controls>
                    <source src={videoUrl} type="video/webm" />
                  </video>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default App;
