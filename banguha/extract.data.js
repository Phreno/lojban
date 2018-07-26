var fs = require("fs");
var program = require("commander");

program
    .option("-s, --source [string]", "language source [eng]", "en")
    .option("-t, --target [string]", "language cible [jbo]", "jbo")
    .option(
        "-e, --encoding [string]",
        "encodage du fichier en entrée [utf8]",
        "utf8"
    )
    .option("-i, --input [string]", "fichier en entrée")
    .option("-o, --output [string]", "fichier en sortie [stdout]", false)
    .option("-f, --format [string]", "format de l'extraction en sortie [json] (sinon dsv)", "json")
    .option("-s, --separator [string]", "si option dsv, indique le séparateur à utiliser [;]", ";")
    .parse(process.argv);

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
const SINGLE_QUOTES = /&#039;/g;
const SINGLE_QUOTE = "'";
const LINE_BREAK = "\n";
var extracted = [];
var processing = undefined;
var currentTranslation = undefined;

fs.readFile(program.input, program.encoding, function(err, data) {
    if (err) {
        console.error(err);
    }
    function markLojbanRendering() {
        processing = "jbo";
    }
    function markEnglishRendering() {
        processing = "eng";
    }

    function parseData(line, index, arr) {
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
            const guessEnglishIndex = index + 1;
            const isAuthorName =
                arr && arr[guessEnglishIndex]
                    ? arr[guessEnglishIndex].match(ENG)
                    : false;
            if (isAuthorName) {
                currentTranslation.author = line;
            } else {
                currentTranslation[processing] += line.replace(
                    SINGLE_QUOTES,
                    SINGLE_QUOTE
                );
            }
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

    data = "json" === program.format
        ? JSON.stringify(extracted, null, 2)
        : extracted.map(data => `${data.eng}${program.separator}${data.jbo}`).join('\n');
    if (program.output) {
        fs.writeFile(
            program.output,
            data,
            err => (err ? console.error(err) : undefined)
        );
    } else {
        console.log(data);
    }
});
