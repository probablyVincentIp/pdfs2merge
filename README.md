# PDFS2MERGE
I had to print about 50 pdf files and MacOS/Windows don't seem to provide an easy way to merge them all into one big file. 
It does what it supposed to do but is very rough around the edges as I made this in 30 minutes before picking up my kid from daycare.

Probably (eh... possibly), I'll revisit this in the future to refine it.

## usage
1. create a folder called `pdf` and put all your pdf files inside ([DBAA](https://www.urbandictionary.com/define.php?term=D.B.A.A.) with your files, at the moment it just checks if the file name ends with ".pdf")
2. `npm run merge` / `yarn merge`
3. pdf is saved in the root as `merged.pdf`