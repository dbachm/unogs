# unogs
Crawl through unogs.com (Netflix region finder)
and log infos (like region availability).

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

# Example output
```unogs.log
search Da 5 Bloods (year: 2020)

    
      
      
      
      
      
      
      Da 5 Bloods (movie,2020)
      
      Four African American veterans return to Vietnam decades after the war to find their squad leader's remains â€” and a stash of buried gold. From Spike Lee.
      
      globally new on 2020-06-12
      
        Runtime:2h35m52s
        +27
    
 Hurray, looks like we have a match!!!

🇨🇦 Canada
🇫🇷 France
🇩🇪 Germany
🇳🇱 Netherlands
🇵🇱 Poland
🇬🇧 United Kingdom
🇺🇸 United States
🇦🇷 Argentina
🇦🇺 Australia
🇧🇪 Belgium

```
