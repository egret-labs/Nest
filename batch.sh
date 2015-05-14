

for((i=0;i<1000;i++));do node random.js >> a.txt;done
sort a.txt | uniq -c
