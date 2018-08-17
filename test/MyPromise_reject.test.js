// Create by Zubin on 2018-08-14 16:06:21

// const MyPromise = Promise;
const MyPromise = require('../src/MyPromise');

describe('MyPromise.reject', () => {
  it('reject', async () => {
    await MyPromise.reject(1).catch(err => {
      expect(err).toBe(1);
    });

    await MyPromise.reject('1').catch(err => {
      expect(err).toBe('1');
    });

    await MyPromise.reject(new Error('err')).catch(err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('err');
    });
  });
});
