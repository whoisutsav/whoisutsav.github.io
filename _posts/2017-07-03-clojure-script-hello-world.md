---
layout: post
title:  "ClojureScript: Hello World"
date:   2017-07-03 11:16:36 -0500
categories: 
---

## What is ClojureScript?

ClojureScript is Clojure compiled to JavaScript. The source code is the same as Clojure code, and it supports the majority of Clojure features, such as persistent data structures.

Some features behave slightly differently between Clojure and ClojureScript. For example, equality in ClojureScript reflects JavaScript behavior, which is different from Clojure:

```
; Clojure
(= 0 0.0)
; *false*

; ClojureScript
(= 0 0.0)
; *true*
```

## Building Hello World in ClojureScript

#### Write source code
First, let's write our program. Here is a simple Hello World program in ClojureScript:

```
$ cat src/hello_world/core.cljs
(ns hello-world.core)

(enable-console-print!)

(println "Hello, World!")
```
(FYI, the call to `enable-console-print!` sets our print functions to use `console.log`, thereby abstracting the use of the `console` object in our code.)

#### Create a build file
The next thing we need to do is to create a build file that we'll run manually to compile our project.

```
$ cat build.clj
(require 'cljs.build.api)

(cljs.build.api/build "src"
                      {:main 'hello-world.core
                       :output-to "out/main.js"})
```
The call to build takes a source directory ("src", in our case) and other standard options.

#### Compile the source code
Finally, we compile this using the ClojureScript compiler.

```
$ java -cp cljs.jar:src clojure.main build.clj
```
Here `cp` is the classpath, where we include the compiler classes (`cljs.jar`) as well as our source code. We use java to run `clojure.main`, which allows us in turn to run any clojure file, in this case, `build.clj.`

Let's see the result

```
$ tree out -L 2
out
├── cljs
│   ├── core.cljs
│   ├── core.js
│   └── core.js.map
├── cljs_deps.js
├── goog
│   ├── array
│   ├── asserts
│   ├── base.js
│   ├── debug
│   ├── deps.js
│   ├── dom
│   ├── math
│   ├── object
│   ├── reflect
│   └── string
├── hello_world
│   ├── core.cljs
│   ├── core.cljs.cache.json
│   ├── core.js
│   └── core.js.map
└── main.js
```
You may be wondering, "where did the `goog` directory come from?" Good question. ClojureScript uses a google library called Closure as a way to optimize JS code. We'll go into Closure briefly in another post.

#### Run the program

Now that we have compiled our Hello World script, let's run it! We create an index.html file in our base directory:

```
$ cat index.html
<html>
    <body>
        <script type="text/javascript" src="out/main.js"></script>
    </body>
</html>
```

And we should see our output in the console!





