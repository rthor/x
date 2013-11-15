// Save a reference to the global object (`window` in the browser, `exports' on the server).
var root = this;

// The top-level namespace. All public X classes and modules will
// be attached to this. Exported for both the browser and the server.
var X = typeof exports !== 'undefined' ? exports : root.X = {};

// Current version.
X.Version = '0.0.4';

// Use restful routes.
X.restful = true;