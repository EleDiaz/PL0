/*jshint esversion: 6 */
/*jshint node:true */
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
        //this.changeExamples();
        this.setUpRunButton();
        this.setUpLoadButton();
        this.setUpSaveButton();
        this.loadListOfCodes();
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
        editor.$blockScrolling = Infinity;
    }

    setUpRunButton() {
        $("#run").click(() => {
            console.log ("Click");
            if (window.localStorage) {
                console.log("Saved in localStorage");
                window.localStorage.setItem(NAME_STORAGE, this.editor.getValue());
            }
            //$("#resultCode").hide();
            $.get("/compile", { file: this.editor.getValue() }, (data, status) => {
                if (typeof (data.result) == 'string') {
                    this.resultCode.setValue(data.result);
                    //$("#resultCode").show();
                }
            }, 'json');
            // TODO: Llevar acabo la peticion al servidor
        });
    }

    setUpSaveButton() {
        $("#save").click(() => {
            var name = $("#inputCodeName").val();
            if (name) {
              $("#formCodeName").removeClass ("has-error");
              var code = this.editor.getValue();
              this.saveCode (name);
            }
            else {
              $("#formCodeName").addClass ("has-error");
              $("#inputCodeName").focus();
            }
        });
    }

    setUpLoadButton() {
        $("#load").click(() => {
            $("#inputfile").trigger ('click');
            $("#inputfile").change ((evt) => {
              var filename = evt.target.files[0];
              if (filename) {
                var reader = new FileReader ();
                reader.onload = (e) => {
                  this.editor.setValue (e.target.result);
                }
                reader.readAsText(filename);
              }
            });
        });
    }

    loadListOfCodes (id) {
        $('#menuSideBar').empty();  // Elimina los elementos

        var firstSelected = false;
        $.get("/getListOfCodes", {}, (data) => {
          data.result[0].forEach ((name) => {
            this.createItemMenu (name);
          });
        });
    }

    createItemMenu (name) {
      var li = $('<li/>', {
        'id': name
      });

      var a = $('<a/>', {
        'id': "a_" + name,
        text: name,
        href: "javascript:void(0);"
      });
      // Evento al hacer click
      a.click(() => {
        this.getCode(name);

        $("#menuSideBar li").each((_, element) =>{
          $(element).removeClass("active");
        });

        $("#" + name).addClass("active");
      });
      li.append (a);

      var icon = $('<span/>', {
        'class': 'pull-right hidden-xs showopacity glyphicon glyphicon-file',
        'style': 'font-size:16px;'
      });
      a.append(icon);

      li.appendTo('#menuSideBar');
    }

    getCode (name) {
        $.get('/getCode', { name: name }, (data) => {
            $("#inputCodeName").val(data.result.name);
            this.editor.setValue(data.result.code);
        }, 'json');
    }

    saveCode(name) {
        let code = this.editor.getValue();
        $.get('/updateCode', { name: name, code: code }, (result) => {
            console.log("Code Saved!");
        }, 'json')
        .done((_) => {
            this.loadListOfCodes();
        });
    }
}
$(document).ready(() => {
    let app = new App();
    if (window.localStorage && localStorage.getItem(NAME_STORAGE)) {
        app.editor.setValue(localStorage.getItem(NAME_STORAGE));
    }
});
