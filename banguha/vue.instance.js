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
    dictionaryTranslations() {

      /**
       * @description
       * @author  K3rn€l_P4n1k
      
       */
      let whiteSpaces = /\s+/
      // TODO: externaliser dans un service
      let match = []
      let referenceSegments = this.reference.value.split(whiteSpaces)
      let valsi
      let words

      // search for valsi
      for (database in data) {
        valsi = data[database]
          .filter(el => referenceSegments.some(segment => el.valsi === segment))
        valsi.map(el => {
          el['@translation'] = "source"; 
          return el
        })
        words = data[database]
          .filter(el => referenceSegments.some(segment => el.shortTranslation === segment))
        words.map(el => {
          el['@translation'] = "target"; 
          return el
        })
        match.push(...valsi, ...words)
      }




      match = match.filter((survivor, index, arr) =>
        index === arr.findIndex((other) => (
          other.valsi === survivor.valsi
        )))

      return match
    },
    referenceTranslations() {
      let translations
      if (
        this.data &&
        this.data.translate &&
        this.data.translate.tuc &&
        this.data.translate.tuc
      ) {
        translations = this.data.translate.tuc.map(el => el.phrase)
      }
      return translations
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
    rightContainerClass() {
      let obj = {}
      let className = this.displayLeftContainer ? "col-8" : "col"
      obj[className] = true
      return obj
    },

    /**
     * Shows the boxes in the interface.
     */
    boxes() {
      return this.referenceParsed && this.referenceParsed[0] ? constructBoxesOutput(this.referenceParsed[0], 0) :  undefined
    },

    // =============================================================================
    // Vérification de données
    // =============================================================================
    displayLeftContainer() {
      return this.displayReferenceTranslations || this.displayDictionaryTranslations
    },
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
    },
    displayReferenceTranslations() {
      return (
        this &&
        this.referenceTranslations &&
        this.referenceTranslations.length > 0
      )
    }
  },
  methods: {
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