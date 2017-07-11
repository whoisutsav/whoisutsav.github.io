---
layout: post
title:  "ClojureScript and Google Closure"
date:   2017-07-10 11:16:36 -0500
categories: 
---

## ClojureScript and Google Closure
The current version of ClojureScript by default integrates with a tool called Google Closure for JavaScript optimization.

The Google Closure library takes JavaScript code that adheres to a certain set of standards, and compiles it to a smaller (but less human readable) format. It supports a number of optimizations, but we'll focus on two of them here: minification and dead code elimination.

## Minification
Minification is the process of reducing the size of the JavaScript source file without changing the structure of the code itself. Since JavaScript source is just a text file, one easy way to do that is to remove unnecessary spaces and newlines:

```
// Before
function myFunction() {
var myVariable = 3;
return myVariable + myVariable;
}

// After
function myFunction(){var myVariable=3;return myVariable+myVariable;}
```

Another minification technique is to shorten variable names:

```
// Before
var myObject = {
	myProperty: 'world'
}

var myString = 'hello ' + myObject.myProperty;

// After
var a = {
	b: 'world'
}

var c = 'hello ' + a.b;
```

However, changing variable names requires some code analysis by the compiler, and can run into problems because of the dynamic nature of JavaScript. According to Closure's documentation, code called from `eval` statements, or code using the global `window` object may not be optimized correctly:

```
// Cannot optimize code within "eval()" statements
function foo() {
	return 'bar';
}

eval('f' + 'o' + 'o')();

// While these are the same object, they will be treated as different and optimized incorrectly
window.myObject = {};
myObject;
```
## Dead code elimination
Another more advanced optimization is the removal of dead code, which is code that is never used or is unreachable. So, for example, consider this program:

```
var myObject = {
	myProp: 'abc' // Unused
	myFunc: function() { return 'def' }
}

var myOtherFunction = function() { // Unused
	return 'xyz'
}

console.log(myObject.myFunc());
```
The property `myObject.myProp`, and the function `myOtherFunction` are never used and can be removed. As we might expect, though, the optimizer may not be smart enough to remove all dead code correctly. For example, if a function is called from a string parameter to "eval", then the compiler may accidentally remove that function:

```
// This will be deleted and the program will break!
function myFunction() {
	return 'abc';
}

eval('my' + 'Function')();

```

Because of these reasons, the Closure library requires the JavaScript source code it compiles to adhere to certain standards in order to be optimized correctly. Luckily, the ClojureScript compiler takes care of this for us, and we can reap the benefits without worrying about the details.