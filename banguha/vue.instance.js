new Vue({
  el: "#app",


  data: {
    page: {
      title: "bangu'a"
    },
    // Focus de la session de travaille
    reference: {
      placeholder: "mi djica lo nu do ciska lo jbobau",
      value: undefined,
      help: [
        "lo glico fanva cu cumki ma'i zoi sy. http://www.lojban.org/publications/wordlists/gismu.txt .sy.",
        "zoi sy.#.sy. cu pinka",
        "zoi sy.:gleki;.sy. cu prina lo mupli sepi'o la'o sy. glosbe .sy.",
        "lo skami galtu ciska .e lo skami dizlo ciska cu litru le do jufra citri"
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
      function preventUselessCallToService() {
        if (instance.waitForInput) {
          clearTimeout(instance.waitForInput)
        }
      }

      function handleReferenceChange() {
        function waitAndDoServiceCall() {
          function doServiceCall() {
            /* glosbeService.translate(
              instance.reference.substring(
                str.lastIndexOf(":") + 1,
                str.lastIndexOf(";")
              ),
              instance.setDataTranslate
            ) */
            glosbeService.getTranslationMemory(
              instance.command,
              instance.setDataTranslationMemory
            )
            instance.waitForInput = undefined
          }
          instance.waitForInput = setTimeout(doServiceCall, 1000)
        }
        const noLetters = /^\W*$/
        const noCommand = instance.command.match(noLetters)
        if (noCommand) {
          instance.emptyData()
        } else {
          // TODO: handle complex command
          waitAndDoServiceCall()
        }
      }

      const instance = this
      preventUselessCallToService()
      handleReferenceChange()
    }
  },
  computed: {

    command() {
      let command = ''
      if (this.hasReferenceValue) {
        command = this.reference.value.substring(
          this.reference.value.lastIndexOf(":") + 1,
          this.reference.value.lastIndexOf(";")
        );
      }
      return command
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