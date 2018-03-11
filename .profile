echo "sourcing lojban profile"

export LOJBAN="${WORKSPACE}/lojban"
export LOJBAN_PROFILE="${LOJBAN}/.profile"
export LOJBAN_RSC="${LOJBAN}/rsc"
export LOJBAN_NORALUJV="${LOJBAN_RSC}/NORALUJV.txt"
export LOJBAN_CMAVO="${LOJBAN_RSC}/cmavo.txt"
export LOJBAN_GISMU="${LOJBAN_RSC}/gismu.txt"

# CONFIGURATION
# -------------

jbo.edit.profile(){
  vim "${LOJBAN_PROFILE}"
  source "${LOJBAN_PROFILE}"
}

alias j.ep='jbo.edit.profile'

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

alias j.g='jbo.gismu'
alias j.fg='jbo.filter.gismu'
alias j.tg='jbo.translate.gismu'
alias j.tgs='jbo.translate.gismu.strict'

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
  jbo.cmavo | egrep "${cmavoClassFilter}" 
}

jbo.filter.cmavo.class.strict(){
  cmavoClassFilter="^ .{10}${1}\W" 
  jbo.cmavo | egrep "${cmavoClassFilter}" 
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
