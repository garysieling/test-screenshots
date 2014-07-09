ls -al $1-* | sort -k 6,6 -k 7,7 | tail -n 2 | head -n 1 | sed "s/.* //"
