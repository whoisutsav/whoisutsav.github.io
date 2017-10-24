---
layout: post
title:  "Cellular Automata"
date:   2017-10-20 13:48:36 -0500
categories: 
---

As a developer on web applications, I mainly thought of the computer as a sophisticated tool, and was primarily concerned with using it to create working programs.

Recently, I've spent some time with a less web-development-focused topic - cellular automata - and not only is it an interesting contrast to typical web programming, which is concerned with structured, text-based-information, but it gave some initial exposure to the broader significance of computing itself.

To learn more about the idea of cellular automata, I began to read Stephen Wolfram's book _A New Kind of Science._

## Cellular Automata

Cellular Automata is essentially a space-based framework to express the evolution of systems based on certain rules. This is best illustrated by an example.

[ Example ]

It is not unlike a recursive function call where the previous output is used as the next input. However there are a few characteristics that make it interesting to study. The first is that it is a visual representation of computation. Just as visual representations of mathematical functions allows us to get a sense of their characteristics, the visual aspect of cellular automata gives us an extra input to understand and classify the behavior or programs. The next feature of cellular automata is that the computation is based on adjaceny. The evolution of cells is dependent on the values of its immediate neighbors. Since physical systems seem to behave in a similar way, this makes cellular automata a candidate for modeling natural phenomena

[ Another example ]

## Origins of Complexity

By running simple cellular automata experiments - what Wolfram does in his book - one begins to notice interesting properties of these programs. The most prominent one - and repeated over and over again in the book - is that programs with simple rules can lead to complex and basically random outcomes. Anyone who has written software can appreciate this - that programs can often behave in ways that we don't expect - but his argument goes further and says these outcomes cannot be predicted without performing thre computation, through, say, some mathematical formula.

He refers to this notion as _computation irreducibility_ and makes several grand statements about it. The most poignant might be that science has been based on mathematical rules, but that these are just a subset of the more general notion of "rules." We must include these kinds of computation rules in our investigation of the universe, and that many of these rules have no analog in mathematics.

I found this idea to be quite fascinating. That mathematics is the foundation, and consequently all science, is just assumed, and to question that idea is fascinating. Wolfram goes further and suggests that the rules of the universe may, instead of folowing a mathematical rule, follow a more general computational rule and we ought to investigate phenomena through this lens. He makes some attempts to do so in the book, and manages to produce simple programs that very closely simulate or mimic natural structures. But how to make this satisfyingly rigorous - so that we can say, yes, this is how nature behaves - remains to be seen.

## Conclusion

This is only a simple rehashing of just the very beginning of concepts that he develops in detail in the book. For example, he explores other computational systems besides cellular automata, such as networks. He also discusses computation in general, and fascinating examples about how cellular automata can simulate a universal computer.

Even thorugh the book has had its share of criticism, I thought it was a fascinating introduction to concepts outside the realm of computing we usually deal with, and the argument that world might follow general computation lawas vs simply mathematical laws, allows one to see the computer not only as the incredibly useful tool that it is, but also as a key to some of the secrets of how Nature behaves.