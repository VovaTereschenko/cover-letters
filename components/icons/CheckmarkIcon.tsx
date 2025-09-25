import React from "react";

type CheckmarkIconProps = {
  width?: number;
  height?: number;
  className?: string;
  backgroundColor?: string;
  checkmarkColor?: string;
};

const CheckmarkIcon = ({
  width = 28,
  height = 28,
  className,
  backgroundColor = "#D1FADF",
  checkmarkColor = "#12B76A",
}: CheckmarkIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Checkmark"
  >
    <rect width="28" height="28" rx="14" fill={backgroundColor} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.946 8.62169L11.592 16.6834L9.376 14.315C8.967 13.93 8.326 13.9067 7.859 14.2334C7.404 14.5717 7.276 15.1667 7.556 15.645L10.181 19.915C10.437 20.3117 10.881 20.5567 11.382 20.5567C11.861 20.5567 12.316 20.3117 12.572 19.915C12.992 19.3667 21.007 9.81169 21.007 9.81169C22.057 8.73836 20.786 7.79336 19.946 8.61002V8.62169Z"
      fill={checkmarkColor}
    />
  </svg>
);

export { CheckmarkIcon };
