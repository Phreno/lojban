# extract table row
cat melbi | sed 's/<div class="tableRow/\n<div class="tableRow/g' | grep tableRow | sed 's/<\/div><\/div><\/div><\/div>.*/<\/div><\/div>/g' > melbi.html 

# force line break every tag
cat melbi.html | sed 's/>/>\n/g; s/</\n</g' | egrep -v '^\s*$' > melbi.breaked.html

# extract strings
cat melbi.breaked.html | grep -v '<.*>' > melbi.strings