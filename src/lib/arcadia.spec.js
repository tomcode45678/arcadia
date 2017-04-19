import arcadia from './arcadia';

test('is a function', () => {
  expect(arcadia.ajax).toEqual(jasmine.any(Function));
});
