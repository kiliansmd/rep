'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full max-w-2xl p-8 rounded-lg border-2 border-dashed
        transition-colors duration-200 ease-in-out cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 bg-white'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-full bg-gray-100">
          <Upload className="w-8 h-8 text-gray-500" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Drop your CV here, or <span className="text-blue-500">browse</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Supports PDF, DOC, and DOCX files
          </p>
        </div>
      </div>
    </div>
  );
}; 