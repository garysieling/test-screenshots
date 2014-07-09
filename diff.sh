echo $1
echo $2

export file1=`pwd`/$1 
export file2=`pwd`/$2 

echo $file1
echo $file2

export cf=`compare -metric MAE $file1 $file2 null: 2>&1`

echo $cf
if [ "$cf" = "0 (0)" ]
then
  echo "Files are equal"
else
  echo "Files are not equal"
fi

compare $file1 $file2 `pwd`/diff.png \
          -compose Src -highlight-color White -lowlight-color Black \
          diff.png

