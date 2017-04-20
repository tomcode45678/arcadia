import app from './arcadia';

test('is a function', () => {
  expect(app.Ajax).toEqual(jasmine.any(Function));
});
