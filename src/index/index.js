import './modules/footer/footer.scss'
import 'bootstrap'
import './index.scss'
import editor from './modules/editor/editor'
import header from './modules/header/header'
import panel from './modules/panel/panel'
import modal from './modules/modal/modal'

window.$ = require('jquery')

global.modules = {
  editor,
  header,
  panel,
  modal
}
