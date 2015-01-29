./node_modules/.bin/uglifyjs parambulator.js -c "evaluate=false" --comments "/ Copyright .*/" -m --source-map parambulator-min.map -o parambulator-min.js
./node_modules/.bin/jshint parambulator.js
./node_modules/.bin/docco parambulator.js -o doc
cp -r doc/* ../gh-pages/parambulator/doc
