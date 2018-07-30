/**
 * Gère la récupération des routes
 */
urlTool = (function() {
  /**
   * @description Récupère l'url de base pour quérir une traduction
   * @author  K3rn€l_P4n1k
   * @returns {string}
   */
  function getTranslateUrl() {
    return `${glosbe.BASE_URL}/${glosbe.route.TRANSLATE}`
  }

  /**
   * @description Récupère l'url de base pour quérir une mémoire de traduction
   * @author  K3rn€l_P4n1k
   * @returns {string}
   */
  function getTranslationMemoryUrl() {
    return `${glosbe.BASE_URL}/${glosbe.route.TRANSLATION_MEMORY}`
  }

  return {
    getTranslateUrl,
    getTranslationMemoryUrl
  }
})()
