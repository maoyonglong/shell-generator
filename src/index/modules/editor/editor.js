/* eslint-disable */

import * as monaco from 'monaco-editor'
import optionalList from '../../../config/optionalList'

import "./editor.scss"

// set height
$('#wordspace').css({
  height: $(window).height() - $('#module-header').outerHeight(true) - $('#module-footer').outerHeight(true) + 'px'
})

function createDependencyProposals (range) {
	return optionalList.map(item => {
		item.range = range
		item.kind = monaco.languages.CompletionItemKind[item.kind]
		return item
	})
}

monaco.languages.registerCompletionItemProvider('shell', {
	provideCompletionItems: function (model, position) {
		var word = model.getWordUntilPosition(position);
		var range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn
		}
		return {
			suggestions: createDependencyProposals(range)
		}
	}
})

let MonacoCodeEditor = monaco.editor.create($('#wordspace')[0], {
	language: 'shell'
})

$(global).on('resize', () => {
  MonacoCodeEditor.layout()
})

export default {
  optionalList,
	insertLine (text) {
    MonacoCodeEditor.executeEdits("", [{
      range: {
          startLineNumber: MonacoCodeEditor.getPosition().lineNumber, 
          startColumn: MonacoCodeEditor.getPosition().column,
          endLineNumber: MonacoCodeEditor.getPosition().lineNumber, 
          endColumn: MonacoCodeEditor.getPosition().column
      },
      text: `${text}`,
      forceMoveMarkers: true
    }])
  },
  setValue (text) {
    MonacoCodeEditor.setValue(text)
  },
  getValue () {
    return MonacoCodeEditor.getValue()
  }
}
