// Import getAllItemsHandler function from get-all-items.mjs 
import { getAllItemsHandler } from '../../../src/handlers/get-all-items.mjs';

// This includes all tests for getAllItemsHandler() 
describe('Test getSitesByLanguageHandler', () => { 

    it('should return ids', async () => { 
        const items = [{ id: 'id1' }, { id: 'id2' }]; 
 
        const event = { 
            httpMethod: 'GET',
            pathParameters: {
                language: "es"
            }
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await getAllItemsHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(items) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
