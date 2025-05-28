import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Dummy-Daten für die Entwicklung
const dummyResumes = [
  {
    id: '1',
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
    fileName: "max_mustermann_cv.pdf",
    uploadedAt: new Date().toISOString()
  },
  {
    id: '2',
    basics: {
      name: "Anna Schmidt",
      label: "Product Manager",
      email: "anna@example.com",
      phone: "+49 987 654321",
      summary: "Erfahrene Product Managerin mit Fokus auf digitale Produkte",
      location: {
        city: "München",
        region: "Bayern",
        countryCode: "DE"
      }
    },
    fileName: "anna_schmidt_cv.pdf",
    uploadedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Im Entwicklungsmodus verwenden wir Dummy-Daten
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(dummyResumes);
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('uploadedAt', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
} 