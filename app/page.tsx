'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const parsedData = await res.json();
      
      // Navigate to resumes page after successful upload
      router.push('/resumes');
    } catch (error) {
      console.error('Error processing resume:', error);
      setError(error instanceof Error ? error.message : 'Failed to process resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Upload Resume
              </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-600">
                    Upload your CV and let us analyze it for you
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <FileUpload onFileUpload={handleFileUpload} />
                  {isLoading && (
                    <div className="mt-4 text-blue-600">
                      Processing your CV...
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 text-red-600">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
