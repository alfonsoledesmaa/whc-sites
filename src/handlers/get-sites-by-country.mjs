import { loadCSVData } from './csvLoader.mjs';

export const getSitesSummaryByCountryHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSitesByCountryHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);

    try {
        // Retrieve CSV Data
        const sitesData = await loadCSVData();

        // Retrieve the country parameter
        const countryName = event.pathParameters?.country_name;

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
