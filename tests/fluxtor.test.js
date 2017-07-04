import Fluxtor from '../src/fluxtor';
import expect from 'expect';

describe('Fluxtor specs:', function () {

    it('should change state by action and reducer', function (done) {

        let store = new Fluxtor();

        store.addAction('test', function (data) {
            return {data};
        });

        store.addReducer('example', function (state = {}, actionName, actionData) {
            if (actionName === 'test') {
                return {...state, ...actionData};
            }
            return state;
        });

        store.subscribe(function (store) {
            expect(store.state).toEqual({
                example: {data: 1}
            });
            done();
        });
        store.dispatch('test', 1);

    });

    it('should change state by action and 2 reducers', function (done) {

        let store = new Fluxtor();

        store.addAction('test', function (first, second) {
            return {first, second};
        });

        store.addReducer('first', function (state = {}, actionName, actionData) {
            if (actionName === 'test') {
                return {...state, data: actionData.first};
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
                first: {data: 1},
                second: {data: 2}
            });
            done();
        });
        store.dispatch('test', 1, 2);

    });

    it('should change state by action, middleware and 2 reducers', function (done) {

        let store = new Fluxtor();

        store.addAction('test', function (first, second) {
            return {first, second};
        });

        store.addMiddleware(function (store, actionName, actionData, next) {
            if (actionName === 'test') {
                setTimeout(() => {
                    next({...actionData, first: actionData.first + 5});
                }, 50);
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
                second: {data: 2}
            });
            done();
        });
        store.dispatch('test', 1, 2);

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

});
