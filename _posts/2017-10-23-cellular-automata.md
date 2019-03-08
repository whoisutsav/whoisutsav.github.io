---
layout: post
title:  "Cellular Automata: an overview"
date:   2017-10-23 13:48:36 -0500
published: false
categories: 
---

A cellular automaton is essentially a grid of cells, each of which can be in certain state. The cells evolve step-by-step according to fixed rules, which determine the new state of the cell based on its previous state and its neighbors' previous states.

For example, we could have two states ("on" and "off"), and a rule that a cell is "on" if its above neighbor was "on" in its previous step, and "off" otherwise:

![alt text](/assets/cellular_automata_1.jpg)
<sub>A trivial example</sub>

It is not unlike a recursive function call where the previous output is used as the next input. However there are a few characteristics that make it interesting to study: firstly, it is inherently visual. Next, the modification of cells' state depends only on adjacent cells, which makes cellular automata a candidate for modeling physical systems.

## Features

This seems at first to be a very basic idea. But because the outputs are visual, they lend themselves to empirical study, and one begins to notice all sorts of interesting behavior.

Consider these examples:

![alt text](/assets/cellular_automata_2.jpg)
<sub>Wolfram, _A New Kind of Science_, p. 25</sub>
![alt text](/assets/cellular_automata_3.jpg)
<sub>Wolfram, p. 27</sub>

One observation from the latter picture (also repeated in the picture's footnote) is that a very simple rule can lead to a very complex and unpredictable outcome. While anyone who has programmed computers understands this - programs often behave in ways we don't expect - here is a very clear and visible example.

Another interesting fact is that it seems impossible to predict the outcome of this rule mathematically. One actually has to run the program to see the result. This is an idea known as _computational irreducibility_ - that for certain problems, one can only calculate the output of the program by actually running the computation. (See further reading, for more information).

## Simple operations

Cellular automata are not only a source of interesting pictures and patterns, they can be constructed to perform actual operations as well. Consider this automata:

![alt text](/assets/cellular_automata_4.jpg)
<sub>Wolfram, p. 638</sub>
![alt text](/assets/cellular_automata_5.jpg)
<sub>Wolfram, p. 662</sub>

The second automata, while having more than two states, can perform a logical operation, in this case OR. Beyond these examples, automata have been found that perform other well-known operations, and there are even automata which are universal, which means they can perform any operation which is expressible as a computation.


## Further reading
An in-depth treatment of this subject (and the source of these pictures) is Wolfram's _A New Kind of Science._ 
