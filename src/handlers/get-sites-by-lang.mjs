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

export const getSitesByLanguageHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSitesByLanguageHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);

    if (sitesData.length === 0) {
        await loadCSVData();
    }

    try {
        const queryParams = params.queryStringParamerers || {};
        const language = queryParams.language || 'en';

        // Determine language fields based on the `language` parameter
        const nameField = `name_${language}`;
        const descriptionField = `short_description_${language}`;

        // Filter and map data based on available fields
        const filteredData = sitesData
        .filter(site => site[nameField])  // Only include entries where the language-specific name is present
        .map(site => ({
            id: site.id_no,
            name: site[nameField],
            description: site[descriptionField] || '',
            country: site.states_name_en,  // Defaulting to English for country names
            region: site.region_en
        }));

    } catch (err) {
        const errorResponse = {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: "Internal Server Error", error: err.message })
        };
        return errorResponse;
    }

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
