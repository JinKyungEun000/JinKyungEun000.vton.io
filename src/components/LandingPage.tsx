import React from 'react';
import { Shirt, Sparkles, Share } from 'lucide-react';
import Button from './Button';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          내 옷장 속 옷, <br />
          <span className="text-indigo-600">입어보지 않고 미리 입어보기!</span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          AI 기술로 내 사진에 가상으로 옷을 입혀보세요. 복잡한 절차 없이, 사진 한 장으로 쉽게 시작할 수 있습니다.
        </p>
        
        <Button 
          size="lg" 
          variant="primary" 
          onClick={onStart}
          className="animate-pulse-soft"
        >
          지금 시작하기
        </Button>
        
        <div className="mt-12 relative">
          <div className="relative rounded-xl overflow-hidden shadow-2xl mx-auto max-w-lg">
            <img 
              src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg" 
              alt="Virtual Try-On Example" 
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white text-sm font-medium">
                다양한 스타일을 내 사진에 적용해보세요
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 px-4 bg-gray-50 rounded-3xl mx-4 my-8">
        <h2 className="text-2xl font-bold text-center mb-10">주요 기능</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shirt className="text-indigo-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">가상 피팅</h3>
            <p className="text-gray-600 text-sm">내 사진으로 다양한 옷을 입어보세요. 실제 구매 전에 어울리는지 확인하세요.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-pink-500" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">스타일 편집</h3>
            <p className="text-gray-600 text-sm">옷의 크기와 위치를 조정하여 더 자연스러운 결과물을 만들어보세요.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share className="text-indigo-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">간편 공유</h3>
            <p className="text-gray-600 text-sm">생성된 이미지를 SNS에 바로 공유하거나 저장해 친구들에게 보여주세요.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-6">지금 바로 시작해보세요!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          몇 초면 끝나는 간단한 절차로 당신의 스타일을 미리 확인하세요.
        </p>
        <Button 
          size="lg" 
          variant="primary" 
          onClick={onStart}
        >
          무료로 시작하기
        </Button>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Virtual Try-On. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600">이용약관</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">개인정보처리방침</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;