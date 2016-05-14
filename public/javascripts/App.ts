/// <reference path="../../typings/main.d.ts" />

// Clave con la que se almacena una copia en localStorage
const NAME_STORAGE = "textedit"

declare var jade : any


const buttonsTemplate = `
each example in examples
  .sideBar__item.example= example
`
let template = jade.compile(buttonsTemplate, {})

// Main class
class App {
  editor : AceAjax.Editor
  resultCode : AceAjax.Editor

  constructor() {
    // Initialize editor
    this.editor = ace.edit("editor")
    this.setUpEditor(this.editor)
    this.resultCode = ace.edit("resultCode")
    this.setUpEditor(this.resultCode)
    this.resultCode.setReadOnly(true)
    // TODO: this.setUpJade()
    this.changeExamples()
    this.setUpRunButton()
  }

  setUpJade(examples : [String]) : void {
    $("#fileServerExample").html(template({examples : ["file1", "file2"]}))
  }

  setUpEditor(editor : AceAjax.Editor) : void {
    editor.setTheme("ace/theme/solarized_dark")
    editor.getSession().setMode("ace/mode/haskell")
    editor.setFontSize("20px")
  }

  setUpRunButton() : void {

    $("#run").click(() => {
      if (window.localStorage) {
        console.log("Saved in localStorage")
        window.localStorage.setItem(NAME_STORAGE, this.editor.getValue())
      }
      this.resultCode.setValue("")
      $("#resultCode").hide()

      $.get("/compile"
        , { file: this.editor.getValue() }
        , (data, status) => {
          if (typeof(data.result) == 'string') {
            this.resultCode.setValue(data.result)
            $("#resultCode").show()
          }

        }
        , 'json'
      );
      // TODO: Llevar acabo la peticion al servidor
    })
  }

  setUpSaveButton() : void {
    $("#load").click(() => {
      // TODO: Llevar a cabo la peticion al servidor y guardar
    })

  }

  changeExamples() : void {
    let lastChecked : JQuery;
    $('.example').each((ix, elem) => {
      if ($(elem).hasClass("selected")) {
        lastChecked = $(elem)
      }
      $(elem).click(() => {
        //this.getCSVFile($(elem).html());
        // Avoid errors of none selected
        lastChecked && lastChecked.removeClass("selected")
        $(elem).addClass("selected")
        lastChecked = $(elem)
      })
    })
  }

  getFiles() : void {
    $.get('/getfiles', {}, (data) => {
      console.log("mis datos" + data.files);
      this.setUpJade(data.files) // TODO
    }, 'json')
    .done(() => { // Debemos actualizar los handlers de evento
      this.changeExamples()
    });
  }

  getFileContents(filename : string) : void {
    $.get('/getCsvfile', { csvfile: filename }, (data) => {
       console.log("Recibo: "+ data)
       this.editor.setValue(data.content)
     }, 'json');
  }

  saveFile(filename : string) : void {
    let data = this.editor.getValue()
    $.get('/sendCsvfile', {name: name, content: data}, (data) => {
      console.log("File Saved!")
    }, 'json');
  }

}

$(document).ready(() => {
  let app = new App()

  if (window.localStorage && localStorage.getItem(NAME_STORAGE)) {
    app.editor.setValue(localStorage.getItem(NAME_STORAGE));
  }
})
