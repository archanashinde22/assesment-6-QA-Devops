const {shuffleArray} = require('./utils')
let arr = [1,2,3,4,5,6,7,8,9,10]
let shufflearr = shuffleArray(arr);
describe('shuffleArray should', () => {
    // CODE HERE

    test('Test 1 :all the same items are in the shuffled array ', () => {
        
        expect(shufflearr).toEqual(
            expect.arrayContaining(arr))
      });
      test('Test 2: check length of argument arr is same as shufflearr ', () => {
        
        expect(shufflearr.length).toBe(arr.length)
      });

      test('Test 3 : returns arr ', () => {
       expect(Array.isArray(shufflearr)).toBeTruthy()
      });
        
      test('Test 4 : return an array in a different order than that passed in', ( ) => {
        expect(shufflearr).not.toEqual(arr)
    })
    
})