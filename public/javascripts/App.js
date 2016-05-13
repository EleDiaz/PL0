/// <reference path="../../typings/main.d.ts" />
class App {
    constructor() {
        // Initialize editor
        this.editor = ace.edit("editor");
        this.setUpEditor(this.editor);
        this.resultCode = ace.edit("resultCode");
        this.setUpEditor(this.resultCode);
        this.resultCode.setReadOnly(true);
        this.changeExamples();
        this.setUpRunButton();
        //document.onclick = (ev) => { this.changeExamples() }
    }
    setUpEditor(editor) {
        editor.setTheme("ace/theme/solarized_dark");
        editor.getSession().setMode("ace/mode/haskell");
        editor.setFontSize("30px");
    }
    setUpRunButton() {
        $("#run").click(() => {
            // TODO: Llevar acabo la peticion al servidor
            $("#resultCode").show(1000);
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
                lastChecked.removeClass("selected");
                $(elem).addClass("selected");
                lastChecked = $(elem);
            });
        });
    }
}
new App();
