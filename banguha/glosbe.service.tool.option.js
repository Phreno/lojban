/**
 * Applati un objet JSON en une string représentant les arguments de la requête ajax
 */
optionTool = (function () {
  const tool = {
    QUERY_START: "?",
    OLD_SEPARATOR: /,/g,
    NEW_SEPARATOR: "&",
    OLD_ASSIGNMENT: /:/g,
    NEW_ASSIGNMENT: "=",
    JUNK: /{|}|"/g,
    EMPTY: ""
  }

  /**
   * @description Applati l'objet en chaîne de charactère
   * @author  K3rn€l_P4n1k
   * @param {*} option
   * @returns {string} "?param1=value1&param2=value2"
   */
  function serialize(option) {
    const serialized = JSON.stringify(option)
      .replace(tool.JUNK, tool.EMPTY)
      .replace(tool.OLD_ASSIGNMENT, tool.NEW_ASSIGNMENT)
      .replace(tool.OLD_SEPARATOR, tool.NEW_SEPARATOR)
    return `${tool.QUERY_START}${serialized}`
  }

  function getTranslateOption(overload) {
    const options = {
      ...glosbe.templateOption.translate,
      ...overload
    }
    return serialize(options)
  }

  function getTranslationMemoryOption(overload) {
    const options = {
      ...glosbe.templateOption.translationMemory,
      ...overload
    }
    return serialize(options)
  }
  return {
    getTranslateOption,
    getTranslationMemoryOption
  }
})()