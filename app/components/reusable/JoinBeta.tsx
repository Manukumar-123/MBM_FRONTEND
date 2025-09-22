"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  width?: string;
  height?: string;
  flipDuration?: number;
  backImage?: string;
  frontImage?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  width = "w-96",
  height = "h-[400px] sm:h-[500px]",
  flipDuration = 0.8,
  backImage = "https://via.placeholder.com/400x500",
  frontImage = "https://via.placeholder.com/400x500",
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
          {/* Front */}
          <div
            className="absolute w-full h-full rounded-xl overflow-hidden flex justify-center items-center"
            style={{
              backfaceVisibility: "hidden",
              backgroundImage: `url(${frontImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
            <div className="relative z-10 w-full h-full flex justify-center items-center text-white">
              {front}
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full rounded-xl flex flex-col justify-center items-center text-white overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundImage: `url(${backImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>
            <div className="relative z-10 px-4 text-center">{back}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
