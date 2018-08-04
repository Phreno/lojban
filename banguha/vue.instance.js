new Vue({
  el: "#app",
  data: {
    page: {
      title: "bangu'a"
    },
    // Focus de la session de travaille
    reference: {
      placeholder: "ca lo nu do.ui ciska lo jbobau",
      value: `:${banguha.command.action.HELP};`,
      history: []
    },
    data: {
      translationMemory: undefined
    }
  },
  watch: {
    "reference.value" () {
      this.emptyData()
      if (this.commandParsed &&
        banguha.command.action.TM === this.commandParsed.action &&
        this.commandParsed.args) {
        glosbeService.getTranslationMemory(
          this.commandParsed.args.join(' '),
          this.setDataTranslationMemory
        )
      }
    }
  },
  computed: {
    command() {
      if (this.includesCommand) {
        command = this.reference.value.substring(
          this.reference.value.lastIndexOf(banguha.command.START) + 1,
          this.reference.value.lastIndexOf(banguha.command.END)
        );
      }
      return command
    },
    commandParsed() {
      return this.includesCommand ?
        this.parseCommand() :  undefined
    },
    help() {
      return this.displayHelp ?
        banguha.help : undefined
    },
    vlasisku() {
      return this.displayVlasisku ?
        `https://vlasisku.lojban.org/${encodeURIComponent(this.commandParsed.args.join(' '))}` : undefined
    },
    jvoste() {
      try {
        return this.displayJvozba ?
          jvozba(this.commandParsed.args) :  undefined
      } catch (e) {
        /* We don't care about parse error */
      }
    },
    open() {
      return this.displayOpen ?
        `http://${this.commandParsed.args[0]}` : undefined
    },
    cll() {
      return this.displayCll ?
        "https://lojban.github.io/cll/" :  undefined
    },
    youtube() {
      return this.displayYoutube ?
        `https://www.youtube.com/embed/${this.commandParsed.args[0]}` : undefined
    },
    jvokahaste() {
      try {
        return this.displayJvokaha ?
          jvokaha(this.commandParsed.args.pop()).map(rafsi =>
            data && data.gismuDatabase ?
            data.gismuDatabase.find(gismu => gismu.rafsi.includes(rafsi)) : {
              rafsi
            }
          ) : undefined
      } catch (e) {
        /* We don't care about parse error */
      }
    },

    // =============================================================================
    // Transformation de données
    // =============================================================================
    referenceSegments() {
      const whiteSpaces = /\s+/
      return this.reference.value.split(whiteSpaces).map((el, index) => {
        return {
          value:  el,
          priority: index
        }
      })
    },

    dictionaryTranslations() {
      let match = []
      let valsi
      let words
      let instance = this

      // search for valsi
      for (database in data) {
        valsi = instance.getSourcesFromSegments(data[database])
        words = instance.getTargetsFromSegments(data[database])
        if (valsi) {
          match.push(...valsi)
        }
        if (words) {
          match.push(...words)
        }
      }

      // @see https://stackoverflow.com/a/36744732
      match = match.filter((survivor, index, arr) =>
        index === arr.findIndex((other) => (
          other.valsi === survivor.valsi
        )))

      match = match.map(el => {
        el['@priority'] = this.referenceSegments.find(segment => segment.value === el.valsi || segment.value === el.shortTranslation).priority
        return el
      })
      return match.sort((a, b) => b['@priority'] - a['@priority'])
    },

    referenceParsed() {
      const empty = ''
      let fullParse
      let simplified
      if (this.reference && this.reference.value) {
        try {
          fullParse = camxes.parse(this.reference.value.replace(banguha.COMMENT, empty))
          simplified = simplifyTree(fullParse)
        } catch (e) {
          /* We don't care about parse error */
        }
      }
      return simplified
    },

    // =============================================================================
    // Rendu de l'ihm
    // =============================================================================

    /**
     * Shows the boxes in the interface.
     */
    boxes() {
      return this.referenceParsedWithSuccess ? constructBoxesOutput(this.referenceParsed[0], 0) :  undefined
    },

    // =============================================================================
    // Vérification de données
    // =============================================================================
    displayRightContainer() {
      return this.displayHelp ||
        this.displayJvokaha ||
        this.displayJvozba ||
        this.displayTranslations ||
        this.displayVlasisku ||
        this.displayOpen ||
        this.displayCll ||
        this.displayYoutube
    },
    displayCll() {
      return this.commandParsed && banguha.command.action.CLL === this.commandParsed.action
    },
    displayVlasisku() {
      return this.commandParsed && banguha.command.action.VLASISKU === this.commandParsed.action
    },
    displayHelp() {
      return this.commandParsed && banguha.command.action.HELP === this.commandParsed.action
    },
    displayJvozba() {
      return this.commandParsed && banguha.command.action.JVOZBA === this.commandParsed.action
    },
    displayJvokaha() {
      return this.commandParsed && banguha.command.action.JVOKAHA === this.commandParsed.action
    },
    displayOpen() {
      return this.commandParsed && banguha.command.action.OPEN === this.commandParsed.action
    },
    displayYoutube() {
      return this.commandParsed && banguha.command.action.YOUTUBE === this.commandParsed.action
    },
    referenceParsedWithSuccess() {
      return this.referenceParsed && this.referenceParsed[0]
    },
    includesCommand() {
      return this.hasReferenceValue &&
        this.reference.value.includes(banguha.command.START) &&
        this.reference.value.includes(banguha.command.END);
    },
    hasReferenceValue() {
      return this.reference &&
        this.reference.value
    },
    displayDictionaryTranslations() {
      return (
        this.hasReferenceValue &&
        this.dictionaryTranslations &&
        this.dictionaryTranslations.length > 0
      )
    },
    displayTranslations() {
      return (
        this.data &&
        this.data.translationMemory &&
        this.data.translationMemory.examples &&
        this.data.translationMemory.examples.length > 0
      )
    }
  },
  methods: {
    // =============================================================================
    // Command Tools
    // =============================================================================
    parseCommand() {
      let parse = []
      if (this.command) {
        parse = this.command.split(banguha.command.ARGS_SEPARATOR)
      }
      return {
        action:  parse.shift(),
        args: parse
      }
    },
    // =============================================================================
    // History Tools
    // =============================================================================
    backupReference() {
      const notFound = -1
      const currentIndex = this.findIndexInHistory()
      const empty = /^\s*$/
      if (this.hasReferenceValue && notFound === currentIndex && !this.reference.value.match(empty)) {
        this.reference.history.push(`${this.reference.value}`) // push a copy to avoid conflicts
      }
    },
    memorize() {
      this.backupReference()
      this.emptyReference()
      console.log(this.reference.history)
    },
    findIndexInHistory() {
      return this.reference.history.findIndex(el => el === this.reference.value)
    },
    stepBackward() {
      const notFound = -1
      const firstItem = 0
      const empty = /^\s*$/
      const isEmpty = this.hasReferenceValue && this.reference.value.match(empty)
      let matchIndex = this.findIndexInHistory()
      let next

      if (!this.hasReferenceValue || isEmpty) {
        matchIndex = this.reference.history.length
      } else if (notFound === matchIndex) {
        this.backupReference()
        matchIndex = this.findIndexInHistory()
      }

      next = matchIndex - 1
      if (notFound !== next) {
        this.setReference(this.reference.history[next])
      } else {
        this.emptyReference()
      }
    },
    stepForward() {
      const notFound = -1
      let matchIndex = this.findIndexInHistory()

      if (notFound === matchIndex) {
        this.backupReference()
        matchIndex = this.findIndexInHistory()
      }

      if (this.reference.history.length - 1 >= matchIndex + 1) {
        this.setReference(this.reference.history[matchIndex + 1])
      } else {
        this.emptyReference()
      }
    },

    // =============================================================================
    // Database tools
    // TODO: rextract data to standardize databases
    // =============================================================================
    getSourcesFromSegments(database) {
      let source = database
        .filter(el => this.referenceSegments.some(segment => el.valsi === segment.value))
      return source.map(el => {
        el['@translation'] = "source"
        el['@type'] = database
        return el
      })
    },
    getTargetsFromSegments(database) {
      let target = database
        .filter(el => this.referenceSegments.some(segment => el.shortTranslation === segment.value))
      return target.map(el => {
        el['@translation'] = "target";
        el['@type'] = database 
        return el
      })
    },
    // =============================================================================
    // Html Tools
    // =============================================================================
    decodeHtml(htmlEncoded) {
      return $("<div/>")
        .html(htmlEncoded)
        .text()
    },

    // =============================================================================
    // Getter & Setter
    // =============================================================================
    setReference(text) {
      this.reference.value = text
    },
    setDataTranslationMemory(data) {
      this.data.translationMemory = data
    },
    getRafsiListFrom(valsi) {
      let rafsi = []
      if (valsi && valsi.rafsi) {
        // TODO: Fix this ugly patch with new extraction of data
        rafsi = valsi.rafsi.split(/\s+/)
      }
      return rafsi
    },

    // =============================================================================
    // Nettoyage des variables
    // =============================================================================
    emptyReference() {
      const empty = ''
      this.setReference(empty);
    },

    emptyDataTranslationMemory() {
      this.setDataTranslationMemory(undefined)
    },

    emptyData() {
      this.emptyDataTranslationMemory()
    }
  }
})