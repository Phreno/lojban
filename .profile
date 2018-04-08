echo "sourcing lojban profile"

export LOJBAN="${WORKSPACE}/lojban" # folder containing this file (only one to adapt)
export LOJBAN_PROFILE="${LOJBAN}/.profile" # this file
export LOJBAN_RSC="${LOJBAN}/rsc" # ressource folder
export LOJBAN_EXT="${LOJBAN}/ext" # dependency folder
export LOJBAN_EXT_LUVZBA_DIR="${LOJBAN_EXT}/luvzba"
export LOJBAN_EXT_LUVZBA="${LOJBAN_EXT_LUVZBA_DIR}/luvzba.jar"
export LOJBAN_NORALUJV="${LOJBAN_RSC}/NORALUJV.txt" 
export LOJBAN_CMAVO="${LOJBAN_RSC}/cmavo.txt"
export LOJBAN_GISMU="${LOJBAN_RSC}/gismu.txt"

# CONFIGURATION
# -------------

jbo.source.profile(){
  source "${LOJBAN_PROFILE}"
}

jbo.edit.profile(){
  vim "${LOJBAN_PROFILE}"
  jbo.source.profile
}

alias j.ep='jbo.edit.profile'
alias j.sp='jbo.source.profile'

# GISMU
# -----

jbo.gismu(){
  payload='1-159'
  cut -b "${payload}" < "${LOJBAN_GISMU}"
}

jbo.filter.gismu(){
  gismuFilter="^ ${1}" 
  jbo.gismu | egrep "${gismuFilter}"
}

jbo.translate.gismu(){
  translateFilter="${1}"
  jbo.gismu | grep "${translateFilter}"
}

jbo.translate.gismu.strict(){
  translateFilter="\W${1}\W"
  jbo.gismu | egrep "${translateFilter}"
} 

jbo.pretty.gismu(){
  gismu="${1}"
  breakLine="\n"
  breakValsi="s/./${breakLine}/20"
  breakTranslation="s/./${breakLine}/62"
  sanitizeWhiteSpace="s/ \+/ /g"
  sanitizeIndent="s/^ //g"
  j.fg "${gismu}" | sed "${breakValsi}; ${breakTranslation}; ${sanitizeWhiteSpace}; ${sanitizeIndent}" 
}

jbo.pretty.gismu.1(){
  gismu="${1}"
  breakX="s/x[2-9]/&\n/g"
  sanitizeLineStart="s/^,*\s//gm"
  duplicateLine2="2s/.*/&\n&/g"
  underline="3s/./-/g"
  jbo.pretty.gismu "${gismu}" | sed "${breakX}; ${sanitizeLineStart}; ${duplicateLine2};" | sed "${underline}"
}

jbo.pretty.gismu.by.rafsi(){
  rafsi="${1}"
  gismu=$(jbo.get.gismu.by.rafsi "${rafsi}")
  jbo.pretty.gismu.1 "${gismu}"
}

jbo.memrise.gismu(){
  gismu="${1}"
  enlightFirstWord="1 s/^\(\w\+\)/**&**/"
  forceBreak="s/^/\n/g"
  jbo.pretty.gismu "${gismu}" | sed "${enlightFirstWord}; ${forceBreak}"
}

jbo.filter.rafsi(){
  rafsi="${1}"
  jbo.gismu | sed -n "/^\s\(.\{6\}\|.\{10\}\|.\{14\}\)${rafsi}.*/p"
}

jbo.get.gismu.by.rafsi(){
  rafsi="${1}"
  jbo.filter.rafsi "${rafsi}" | awk '{print $1}'
}

jbo.memrise.gismu.by.rafsi(){
  rafsi="${1}"
  gismu=$(jbo.get.gismu.by.rafsi "${rafsi}")
  jbo.memrise.gismu "${gismu}"
}

alias j.g='jbo.gismu'
alias j.fg='jbo.filter.gismu'
alias j.tg='jbo.translate.gismu'
alias j.tgs='jbo.translate.gismu.strict'
alias j.pg='jbo.pretty.gismu'
alias j.pgr='jbo.pretty.gismu.by.rafsi'
alias j.pg1='jbo.pretty.gismu.1'
alias j.mg='jbo.memrise.gismu'
alias j.ggr='jbo.get.gismu.by.rafsi'
alias j.mgr='jbo.memrise.gismu.by.rafsi'
alias j.fr='jbo.filter.rafsi'

# NORALUJV
# --------
jbo.noralujv(){
  cat "${LOJBAN_NORALUJV}"  
}

jbo.filter.noralujv(){
  noralujvFilter="${1}"
  jbo.noralujv | grep "${noralujvFilter}"
}

alias j.n='jbo.noralujv'
alias j.fn='jbo.filter.noralujv'

# LUJVO
# -----

jbo.luvzba(){
  java -jar "${LOJBAN_EXT_LUVZBA}"
}

alias j.ll='jbo.luvzba'


# CMAVO
# -----

jbo.cmavo(){
  payload='1-168'
  cut -b "${payload}" < "${LOJBAN_CMAVO}"
}

jbo.filter.cmavo(){
  cmavoFilter="^ ${1}"
  jbo.cmavo | egrep "${cmavoFilter}"
}

jbo.filter.cmavo.class(){
  cmavoClassFilter="^ .{10}${1}" 
  jbo.cmavo | egrep "${cmavoClassFilter}" | sort -k "1.12,1.20" 
}

jbo.filter.cmavo.class.strict(){
  cmavoClassFilter="^ .{10}${1}\W" 
  jbo.cmavo | egrep "${cmavoClassFilter}" | sort -k "1.12,1.20"
}

jbo.translate.cmavo(){
  translateFilter="${1}"
  jbo.cmavo | grep "${translateFilter}"
}

jbo.translate.cmavo.strict(){
  translateFilter="\W${1}\W"
  jbo.cmavo | egrep "${translateFilter}"
}

alias j.c='jbo.cmavo'
alias j.fc='jbo.filter.cmavo'
alias j.fcc='jbo.filter.cmavo.class'
alias j.fccs='jbo.filter.cmavo.class.strict'
alias j.tc='jbo.translate.cmavo'
alias j.tcs='jbo.translate.cmavo.strict'


# WORKING WITH TEXTE
# ------------------
jbo.word.listing(){
  file="${1}"
  while read line; do
    echo "${line}" | tr '[:blank:]' '\n'
  done < "${file}" | awk 'NF' | sort | uniq
}

jbo.define.list(){
  file="${1}"


  echo "[options='header']"
  echo "|===="
  echo "| valsi | rafsi         | short description                         | long description"
  
  while read valsi; do
    definition="$(j.fg "${valsi}\s" )";
    gismu="${definition:1:5}"
    rafsi="${definition:7:13}"
    word="${definition:20:41}"
    translation="${definition:62:159}"
    echo "| ${gismu} | ${rafsi} | ${word} | ${translation}"
  done < "${file}" | egrep -v "^\|\s+\|" | sort | uniq
  
  echo "|===="
}
