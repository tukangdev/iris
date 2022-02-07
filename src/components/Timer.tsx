const Timer = ({ timeRecording }: { timeRecording: number }) => {
  return (
    <div className="bg-black opacity-50 py-1 px-2 rounded-lg">
      <p className="font-thin text-2xl text-white">
        <span>{("0" + Math.floor(timeRecording / 3600)).slice(-2)}:</span>
        <span>{("0" + Math.floor((timeRecording / 60) % 60)).slice(-2)}:</span>
        <span>{("0" + (timeRecording % 60)).slice(-2)}</span>
      </p>
    </div>
  );
};

export default Timer;
