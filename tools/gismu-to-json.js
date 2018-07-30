let fs = require('fs')


// =============================================================================
// Description des fichiers à extraires
// =============================================================================
let config = {
  LINE_BREAK: '\n',
  gismu: {
    identifier:   "gismu",
    path: "../rsc/gismu.txt",
    output:   "../rsc/gismu.json",
    columns: {
      positions: {
        valsi: {
          start: 1,
          end: 6
        },
        rafsi:  {
          start: 7,
          end: 19
        },
        shortTranslation:  {
          start: 20,
          end: 40
        },
        aka: {
          start: 41,
          end: 61
        },
        translation: {
          start: 62,
          end: 158
        },
        unknown: {
          start: 159,
          end: 168
        },
        refers: {
          start: 169
        }
      }
    }
  },
  cmavo: {
    identifier: "cmavo",
    path:   "../rsc/cmavo.txt",
    output:   "../rsc/cmavo.json",
    columns: {
      positions: {
        valsi:  {
          start: 0,
          end: 10
        },
        class:  {
          start: 11,
            end: 19
        },
        translation: {
          start: 20,
          end: 61
        },
        definition:  {
          start: 62
        }
      }
    }
  }
}

/**
 * @description Procède a l'extraction des données désignés dans la configuration
 * @author  K3rn€l_P4n1k
 * @param {*} dataType
 */
function extractDataFrom(dataType) {

  function line2Json(line) {
    let columns = config[dataType].columns.positions
    let jsonObj = {};
    let field
    let start
    let end
    for (let column in columns) {
      start = config[dataType].columns.positions[column].start
      end = config[dataType].columns.positions[column].end
      field = line.substring(start, end).trim()
      jsonObj[column] = field.trim()
    }
    return jsonObj
  }

  fs.readFile(config[dataType].path, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      exit(1)
    }
    const jsonArray = data.split(config.LINE_BREAK).filter((el, index) => index !== 0 && !el.match(/^\s*$/)).map(line2Json)
    fs.writeFile(config[dataType].output, JSON.stringify(jsonArray, null, 2), err => {
      if (err) {
        console.error(err)
        exit(1)
      }
    })
  })
}

function main() {
  extractDataFrom(config.gismu.identifier)
  extractDataFrom(config.cmavo.identifier)
}

main()