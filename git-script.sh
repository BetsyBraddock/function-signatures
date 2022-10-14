#!/bin/sh

set -u

echo running script;

git checkout master;

[ -z "$(git status --porcelain)" ] || { echo "working tree not clean" >&2; false; }

echo I am here;

for commit in $(git log --pretty=format:"%H" ./src/utils/blockchain/abi/)
do
    echo $commit;
    # This will overwrite any changes.
    git checkout $commit;
    echo $commit checked out;
    node '../functionSignatures/writeAbiToCsv.js';
    echo $commit file written to csv;
    sleep 1;
    # Run command here.
done;
git checkout master;
exit;