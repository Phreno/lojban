new Vue({
  el:   "#app",
  data: {
    // Focus de la session de travaille
    reference: {
      label: "La session de travail porte sur ",
      placeholder:   "Un mot à travailler",
      value: undefined,
      help: "Défini un axe la session de travail"
    }
  },
  watch:  {
    "reference.value" () {
      glosbeService.getTranslationMemory(this.reference.value)
    }
  },
  methods: {

  }
})