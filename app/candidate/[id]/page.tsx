'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { KandidatenProfile } from '@/components/kandidaten-profile';
import { useParams } from 'next/navigation';
import type { Kandidat, AccountManager, NavigationItem } from '@/types/kandidat';
// Importiere format und de von date-fns
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ParsedResume {
  parsed: {
    name?: string | null; // Make optional/nullable
    title?: string | null; // Make optional/nullable
    brief?: string | null; // Make optional/nullable
    contact?: { // Make optional
      location_city?: string | null; // Make optional/nullable
      location_country?: string | null; // Make optional/nullable
      email?: string | null; // Make optional/nullable
      phone?: string | null; // Make optional/nullable
      linkedin?: string | null;
      github?: string | null;
      twitter?: string | null;
      website?: string | null;
    } | null; // Make nullable
    employment_history?: Array<{ // Make optional
      company?: string | null; // Make optional/nullable
      position?: string | null; // Make optional/nullable
      startDate?: string | null; // Make optional/nullable
      endDate?: string | null; // Make optional/nullable
      description?: string[] | null; // Make optional/nullable
    }> | null; // Make nullable
    education?: Array<{ // Make optional
      degree?: string | null; // Make optional/nullable
      institution?: string | null; // Make optional/nullable
      graduationDate?: string | null; // Make optional/nullable
    }> | null; // Make nullable
    skills?: string[] | null; // Make optional/nullable
    languages?: string[] | null; // Make optional/nullable
    derived?: { // Make optional
      years_of_experience?: number | null; // Make optional/nullable
      approximate_age?: number | null; // Make optional/nullable
    } | null; // Make nullable
  };
  fileName?: string | null; // Make optional/nullable
  uploadedAt?: string | null; // Should be a string in ISO format from Supabase, make optional/nullable
}

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [kandidatData, setKandidatData] = useState<Kandidat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resume/${id}`);
        if (!response.ok) {
          // Versuche, die Fehlermeldung vom Server zu lesen
          const errorText = await response.text();
          throw new Error(`Failed to fetch resume data: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data: ParsedResume = await response.json();
        setResumeData(data);
        // Map the fetched data to Kandidat format here after data is set
        // This part runs on the client after fetching
        setKandidatData(mapResumeToKandidat(data));

      } catch (err) {
        console.error("Error fetching or processing resume data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch resume data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeData();
    }
  }, [id]); // Abhängigkeit vom id-Parameter

  // Helper function to safely get nested properties
  const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined => {
    return obj?.[key];
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Heute';
    try {
      // date-fns parseISO can handle ISO strings directly
      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        // Wenn das native Parsing fehlschlägt, gib den Original-String zurück oder handle es anders
        console.warn("Could not parse date string:", dateStr);
        return dateStr;
      }

      // Verwenden Sie date-fns zum Formatieren des Datums mit dem importierten de Locale
      return format(date, 'MMMM yyyy', { locale: de });
    } catch (e) {
      console.error("Error formatting date:", dateStr, e);
      return dateStr;
    }
  };

  const mapResumeToKandidat = (resume: ParsedResume): Kandidat => {
    const parsed = resume.parsed;

    return {
      name: safeGet(parsed, 'name') || '',
      position: safeGet(parsed, 'title') || '',
      gehalt: 'Auf Anfrage', // Default value
      standort: `${safeGet(parsed?.contact, 'location_city') || ''}${safeGet(parsed?.contact, 'location_city') && safeGet(parsed?.contact, 'location_country') ? ', ' : ''}${safeGet(parsed?.contact, 'location_country') || ''}`,
      verfuegbarkeit: 'Sofort', // Default value
      erfahrung: `${safeGet(parsed?.derived, 'years_of_experience') ?? 0} Jahre`, // Nutze Nullish Coalescing
      location: {
        address: '', // Annahme: nicht im ParsedResume
        postalCode: '', // Annahme: nicht im ParsedResume
        city: safeGet(parsed?.contact, 'location_city') || '',
        countryCode: safeGet(parsed?.contact, 'location_country') || '',
        region: '' // Annahme: nicht im ParsedResume
      },
      kurzprofil: safeGet(parsed, 'brief') || '',
      lebenslauf: '', // Will be populated from normalized_text if needed
      einschaetzung: safeGet(parsed, 'brief') || '', // Annahme: gleicher Wert wie kurzprofil
      senioritaet: (safeGet(parsed?.derived, 'years_of_experience') ?? 0) > 5 ? 'Senior' : 'Mid-Level',
      jobrollen: [safeGet(parsed, 'title')].filter(Boolean), // Filtere leere Werte
      kernthemen: safeGet(parsed, 'skills') || [],
      persoenlicheDaten: {
        geburtsdatum: '', // Annahme: nicht im ParsedResume
        geburtsort: '', // Annahme: nicht im ParsedResume
        wohnort: safeGet(parsed?.contact, 'location_city') || '',
        familienstand: '' // Annahme: nicht im ParsedResume
      },
      softwareKenntnisse: (safeGet(parsed, 'skills') || []).map(skill => ({
        name: skill || '',
        level: 80 // Default level
      })),
      sprachkenntnisse: (safeGet(parsed, 'languages') || []).map(lang => {
        // Annahme: lang ist ein String oder ein Objekt { language: string, fluency: string }
         return {
           sprache: (typeof lang === 'object' && lang !== null ? safeGet(lang, 'language') : lang) || '', // Handle both string and object format
           niveau: (typeof lang === 'object' && lang !== null ? safeGet(lang, 'fluency') : 'Fließend') || 'Fließend', // Default or use fluency from object
           level: 80 // Default level
         };
      }),
      highlights: [], // Annahme: nicht im ParsedResume
      topSkills: (safeGet(parsed, 'skills') || []).slice(0, 3).map(skill => ({
        title: skill || '',
        description: '', // Annahme: nicht im ParsedResume
        keywords: [] // Annahme: nicht im ParsedResume
      })),
      work: (safeGet(parsed, 'employment_history') || []).map(job => ({
        name: safeGet(job, 'company') || '',
        position: safeGet(job, 'position') || '',
        startDate: formatDate(safeGet(job, 'startDate')),
        endDate: safeGet(job, 'endDate')?.toLowerCase() === 'present' ? 'Heute' : formatDate(safeGet(job, 'endDate')), // Check for null/undefined and lowercase 'present'
        summary: Array.isArray(safeGet(job, 'description')) ? safeGet(job, 'description')?.join('\n') || '' : safeGet(job, 'description') || '',
        achievements: Array.isArray(safeGet(job, 'description')) ? safeGet(job, 'description') || [] : []
      })),
      education: (safeGet(parsed, 'education') || []).map(edu => ({
        institution: safeGet(edu, 'institution') || '',
        url: '', // Annahme: nicht im ParsedResume
        area: safeGet(edu, 'degree') || '',
        studyType: safeGet(edu, 'degree') || '', // Annahme: gleicher Wert wie degree
        startDate: formatDate(safeGet(edu, 'graduationDate')),
        endDate: formatDate(safeGet(edu, 'graduationDate')), // Annahme: Enddatum = Startdatum für Bildung
        note: '' // Annahme: nicht im ParsedResume
      })),
      certificates: [], // Annahme: nicht im ParsedResume
      languages: (safeGet(parsed, 'languages') || []).map(lang => {
         // Passe dies an, falls lang ein Objekt { language: string, fluency: string } ist, basierend auf dem tatsächlichen ParsedResume
         return {
           language: (typeof lang === 'object' && lang !== null ? safeGet(lang, 'language') : lang) || '', // Handle both string and object format
           fluency: (typeof lang === 'object' && lang !== null ? safeGet(lang, 'fluency') : 'Fließend') || 'Fließend' // Default or use fluency from object
         };
      })
    };
  };

  const mockAccountManager: AccountManager = {
    name: 'John Doe',
    position: 'Account Manager',
    email: 'john.doe@example.com',
    phone: '+49 123 456789'
  };

  const generateNavSections = (resume: ParsedResume | null): NavigationItem[] => {
     if (!resume?.parsed) return []; // Return empty array if no parsed data

    const sections: NavigationItem[] = [
      { id: 'profile', label: 'Profil' }
    ];

    // Füge Sektionen nur hinzu, wenn die entsprechenden Daten vorhanden sind
    if (resume.parsed.employment_history && resume.parsed.employment_history.length > 0) {
      sections.push({ id: 'experience', label: 'Erfahrung' });
    }
    if (resume.parsed.education && resume.parsed.education.length > 0) {
      sections.push({ id: 'education', label: 'Ausbildung' });
    }
    if (resume.parsed.skills && resume.parsed.skills.length > 0) {
      sections.push({ id: 'skills', label: 'Fähigkeiten' });
    }
    if (resume.parsed.languages && resume.parsed.languages.length > 0) {
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
      ) : kandidatData ? ( // Rendere nur, wenn kandidatData vorhanden ist
        <div className="bg-white">
          <KandidatenProfile
            kandidat={kandidatData} // Verwende gemappte Daten
            accountManager={mockAccountManager}
            navSections={generateNavSections(resumeData)} // generateNavSections benötigt resumeData (optional jetzt)
          />
        </div>
      ) : null} {/* Zeige nichts an, wenn keine Daten oder ein Fehler vorliegt */}
    </main>
  );
}
