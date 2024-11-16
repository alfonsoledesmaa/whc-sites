// Import getAllItemsHandler function from get-all-items.mjs 
import { getSitesSummaryByCountryHandler } from '../../../src/handlers/get-sites-by-country.mjs';

// This includes all tests for getAllItemsHandler() 
describe('Test getSitesByLanguageHandler', () => {
    const result = {
        country: "Austria",
        total_sites: 7,
        site_counts: {
            cultural: 7,
            natural: 0,
            mixed: 0
        },
        sites: [
            {
                id: "784",
                name: "Historic Centre of the City of Salzburg",
                region: "Europe and North America"
            },
            {
                id: "785",
                name: "Semmering Railway",
                region: "Europe and North America"
            },
            {
                id: "786",
                name: "Palace and Gardens of Schönbrunn",
                region: "Europe and North America"
            },
            {
                id: "806",
                name: "Hallstatt-Dachstein / Salzkammergut Cultural Landscape",
                region: "Europe and North America"
            },
            {
                id: "931",
                name: "City of Graz – Historic Centre and Schloss Eggenberg",
                region: "Europe and North America"
            },
            {
                id: "970",
                name: "Wachau Cultural Landscape",
                region: "Europe and North America"
            },
            {
                id: "1033",
                name: "Historic Centre of Vienna",
                region: "Europe and North America"
            }
        ]
    };

    it('should return seven spots from Austria', async () => { 
        const data = {
            country: "Austria",
            total_sites: 7,
            site_counts: {
                cultural: 7,
                natural: 0,
                mixed: 0
            },
            sites: [
                {
                    id: "784",
                    name: "Historic Centre of the City of Salzburg",
                    region: "Europe and North America"
                },
                {
                    id: "785",
                    name: "Semmering Railway",
                    region: "Europe and North America"
                },
                {
                    id: "786",
                    name: "Palace and Gardens of Schönbrunn",
                    region: "Europe and North America"
                },
                {
                    id: "806",
                    name: "Hallstatt-Dachstein / Salzkammergut Cultural Landscape",
                    region: "Europe and North America"
                },
                {
                    id: "931",
                    name: "City of Graz – Historic Centre and Schloss Eggenberg",
                    region: "Europe and North America"
                },
                {
                    id: "970",
                    name: "Wachau Cultural Landscape",
                    region: "Europe and North America"
                },
                {
                    id: "1033",
                    name: "Historic Centre of Vienna",
                    region: "Europe and North America"
                }
            ]
        };
        

        const event = { 
            httpMethod: 'GET',
            pathParameters: {
                country_name: "Austria"
            }
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await getSitesSummaryByCountryHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(data) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
