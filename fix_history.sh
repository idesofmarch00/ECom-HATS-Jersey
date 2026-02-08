#!/bin/bash
git filter-branch -f --env-filter '
    export GIT_AUTHOR_NAME="idesofmarch00"
    export GIT_AUTHOR_EMAIL="sa.idesofmarch@gmail.com"
    export GIT_COMMITTER_NAME="idesofmarch00"
    export GIT_COMMITTER_EMAIL="sa.idesofmarch@gmail.com"
' HEAD

git push -f origin main
