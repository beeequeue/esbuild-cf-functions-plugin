export var hello = "world"

// unicode
var unicode = "\u1F975"

// object spread
var a = { foo: "\u1F975" }
var b = { ...a }

// arrow functions
var func = () => {}

// spread parameters
var func = (...strings: string[]) => {}

// object.entries
Object.entries(a)
// object.values
Object.values(a)
