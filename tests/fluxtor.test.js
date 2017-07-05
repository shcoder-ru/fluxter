import Fluxtor from '../src/fluxtor';
import expect from 'expect';

describe('Fluxtor specs:', function () {

    it('should change state by action and reducer', function () {

        let store = new Fluxtor();

        store.addAction('action1', function (data) {
            return {data};
        });

        store.addAction('action2', function () {
            return {};
        });

        store.addReducer('example', function (state = {}, actionName, actionData) {
            if (actionName === 'action1') {
                return {...state, ...actionData};
            }
            return state;
        });

        store.dispatch('action2');
        expect(store.state).toEqual({ example: {} });

        store.dispatch('action1', 1);
        expect(store.state).toEqual({ example: {data: 1} });

    });

    it('should change state by action and 2 reducers', function (done) {

        let store = new Fluxtor();

        store.addAction('action1', function (first, second) {
            return {first, second};
        });

        store.addAction('action2', function () {
            return {};
        });

        store.addReducer('first', function (state = {}, actionName, actionData) {
            if (actionName === 'action1') {
                return {...state, data: actionData.first};
            }
            return state;
        });

        store.addReducer('second', function (state = {}, actionName, actionData) {
            if (actionName === 'action1') {
                return {...state, data: actionData.second};
            }
            return state;
        });

        store.dispatch('action2');
        expect(store.state).toEqual({ first: {}, second: {} });

        store.dispatch('action1', 1, 2);
        expect(store.state).toEqual({
            first: {data: 1},
            second: {data: 2}
        });

        done();

    });

    it('should change state by action, middleware and 2 reducers', function (done) {

        let store = new Fluxtor();

        store.addAction('action1', function (first, second) {
            return {first, second};
        });

        store.addAction('action2', function () {
            return {};
        });

        store.addMiddleware(function (store, actionName, actionData, next) {
            if (actionName === 'action1') {
                setTimeout(() => {
                    next({...actionData, first: actionData.first + 5});
                }, 50);
            } else {
                next(actionData);
            }
        });

        store.addReducer('first', function (state = {}, actionName, actionData) {
            if (actionName === 'action1') {
                return {
                    ...state,
                    data: actionData.first
                };
            }
            return state;
        });

        store.addReducer('second', function (state = {}, actionName, actionData) {
            if (actionName === 'action1') {
                return {...state, data: actionData.second};
            }
            return state;
        });

        store.subscribe(function (store) {
            expect(store.state).toEqual({
                first: {data: 6},
                second: {data: 2}
            });
            done();
        });

        store.dispatch('action1', 1, 2);

    });

    it('should change state by action, 2 middlewares and 2 reducers', function (done) {

        let store = new Fluxtor();

        store.addAction('test', function (first, second) {
            return {first, second};
        });

        store.addMiddleware(function (store, actionName, actionData, next) {
            if (actionName === 'test') {
                setTimeout(() => {
                    next({...actionData, first: actionData.first + 5});
                }, 10);
            } else {
                next(actionData);
            }
        });

        store.addMiddleware(function (store, actionName, actionData, next) {
            if (actionName === 'test') {
                setTimeout(() => {
                    next({...actionData, second: actionData.second + 3});
                }, 30);
            } else {
                next(actionData);
            }
        });

        store.addReducer('first', function (state = {}, actionName, actionData) {
            if (actionName === 'test') {
                return {
                    ...state,
                    data: actionData.first
                };
            }
            return state;
        });

        store.addReducer('second', function (state = {}, actionName, actionData) {
            if (actionName === 'test') {
                return {...state, data: actionData.second};
            }
            return state;
        });

        store.subscribe(function (store) {
            expect(store.state).toEqual({
                first: {data: 6},
                second: {data: 5}
            });
            done();
        });
        store.dispatch('test', 1, 2);

    });

    it('should throw an exception if dispatch unspecified action', function () {

        expect(function () {
            let store = new Fluxtor();
            store.dispatch('unspecified');
        }).toThrow('Action "unspecified" was not specified.');

    });

    it('should throw an exception if first argument of constructor is not object or undefined', function () {

        expect(function () {
            new Fluxtor(false);
        }).toThrow('A first argument must be an object.');

    });

    it('should throw an exception if first argument of addReducer is not a string', function () {

        expect(function() {
            let store = new Fluxtor();
            store.addReducer();
        }).toThrow('A first argument must be a string.');

    });

    it('should throw an exception if second argument of addReducer is not a function', function () {

        expect(function () {
            let store = new Fluxtor();
            store.addReducer('fieldname');
        }).toThrow('A second argument must be a function.');

    });

    it('should throw an exception if first argument of addMiddleware is not a function', function () {

        expect(function () {
            let store = new Fluxtor();
            store.addMiddleware();
        }).toThrow('A first argument must be a function.');

    });

    it('should throw an exception if first argument of addAction is not a string', function () {

        expect(function () {
            let store = new Fluxtor();
            store.addAction();
        }).toThrow('A first argument must be a string.');

    });

    it('should throw an exception if second argument of addAction is not a function', function () {

        expect(function () {
            let store = new Fluxtor();
            store.addAction('action-name');
        }).toThrow('A second argument must be a function.');

    });

    it('should throw an exception if first argument of subscribe is not a function', function () {

        expect(function() {
            let store = new Fluxtor();
            store.subscribe();
        }).toThrow('A first argument must be a function.');

    });

});
