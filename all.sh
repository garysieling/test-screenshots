for i in $( ./list_tests.sh $1 ); do
  ./diff.sh screenshots/$1/$i
done

