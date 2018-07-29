/*
 * Filename: ./glosbe.service.js
 * Path: ./banguha
 * Created Date: Saturday, July 28th 2018, 2:39:43 pm
 * Author: phreno
 * 
 * @file Service de récupération des exemples de traduction
 * @see https://glosbe.com/a-api
 * 
 * Copyright (c) 2018 Kern€l_P4n1k
 */

glosbeService = (function () {

  /**
   * Vérification des arguments du service
   */
  (function handleServiceConfig() {
    const validOptions = languages && languages.from && languages.to
    if (!validOptions) {
      console.error('lors du chargement du paramètrage du service')
      console.log(languages)
    }
  })

  function getTranslationMemory(phrase, callback) {

    const url = `${urlTool.getTranslationMemoryUrl()}${optionTool.getTranslationMemoryOption({phrase})}`
    $.get({
      url,
      crossDomain: true,
      dataType: "jsonp",
      headers: {
        Accept: "application/json"
      }
    }).done(callback).fail((err) => console.error(err))
  }

  function translate(phrase, callback) {
    const url = `${urlTool.getTranslateUrl()}${optionTool.getTranslationMemoryOption(phrase)}`
    $.ajax({
      url
    }).done(callback)
  }

  return {
    getTranslationMemory,
    translate
  }
})()