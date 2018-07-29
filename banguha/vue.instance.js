new Vue({
  el:   "#app",
  data: {
    // Focus de la session de travaille
    reference: {
      label: "La session de travail porte sur ",
      placeholder:   "Un mot à travailler",
      value: undefined,
      help: "Défini un axe la session de travail",
      waitForInput: undefined,
      waitingTime: 1000
    },
  },
  watch:  {
    "reference.value" () {
      function doReferenceUpdate() {
        glosbeService.translate(instance.reference.value, data => console.log(data))
        glosbeService.getTranslationMemory(instance.reference.value, data => console.log(data))
        instance.waitForInput = undefined
      }

      function preventUselessCall() {
        if (instance.waitForInput) {
          clearTimeout(instance.waitForInput)
        }
      }

      function waitAndDoUpdate() {
        instance.waitForInput = setTimeout(doReferenceUpdate, 1000)
      }

      const instance = this
      preventUselessCall()
      waitAndDoUpdate()
    }
  },
  methods: {

  }
})