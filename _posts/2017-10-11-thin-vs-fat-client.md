---
layout: post
title:  "Thin vs. Thick client"
published: false
date:   2017-10-11 13:48:36 -0500
categories: 
---

What’s the benefit of keeping processing tasks, even simple ones, in the server vs. the client? Or put another way, what are the tradeoffs of a thin client vs. a thick client?

## Benefits of thin clients

One benefit of a thin client is that different clients don’t have to re-implement functionality. Another benefit of the client being simple is that there is a clearer separation of responsibilities. Processing tasks are performed in one place and view tasks in another.

## Downsides of thin clients

What is the downside of a thin client? One factor seems to be latency. If there is some computation that needs to be performed quickly, or multiple times, it is sometimes faster to do it on the client - for example, consider a computationally heavy game. What else? If the functionality varies for different clients, then that functionality might be best living in the client - consider PCs, for example.

## (Trivial) example

The reason I initially thought about this topic was to understand how to design the frontend for a tic-tac-toe application. The response returned by the server contained a board, which was just an array of elements:

	{ 
		"board": ["X", "X", "_", "O", "O", "_", "_", "X", "_"]
		...
	}

In order to display the board, it needs to know the size of the board - whether it is 3x3 or 4x4 or some other size. It could do this by calculating the square root of the board length, i.e. `Math.sqrt(board.length)`. Or we could return the size in the response from the server.

While this is a trivial example, and one could make an argument either way, my decision was to return the size in a response to the client, based on the ideas above. While the client is not protected against changes in the board representation, at least this thin element of game logic remains in the server.

## Note

This is only one dimension of how a client or server should be designed. There are other considerations, too - for example, if the clients have different needs, a set of granular services might be more appropriate than one combined service.