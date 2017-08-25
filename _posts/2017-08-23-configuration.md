---
layout: post
title:  "Configuration"
date:   2017-08-23 11:16:36 -0500
categories: 
---

# Configuration: an exploration of basics

Despite having some exposure to development, or perhaps especially because of it, I've found that creating a tic-tac-toe game has been an invaluable opportunity to question and more deeply explore some fundamental programming ideas that I often took for granted. One of those ideas which I recently came across was how to design a program's initial configuration.

Having to implement it myself rather than using a framework, I was able to think more about the role of configuration and how it should be designed: Why should it be a separate piece of the program at all? How do we decide the complexity of the configuration, and at what level should it be passed into the program?

### Configuration as means to genericize

The fundamental idea behind configuration, which is familiar to everyone, is that it is a means to make our programs more generic so they can be reused in different ways. In tic-tac-toe, for example, I could write a program that operates on a standard 3x3 board. We can have our main function just run the program, which exists in the function `tic-tac-toe-3x3`:
	
	(ns tic-tac-toe.core)
	
	(defn -main []
		(tic-tac-toe-3x3))

If we wanted to use a 4x4 board, we'd have to change the internals. Alternatively, we could instead decompose our program into a generic tic-tac-toe program (i.e. abstract our program) to take a board of whatever size as an input. The implication of this is that the top level function's responsibility is now to compose our configuration with our generic program, as follows:

	(ns tic-tac-toe.core)
	
	(def board (board/empty-board)
	
	(defn -main []
		(tic-tac-toe board))

### Balancing flexibility with simplicity

This idea is straightforward (perhaps painfully so) but let's explore it further. Following this line of thought, we could genericize our program to handle all different types of inputs - we could pass in a different set of rules, for example. Taken to an extreme, our configuration could be the tic-tac-toe game itself and our primary program could be a simple program runner:

	(ns tic-tac-toe.core)
		
	(def configuration tic-tac-toe)
		
	(defn run [program]
		(program))
		
	(defn -main []
		(run configuration))

Clearly this seems impractical and counter to what we usually think of as configuration. So in addition to the idea of decomposing our main program into an input parameter and abstracted program, there must be another principle at play here.

This other principle seems to be balancing the flexibility of a program and the ease which we can change it. By making it more generic, we will be adding complexity to the configuration. If we genericize it in ways that aren't useful, then we will be creating needless complexity in the configuration. So here is where we make practical design decisions, namely, how might someone want to reuse this program in a different way?

### Configuration vs. Initialization

Above, I mentioned we can write a program that accepts a board. This is probably enough for a program as simple as tic-tac-toe. But it seems that, to the user who is making changes to the configuration, we are providing some flexibility that appears unnecessary - our program operates on the board in a certain way and expects it to be a certain type. Really, all we can change is the size. So instead we could simplify our configuration parameters to only be a board size:

	(ns tic-tac-toe.core)
	
	(def board-size 3)
	
	(defn -main []
		(tic-tac-toe board-size))
		


We must be aware, however, that this parameter at some point must be converted into something that is usable by our program, a board. So here we see another concept - the difference between configuration and initialization.

The concepts, though related, have subtly different meanings. Configuration can mean the parameter itself (a file, or hash map with options, for example). Or it could mean the initialized set of values that our program operates on. 

Seeing the idea of configuration parameters as distinct from initializing them allows us to decompose our program further, and abstract away the initialization logic:

	(ns tic-tac-toe.core)
	
	(def board-size 3)
	
	(defn -main []
		(tic-tac-toe-runner (initialize-game board-size))


Now we have a configuration parameter, an initialization function that takes in the configuration parameters and translates them into something usable by the primary function that takes in these initialized inputs and performs the actual task. This might be useful if, say, we were to change how the configuration file is structured or read.