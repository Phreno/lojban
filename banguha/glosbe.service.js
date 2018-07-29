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
   * @description Récupère les traductions disponnibles contenant la phrase en paramètre
   * @author  K3rn€l_P4n1k
   * @param {*} phrase Morceau de texte pour lequel on recherche des traductions
   * @param {*} callback
   */
  function getTranslationMemory(phrase, callback) {
    const url = `${urlTool.getTranslationMemoryUrl()}${optionTool.getTranslationMemoryOption({phrase})}`
    $.get({
      ...glosbe.templateOption.jQuery,
      url,
    }).done(callback).fail((err) => console.error(err))
  }

  /**
   * @description Traduit la phrase passée en paramètre
   * @author  K3rn€l_P4n1k
   * @param {*} phrase Morceau de texte à traduire
   * @param {*} callback
   */
  function translate(phrase, callback) {
    const url = `${urlTool.getTranslateUrl()}${optionTool.getTranslationMemoryOption({phrase})}`
    $.get({
      ...glosbe.templateOption.jQuery,
      url
    }).done(callback).fail((err) => console.error(err))
  }

  return {
    getTranslationMemory,
    translate
  }
})()