# unogs
Reads one or more newline separated lines from file, 
and search unogs.

# Requirements
Install [Node.js](https://nodejs.org/en/download/)

# How to install
```
npm install
```

# Preparations before first run
(1)
first create file *wishlist*, simple text file with a search per line,
each line containing the movie you need to search (and the year in paranthesis)

```wishlist
4 Months, 3 Weeks and 2 Days (2007)
Da 5 Bloods (2020)
```

# How to run
```
node unogs.js 
```

or run and write output to additional logfile
```
node unogs.js | tee unogs.log 
```

