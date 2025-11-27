import React, { useState } from "react";
import heroPlaceholder from "../../assests/imgs/desert_1-min.png";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ fallbackSrc = heroPlaceholder, ...props }) => {
  const [src, setSrc] = useState(props.src);

  return (
    <img
      {...props}
      src={src}
      onError={() => setSrc(fallbackSrc)}
      alt={props.alt}
    />
  );
};
