import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Dummy-Daten für die Entwicklung
const dummyResumeData = {
  basics: {
    name: "Max Mustermann",
    label: "Software Engineer",
    email: "max@example.com",
    phone: "+49 123 456789",
    summary: "Erfahrener Software Engineer mit Fokus auf Web-Entwicklung",
    location: {
      city: "Berlin",
      region: "Berlin",
      countryCode: "DE"
    }
  },
  work: [
    {
      name: "Tech Company GmbH",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "Present",
      summary: "Entwicklung von Web-Anwendungen mit React und Node.js"
    }
  ],
  education: [
    {
      institution: "Technische Universität Berlin",
      area: "Informatik",
      studyType: "Bachelor",
      startDate: "2015",
      endDate: "2019"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "TypeScript"],
  languages: [
    {
      language: "Deutsch",
      fluency: "Muttersprache"
    },
    {
      language: "Englisch",
      fluency: "Fließend"
    }
  ]
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Im Entwicklungsmodus verwenden wir Dummy-Daten
    if (process.env.NODE_ENV === 'development') {
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            ...dummyResumeData,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        ...data,
        message: 'Resume parsed and stored successfully (Development Mode)'
      });
    }

    // Produktionsmodus
    if (!process.env.NEXT_PUBLIC_RESUME_PARSER_API) {
      throw new Error('RESUME_PARSER_API_KEY is not defined in environment variables');
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch('https://resumeparser.app/resume/parse', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESUME_PARSER_API}`
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error(`Resume parser API error: ${response.status}`);
    }

    const parsedData = await response.json();

    // Speichere in Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('resumes')
      .insert([
        {
          ...parsedData,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      throw supabaseError;
    }

    return NextResponse.json({
      ...supabaseData,
      message: 'Resume parsed and stored successfully'
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
} 