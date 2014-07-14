ls screenshots/$1/ | sed s/\\\([^-]*\\\)-.*/\\1/ | uniq | sort -g

