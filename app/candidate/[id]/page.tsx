'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { KandidatenProfile } from '@/components/kandidaten-profile';
import { useParams } from 'next/navigation';
import type { Kandidat, AccountManager, NavigationItem } from '@/types/kandidat';

interface ParsedResume {
  parsed: {
    name: string;
    title: string;
    brief: string;
    contact: {
      location_city: string;
      location_country: string;
      email: string;
      phone: string;
      linkedin: string;
      github: string | null;
      twitter: string | null;
      website: string | null;
    };
    employment_history: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      graduationDate: string;
    }>;
    skills: string[];
    languages: string[];
    derived: {
      years_of_experience: number;
      approximate_age: number;
    };
  };
  fileName: string;
  uploadedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resume/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const data = await response.json();
        setResumeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resume data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeData();
    }
  }, [id]);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Heute';
    try {
      // Try parsing different date formats
      let date;
      if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD format
        date = new Date(dateStr);
      } else if (dateStr.match(/^\d{4}$/)) {
        // Handle year only format
        date = new Date(parseInt(dateStr), 0, 1);
      } else {
        // Try parsing as is
        date = new Date(dateStr);
      }
      
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat('de-DE', { 
        year: 'numeric', 
        month: 'long'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const mapResumeToKandidat = (resume: ParsedResume): Kandidat => {
    return {
      name: resume.parsed.name,
      position: resume.parsed.title,
      gehalt: 'Auf Anfrage', // Default value
      standort: `${resume.parsed.contact.location_city}, ${resume.parsed.contact.location_country}`,
      verfuegbarkeit: 'Sofort', // Default value
      erfahrung: `${resume.parsed.derived.years_of_experience} Jahre`,
      location: {
        address: 'wewewewewe',
        postalCode: '',
        city: resume.parsed.contact.location_city,
        countryCode: resume.parsed.contact.location_country,
        region: ''
      },
      kurzprofil: resume.parsed.brief,
      lebenslauf: '', // Will be populated from normalized_text if needed
      einschaetzung: resume.parsed.brief,
      senioritaet: resume.parsed.derived.years_of_experience > 5 ? 'Senior' : 'Mid-Level',
      jobrollen: [resume.parsed.title],
      kernthemen: resume.parsed.skills,
      persoenlicheDaten: {
        geburtsdatum: '',
        geburtsort: '',
        wohnort: resume.parsed.contact.location_city,
        familienstand: ''
      },
      softwareKenntnisse: resume.parsed.skills.map(skill => ({
        name: skill,
        level: 80 // Default level
      })),
      sprachkenntnisse: resume.parsed.languages.map(lang => ({
        sprache: lang,
        niveau: 'Fließend', // Default value
        level: 80 // Default level
      })),
      highlights: [],
      topSkills: resume.parsed.skills.slice(0, 3).map(skill => ({
        title: skill,
        description: '',
        keywords: []
      })),
      work: resume.parsed.employment_history.map(job => ({
        name: job.company,
        position: job.position,
        startDate: formatDate(job.startDate),
        endDate: job.endDate === 'Present' ? 'Heute' : formatDate(job.endDate),
        summary: Array.isArray(job.description) ? job.description.join('\n') : job.description || '',
        achievements: Array.isArray(job.description) ? job.description : []
      })),
      education: resume.parsed.education.map(edu => ({
        institution: edu.institution,
        url: '',
        area: edu.degree,
        studyType: edu.degree,
        startDate: formatDate(edu.graduationDate),
        endDate: formatDate(edu.graduationDate),
        note: ''
      })),
      certificates: [],
      languages: resume.parsed.languages.map(lang => ({
        language: lang,
        fluency: 'Fließend' // Default value
      }))
    };
  };

  const mockAccountManager: AccountManager = {
    name: 'John Doe',
    position: 'Account Manager',
    email: 'john.doe@example.com',
    phone: '+49 123 456789'
  };

  const generateNavSections = (resume: ParsedResume): NavigationItem[] => {
    const sections: NavigationItem[] = [
      { id: 'profile', label: 'Profil' }
    ];

    if (resume.parsed.employment_history.length > 0) {
      sections.push({ id: 'experience', label: 'Erfahrung' });
    }
    if (resume.parsed.education.length > 0) {
      sections.push({ id: 'education', label: 'Ausbildung' });
    }
    if (resume.parsed.skills.length > 0) {
      sections.push({ id: 'skills', label: 'Fähigkeiten' });
    }
    if (resume.parsed.languages.length > 0) {
      sections.push({ id: 'languages', label: 'Sprachen' });
    }

    return sections;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
          {error}
        </div>
      ) : resumeData ? (
        <div className="bg-white">
          <KandidatenProfile
            kandidat={mapResumeToKandidat(resumeData)}
            accountManager={mockAccountManager}
            navSections={generateNavSections(resumeData)}
          />
        </div>
      ) : null}
    </main>
  );
} 