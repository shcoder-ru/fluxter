/**
 *  @fileOverview   Class Fluxtor.
 *  @description    Simple container of unidirectional data flow.
 *  @author         Vasily Shilov <shcoder.ru@ya.ru> (https://github.com/shcoder-ru)
 *  @licence        ISC (https://github.com/shcoder-ru/fluxtor/blob/master/LICENSE.txt)
 *  {@link          https://github.com/shcoder-ru/fluxtor GitHub}
 *  {@link          https://www.npmjs.com/package/fluxtor NPM}
 */

/**
 * Class Fluxtor
 * @class Fluxtor
 * @public
 *
 * @example
 * let store = new Fluxtor({
 *     user: {
 *         logged: false,
 *         name: null,
 *         token: null
 *     }
 * });
 */
export default class Fluxtor {

    /**
     * @constructor
     * @param {Object=} state
     */
    constructor(state = {}) {
        checkArgumentType(state, 'first', 'object');
        this.reducers = [];
        this.middlewares = [];
        this.actions = {};
        this.handlers = [];
        this.state = state;
    }

    /**
     * Add reducer to store
     * @method addReducer
     * @param {String} stateKey
     * @param {Function} reducer
     *
     * @example
     * store.addReducer('user', (state = {}, actionName, actionData) => {
     *     if (actionName === 'login') {
     *         return {
     *             ...state,
     *             logged: actionData.logged,
     *             name: actionData.name,
     *             token: actionData.token
     *         };
     *     }
     *     return state;
     * });
     */
    addReducer(stateKey, reducer) {
        checkArgumentType(stateKey, 'first', 'string');
        checkArgumentType(reducer, 'second', 'function');
        this.reducers.push({
            stateKey: stateKey,
            reducer: reducer
        });
    }

    /**
     * Add middleware to store
     * @method addMiddleware
     * @param {Function} middleware

     * @example
     * store.addMiddleware('user', (store, actionName, actionData, next) => {
     *     if (actionName === 'login') {
     *         SomeRepository.check(actionData).then(data => next({
     *             ...data,
     *             ...actionData
     *         }));
     *     } else {
     *         next(actionData);
     *     }
     * });
     */
    addMiddleware(middleware) {
        checkArgumentType(middleware, 'first', 'function');
        this.middlewares.push(middleware);
    }

    /**
     * Add action to store
     * @method addAction
     * @param {String} actionName
     * @param {Function} action
     *
     * @example
     * store.addAction('login', (name, password) => ({
     *     name,
     *     password
     * }));
     */
    addAction(actionName, action) {
        checkArgumentType(actionName, 'first', 'string');
        checkArgumentType(action, 'second', 'function');
        this.actions[actionName] = action;
    }

    /**
     * Dispatch action to store
     * @method dispatch
     * @param {String} actionName
     * @param {...*} args
     *
     * @example
     * store.dispatch('login', 'example-name', 'example-password');
     */
    dispatch(actionName, ...args) {
        if (typeof this.actions[actionName] !== 'function') {
            throw new Error('Action "' + actionName + '" was not specified.');
        }
        let actionData = this.actions[actionName](...args);
        callMiddlewares.call(this, actionName, actionData, (actionData) => {
            callReducers.call(this, actionName, actionData);
            fire.call(this);
        });
    }

    /**
     * Add handler
     * @method subscribe
     * @param {Function} handler
     *
     * @example
     * s.subscribe(store => view.setState(store.state));
     */
    subscribe(handler) {
        checkArgumentType(handler, 'first', 'function');
        this.handlers.push(handler);
    }

}

/**
 * Call middlewares
 * @function callMiddlewares
 * @param {String} actionName
 * @param {*} actionData
 * @param {Function} done
 * @private
 */
function callMiddlewares(actionName, actionData, done) {
    let store = this;
    let index = -1;
    /**
     * Call next middleware or done
     * @function next
     * @param {*} actionData
     */
    function next(actionData) {
        index++;
        if(index === store.middlewares.length) {
            done(actionData);
        } else {
            store.middlewares[index](store, actionName, actionData, next);
        }
    }
    next(actionData);
}

/**
 * Call reducers
 * @function callReducers
 * @param {String} actionName
 * @param {*} actionData
 * @private
 */
function callReducers(actionName, actionData) {
    this.reducers.forEach(item => {
        this.state[item.stateKey] = item.reducer(this.state[item.stateKey], actionName, actionData);
    });
}

/**
 * Call handlers
 * @function fire
 * @private
 */
function fire() {
    this.handlers.forEach(handler => handler(this));
}

/**
 * Check type of argument
 * @function checkArgumentType
 * @param {*} argument
 * @param {String} position - first, second, ...
 * @param {String} type - string, function, ...
 * @throws {TypeError}
 * @private
 */
function checkArgumentType(argument, position, type) {
    let wrongTypeOf = typeof argument !== type;
    let isCheckObject = type === 'object';
    let n = isCheckObject ? 'n' : '';
    if (isCheckObject && (wrongTypeOf || argument.constructor !== Object) || wrongTypeOf) {
        throw new TypeError('A ' + position + ' argument must be a' + n + ' ' + type + '.');
    }
}
