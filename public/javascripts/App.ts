/// <reference path="../../typings/main.d.ts" />

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
    this.changeExamples()
    this.setUpRunButton()
    //document.onclick = (ev) => { this.changeExamples() }
  }

  setUpEditor(editor : AceAjax.Editor) : void {
    editor.setTheme("ace/theme/solarized_dark")
    editor.getSession().setMode("ace/mode/haskell")
    editor.setFontSize("30px")
  }

  setUpRunButton() : void {
    $("#run").click(() => {
      // TODO: Llevar acabo la peticion al servidor
      $("#resultCode").show(1000)
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
        lastChecked.removeClass("selected")
        $(elem).addClass("selected")
        lastChecked = $(elem)
      })
    })
  }
}

new App()
