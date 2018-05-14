# codeforces-problem-filter

I always wanted to practice questions from codeforces in a way like:

> Get 5 problems having tag dp and all should be problem A

Thus this script for now fetches all the problems for you of a particular tag and index and stores them as pdf in the problems directory which is created in the repo automatically.

The supported values, for now, are:

**tags**: Whatever tags you see on the codeforces problems like dp, math, sortings etc.

**limit**: You can specify the number of problems you want. Put 0 for getting all problems.

![CLI usage](/screenshots/cli.png?raw=true "CLI usage")

![Final output](/screenshots/output.png?raw=true "output")

And as you can see above the program has saved all the required problem statements into the directory.


### Usage

These steps assume you have Node.js >= 8.0 and NPM installed in advance.

+ Clone the repo
+ Run ```npm install```
+ Run ```node app.js``` in the directory and you will be guided.