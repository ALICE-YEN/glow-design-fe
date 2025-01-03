import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "繪製空間",
    description:
      "使用繪製工具繪製牆面，系統自動識別並生成封閉空間，未完成封閉空間的牆面可繼續繪製。",
    video:
      "https://res.cloudinary.com/datj4og4i/video/upload/v1725780291/step1%E9%87%8D%E9%8C%84_hypr19.mp4",
  },
  {
    id: 2,
    title: "應用材質",
    description: "從材質庫中選擇合適材質，並應用到牆面和地板。",
    video:
      "https://res.cloudinary.com/datj4og4i/video/upload/v1725780290/step2%E9%87%8D%E9%8C%84_ldcx0m.mp4",
  },
  {
    id: 3,
    title: "擺放家具",
    description:
      "從家具庫內選擇家具，以拖曳方式自由擺放，可按右鍵使用操作選單進行更多操作。",
    video:
      "https://res.cloudinary.com/datj4og4i/video/upload/v1725780290/step3%E9%87%8D%E9%8C%84_doecld.mp4",
  },
  {
    id: 4,
    title: "分享成果",
    description: "完成設計後可導出並分享成果，輕鬆展示設計作品。",
    video:
      "https://res.cloudinary.com/datj4og4i/video/upload/v1725780463/step4%E9%87%8D%E9%8C%84_ru9o3v.mp4",
  },
];

export default function Steps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const handleVideoEnd = () => {
      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCurrentStep(1); // Loop back to the first step
      }
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleVideoEnd);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [currentStep]);

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  return (
    <div className="flex justify-between items-stretch space-x-14 mx-auto max-w-7xl px-8 py-16">
      {/* Left: Video Section */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="relative w-2/3"
      >
        <div className="relative">
          {/* Video Element */}
          <video
            ref={videoRef}
            src={steps[currentStep - 1].video}
            controls
            autoPlay
            className="rounded-card shadow-lg w-full"
          />
          {/* Progress Bar Overlay */}
          <div
            className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 cursor-pointer overflow-hidden rounded-b-card"
            onClick={handleProgressClick}
          >
            <div
              className="h-2 bg-contrast"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Right: Steps Section */}
      <div className="w-1/3 flex flex-col justify-between self-auto">
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.id}>
              {/* Step Indicator */}
              <motion.div
                className="flex items-center cursor-pointer"
                onClick={() => setCurrentStep(step.id)}
                initial={{ opacity: 0.6 }}
                animate={{
                  opacity: currentStep === step.id ? 1 : 0.6,
                  scale: currentStep === step.id ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    currentStep === step.id
                      ? "border-contrast"
                      : "border-secondary"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      currentStep === step.id
                        ? "text-contrast"
                        : "text-secondary"
                    }`}
                  >
                    {step.id}
                  </span>
                </div>
                <span
                  className={`ml-4 text-lg ${
                    currentStep === step.id
                      ? "text-contrast font-bold"
                      : "text-secondary"
                  }`}
                >
                  {step.title}
                </span>
              </motion.div>

              {/* Step Description */}
              {currentStep === step.id && (
                <motion.div
                  className="mt-4 pl-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-primary">{step.description}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* <motion.div
          className="self-end w-48 rounded-card bg-contrast p-2 text-center font-bold text-white"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div>開始創作 →</div>
        </motion.div> */}
      </div>
    </div>
  );
}
