[![view on npm](http://img.shields.io/npm/v/fluxtor.svg)](https://www.npmjs.org/package/fluxtor)
[![npm module downloads](http://img.shields.io/npm/dt/fluxtor.svg)](https://www.npmjs.org/package/fluxtor)
[![Build Status](https://travis-ci.org/shcoder-ru/fluxtor.svg?branch=master)](https://travis-ci.org/shcoder-ru/fluxtor)
[![Coverage Status](https://coveralls.io/repos/github/shcoder-ru/fluxtor/badge.svg?branch=master)](https://coveralls.io/github/shcoder-ru/fluxtor?branch=master)
[![codecov](https://codecov.io/gh/shcoder-ru/fluxtor/branch/master/graph/badge.svg)](https://codecov.io/gh/shcoder-ru/fluxtor)
[![Dependency Status](https://david-dm.org/shcoder-ru/fluxtor.svg)](https://david-dm.org/shcoder-ru/fluxtor)
[![Join the chat at https://gitter.im/es-fluxtor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/es-fluxtor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# fluxtor
Simple container of unidirectional data flow.

## Install

```
$ npm install --save fluxtor
```

## Classes

<dl>
<dt><a href="#Fluxtor">Fluxtor</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#addReducer">addReducer(stateKey, reducer)</a></dt>
<dd><p>Add reducer to store</p>
</dd>
<dt><a href="#addMiddleware">addMiddleware(middleware)</a></dt>
<dd><p>Add middleware to store</p>
</dd>
<dt><a href="#addAction">addAction(actionName, action)</a></dt>
<dd><p>Add action to store</p>
</dd>
<dt><a href="#dispatch">dispatch(actionName, ...args)</a></dt>
<dd><p>Dispatch action to store</p>
</dd>
<dt><a href="#subscribe">subscribe(handler)</a></dt>
<dd><p>Add handler</p>
</dd>
<dt><a href="#next">next(actionData)</a></dt>
<dd><p>Call next middleware or done</p>
</dd>
</dl>

<a name="Fluxtor"></a>

## Fluxtor
**Kind**: global class  
**Access**: public  
<a name="new_Fluxtor_new"></a>

### new Fluxtor()
Class Fluxtor

**Example**  
```js
let store = new Fluxtor({
    user: {
        logged: false,
        name: null,
        token: null
    }
});
```
<a name="addReducer"></a>

## addReducer(stateKey, reducer)
Add reducer to store

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| stateKey | <code>String</code> | A state field |
| reducer | <code>function</code> | A pure function |

**Example**  
```js
store.addReducer('user', (state = {}, actionName, actionData) => {
    if (actionName === 'login') {
        return {
            ...state,
            logged: actionData.logged,
            name: actionData.name,
            token: actionData.token
        };
    }
    return state;
});
```
<a name="addMiddleware"></a>

## addMiddleware(middleware)
Add middleware to store

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>function</code> | A middleware function |

**Example**  
```js
store.addMiddleware('user', (store, actionName, actionData, next) => {
    if (actionName === 'login') {
        SomeRepository.check(actionData).then(data => next({
            ...data,
            ...actionData
        }));
    } else {
        next(actionData);
    }
});
```
<a name="addAction"></a>

## addAction(actionName, action)
Add action to store

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>String</code> | An action name |
| action | <code>function</code> | An action creator function |

**Example**  
```js
store.addAction('login', (name, password) => ({
    name,
    password
}));
```
<a name="dispatch"></a>

## dispatch(actionName, ...args)
Dispatch action to store

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionName | <code>String</code> | An action name |
| ...args | <code>\*</code> | Arguments that take action |

**Example**  
```js
store.dispatch('login', 'example-name', 'example-password');
```
<a name="subscribe"></a>

## subscribe(handler)
Add handler

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>function</code> | Change state handler |

**Example**  
```js
store.subscribe(store => view.setState(store.state));
```
<a name="next"></a>

## next(actionData)
Call next middleware or done

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionData | <code>\*</code> | An action data |


## Note on Patches/Pull Requests

1. Fork the project.
2. Make your feature addition or bug fix.
3. Send me a pull request.

* * *

&copy; 2017 Vasily Shilov
