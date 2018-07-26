SOURCE="https://fr.glosbe.com/ajax/phrasesAutosuggest?from=en&dest=jbo&phrase=test"
TRADUCTION="https://glosbe.com/en/jbo/word"

getWordTraductionFile(){
    word="${1}"
    wget "${TRADUCTION}/${word}" -O "${word}"
}


# extract table row
filterTableRowFromFile(){
    file="${1}"
    # le fichier html est minifié, les lignes sont encodées sur une seule ligne
    isolateTableRow='s/<div class="tableRow/\n<div class="tableRow/g'
    # on vire la fin du fichier pour que les données a travaillées conservent le même format
    normalizeEOF='s/<\/div><\/div><\/div><\/div>.*/<\/div><\/div>/g'
    cat "${file}" | sed "${isolateTableRow}" | grep "tableRow" | sed "${normalizeEOF}"
}

# force line break every tag
prepareFileForExtraction(){
    file="${1}"
    # on assume que les traductions ne comportent pas de chevrons
    forceLineBreak='s/>/>\n/g; s/</\n</g'
    # et on vire ce qui ne sert à rien
    noEmptyLine='^\s*$'
    filterTableRowFromFile "${file}" | sed "${forceLineBreak}" | egrep -v "${noEmptyLine}"
}

# extract strings
extractStringsFromFile(){
    file="${1}"
    removeTags='<.*>'
    prepareFileForExtraction "${file}" | grep -v "${removeTags}"
}

WORD="${1}"
getWordTraductionFile "${WORD}"
extractStringsFromFile "${WORD}"
rm "${WORD}"
