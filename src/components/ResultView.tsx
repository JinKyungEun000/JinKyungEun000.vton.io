import React from 'react';
import { Share2, Download, Undo2 } from 'lucide-react';
import Button from './Button';

interface ResultViewProps {
  resultImageUrl: string;
  onTryAnother: () => void;
  onStartOver: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({
  resultImageUrl,
  onTryAnother,
  onStartOver
}) => {
  const handleShare = async () => {
    if (!resultImageUrl) return;
    
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(resultImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'virtual-tryon-result.png', { type: 'image/png' });
        
        await navigator.share({
          title: '가상 피팅 결과',
          text: '내가 가상으로 입어본 옷이에요!',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        alert('공유에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('현재 브라우저에서는 공유 기능을 지원하지 않습니다.');
    }
  };
  
  const handleDownload = () => {
    if (!resultImageUrl) return;
    
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'virtual-tryon-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">멋진데요! 잘 어울립니다 😃</h2>
        <p className="text-gray-500 text-sm mt-1">결과가 마음에 드시나요?</p>
      </div>
      
      <div className="rounded-lg overflow-hidden bg-white shadow-lg mb-6">
        <img 
          src={resultImageUrl} 
          alt="Virtual Try-on Result" 
          className="w-full"
        />
      </div>
      
      <div className="flex justify-center space-x-3 mb-6">
        <Button
          variant="primary"
          icon={<Share2 size={18} />}
          onClick={handleShare}
        >
          공유하기
        </Button>
        
        <Button
          variant="outline"
          icon={<Download size={18} />}
          onClick={handleDownload}
        >
          저장하기
        </Button>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button
          variant="secondary"
          onClick={onTryAnother}
        >
          다른 옷 입어보기
        </Button>
        
        <Button
          variant="ghost"
          icon={<Undo2 size={16} />}
          onClick={onStartOver}
        >
          처음부터 다시하기
        </Button>
      </div>
    </div>
  );
};

export default ResultView;