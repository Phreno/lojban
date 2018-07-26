# extract table row
cat melbi | sed 's/<div class="tableRow/\n<div class="tableRow/g' | grep tableRow | sed 's/<\/div><\/div><\/div><\/div>.*/<\/div><\/div>/g' 