---
layout: post
title:  "Extracting core logic for tic-tac-toe"
date:   2017-09-22 11:16:36 -0500
published: false
categories: 
---

I'd like to briefly document my experience extracting core logic for a tic-tac-toe application. I came across this problem as part of an exercise to convert a console tic-tac-toe application into a web app. The experience showed that lower levels of functionality are more straightforward to identify and isolate, while at the high level (the edges between core functionality and implementation), the distinction is not so clear, and consolidation can be counterproductive.


## Core logic components

What is shared across all games of tic-tac-toe? We could make a list quite easily: a board, players (and their markers), the rules for making a move (e.g. you cannot play an occupied space), the rules for what constitutes a win, among others.

More useful than a list is the structure of this functionality. The general structure I used for my tic-tac-toe program was as follows:

![alt text](/assets/tic-tac-toe-core-logic.jpg)


## Extracting higher level functionality

It's quite clear that the lower levels remain unchanged across different implementations. What is less clear is the parts of the program that deal with the game state and progression of game states.

In dealing with **a single game state**, the action of taking a turn (essentially getting a move from the active player, and updating the board), is standard, but how we get a move from a human player is not: it would be different for a web application, or a console application. So here we begin to see some differences. But for the most part, logic here is shared.

What about the highest level, the parts of the program that deal with **the progression of game states?**


## A failed exercise at the edges

It's quite clear that how the game progresses would likely be different between a console and a web app. In a console app, the program would run until completion, whereas in a web app, the program might process only one move request and return a response to the client. But I was curious to see whether we could at least find some functionality at this level that is shared, and consolidate it.

One thin piece of logic that was shared was a control element: if the game is over, we should do some wrap-up action, whereas if the game is not over, we should take a turn. This seems like a core, albeit thin, piece of logic, and something that is part of all games, not just tic-tac-toe, no less. 

I started with this straightforward implementation: 

```
	(defn advance-game [game-state]
		(if (game-over? game-state)
			; Perform "game over" action
			; Perform "take turn" action
			));
```

Could this be shared between implementations? In the case of the console and the web app, the game over action would be different, and the looping mechanisms might also be different, but the control would be the same, wouldn't it? 

First, in order to support custom "game over" and "take turn" actions, we would need to add these as parameters to the function, and call them with the game state:

```
	(defn advance-game [game-state game-over-fn take-turn-fn]
		(if (game-over? game-state)
			(game-over-fn game-state)
			(take-turn-fn game-state)))
```
Already we see that this approach has some problems. For one, the meaning of the function has become obscured. The amount of code required to customize the function is greater than the logic itself. 

And further problems began to reveal themselves. How do we customize the looping of this function: until the game is over (in the case of the console app) or until it's the human turn again (in the case of the web app)? Should there be some function after take-turn?

```
	(defn advance-game [game-state game-over-fn take-turn-fn loop-fn]
		(if (game-over? game-state)
			(game-over-fn game-state)
			(-> (take-turn-fn game-state) (loop-fn))
```

While there were alternatives, none were great, and at this point I declared this exercise pretty hopeless. It became clear that at the edges of the core logic, the shared functionality becomes thinner, and while 90% of shared code overall can be consolidated, it would be counterproductive to consolidate the last 10%.
