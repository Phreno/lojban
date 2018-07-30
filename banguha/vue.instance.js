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
    response: {
      label: "Votre réponse",
      placeholder: "...",
      value: undefined
    },
    data: {
      translate: undefined,
      translationMemory: undefined
    }
  },
  watch: {
    "reference.value"() {
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

      function preventUselessCallToService() {
        if (instance.waitForInput) {
          clearTimeout(instance.waitForInput)
        }
      }

      function waitAndDoServiceCall() {
        instance.waitForInput = setTimeout(doServiceCall, 1000)
      }

      function handleReferenceChange() {
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

    // =============================================================================
    // Rendu de l'ihm
    // =============================================================================
    rightContainerClass() {
      let obj = {}
      let className = this.displayReferenceTranslations ? "col-8" : "col"
      obj[className] = true
      return obj
    },

    // =============================================================================
    // Vérification de données
    // =============================================================================
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
