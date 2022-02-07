import React from "react";

function Tooltip({
  children,
  tooltipText,
}: {
  children: any;
  tooltipText: string;
}) {
  const tipRef = React.createRef<any>();
  function handleMouseEnter() {
    tipRef.current.style.opacity = 1;
    tipRef.current.style.marginBottom = "20px";
  }
  function handleMouseLeave() {
    tipRef.current.style.opacity = 0;
    tipRef.current.style.marginBottom = "10px";
  }
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute whitespace-no-wrap bg-gray-900  text-white px-4 py-2 rounded flex items-center transition-all duration-150"
        style={{ bottom: "100%", opacity: 0 }}
        ref={tipRef}
      >
        <div
          className="bg-black h-3 w-3 absolute"
          style={{ bottom: "-6px", transform: "rotate(45deg)" }}
        />
        {tooltipText}
      </div>
      {children}
    </div>
  );
}

export default Tooltip;
