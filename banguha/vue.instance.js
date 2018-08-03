new Vue({
  el: "#app",


  data: {
    page: {
      title: "bangu'a"
    },
    // Focus de la session de travaille
    reference: {
      placeholder: "ca lo nu do.ui ciska lo jbobau",
      value: ":help;",
      help: [{
          action: "...valsi / words",
          description: "type words to display translation (if available)"
        },
        {
          action: "do ciska lo xamgu jufra",
          description:   "display boxes"
        }, {
          action: "<pre>:help;</pre>",
          description:   "display help"
        },
        {
          action: "<pre>:command [args...];<pre>",
          description: "run some command"
        },
        {
          action: "<pre>:jvozba <gismu> [gismu ...];<pre>",
          description: "do a lujvo"
        },
        {
          action: "<pre>:jvokaha &lt;lujvo&gt;;<pre>",
          description: "decompose a lujvo"
        },
        {
          action: "<pre>:tm [valste...];<pre>",
          description: "request <a href='https://glosbe.com/'> glosbe</a> for available sample about vlaste"
        },
        {
          action:   "<pre> # is a sort of comment </pre>",
          description: "after this sign, the lojban is not parsed for the boxes, but you can run command and display translation"
        },
        {
          action:   "<kbd>enter</kbd>",
          description: "type enter to store your work in history"
        },
        {
          action: "<kbd>↑</kbd> <kbd>↓</kbd>",
          description: "use arrow (up/down) to navigate through history"
        }
      ],
      waitForInput: undefined,
      waitingTime: 1000,
      history: []
    },
    // TODO: déplacer data dans reference.glosbe
    data: {
      translate: undefined,
      translationMemory: undefined
    }
  },
  watch: {
    "reference.value" () {
      const instance = this
      instance.emptyData()
      if (instance.command) {
        let command = this.parseCommand(instance.command)
        if (command.action === "tm" && command.args) {
          glosbeService.getTranslationMemory(
            command.args.join(' '),
            instance.setDataTranslationMemory
          )
        }
      }
    }
  },
  computed: {

    command() {
      let command = ''
      let commandStart = ':'
      let commandEnd = ';'
      if (
        this.hasReferenceValue &&
        this.reference.value.includes(commandStart) &&
        this.reference.value.includes(commandEnd)
      ) {
        command = this.reference.value.substring(
          this.reference.value.lastIndexOf(commandStart) + 1,
          this.reference.value.lastIndexOf(commandEnd)
        );
      }
      return command
    },
    help() {
      let result
      let command
      if (this.command) {
        command = this.parseCommand()
        if ("help" === command.action) {
          result = this.reference.help
        }
      }
      return result
    },
    jvoste() {
      let result
      let command
      if (this.command) {
        command = this.parseCommand()
        if ("jvozba" === command.action) {
          try {
            result = jvozba(command.args)
          } catch (error) {
            /* malformed tanru */
          }
        }
      }
      return result
    },

    jvokahaste() {
      let result
      let command
      if (this.command) {
        command = this.parseCommand()
        if ("jvokaha" === command.action) {
          result = jvokaha(command.args.pop())
          result = result.map(rafsi =>
            data && data.gismuDatabase ?
            data.gismuDatabase.find(gismu => gismu.rafsi.includes(rafsi)) : {
              rafsi
            }
          )
        }
      }
      return result
    },

    // =============================================================================
    // Transformation de données
    // =============================================================================
    referenceSegments() {
      const whiteSpaces = /\s+/
      const comment = /#.*$/
      const empty = ''
      return this.reference.value.split(whiteSpaces).map((el, index) => {
        return {
          value:  el,
          priority: index
        }
      })
    },

    dictionaryTranslations() {

      /**
       * @description
       * @author  K3rn€l_P4n1k
       */
      // TODO: externaliser dans un service
      // TODO: prioriser les sources de données
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
      const comment = /#.*$/
      const empty = ''
      let fullParse
      let simplified
      if (this.reference && this.reference.value) {
        try {
          fullParse = camxes.parse(this.reference.value.replace(comment, empty))
          simplified = simplifyTree(fullParse)
        } catch (e) {
          /* 
          Something strange happens but I don't care :)
          */
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
      return this.referenceParsed && this.referenceParsed[0] ? constructBoxesOutput(this.referenceParsed[0], 0) :  undefined
    },

    // =============================================================================
    // Vérification de données
    // TODO: mettre en commun certaines vérifications
    // =============================================================================
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
        parse = this.command.split(/\s+/)
      }
      return {
        action:  parse.shift(),
        args: parse
      }
    },

    runCommand() {
      let command = this.parseCommand(this.command)
      switch (command.action) {
        case "tm":

          break;

        case "jvoka'a":
          break;

        case "jvozba":
          console.log(result)
          break

        default:
          break;
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
        this.reference.history.push(`${this.reference.value}`)
      } else {
        //TODO: faire remonter le résultat en première position 
      }

      // @see https://stackoverflow.com/a/36744732
      /*       this.reference.history = this.reference.history.filter((survivor, index, arr) =>
              index === arr.findIndex((other) => (
                other.valsi === survivor.valsi
              )))
       */
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
    setDataTranslate(data) {
      this.data.translate = data
    },
    setDataTranslationMemory(data) {
      this.data.translationMemory = data
    },
    getRafsiListFrom(valsi) {
      let rafsi = []
      if (valsi && valsi.rafsi) {
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
    emptyDataTranslate() {
      this.setDataTranslate(undefined)
    },
    emptyDataTranslationMemory() {
      this.setDataTranslationMemory(undefined)
    },
    emptyData() {
      this.emptyDataTranslate()
      this.emptyDataTranslationMemory()
    }
  }
})