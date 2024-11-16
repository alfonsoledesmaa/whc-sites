import { loadCSVData } from './csvLoader.mjs';

export const getSitesByLanguageHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSitesByLanguageHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    try {

        // Retrieve CSV Data
        const sitesData = await loadCSVData();

        const queryParams = event.queryStringParameters || {};
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

        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredData)
        };

        return response

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
}
