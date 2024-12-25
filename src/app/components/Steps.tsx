import { useState } from "react";
import { motion } from "motion/react";

const steps = [
  {
    id: 1,
    title: "繪製空間",
    description:
      "使用繪製工具繪製牆面，系統自動識別並生成封閉空間，未完成封閉空間的牆面可繼續繪製。",
  },
  {
    id: 2,
    title: "應用材質",
    description: "從材質庫中選擇合適材質，並應用到牆面和地板。",
  },
  {
    id: 3,
    title: "擺放家具",
    description:
      "從家具庫內選擇家具，以拖曳方式自由擺放，可按右鍵使用操作選單進行更多操作。",
  },
  {
    id: 4,
    title: "分享成果",
    description: "完成設計後可導出並分享成果，輕鬆展示設計作品。",
  },
];

export default function Steps() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="flex justify-between items-center mx-auto max-w-7xl px-8 py-16">
      {/* Left: Image Section */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="w-2/3"
      >
        <img
          src="https://via.placeholder.com/800x400" // Replace with your image URL
          alt={`Step ${currentStep}`}
          className="rounded-lg shadow-lg"
        />
      </motion.div>

      {/* Right: Steps Section */}
      <div className="w-1/3 pl-8">
        <h2 className="text-3xl font-bold mb-8 text-red-600">HOW IT WORKS</h2>
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.id}>
              {/* Step Indicator */}
              <motion.div
                className="flex items-center cursor-pointer"
                onClick={() => handleStepClick(step.id)}
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
                      ? "border-red-600"
                      : "border-gray-300"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      currentStep === step.id ? "text-red-600" : "text-gray-400"
                    }`}
                  >
                    {step.id}
                  </span>
                </div>
                <span
                  className={`ml-4 text-lg ${
                    currentStep === step.id
                      ? "text-red-600 font-bold"
                      : "text-gray-400"
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
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
