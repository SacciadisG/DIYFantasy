// With Express 4, error thrown in an async functions are handled differently
// For easy code re-writing, we pass any async functions through this wrapper class
// and if any errors are thrown, they're caught and passed to the middleware defined in index.js

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}