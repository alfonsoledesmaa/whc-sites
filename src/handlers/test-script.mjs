import csv from 'csv-parser';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Determine the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV data file
const dataFilePath = path.resolve(__dirname, 'whc-sites.csv');
let sitesData = [];

function loadCSVData() {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(dataFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          sitesData = results;
          resolve();
        })
        .on('error', (error) => reject(error));
    });
  }

async function readSitesByCountry(params) {
    if (sitesData.length === 0) {
        await loadCSVData();
    }

    const countryName = params.country_name; //event.pathParameters?.country_name;

    if (!countryName) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "Country name is required in the path." }),
      };
    }
    
    const countrySites = sitesData.filter(site =>
      site.states_name_en.toLowerCase() === countryName.toLowerCase()
    );

    if (countrySites.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `No sites found for country: ${countryName}` }),
      };
    }

    // Summarize site counts by type
    const summary = {
      cultural: 0,
      natural: 0,
      mixed: 0,
    };

    countrySites.forEach(site => {
      const type = site.category ? site.category.toLowerCase() : "unknown";
      if (type === "cultural") summary.cultural++;
      else if (type === "natural") summary.natural++;
      else if (type === "mixed") summary.mixed++;
    });

    const response = {
      country: countryName,
      total_sites: countrySites.length,
      site_counts: summary,
      sites: countrySites.map(site => ({
        id: site.id_no,
        name: site.name_en,
        region: site.region_en,
      })),
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };

}

readSitesByCountry({country_name: 'Denmark'});