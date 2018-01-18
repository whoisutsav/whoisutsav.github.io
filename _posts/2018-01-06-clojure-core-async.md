---
layout: post
title:  "Clojure's core.async - an introduction"
date:   2018-01-06 11:16:36 -0500
categories: 
---
Clojure's core.async is a library that enables Clojure developers to build async programs. In this post we briefly introduce the principles behind core.async, namely CSP.

## CSP
Clojure's core.async is based on the concept of [Communicating Sequential Processes (CSP)](https://en.wikipedia.org/wiki/Communicating_sequential_processes), an idea first presented by Robert Hoare in 1978. The impetus behind CSP was that processes need a way to communicate and synchronize with each other, and doing so via shared memory and locks is error-prone. (Besides CSP, actors are the other popular paradigm to address this problem.)

CSP instead suggests that processes communicate with each other via a mechanism called a _channel_. Processes can put a message onto a channel or they can take messages from a channel. In its simplest form, the putting process waits until the receiving process is ready to take, and vice versa. There can be multiple writers and readers on a channel, and neither knows about the other.

Another idea from CSP is the ability to choose from a variety of alternate inputs, or outputs. A thread can take the first value from multiple channels, whichever is ready first (or, a channel can put to one of many channels, whichever is ready to receive first).

Clojure's core.async builds on these general ideas, with a few nuances. First, the processes in reality are threads, or an even lighter-weight construct that generally imitates the idea of a thread (referred to as go blocks, or IOC threads).

The other notable feature is that Clojure enables channel buffering, with the requirement that the buffers be bounded.

## Example

Below is a simple example that utilizes the following constructs from core.async:

* `(chan)` returns an unbuffered channel
* `(>!! ch message)` puts a given message on a channel. Blocks until a receiver is ready
* `(<!! ch)` takes a channel and returns the next message from the channel. Blocks until a message is delivered to the channel
* `(thread & body)` takes a body and executes the body on a separate thread

### Simple put-receive

```
(defn- put-task [c]
  (Thread/sleep 1000)
  (println "Putting message on channel")
  (>!! c "test message"))

(defn example []
  (let [c (chan)]
    (thread (put-task c))
    (println "Started thread")
    (->> (<!! c)
      (str "Received message from channel: ")
      (println))
    (close! c)))
  

user=> (example)
"Started thread"
"Putting message on channel"
"Received message from channel: test message"
	
```

