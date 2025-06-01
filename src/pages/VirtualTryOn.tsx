import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import UploadArea from '../components/UploadArea';
import LoadingAnimation from '../components/LoadingAnimation';
import ResultView from '../components/ResultView';
import Button from '../components/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const STEPS = ['내 사진 업로드', '옷 이미지 업로드', '가상 피팅', '결과 확인'];

const VirtualTryOn: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null);
  const [clothingPhotoUrl, setClothingPhotoUrl] = useState<string | null>(null);
  const [processProgress, setProcessProgress] = useState(0);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  
  // Handle user photo selection
  const handleUserPhotoSelected = (file: File) => {
    setUserPhoto(file);
    setUserPhotoUrl(URL.createObjectURL(file));
  };
  
  // Handle clothing photo selection
  const handleClothingPhotoSelected = (file: File) => {
    setClothingPhoto(file);
    setClothingPhotoUrl(URL.createObjectURL(file));
  };
  
  // Clear user photo
  const clearUserPhoto = () => {
    if (userPhotoUrl) {
      URL.revokeObjectURL(userPhotoUrl);
    }
    setUserPhoto(null);
    setUserPhotoUrl(null);
  };
  
  // Clear clothing photo
  const clearClothingPhoto = () => {
    if (clothingPhotoUrl) {
      URL.revokeObjectURL(clothingPhotoUrl);
    }
    setClothingPhoto(null);
    setClothingPhotoUrl(null);
  };
  
  // Start the processing
  const startProcessing = () => {
    setCurrentStep(2);
    
    // Simulate processing with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // In a real app, this would be the URL of the processed image from the backend
          // For demo, we'll just use a sample image
          setResultImageUrl('https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg');
          setCurrentStep(3);
        }, 500);
      }
    }, 300);
  };
  
  // Try with another clothing
  const tryAnotherClothing = () => {
    clearClothingPhoto();
    setCurrentStep(1);
  };
  
  // Start over from the beginning
  const startOver = () => {
    clearUserPhoto();
    clearClothingPhoto();
    setResultImageUrl(null);
    setCurrentStep(0);
  };
  
  // Function to handle next step
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      if (currentStep === 1) {
        startProcessing();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  // Function to handle previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Stepper currentStep={currentStep} steps={STEPS} />
      
      <div className="mt-8 mb-12">
        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">내 사진 업로드</h2>
            <p className="text-gray-600 mb-6">
              가상 피팅을 위해 전신이 나온 사진을 업로드해주세요.
              선명한 전신 사진일수록 정확한 결과를 얻을 수 있습니다.
            </p>
            
            <UploadArea
              title="사진 업로드"
              description="정면을 바라보는 전신 사진을 올려주세요"
              onFileSelected={handleUserPhotoSelected}
              previewUrl={userPhotoUrl}
              onClearFile={clearUserPhoto}
            />
          </div>
        )}
        
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">옷 이미지 업로드</h2>
            <p className="text-gray-600 mb-6">
              입어보고 싶은 옷의 이미지를 업로드해주세요.
              흰 배경의 깔끔한 이미지일수록 결과가 자연스럽습니다.
            </p>
            
            <UploadArea
              title="의상 업로드"
              description="가상으로 입어볼 옷 이미지를 올려주세요"
              onFileSelected={handleClothingPhotoSelected}
              previewUrl={clothingPhotoUrl}
              onClearFile={clearClothingPhoto}
            />
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">가상 피팅 진행중</h2>
            <LoadingAnimation 
              message="AI가 이미지를 합성하고 있습니다..."
              progress={processProgress}
            />
          </div>
        )}
        
        {currentStep === 3 && resultImageUrl && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">결과 확인</h2>
            <ResultView
              resultImageUrl={resultImageUrl}
              onTryAnother={tryAnotherClothing}
              onStartOver={startOver}
            />
          </div>
        )}
      </div>
      
      {(currentStep === 0 || currentStep === 1) && (
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              icon={<ArrowLeft size={16} />}
              onClick={goToPreviousStep}
            >
              이전
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button
            variant="primary"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            disabled={(currentStep === 0 && !userPhoto) || (currentStep === 1 && !clothingPhoto)}
            onClick={goToNextStep}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;