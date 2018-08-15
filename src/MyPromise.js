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

module.exports = MyPromise;
