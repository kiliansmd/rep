'use client';

import { useEffect, useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Resume {
  id: string;
  fileName: string;
  uploadedAt: {
    _seconds: number;
    seconds: number;
  };
  // Add other fields based on your parsed data
}

export const ResumeList = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/get-resumes');
        if (!response.ok) {
          throw new Error('Failed to fetch resumes');
        }
        const data = await response.json();
        setResumes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleResumeClick = (id: string) => {
    router.push(`/candidate/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center text-gray-500 min-h-[400px] flex items-center justify-center">
        No resumes uploaded yet
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          onClick={() => handleResumeClick(resume.id)}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{resume.fileName}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(resume.uploadedAt._seconds * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 