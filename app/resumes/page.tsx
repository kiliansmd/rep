'use client';

import { ResumeList } from '@/components/ResumeList';
import { Header } from '@/components/Header';

export default function ResumesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Uploaded Resumes
              </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <ResumeList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 