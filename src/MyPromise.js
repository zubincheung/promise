// Create by Zubin on 2018-08-14

/**
 * Proise简单实现
 */
function MyPromise(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError(`Promise resolver ${fn} is not a function`);
  }

  let state = 'Pending';
  const deferredList = [];
  let value = null;

  function handler(deferred) {
    try {
      switch (state) {
        case 'Pending':
          // 当前的promise对象为pendding时候 直接加入到异步回调中
          deferredList.push(deferred);
          break;
        case 'Fulfilled':
          // Fulfilled状态 直接执行then参数函数
          if (deferred.onFulfilled) {
            value = deferred.onFulfilled(value);
          }
          // 传递返回值
          deferred.resolve(value);

          break;
        case 'Rejected':
          // Rejected状态 直接执行catch参数函数
          if (deferred.onRejected) {
            value = deferred.onRejected(value);

            // 传递catch中的返回值给下个then
            deferred.resolve(value);
          } else {
            deferred.reject(value);
          }
          break;
      }
    } catch (error) {
      // 捕捉错误并传递给下个catch
      deferred.reject(error);
    }
  }

  /**
   * 异步执行回调
   */
  function final() {
    setTimeout(() => {
      deferredList.forEach(deferred => {
        handler(deferred);
      });
    }, 0);
  }

  function resolve(val) {
    state = 'Fulfilled';
    value = val;

    final();
  }

  function reject(newReason) {
    state = 'Rejected';
    value = newReason;

    final();
  }

  /**
   * then
   * @param {*} onFulfilled
   * @param {*} onRejected
   */
  this.then = function(onFulfilled, onRejected) {
    // 返回一个Promise,保证是thenable的
    return new Promise((newResolve, newReject) => {
      handler({
        onFulfilled,
        onRejected,
        resolve: newResolve,
        reject: newReject,
      });
    });
  };

  /**
   * catch
   * @param {*} onRejected
   */
  this.catch = function(onRejected) {
    return this.then(undefined, onRejected);
  };

  fn(resolve, reject);
}

/**
 * resolve
 * @param {*} value
 */
MyPromise.resolve = function(value) {
  return new MyPromise(resolve => {
    resolve(value);
  });
};

/**
 * reject
 * @param {*} value
 */
MyPromise.reject = function(value) {
  return new MyPromise((resolve, reject) => {
    reject(value);
  });
};

/**
 * All
 * @param {MyPromise[]} promises
 */
MyPromise.all = function(promises) {
  if (!Array.isArray(promises)) {
    return MyPromise.reject(new TypeError('promises is not Array'));
  }

  return new MyPromise((resolve, reject) => {
    const results = [];
    let count = promises.length;
    let isChange = false; // 状态是否改变，避免重复执行

    function resolver(index) {
      return value => {
        // 存储每一个promise的执行结果
        results[index] = value;

        // 所有的promise 都已经运行完成，执行resolve函数
        if (--count === 0 && !isChange) {
          resolve(results);
        }
      };
    }

    function rejecter(reason) {
      // 若有一个失败，就执行reject函数
      if (!isChange) {
        isChange = true;
        reject(reason);
      }
    }

    // 依次循环执行每个promise
    promises.forEach((promise, i) => {
      promise.then(resolver(i), rejecter);
    });
  });
};

/**
 * Race
 * @param {MyPromise[]} promises
 */
MyPromise.race = function(promises) {
  if (!Array.isArray(promises)) {
    return MyPromise.reject(new TypeError('promises is not Array'));
  }

  return new MyPromise((resolve, reject) => {
    let isChange = false; // 状态是否改变，避免重复执行

    function resolver(value) {
      // 若有一个成功，就执行resolve函数
      if (!isChange) {
        isChange = true;
        resolve(value);
      }
    }

    function rejecter(reason) {
      // 若有一个失败，就执行reject函数
      if (!isChange) {
        isChange = true;
        reject(reason);
      }
    }

    promises.forEach(promise => {
      promise.then(resolver, rejecter);
    });
  });
};

module.exports = MyPromise;
