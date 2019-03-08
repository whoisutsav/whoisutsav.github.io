---
layout: post
title:  "Thinking through minimax step-by-step"
date:   2017-08-16 12:14:36 -0500
published: false
categories: 
---

I'd like to write about my experience learning and implementing minimax for the first time.

Perhaps the line of thought that I followed might help others in understanding the concept, specifically as it relates to implementing an algorithm for tic-tac-toe.

Disclaimer: I'm not familiar with the details of economics or game theory. I may be using terms loosely. If I am using a term in a way that's grossly inaccurate or can be improved, please let me know.

## Step 1: Become familiar with the concept of minimax

The best place to start is the [wikipedia article](https://en.wikipedia.org/wiki/Minimax).

The fundamental idea  is that, when making a decision in a "game" (i.e. a situation with multiple players that entails everyone making rational choices), we would like to pursue a strategy that ___min___**imizes our** ___max___**imum loss.** So, if I were to choose between two options: one, where I could win 50 but also lose 30, and another where I could win 20 or also lose 20, I would choose the latter. It is a "play-not-to-lose" strategy:

We could contrast this with other kinds of strategies: perhaps a "maximax" strategy where we *max*imize our *max*imum gain, in which case we would choose the option where we might win 50. But we can also see why a strategy like this doesn't make much sense in a zero-sum game like tic-tac-toe: our opponents are going to make decisions that move them towards their maximum gain, which is equivalent to our maximum loss.

## Step 2: Explore minimax for multi-step games

Given a situation where we make a single decision, and our opponent makes a single decision, the concept of minimax is hopefully clearer. But how do we apply this concept to a game like tic-tac-toe, that can have many future states, and has an opponent who will make a series of moves we can't predict? 

Or, put another way: when it is our turn, we will have a set of available moves we can make. If we want to choose the move that minimizes our maximum loss, how do we quantify "maximum loss" for each of these moves? 

### Finding a valuation function for "maximum loss"

![alt text](/assets/minimax_example_1.jpg)
<sub>Example 1: 3 moves left</sub>

Consider the above example. In this example, player "X" can choose from 3 possible moves. We need some way to quantify the maximum loss for each of these moves. Put it another way, we need some sort of "valuation function" that returns a maximum loss for each option. 

#### Solution 1: Worst possible case
The first thing I considered here was, what if we assumed that subsequent decisions are arbitrary, and the maximum loss was just the worst possible scenario? Using the above example, if we choose (1), the worst possible case is we lose. Same if we choose option (3). But if we choose option (9), then the worst case is a tie. Let's choose to assign numerical weights to these scenarios: value a loss as a loss of +∞, value a tie as a loss of 0, and value a win as a loss of -∞

	Valuation (using worst-case):
		1) We lose, value at +∞
		3) We lose, value at +∞
		9) We tie, value at 0.
		
Applying the concept of minimax here, the minimum of our "maximum losses" is the minimum of (+∞, +∞, 0), which is 0, move 9.

#### Solution 2: Likelihood of loss

Is this approach sufficient? Consider this next example. Now I must admit it is a fake game that doesn't really make sense according to the traditional rules of tic-tac-toe, but will help illustrate some concepts:

![alt text](/assets/minimax_example_2.jpg)
<sub>Example 2: 4 moves left. "X" indicates X wins, same for "O". "C" indicates cats game.</sub>

Here, X can choose from 4 possible moves: 1, 2, 3 and 9. Let's focus on the moves 1 and 2, and ignore moves 3 and 9 for now. Let's assume all subsequent moves are random. If we use the valuation function described above, where the "maximum loss" for each move is just the worst possible scenario, then (1) and (2) should be valued equally - both could potentially lead to a loss for X. So according to our previous idea of valuation, either choice is equally good. This is clearly inaccurate - it would be best to choose (2), because if subsquent moves were random, X has a 50% chance of winning in that case, whereas it only has a 17% chance of winning for choice (1).

So then is the right method of valuing each choice a function of the % of possible end states that lead to a win? That certainly seems reasonable.

#### Solution 3: Assume we are rational

![alt text](/assets/minimax_example_3.jpg)
<sub>Example 3</sub>

Let's extend our previous example by considering move (9) in addition to move (2). By our new decision making process, between choice (2) and choice (9), choice 9 is superior: 4/6 end states lead to a win for X, while for choice (2), only 3/6 end states lead to a win for X. This holds if all players make arbitrary decisions. But if we assume others (and our) future decisions to be rational, it becomes clearer that option (2) is a better choice. For, no matter what "O" chooses after X moves to (2), X can then force him to ultimately lose. So our valuation function must be improved further yet to account for our ability to make rational decisions.

What would that function look like? It could be something along the lines of, "if we were to behave rationally for all of our subsequent turns, what is the maximum loss we could expect?"<sup>1</sup> In the case of example 3, choice (2), the maximum loss or worst case is that we win, i.e. a loss of -∞. There is no case where we lose or tie. In example 3 choice (9), the maximum loss is the case where we lose, or a loss of +∞. (We could just as well use -1, 1 instead of -∞, +∞). Since we want to _minimize_ our _maximum loss_, clearly the minimum is -∞, or choice 2.

---
<sup>1</sup> Rationally, in our case, means minimax. So the solution is recursive!


## Step 3: Implementing an algorithm for tic-tac-toe

How can we implement this idea in tic-tac-toe? Assume it is our turn (we being the computer), and we have a given board. Say there are 3 moves we can make. Assume we had a valuation function that calculated the maximum loss for each of these three moves. Then our algorithm should calculate the maximum loss for each of these moves, and return the move that corresponds to the minimum of these maximum losses.

At this point, it will be helpful to define some terms:

* **s**: a game state where it is our turn
* **ŝ**: a game state where it is the opposing players turn
* **max-loss(s)/max-loss(ŝ)**: a function that takes in a given state, and returns the maximum loss

So, repeating our above example using these terms, we are given a state **s**. Since we have three moves, we have the option of moving the game into 3 different states: **ŝ₁, ŝ₂, ŝ₃**. We want to calculate the values **max-loss(ŝ₁), max-loss(ŝ₂), and max-loss(ŝ₃)** and return the move that corresponds to the minimum of these values

### Writing the max-loss function for _ŝ_ (opposing player's turn)

How do we write a function that calculates **max-loss(ŝ)**? 

If **ŝ** is a leaf node (i.e. the game is over), we can define the return values as follows:

	max-loss(ŝ), where ŝ is a leaf node:
		= 1, if opposing player wins
		= 0, if draw
		= -1, if I win.
		
Here we are using 1, -1 instead of +∞, -∞. Also notice that when we calculate the loss, we are **always** doing it from **our** perspective. So if the opposing player wins, that's a **loss** of **+1**. Whereas if I win, it's a **loss** of **-1**.

What if **ŝ** is not a leaf node? Since it's the opposing player's turn, and we don't know their moves in advance, we need to account for the possibility that they will choose the worst for us, i.e. the maximum loss for us out of all their options. So we can define max-loss as follows:

	max-loss(ŝ), where ŝ is not a leaf node:
		= maximum(max-loss(s₁), max-loss(s₂) ... max-loss(sᵢ))
		 (where {sᵢ} is the set of states the opposing player can move to)
		
Now we must define what we mean by **max-loss(s)**, i.e. calculating the max-loss when it is our turn.

### Writing the max-loss function for _s_ (our turn)

Now we must define **max-loss(s)**, i.e. a state where it is our turn. If **s** is a leaf node, we can use the exact same definition as before:

	max-loss(s), where s is a leaf node:
		= 1, if opposing player wins
		= 0, if draw
		= -1, if I win.
		
However, if **s** is not a leaf node, then we should assume we will make an intelligent choice (i.e. choose the option that minimizes our max loss). Thus:

	max-loss(s), where s is not a leaf node:
		= minimum(max-loss(ŝ₁), max-loss(ŝ₂) ... max-loss(ŝᵢ))
		 (where {ŝᵢ} is the set of states we can choose to move to)

This gives us a complete definition of the **max-loss** function. Now what remains is a top-level function that gives us the optimal move.

### Writing the get-move function

This is similar to the max-loss function, except instead of returning a max-loss value, we return the move. Let's define the function, **get-move(s)** which takes in a game state where it's our turn, and returns a move. We already outlined an algorithm for this above.

	get-move(s), where s is never a leaf node:
		- assume, given s, we can make moves 1, 2 ... i
		- These correspond to potential game states ŝ₁, ŝ₂ ... ŝᵢ
		- calculate max-loss(ŝ₁), max-loss(ŝ₂) ... max-loss(ŝᵢ)
		- return the move that has the minimum max-loss

		
### Example

The `max-loss` and `get-move` functions are all we need to implement minimax. 

If you would like to see a working version in clojure, you can see one here: <https://github.com/whoisutsav/tic-tac-toe>
