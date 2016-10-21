# Project 1: Tic Tac Toe

This project was coded in JavaScript, HTML and CSS.

### Approach

I thought I was a logically thinker and boy, did Tic Tac Toe show me how right-brain I actually am.

During the planning process, I recognised what I could do to simplify the problem - eg. set an achievable goal for my skill level which was really just about basic functionality and absolutely no AI, even though blocking and winning strategies were fun to think about. I could also see my sketched references of rows and columns were flawed and quickly learned to simplify HTML element ids in order to make looping and DOM manipulation easier.

I mapped out the separation of concerns and code design. Both seemed fine and clear on paper though when I went to approach the problem, I really struggled with the intricacies of how game logic translates in code - do one thing you break another.

### What I learned

JavaScript is hard! Computational thinking is hard!

I'm drawn to the front end and need to make that a secondary concern in order to get better at programming. I struggle to let go of the DOM because it is seductive in its immediacy. At one stage, I considered using the data attribute in HTML elements to store values for marked squares but that seemed like an extra step when JavaScript is supposed to be the single source of truth. In the actual coding, I really had to remind myself that where data is concerned, JavaScript is master and HTML is slave. My brain needs some serious rewiring.

Data type selection is also something I am also learning to keep simple. Why use a three dimensional object when all you need is a two dimensional array to store values in a game like Tic Tac Toe?

I really struggled with the game logic, and learning to simplify and really break problems down is still quite new. In this first attempt at Tic Tac Toe, I do feel my game logic wasn't great. I also know that it's not as bad as I think it is. Given how I solved the problem, I found myself having to tweak the control flow with a lot of if in if/else statements which are a little convoluted. Learning how to make this more straight forward is something to work on.

It took quite a long time to understand what the compiler was doing with my incorrect code, even when using the debugger. I can appreciate the console throwing error messages for hints but it still doesn't make the process any less frustrating. Practice makes perfect, hey.

I do feel like I need to step out of my comfort zone more but I don't feel like I can do that until I have the fundamentals down. Given that there are only 9 weeks remaining in this course, I do need to change gears.

In terms of best practices, I learned the order for structuring code is:

* Variables
* Functions
* DOM elements

Harry hinted that if I follow the above guidelines, I am unlikely to encounter issues with hoisting at this stage. There were moments I feel that knowledge of how to leverage closures would have benefited. I have also encountered the closures issue in other exercises and sort of get it / don't get it. Looking forward to furthering knowledge and practice.

### Unsolved Problems

I tried to change the hover states by adding a class and also via DOM manipulation but there was an issue with my recordMove function that is still unresolved. When the hover state changed, the move wouldn't register. I will look into this another time.

### To Do List

* Highlight the game win on the board
* Change hover states for each player
* Fix the bugs in the hover states
* Write better code

### Future features

* I'm not crazy about name inputs because I like the minimalism but will incorporate this in for practice
* CSS or JS animated intro over tiles
* Either atmospheric or 8-bit music with sound controls
* Make the game responsive


[Play Game](https://duyen-ho.github.io/Tic-Tac-Toe/)
