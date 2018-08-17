// Create by Zubin on 2018-08-16 16:54:38
const MyPromise = require('../src/MyPromise');

describe('MyPromise.all', () => {
  it('传入的参数必须是iterable', () => {
    return MyPromise.all({}).catch(err => {
      expect(err).toBeInstanceOf(TypeError);
    });
  });

  it('所有状态都变成fulfilled，结果集返回一个数组', () => {
    const promises = [1, 2, 3, 4, 5].map(v => MyPromise.resolve(v));
    return MyPromise.all(promises)
      .then(values => {
        expect(values).toEqual([1, 2, 3, 4, 5]);
      })
      .catch(err => {
        expect(err).toBeUndefined();
      });
  });

  it('其中一个状态被rejected，状态就变成rejected', () => {
    const promises = [1, 2, 3, 4, 5].map(v => MyPromise.resolve(v));
    promises.push(MyPromise.reject(new Error('err')));
    return MyPromise.all(promises)
      .then(data => {
        expect(data).toBeUndefined();
      })
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
      });
  });
});
