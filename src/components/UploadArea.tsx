import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, RotateCw } from 'lucide-react';
import Button from './Button';

interface UploadAreaProps {
  title: string;
  description: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  onFileSelected: (file: File) => void;
  previewUrl: string | null;
  onClearFile: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  title,
  description,
  acceptedFileTypes = 'image/jpeg, image/jpg, image/png',
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  onFileSelected,
  previewUrl,
  onClearFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    const fileType = file.type.toLowerCase();
    const isAcceptedType = fileType === 'image/jpeg' || 
                          fileType === 'image/jpg' || 
                          fileType === 'image/png';
    
    if (!isAcceptedType) {
      setError(`지원되지 않는 파일 형식입니다. JPG, JPEG, PNG 형식의 이미지를 올려주세요.`);
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      setError(`파일 용량이 너무 큽니다. ${Math.round(maxFileSize / 1024 / 1024)}MB 이하 이미지를 사용해주세요.`);
      return;
    }
    
    onFileSelected(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="mb-4 p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Upload size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center mb-4">{description}</p>
          <p className="text-xs text-gray-400">JPG, JPEG, PNG 파일 / 최대 {Math.round(maxFileSize / 1024 / 1024)}MB</p>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileInputChange}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            icon={<ImageIcon size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            파일 선택하기
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <button 
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={onClearFile}
            >
              <X size={16} className="text-gray-700" />
            </button>
            <button 
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={() => triggerFileInput()}
            >
              <RotateCw size={16} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-sm text-red-500 bg-red-50 p-3 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadArea;