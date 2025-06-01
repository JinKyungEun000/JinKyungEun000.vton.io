import React from 'react';

interface LoadingAnimationProps {
  message?: string;
  progress?: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "이미지를 생성하고 있습니다...", 
  progress 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-300 border-b-indigo-600 border-l-indigo-300 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-pink-500 animate-spin animation-delay-150"></div>
      </div>
      
      <p className="mt-6 text-lg font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500 mt-1">(약 5~10초 소요 예상)</p>
      
      {progress !== undefined ? (
        <div className="w-full max-w-xs mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-right mt-1">{progress}%</p>
        </div>
      ) : (
        <div className="w-full max-w-xs mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-2.5 animate-progress-indeterminate"></div>
          </div>
        </div>
      )}
      
      <button className="mt-8 text-sm text-gray-500 hover:text-indigo-600 flex items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M16 21h5v-5"></path>
        </svg>
        취소하고 다시 시도
      </button>
    </div>
  );
};

export default LoadingAnimation;