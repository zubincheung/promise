// Create by Zubin on 2018-08-14 16:06:21

// const MyPromise = Promise;
const MyPromise = require('../src/MyPromise');

describe('Promise', () => {
  it('reject', () => {
    return new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    }).catch(err => {
      expect(err.message).toBe('err');
    });
  });

  it('catch中的返回值', async () => {
    await new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    })
      .catch(err => {
        expect(err.message).toBe('err');
        return 1;
      })
      .then(data => {
        expect(data).toBe(1);
      });

    await new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    })
      .catch(err => {
        expect(err.message).toBe('err');
        return new MyPromise(resolve => {
          resolve(1);
        });
      })
      .then(data => {
        expect(data).toBe(1);
      });

    await new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    })
      .catch(err => {
        expect(err.message).toBe('err');
        return new MyPromise(resolve => {
          setTimeout(() => {
            resolve(1);
          }, 0);
        });
      })
      .then(data => {
        expect(data).toBe(1);
      });
  });

  it('捕捉then中的错误', async () => {
    await new MyPromise(function(resolve, reject) {
      resolve(1);
    })
      .then(data => {
        expect(data).toBe(1);
        throw new Error('err');
      })
      .catch(err => {
        expect(err.message).toBe('err');
      });

    await new MyPromise(function(resolve, reject) {
      resolve(1);
    })
      .then(data => {
        expect(data).toBe(1);
        return new MyPromise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('err'));
          }, 0);
        });
      })
      .catch(err => {
        expect(err.message).toBe('err');
      });

    await new MyPromise(function(resolve, reject) {
      resolve(1);
    })
      .then(data => {
        expect(data).toBe(1);
        return new MyPromise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('err'));
          }, 0);
        });
      })
      .then(
        data => {
          expect(data).toBeUndefined();
        },
        err => {
          expect(err.message).toBe('err');
        }
      );
  });

  it('捕捉catch中的错误：', async () => {
    await new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    })
      .catch(err => {
        expect(err.message).toBe('err');
        throw new Error('err1');
      })
      .catch(err => {
        expect(err.message).toBe('err1');
      });
    await new MyPromise(function(resolve, reject) {
      reject(new Error('err'));
    })
      .catch()
      .catch(err => {
        expect(err.message).toBe('err');
      });
  });
});
