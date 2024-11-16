import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV data file
const dataFilePath = path.resolve(__dirname, 'whc-sites.csv');
let sitesData = [];

export function loadCSVData() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(dataFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                sitesData = results;
                resolve(sitesData);
            })
            .on('error', (error) => reject(error));
    });
}