# Notes

# Error Handling
- Express has its own built-in error handler; if an error is thrown, we'll get an HTTP response with error codes & a 500 status code
- <throw new Error('message')> produces an Error


# Express Router
In Node.js, module.exports is used to define what a module should export when it is required in another file.

* When another file requires this module using require('./pathToRouterFile'), it will receive the router object.
This allows the router to be modular and used in your main server.js or app.js file *

const myRouter = require('./path/to/routerFile'); // This is how you import the router

# Cookies


# Sessions