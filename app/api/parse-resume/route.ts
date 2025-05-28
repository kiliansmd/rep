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

    // In development, return dummy data
    if (process.env.NODE_ENV === 'development') {
      const dummyResumeData = {
        candidate: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          summary: "Experienced software developer with a focus on web technologies.",
          location: "New York, USA"
        },
        workExperience: [
          {
            company: "Tech Corp",
            position: "Senior Developer",
            startDate: "2020-01",
            endDate: "Present",
            description: "Led development of multiple web applications."
          }
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2016-09",
            endDate: "2020-06"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "TypeScript"],
        languages: ["English", "Spanish"]
      };

      // Store in Supabase
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            name: dummyResumeData.candidate.name,
            label: dummyResumeData.candidate.name,
            email: dummyResumeData.candidate.email,
            phone: dummyResumeData.candidate.phone,
            summary: dummyResumeData.candidate.summary,
            location: dummyResumeData.candidate.location,
            file_name: file.name,
            upload_date: new Date().toISOString(),
            parsed_data: dummyResumeData
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error storing dummy data:', error);
        return NextResponse.json(
          { error: 'Failed to store resume data' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Resume parsed successfully (dummy data)',
        data: dummyResumeData
      });
    }

    // In production, use the Resume Parser API
    if (!process.env.NEXT_PUBLIC_RESUME_PARSER_API) {
      return NextResponse.json(
        { error: 'Resume Parser API key not configured' },
        { status: 500 }
      );
    }

    const formDataForApi = new FormData();
    formDataForApi.append('file', file);

    const response = await fetch('https://api.resumeparser.io/api/v1/parser/resume', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_RESUME_PARSER_API
      },
      body: formDataForApi
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resume Parser API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to parse resume' },
        { status: response.status }
      );
    }

    const parsedData = await response.json();

    // Store in Supabase
    const { data, error } = await supabase
      .from('resumes')
      .insert([
        {
          name: parsedData.candidate.name,
          label: parsedData.candidate.name,
          email: parsedData.candidate.email,
          phone: parsedData.candidate.phone,
          summary: parsedData.candidate.summary,
          location: parsedData.candidate.location,
          file_name: file.name,
          upload_date: new Date().toISOString(),
          parsed_data: parsedData
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error storing resume data:', error);
      return NextResponse.json(
        { error: 'Failed to store resume data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedData
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 