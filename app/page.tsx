import React from 'react';
import Papa from 'papaparse';
import DirectoryClient from './components/DirectoryClient';

async function getPublicSheetData() {
  const SPREADSHEET_ID = '1m1yc1k1StZfYFMuJw7mKCawu7CrW9130FoYMZAiC5eU';
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=Master_Directory`;

  try {
    // Fetches the public sheet and caches it for 1 hour to keep your site lightning fast
    const res = await fetch(url, { next: { revalidate: 3600 } }); 
    const csvText = await res.text();

    const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    return data.map((row: any, idx: number) => ({
      id: idx.toString(),
      name: row['Org_Name'] || "Unknown Organization",
      address: `${row['Main_Address_Line1'] || ''}, ${row['City_Town'] || ''}, MA ${row['ZIP'] || ''}`,
      lat: row['Latitude'] ? parseFloat(row['Latitude']) : 42.36,
      lng: row['Longitude'] ? parseFloat(row['Longitude']) : -71.06,
      phone: row['Main_Phone'] || '',
      website: row['Website'] || '',
      services: row['Service_Modalities'] ? row['Service_Modalities'].split(';') : [],
      languages: row['Languages_Spoken_By_Staff_Other_Than_English'] ? row['Languages_Spoken_By_Staff_Other_Than_English'].split(';') : [],
      massHealth: row['Accepts_MassHealth'] || "Unknown",
      medicare: row['Accepts_Medicare'] || "Unknown",
      commercial: row['Accepts_Commercial_Insurance'] || "Unknown",
      undocumented: row['Serves_Regardless_of_Immigration_Status'] || "Unknown",
      telehealth: row['Telehealth_Available'] || "Unknown",
      notes: row['Qualitative_Notes'] || null
    })).filter((res: any) => res.name !== "Unknown Organization");
  } catch (error) {
    console.error("Error fetching public sheet:", error);
    return [];
  }
}

export default async function Page() {
  const data = await getPublicSheetData();
  return (
    <main>
      <DirectoryClient initialData={data} />
    </main>
  );
}