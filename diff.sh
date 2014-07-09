export prefix=`pwd`/$1
echo 'Prefix:'
echo $prefix

export path1=`./first.sh $prefix`
export path2=`./second.sh $prefix`

echo $path1
echo $path2

export cf=`compare -metric MAE $path1 $path2 null: 2>&1`

echo 'Comparison:'
echo $cf

if [ "$cf" = "0 (0)" ]
then
  echo "Files are equal"
else
  echo "Files are not equal"
fi

compare $path1 $path2 `pwd`/diff.png \
          -compose Src -highlight-color White -lowlight-color Black \
          `pwd`/diff.png

