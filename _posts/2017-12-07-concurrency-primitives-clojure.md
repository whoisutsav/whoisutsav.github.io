---
layout: post
title:  "Concurrency primitives in Clojure"
date:   2017-12-07 11:16:36 -0500
categories: 
---

Whether we are aware of it or not, we are intuitively familiar with the concept of concurrency. If we have ever followed a recipe, we know that when we perform a task, there's often some freedom in how we structure the steps. If a recipe asks us to chop onions, carrots, and peppers, we know that we don't have to chop them exactly in this order - we can choose to chop the peppers first, or alternate between all three, if we so choose. And this is the very definition of _concurrency_ - the ability to perform certain steps of a task in non-sequential order.

#### Parallelism
Now, we may not see much benefit to chopping vegetables in a different order - we only have one set of hands, so it will take the same time. But if we had a friend to help us, our friend could chop carrots at the same time as we chop onions, and reduce the overall chopping time. This is a specific form of concurrency known as _parallelism_.

#### Asynchrony
These concepts both relate to work we do with our hands - chopping vegetables, or mixing things. But what about other kinds of work, say pre-heating the oven?  We can pre-heat the oven and start doing other tasks before waiting for it to complete. The ability to not "block" on a task and perform other tasks while the prior task is carrying forward is a concept known as _asynchrony_. While not directly related to concurrency, it relates to how we perform work, and we often see these two concepts talked about together.


## Task relationships

So we see that when we perform a task, we often have flexibility in how we structure the steps (which we can call "sub-tasks"). Some sub-tasks can be done out of order (for example, chopping the vegetables), but some must be done in order (for example, we must finish chopping before putting everything in the oven). How do we encode this information in our programs, which are a set of instructions for performing a given task? Or, put another way, how do we convey the relationships between sub-tasks?

The first thing we must determine is if the result of a given task will be used in some other task down the line. If not, our job is pretty easy - we can specify the task and forget about it. An example might be if we want to write something to a log file without caring whether it fails.

Most often, however, we will want to use the result of the sub-task later on. When we move from a stage where tasks can be completed in any order, to a stage that requires the results of these previous tasks, we reach a boundary where we must synchronize the tasks. Indeed, in mathematics, the word concurrency is used to describe lines that intersect at a point.

![alt text](/assets/concurrent_lines.jpg)


## Clojure primitives for concurrency

How do we handle this synchronization, when we have no guarantees when the sub-tasks will complete? The mechanisms that Clojure provides are: futures, promises, and delay.

The first thing to remember is that these primitives are various implementations of the same functionality - to coordinate multiple tasks, or threads of execution. They differ in 1) when the work is defined and 2) when and where the work is executed

### Futures

When we create a future in Clojure, we specify the work to be done, and the value returned is a reference to the result (which may not be calculated). The work is immediately scheduled for execution on a separate thread.

```
;; Starts on separate thread
user=> (def f (future (Thread/sleep 5000) (println "doing work") "result"))
```

To synchronize the task with the main program flow, we _dereference_ the future. The result may not yet be evaluated, in which case the main program flow blocks until it is.

```
;; Blocks until result is available
user=> (deref f)
"doing work"
"result"

user=> @f
"result"
```

### Promises

A promise is very similar to a future in that, it represents a 'yet-to-be-calculated' value, and we can synchronize the promise with our main program flow by dereferencing it. 


The main difference between promises and futures in Clojure is that a promise doesn't specify the work that needs to be done. Instead, what's returned is a container that we can fill at a separate time (known as _delivering_ the promise), and dereference when we want to synchronize with our main program flow.

```
user=> (def p (promise))

;; We must deliver the promise before we dereference it,
;; otherwise our program will wait forever
user=> (deliver p "result")

user=> (deref p)
"result"
```

### Delay

Delay is a special form in Clojure that allows us to define work to be done without executing it immediately. Like futures and promises, it returns a reference to a 'yet-to-be-evaluated' value. When we need the work performed, we can initiate execution using a construct called `force.`

```
user=> (def d (delay (println "doing work") "result"))

user=> (force d)
"doing work"
"result"
```

The ability to define a task without executing it immediately is how we are able to create streams. It's also useful for creating an object that evaluates only once, since the result is cached.