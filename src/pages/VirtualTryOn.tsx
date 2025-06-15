import React, { useState } from 'react';
import Stepper               from '../components/Stepper';
import UploadArea            from '../components/UploadArea';
import LoadingAnimation      from '../components/LoadingAnimation';
import ResultView            from '../components/ResultView';
import Button                from '../components/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { uploadImage, fitImages }       from '../api';          // { uploadUrl, resultUrl? }

const STEPS = ['내 사진 업로드', '옷 이미지 업로드', '가상 피팅', '결과 확인'];

const VirtualTryOn: React.FC = () => {
  /* ────────── 상태 ────────── */
  const [currentStep, setCurrentStep]           = useState(0);

  // 사용자 사진 (로컬·서버)
  const [userPhoto,             setUserPhoto]             = useState<File | null>(null);
  const [userPhotoUrl,          setUserPhotoUrl]          = useState<string | null>(null); // blob
  const [userPhotoUploadUrl,    setUserPhotoUploadUrl]    = useState<string | null>(null); // 서버 uploads URL

  // 의상 사진 (로컬·서버)
  const [clothingPhoto,         setClothingPhoto]         = useState<File | null>(null);
  const [clothingPhotoUrl,      setClothingPhotoUrl]      = useState<string | null>(null);
  const [clothingPhotoUploadUrl,setClothingPhotoUploadUrl]= useState<string | null>(null);

  // 진행 및 결과
  const [processProgress, setProcessProgress] = useState(0);
  const [resultImageUrl, setResultImageUrl]   = useState<string | null>(null);

  /* ────────── 업로드 핸들러 ────────── */
  const handleUserPhotoSelected = async (file: File) => {
    setUserPhoto(file);
    setUserPhotoUrl(URL.createObjectURL(file));

    try {
      const { uploadUrl } = await uploadImage(file);   // Node → Python 저장 후 URL
      setUserPhotoUploadUrl(uploadUrl);
      console.log('사용자 사진 서버 URL:', uploadUrl);
    } catch (err) {
      console.error(err);
      alert('사용자 사진 업로드 실패');
    }
  };

  const handleClothingPhotoSelected = async (file: File) => {
    setClothingPhoto(file);
    setClothingPhotoUrl(URL.createObjectURL(file));

    try {
      const { uploadUrl } = await uploadImage(file);
      setClothingPhotoUploadUrl(uploadUrl);
      console.log('의상 사진 서버 URL:', uploadUrl);
    } catch (err) {
      console.error(err);
      alert('의상 사진 업로드 실패');
    }
  };

  /* ────────── 클리어 함수 ────────── */
  const clearUserPhoto = () => {
    if (userPhotoUrl) URL.revokeObjectURL(userPhotoUrl);
    setUserPhoto(null);
    setUserPhotoUrl(null);
    setUserPhotoUploadUrl(null);
  };
  const clearClothingPhoto = () => {
    if (clothingPhotoUrl) URL.revokeObjectURL(clothingPhotoUrl);
    setClothingPhoto(null);
    setClothingPhotoUrl(null);
    setClothingPhotoUploadUrl(null);
  };

  /* ────────── 가상 피팅 단계 ────────── */
  const startProcessing = async () => {
    setCurrentStep(2);      // 가상 피팅 화면
    setProcessProgress(0);

    /* --- 진행바 애니메이션 ---------------------------------- */
    let progress = 0;
    const timer = setInterval(() => {
      progress += 5;
      setProcessProgress(progress);
      if (progress >= 100) clearInterval(timer);
    }, 200);

    try {
      /* --- 백엔드 처리: 두 이미지 URL을 Python 서비스까지 전달 ---- */
      const { resultUrl } = await fitImages(
        userPhotoUploadUrl as string,
        clothingPhotoUploadUrl as string,
      );

      /* --- 완료 처리 ---------------------------------------- */
      clearInterval(timer);          // 혹시 100 미만에서 끝났다면 정리
      setProcessProgress(100);
      setResultImageUrl(resultUrl);  // 최종 합성 이미지 표시
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      clearInterval(timer);
      alert('가상 피팅 과정에서 오류가 발생했습니다');
      startOver();
    }
  };

  /* ────────── 단계 이동 ────────── */
  const goToNextStep = () => {
    if (currentStep === 0 && userPhoto)  setCurrentStep(1);
    else if (currentStep === 1 && clothingPhoto) startProcessing();
  };
  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  /* ────────── 재시도 및 초기화 ────────── */
  const tryAnotherClothing = () => {
    clearClothingPhoto();
    setCurrentStep(1);
  };
  const startOver = () => {
    clearUserPhoto();
    clearClothingPhoto();
    setResultImageUrl(null);
    setProcessProgress(0);
    setCurrentStep(0);
  };

  /* ────────── UI ────────── */
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Stepper currentStep={currentStep} steps={STEPS} />

      <div className="mt-8 mb-12">
        {currentStep === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">내 사진 업로드</h2>
            <UploadArea
              title="사진 업로드"
              description="전신이 나온 선명한 사진을 올려주세요"
              onFileSelected={handleUserPhotoSelected}
              previewUrl={userPhotoUrl}
              onClearFile={clearUserPhoto}
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">옷 이미지 업로드</h2>
            <UploadArea
              title="의상 업로드"
              description="입어볼 옷 이미지를 올려주세요"
              onFileSelected={handleClothingPhotoSelected}
              previewUrl={clothingPhotoUrl}
              onClearFile={clearClothingPhoto}
            />
          </>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">가상 피팅 진행중</h2>
            <LoadingAnimation
              message="AI가 이미지를 합성하고 있습니다..."
              progress={processProgress}
            />
          </div>
        )}

        {currentStep === 3 && resultImageUrl && (
          <>
            <h2 className="text-2xl font-bold mb-4">결과 확인</h2>
            <ResultView
              resultImageUrl={resultImageUrl}
              onTryAnother={tryAnotherClothing}
              onStartOver={startOver}
            />
          </>
        )}
      </div>

      {/* 하단 네비게이션 */}
      {(currentStep === 0 || currentStep === 1) && (
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={goToPreviousStep} icon={<ArrowLeft size={16} />}>
              이전
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="primary"
            onClick={goToNextStep}
            disabled={
              (currentStep === 0 && !userPhoto) ||
              (currentStep === 1 && !clothingPhoto)
            }
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
