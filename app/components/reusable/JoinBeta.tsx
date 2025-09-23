"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

interface FlipCardProps {
  // Can be a video now
  Title?: string;
  Back: React.ReactNode;
  width?: string;
  height?: string;
  flipDuration?: number;
  videoUrl?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  Title,
  Back,
  width = "w-96",
  height = "h-[400px] sm:h-[500px]",
  flipDuration = 0.8,
  videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4", // default video
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = useState(false);

  const flipCard = (toBack: boolean) => {
    if (!cardRef.current) return;
    if (flipped === toBack) return;

    gsap.to(cardRef.current, {
      rotationY: toBack ? 180 : 0,
      duration: flipDuration,
      ease: "power2.out",
    });

    setFlipped(toBack);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    flipCard(!flipped);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={`${width} ${height} cursor-pointer`}
        style={{ perspective: 1000 }}
        onMouseEnter={() => flipCard(true)}
        onMouseLeave={() => flipCard(false)}
        onClick={() => flipCard(!flipped)}
        onTouchStart={handleTouch} // mobile support
      >
        <div
          ref={cardRef}
          className="relative w-full h-full rounded-xl shadow-lg"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front with Video */}
          <div
            className="absolute w-full h-full rounded-xl overflow-hidden flex justify-center items-center"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <video
              src={videoUrl}
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Bottom Overlay with Name */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8">
              <h6 className="text-white text-xl font-semibold tracking-widest">
                {Title}
              </h6>
            </div>
          </div>

          {/* Back with Buttons/Text */}
          <div
            className="absolute w-full h-full rounded-xl flex flex-col justify-center items-center text-white overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute z-10 text-white">{Back}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
