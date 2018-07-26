var fs = require("fs");

const translationTemplate = {
    jbo: "",
    eng: ""
};

function handleTranslationPush(translation) {
    const previousIsTranslated =
        translation && translation.jbo && translation.eng;
    if (previousIsTranslated) {
        extracted.push(translation);
    }
}

function handleNewTranslation(translation) {
    handleTranslationPush(translation);
    currentTranslation = {
        ...translationTemplate
    };
}

const JBO = /^\s*jbo\s*$/;
const ENG = /^\s*en\s*$/;
const LINE_BREAK = "\n";
var extracted = [];
var processing = undefined;
var currentTranslation = undefined;

fs.readFile("./melbi.strings", "utf8", function(err, data) {
    if (err) {
        console.error(err);
    }
    function markLojbanRendering() {
        processing = "jbo";
    }
    function markEnglishRendering() {
        processing = "eng";
    }

    function parseData(line, index) {
        function handleLojbanProcessingContext() {
            markLojbanRendering();
            if (currentTranslation.jbo) {
                handleNewTranslation(currentTranslation);
            }
        }

        function handleEnglishProcessingContext() {
            markEnglishRendering();
            if (currentTranslation.eng) {
                handleNewTranslation(currentTranslation);
            }
        }
        function addCurrentSegment() {
            currentTranslation[processing] += line;
        }

        if (line.match(JBO)) {
            handleLojbanProcessingContext();
        } else if (line.match(ENG)) {
            handleEnglishProcessingContext();
        } else {
            addCurrentSegment();
        }
    }

    handleNewTranslation();
    data.split(LINE_BREAK).forEach(parseData);
    console.log(JSON.stringify(extracted, null, 2));
});
