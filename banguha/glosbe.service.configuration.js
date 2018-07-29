/**   
 * @description Constantes de configuration du service
 */
glosbe = (function (languages = {
  from: "en",
  dest: "jbo"
}) {
  const config = {
    DATA_FORMAT: "json",
    BASE_URL: "https://glosbe.com/gapi",
    route: {
      TRANSLATE: "translate",
      TRANSLATION_MEMORY: "tm"
    }
  };

  config.templateOption = {

    /** 
     * from - (required) language of phrase to translate, values: ISO 693-3 three letter language code, no default, beware: if language is invalid you'll get server 500 error code in return
     * dest - (required) destination language, values: ISO 693-3 three letter language code, no default
     * phrase - (required) phrase to be translated, values: arbitrary text, no default, case sensitive
     * tm - whether to include examples (make translation memories search), values: 'true' or 'false', default: 'false'
     * format - described elsewhere
     * callback - described elsewhere
     */
    translate: {
      ...languages, // from & dest
      phrase: undefined,
      tm:  undefined,
      format: config.DATA_FORMAT,
      callback: undefined,
      pretty: false
    },
    /** 
     * from - (required) language of phrase to translate, values: ISO 693-3 three letter language code, no default
     * dest - (required) destination language, values: ISO 693-3 three letter language code, no default
     * phrase - (required) phrase to be searched in existing translated sentences, values: arbitrary text, no default
     * page - page of results to be displayed, values: counted from 1, positive number lower than arbitrary limit - you cannot see results above 200 item, default: 1;
     * pageSize - size of the result page, values: positive number lower or equal 30, default: 30
     * format - described elsewhere
     * callback - described elsewhere
     */
    translationMemory: {
      ...languages, // from & dest
      phrase:  undefined,
      page: undefined,
      pageSize: undefined,
      format: config.DATA_FORMAT,
      callback: undefined,
      pretty: false
    }
  }
  return config
})()