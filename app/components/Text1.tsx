import React from "react";

interface TextProps {
  heading?: string;
  subheading?: string;
  tagline?: string;
  description?: string;
  className?: string;
}

const Text: React.FC<TextProps> = ({
  heading = "",
  subheading = "",
  tagline = "",
  description = "",
  className = "",
}) => {
  return (
    <div className={`absolute right-20 bottom-90 text-center text-wrap ${className}`}>
      <h1 className="text-[#000000] font-light text-6xl">{heading}</h1>
      <p className="text-[#000000] font-bold text-6xl">{subheading}</p>
      <p>{tagline}</p>
      <div className="text-wrap">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Text;
