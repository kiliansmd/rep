# CV Parser Application

Eine Next.js-Anwendung zum Parsen und Verwalten von Lebensläufen.

## Technologien

- Next.js 15.2.4
- TypeScript
- Supabase (Datenbank)
- Tailwind CSS
- Resume Parser API

## Lokale Entwicklung

1. Repository klonen:
```bash
git clone [repository-url]
cd cv-parser
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
Erstelle eine `.env.local` Datei mit folgenden Variablen:
```env
# Resume Parser API
NEXT_PUBLIC_RESUME_PARSER_API=your-api-key

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Entwicklungsserver starten:
```bash
npm run dev
```

## Deployment auf Vercel

1. Repository auf GitHub pushen
2. In Vercel ein neues Projekt erstellen
3. GitHub-Repository verbinden
4. Umgebungsvariablen in Vercel konfigurieren:
   - NEXT_PUBLIC_RESUME_PARSER_API
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

## Supabase Setup

1. Erstelle eine neue Tabelle `resumes` mit folgenden Feldern:
   - `id` (UUID, Primary Key)
   - `fileName` (Text)
   - `uploadedAt` (Timestamp)
   - `basics` (JSONB)
   - `work` (JSONB)
   - `education` (JSONB)
   - `skills` (JSONB)
   - `languages` (JSONB)

2. RLS (Row Level Security) Policies konfigurieren:
   - Für Lese-Zugriff: `SELECT` Policy für authentifizierte Benutzer
   - Für Schreib-Zugriff: `INSERT` Policy für authentifizierte Benutzer

## Features

- Lebenslauf-Upload und Parsing
- Speicherung in Supabase
- Anzeige und Verwaltung von Lebensläufen
- Responsive Design
- Dark/Light Mode 