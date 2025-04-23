import React from "react";

interface AnimatedUploadProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "indigo" | "emerald" | "purple";
}

const AnimatedUpload: React.FC<AnimatedUploadProps> = ({
  message = "Uploading your file...",
  size = "md",
  color = "blue",
}) => {
  // Size configuration
  const sizeConfig = {
    sm: {
      container: "w-16 h-16",
      arrow: "h-8 w-8",
      spinner: "h-14 w-14",
      text: "text-sm",
      progress: "h-1.5",
    },
    md: {
      container: "w-24 h-24",
      arrow: "h-12 w-12",
      spinner: "h-20 w-20",
      text: "text-base",
      progress: "h-2.5",
    },
    lg: {
      container: "w-32 h-32",
      arrow: "h-16 w-16",
      spinner: "h-28 w-28",
      text: "text-lg",
      progress: "h-3",
    },
  };

  // Color configuration
  const colorConfig = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      arrow: "text-blue-500",
      spinner: "text-blue-500",
      progress: "bg-blue-600",
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      arrow: "text-indigo-500",
      spinner: "text-indigo-500",
      progress: "bg-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      arrow: "text-emerald-500",
      spinner: "text-emerald-500",
      progress: "bg-emerald-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      arrow: "text-purple-500",
      spinner: "text-purple-500",
      progress: "bg-purple-600",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`relative ${sizeConfig[size].container}`}>
        {/* Circle background */}
        <div
          className={`absolute inset-0 rounded-full ${colorConfig[color].bg} opacity-30`}
        ></div>

        {/* Animated arrow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`${sizeConfig[size].arrow} ${colorConfig[color].arrow} animate-bounce`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </div>

        {/* Rotating circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`${sizeConfig[size].spinner} ${colorConfig[color].spinner} animate-spin`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>

      <p className={`${colorConfig[color].text} font-medium animate-pulse ${sizeConfig[size].text}`}>
        {message}
      </p>

      <div className="w-full bg-gray-200 rounded-full">
        <div
          className={`${colorConfig[color].progress} ${sizeConfig[size].progress} rounded-full animate-progress`}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedUpload;