// Create by Zubin on 2018-08-14 16:06:21

const MyPromise = require('../src/MyPromise');

describe('MyPromise', () => {
  it('构造函数传入一个function', () => {
    try {
      new MyPromise(null);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
    try {
      new MyPromise(1);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }

    try {
      new MyPromise('1');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }

    try {
      new MyPromise({});
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
    }
  });

  it('返回定义了then方法的对象或函数', () => {
    const p = new MyPromise(function(resolve, reject) {});
    expect(p).toBeInstanceOf(MyPromise);
    expect(p).toHaveProperty('then');
    expect(p.then()).toHaveProperty('then');
  });

  it('同步方法', () => {
    return new MyPromise(function(resolve) {
      resolve(1);
    }).then(data => {
      expect(data).toBe(1);
    });
  });

  it('同步链式调用', () => {
    return new MyPromise(function(resolve) {
      resolve(1);
    })
      .then(data => {
        expect(data).toBe(1);

        return new MyPromise(function(resolve) {
          resolve(2);
        });
      })
      .then(data => {
        expect(data).toBe(2);

        return new MyPromise(function(resolve) {
          resolve(3);
        });
      })
      .then(data => {
        expect(data).toBe(3);
      });
  });

  it('异步方法', () => {
    return new MyPromise(function(resolve) {
      setTimeout(() => {
        resolve(1);
      }, 0);
    }).then(data => {
      expect(data).toBe(1);
    });
  });

  it('异步链式调用', () => {
    return new MyPromise(function(resolve) {
      setTimeout(() => {
        resolve(1);
      }, 0);
    })
      .then(data => {
        expect(data).toBe(1);

        return new MyPromise(function(resolve) {
          setTimeout(() => {
            resolve(2);
          }, 0);
        });
      })
      .then(data => {
        expect(data).toBe(2);

        return new MyPromise(function(resolve) {
          setTimeout(() => {
            resolve(3);
          }, 0);
        });
      })
      .then(data => {
        expect(data).toBe(3);
      });
  });

  it('同步异步混合链式调用1', () => {
    return new MyPromise(function(resolve) {
      resolve(1);
    })
      .then(data => {
        expect(data).toBe(1);

        return new MyPromise(function(resolve) {
          setTimeout(() => {
            resolve(2);
          }, 0);
        });
      })
      .then(data => {
        expect(data).toBe(2);

        return new MyPromise(function(resolve) {
          setTimeout(() => {
            resolve(3);
          }, 0);
        });
      })
      .then(data => {
        expect(data).toBe(3);
      });
  });

  it('同步异步混合链式调用2', () => {
    return new MyPromise(function(resolve) {
      setTimeout(() => {
        resolve(1);
      }, 0);
    })
      .then(data => {
        expect(data).toBe(1);

        return new MyPromise(function(resolve) {
          resolve(2);
        });
      })
      .then(data => {
        expect(data).toBe(2);

        return 3;
      })
      .then(data => {
        expect(data).toBe(3);
      });
  });

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
