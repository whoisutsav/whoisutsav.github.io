---
layout: post
title:  "Lazy Sequences in Clojure"
date:   2017-06-15 11:16:36 -0500
published: false
categories: 
---
One unique feature of Clojure is the ability to create and manipulate infinite sequences.An example is the sequence returned by `(range)`. If you run the following in your REPL:

```
user=> (take 10 (range))
(0 1 2 3 4 5 6 7 8 9)

user=> (take 20 (range))
(0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19)
```

We see that there doesn't seem to be any limits to what's returned by range. We can trust that range will return whatever number of elements we ask for, no matter how large.

The interesting thing here is not that we can return an infinite number of values - we could write a one-line while loop that does the same thing - but that it highlights a different way to think about certain sets of data, that's actually more in line with how we naturally as humans think. For example, in an imperative language, if we needed the sequence `[1, 2, 3, 4, 5]` we'd most likely treat it as a hard-coded array or list of some kind. In a functional language, however, we could think of it as an initial number (1) and a rule (to get the next number, take the previous number and add one) applied 5 times. Both implementations will give the same result, but storing the values of the remaining 4 numbers as a "rule" instead of actual data highlights a fundamental tradeoff - it's more concise (especially for larger sets), but that access to the data is O(n) unlike say, an array, which is accessed in O(1).

It also interestingly highlights the relationship between functions and data. We often think of data as fixed values and functions as operations on those values, but in the case of Lazy Sequences (the underlying implementation of range), we see that functions, when combined with a seed value, can give rise to an infinite amount of data.  

While this construct could implemented in any language, it's natural that it is part of the core library in Clojure, which is fundamentally recursive. 


 

