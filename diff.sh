echo $1
echo $2


compare `pwd`/$1 `pwd`/$2 `pwd`/diff.png \
          -compose Src -highlight-color White -lowlight-color Black \
          diff.png

