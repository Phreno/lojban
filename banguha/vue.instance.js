new Vue({
  el: "#app",


  data: {
    // Focus de la session de travaille
    reference: {
      label: "La session de travail porte sur ",
      placeholder: "Un mot à travailler",
      value: undefined,
      help: "Défini un axe la session de travail",
      waitForInput: undefined,
      waitingTime: 1000
    },
    // TODO: déplacer data dans reference.glosbe
    data: {
      translate: undefined,
      translationMemory: undefined
    }
  },
  watch: {
    "reference.value" () {
      // TODO: faire un bouton pour requéter manuellement sinon on se fait bloquer
      return undefined

      function preventUselessCallToService() {
        if (instance.waitForInput) {
          clearTimeout(instance.waitForInput)
        }
      }

      function handleReferenceChange() {
        function waitAndDoServiceCall() {
          function doServiceCall() {
            glosbeService.translate(
              instance.reference.value,
              instance.setDataTranslate
            )
            glosbeService.getTranslationMemory(
              instance.reference.value,
              instance.setDataTranslationMemory
            )
            instance.waitForInput = undefined
          }
          instance.waitForInput = setTimeout(doServiceCall, 1000)
        }
        const noLetters = /^\W*$/
        const noReference = instance.reference.value.match(noLetters)
        if (noReference) {
          instance.emptyData()
        } else {
          waitAndDoServiceCall()
        }
      }

      const instance = this
      preventUselessCallToService()
      handleReferenceChange()
    }
  },
  computed: {
    // =============================================================================
    // Transformation de données
    // =============================================================================
    referenceSegments() {
      let whiteSpaces = /\s+/
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
      let fullParse
      let simplified
      if (this.reference && this.reference.value) {
        try {
          fullParse = camxes.parse(this.reference.value)
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

    displayDictionaryTranslations() {
      return (
        this.reference &&
        this.reference.value &&
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

    decodeHtml(htmlEncoded) {
      return $("<div/>")
        .html(htmlEncoded)
        .text()
    },
    setDataTranslate(data) {
      this.data.translate = data
    },
    setDataTranslationMemory(data) {
      this.data.translationMemory = data
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