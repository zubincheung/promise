// Create by Zubin on 2018-08-14 16:06:21

// const MyPromise = Promise;
const MyPromise = require('../src/MyPromise');

describe('MyPromise.resolve', () => {
  it('resolve', async () => {
    await MyPromise.resolve(1).then(data => {
      expect(data).toBe(1);
    });

    await MyPromise.resolve('1').then(data => {
      expect(data).toBe('1');
    });

    await MyPromise.resolve({ a: 1 }).then(data => {
      expect(data).toBeInstanceOf(Object);
      expect(data).toEqual({ a: 1 });
    });
  });
});
