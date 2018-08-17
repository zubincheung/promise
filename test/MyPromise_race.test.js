// Create by Zubin on 2018-08-16 16:54:38
const MyPromise = require('../src/MyPromise');

describe('MyPromise.race', () => {
  it('传入的参数必须是iterable', () => {
    return MyPromise.race({}).catch(err => {
      expect(err).toBeInstanceOf(TypeError);
    });
  });

  it('有一个实例率先改变状态变成fulfilled', async () => {
    const promises = [1, 2, 3, 4, 5].map(v => MyPromise.resolve(v));
    await MyPromise.race(promises)
      .then(data => {
        expect(data).toEqual(1);
      })
      .catch(err => {
        expect(err).toBeUndefined();
      });

    await MyPromise.race([
      new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, 60);
      }),
      new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(2);
        }, 10);
      }),
    ])
      .then(data => {
        expect(data).toEqual(2);
      })
      .catch(err => {
        expect(err).toBeUndefined();
      });
  });

  it('其中一个状态先rejected，状态就变成rejected', () => {
    return MyPromise.race([
      new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, 60);
      }),
      new MyPromise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('err'));
        }, 10);
      }),
    ]).catch(err => {
      expect(err).toBeInstanceOf(Error);
    });
  });
});
