/// <reference path="../../typings/main.d.ts" />
// Clave con la que se almacena una copia en localStorage
const NAME_STORAGE = "textedit";
const buttonsTemplate = `
each example in examples
  .sideBar__item.example= example
`;
let template = jade.compile(buttonsTemplate, {});
// Main class
class App {
    constructor() {
        // Initialize editor
        this.editor = ace.edit("editor");
        this.setUpEditor(this.editor);
        this.resultCode = ace.edit("resultCode");
        this.setUpEditor(this.resultCode);
        this.resultCode.setReadOnly(true);
        this.resultCode.setValue("// Escriba un código y ejecute el compilador.");
        this.editor.resize();
        this.resultCode.resize();
        // TODO: this.setUpJade()
        this.changeExamples();
        this.setUpRunButton();
    }
    setUpJade(examples) {
        $("#fileServerExample").html(template({ examples: ["file1", "file2"] }));
    }
    setUpEditor(editor) {
        editor.setTheme("ace/theme/eclipse");
        //editor.setTheme("ace/theme/merbivore");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setFontSize("12px");
        editor.setShowPrintMargin(false);
        editor.setDisplayIndentGuides(true);
        editor.setHighlightActiveLine(true);
        editor.$blockScrolling = Infinity
    }
    setUpRunButton() {
        $("#run").click(() => {
            if (window.localStorage) {
                console.log("Saved in localStorage");
                window.localStorage.setItem(NAME_STORAGE, this.editor.getValue());
            }
            //$("#resultCode").hide();
            $.get("/compile", { file: this.editor.getValue() }, (data, status) => {
                if (typeof (data.result) == 'string') {
                    this.resultCode.setValue(data.result);
                    $("#resultCode").show();
                }
            }, 'json');
            // TODO: Llevar acabo la peticion al servidor
        });
    }
    setUpSaveButton() {
        $("#load").click(() => {
            // TODO: Llevar a cabo la peticion al servidor y guardar
        });
    }
    changeExamples() {
        let lastChecked;
        $('.example').each((ix, elem) => {
            if ($(elem).hasClass("selected")) {
                lastChecked = $(elem);
            }
            $(elem).click(() => {
                //this.getCSVFile($(elem).html());
                // Avoid errors of none selected
                lastChecked && lastChecked.removeClass("selected");
                $(elem).addClass("selected");
                lastChecked = $(elem);
            });
        });
    }
    getFiles() {
        $.get('/getfiles', {}, (data) => {
            console.log("mis datos" + data.files);
            this.setUpJade(data.files); // TODO
        }, 'json')
            .done(() => {
            this.changeExamples();
        });
    }
    getFileContents(filename) {
        $.get('/getCsvfile', { csvfile: filename }, (data) => {
            console.log("Recibo: " + data);
            this.editor.setValue(data.content);
        }, 'json');
    }
    saveFile(filename) {
        let data = this.editor.getValue();
        $.get('/sendCsvfile', { name: name, content: data }, (data) => {
            console.log("File Saved!");
        }, 'json');
    }
}
$(document).ready(() => {
    let app = new App();
    if (window.localStorage && localStorage.getItem(NAME_STORAGE)) {
        app.editor.setValue(localStorage.getItem(NAME_STORAGE));
    }
});
