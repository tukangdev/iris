import {
  faPause,
  faPlay,
  faRedo,
  faStop,
  faUpload,
  faVideo,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Timer from "./Timer";
import Tooltip from "./Tooltip";

interface ControlsProps {
  timeRecording: number;
  isDoneRecording: boolean;
  isCapturing: boolean;
  isPaused: boolean;
  recordedChunks: Blob[];
  handlePreview: () => void;
  handleStop: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStart: () => void;
  handleReset: () => void;
  handleUpload: () => void;
}

const ButtonTemplate = ({
  icon,
  onClick,
  disabled = false,
  bgColor = "bg-red-500",
  toolTipText = "",
}: {
  icon: IconDefinition;
  onClick: () => void;
  disabled?: boolean;
  bgColor?: string;
  toolTipText?: string;
}) => (
  <Tooltip tooltipText={toolTipText}>
    <button
      data-tooltip-target="tooltip-dark"
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={`h-16 w-16 shadow-md ${
          disabled ? "bg-gray-500" : bgColor
        } rounded-xl text-white text-2xl flex justify-center items-center`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
    </button>
  </Tooltip>
);

const StopButton = ({
  capturing,
  hasRecording,
  handlePreview,
  handleStop,
}: {
  capturing: boolean;
  hasRecording: boolean;
  handlePreview: () => void;
  handleStop: () => void;
}) => {
  if (!capturing && hasRecording) {
    return (
      <ButtonTemplate
        icon={faPlay}
        bgColor="bg-green-500"
        onClick={handlePreview}
        toolTipText="Preview recording"
      />
    );
  }

  return (
    <ButtonTemplate
      icon={faStop}
      onClick={handleStop}
      toolTipText="End recording"
    />
  );
};

const RecordButton = ({
  capturing,
  isPaused,
  handlePause,
  handleResume,
  handleStart,
}: {
  capturing: boolean;
  isPaused: boolean;
  handlePause: () => void;
  handleResume: () => void;
  handleStart: () => void;
}) => {
  if (capturing && !isPaused) {
    return (
      <ButtonTemplate
        bgColor={"bg-yellow-500"}
        icon={faPause}
        onClick={handlePause}
        toolTipText="Pause recording"
      />
    );
  }

  if (isPaused && !capturing) {
    return (
      <ButtonTemplate
        bgColor={"bg-yellow-500"}
        icon={faVideo}
        onClick={handleResume}
        toolTipText="Resume recording"
      />
    );
  }

  return (
    <ButtonTemplate
      icon={faVideo}
      onClick={handleStart}
      toolTipText="Start recording"
    />
  );
};

const ResetButton = ({
  disabled,
  handleReset,
}: {
  disabled: boolean;
  handleReset: () => void;
}) => {
  return (
    <Tooltip tooltipText="Retake">
      <button onClick={handleReset} disabled={disabled}>
        <div
          className={`h-12 w-12 ${
            disabled ? "bg-gray-500" : "bg-red-500"
          } rounded-xl ease-in-out transition-opacity text-white shadow-md text-2xl flex justify-center items-center `}
        >
          <FontAwesomeIcon icon={faRedo} />
        </div>
      </button>
    </Tooltip>
  );
};

const UploadButton = ({
  disabled,
  handleUpload,
}: {
  disabled: boolean;
  handleUpload: () => void;
}) => {
  return (
    <Tooltip tooltipText="Upload recording">
      <button onClick={handleUpload} disabled={disabled}>
        <div
          className={`h-12 w-12 ${
            disabled ? "bg-gray-500" : "bg-blue-500"
          } rounded-xl text-white shadow-md text-2xl flex justify-center items-center`}
        >
          <FontAwesomeIcon icon={faUpload} />
        </div>
      </button>
    </Tooltip>
  );
};

const Controls = ({
  timeRecording,
  isDoneRecording,
  isCapturing,
  isPaused,
  recordedChunks,
  handleReset,
  handlePause,
  handlePreview,
  handleResume,
  handleStart,
  handleStop,
  handleUpload,
}: ControlsProps) => {
  return (
    <div className="gap-2 flex flex-col z-10 justify-center items-center absolute bottom-10">
      <Timer timeRecording={timeRecording} />
      <div className="z-10 bg-transparent py-2 px-2 rounded-md w-80 flex flex-row justify-center items-center gap-4">
        <Transition
          show={isDoneRecording}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 scale-50 translate-x-20"
          enterTo="opacity-100  scale-100 translate-x-0"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100  scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <ResetButton
            disabled={recordedChunks.length === 0}
            handleReset={handleReset}
          />
        </Transition>
        <Transition
          show={recordedChunks.length === 0}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 scale-50 "
          enterTo="opacity-100  scale-100 "
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100  scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <RecordButton
            capturing={isCapturing}
            handlePause={handlePause}
            handleResume={handleResume}
            handleStart={handleStart}
            isPaused={isPaused}
          />
        </Transition>
        <Transition
          show={isPaused}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 scale-50 "
          enterTo="opacity-100  scale-100 "
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100  scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <StopButton
            capturing={isCapturing}
            handlePreview={handlePreview}
            handleStop={handleStop}
            hasRecording={recordedChunks.length !== 0}
          />
        </Transition>
        <Transition
          show={isDoneRecording}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0  scale-50 -translate-x-20"
          enterTo="opacity-100  scale-100 translate-x-0"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100  scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <UploadButton
            disabled={recordedChunks.length === 0}
            handleUpload={handleUpload}
          />
        </Transition>
      </div>
    </div>
  );
};

export default Controls;
