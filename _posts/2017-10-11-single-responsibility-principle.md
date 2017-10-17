---
layout: post
title:  "Single Responsibility Principle"
published: false
date:   2017-10-11 14:48:36 -0500
categories: 
---

When developing a modular system, the single-responsibility principle provides a guideline for the scope of each module. In essence it states that the modules should be reasonably granular - that is, they should each perform one function, or a set of functions that are likely to change together. 

Consider the example of engineering a radio. You will have to develop the parts of the radio and then ultimately combine them. You could design one of those parts to be a battery and an antenna fused into one. If your design is going to change, however, then this might create problems: if either the antenna or the battery specifications change, you'll have to change the whole part. Whereas if the parts were separate, only the relevant piece would have to change.

## Example: Tic Tac Toe

Here's an example of a JavaScript object from a Tic Tac Toe game I have been developing in Clojure:

```
function Game() {
	// Initialize values
}

Game.prototype.update = function() { 
	// Set values 
}

Game.prototype.isOver = function() { 
	// Return whether game is over
}

Game.prototype.handleClick = function() { 
	// Make API call to server
	// Update game with new values
}
```

What's the responsibility of this object? It seems like there are two: the first is to manage the state of the game. The second is to deal with click events by handling the request/response to the API. According to the single-responsibility principle, these two responsibilities should be separated.

A better solution might be:

```
function Game() {
	// Initialize values
}

Game.prototype.update = function() { 
	// Set values 
}

Game.prototype.isOver = function() { 
	// Return whether game is over
}

function Controller() {
	// Initialize with reference to a game
}

Controller.prototype.handleClick = function() { 
	// Make API call to server
	// Update game with new values
}
```
In this setup, the `Controller` is responsible for user interactions (dealing with click events and making the call to the server), and the `Game` is responsible only for managing the state of the game.