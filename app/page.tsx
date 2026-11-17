import React from 'react';
import { google } from 'googleapis';
import DirectoryClient from './components/DirectoryClient';

async function getPrivateSheetData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // REPLACE THIS with the long ID found in your Google Sheet URL
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Master_Directory!A1:Z1000',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const getIndex = (name: string) => headers.indexOf(name);

    return dataRows.map((row, idx) => {
      const latIdx = getIndex('Latitude');
      const lngIdx = getIndex('Longitude');
      const hasLat = latIdx !== -1 && row[latIdx] && row[latIdx].trim() !== "";

      return {
        id: idx.toString(),
        name: row[getIndex('Org_Name')] || "Unknown Organization",
        address: `${row[getIndex('Main_Address_Line1')] || ''}, ${row[getIndex('City_Town')] || ''}, MA ${row[getIndex('ZIP')] || ''}`,
        lat: hasLat ? parseFloat(row[latIdx]) : 42.36,
        lng: hasLat ? parseFloat(row[lngIdx]) : -71.06,
        phone: row[getIndex('Main_Phone')],
        website: row[getIndex('Website')],
        services: row[getIndex('Service_Modalities')] ? row[getIndex('Service_Modalities')].split(';') : [],
        languages: row[getIndex('Languages_Spoken_By_Staff_Other_Than_English')] ? row[getIndex('Languages_Spoken_By_Staff_Other_Than_English')].split(';') : [],
        massHealth: row[getIndex('Accepts_MassHealth')] || "Unknown",
        medicare: row[getIndex('Accepts_Medicare')] || "Unknown",
        commercial: row[getIndex('Accepts_Commercial_Insurance')] || "Unknown",
        undocumented: row[getIndex('Serves_Regardless_of_Immigration_Status')] || "Unknown",
        telehealth: row[getIndex('Telehealth_Available')] || "Unknown",
        notes: row[getIndex('Qualitative_Notes')] || null
      };
    }).filter(res => res.name !== "Unknown Organization");

  } catch (error) {
    console.error("Error fetching private sheet:", error);
    return [];
  }
}

export default async function Page() {
  const secureData = await getPrivateSheetData();
  return (
    <main>
      <DirectoryClient initialData={secureData} />
    </main>
  );
}