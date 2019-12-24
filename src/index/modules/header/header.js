import lang from '@/config/lang'
import { saveAs } from 'file-saver'
import path from 'path'
import './header.scss'

let $fileInput = $('#file-input')
let curFileName = ''
$fileInput.on('change', function () {
  let file = $(this)[0].files[0]
  if (!file) return
  curFileName = file.name
  if (path.extname(curFileName) !== '.sh') {
    console.log('只支持sh文件')
    return
  }
  let reader = new FileReader()
  reader.onload = function (e) {
    global.modules.editor.setValue(e.target.result)
  }
  reader.readAsText(file)
})

export default {
  // 导航菜单
  _$menus: [],
  dispatch (menu, e) {
    let fn = $(e.target).data('fn')
    this[fn](menu, e.target)
  },
  newFile () {
    this.closeFile()
    global.modules.modal.open({
      name: 'newFile',
      certain (filename) {
        console.log(filename)
        curFileName = filename
      }
    })
  },
  openFile () {
    $fileInput.click()
  },
  closeFile () {
    curFileName = ''
    global.modules.editor.setValue('')
  },
  saveFile () {
    let value = global.modules.editor.getValue()
    let blob = new Blob([value], {type: 'text/plain;charset=utf-8'})
    if (curFileName === '') {
      global.modules.modal.open({
        name: 'newFile',
        certain (filename) {
          curFileName = filename
          saveAs(blob, curFileName)
        }
      })
    }
    saveAs(blob, curFileName)
  },
  setSnippets () {},
  setEditorTheme () {},
  setOptionalList () {},
  setMenus () {
    let $toggles = $('.nav-pills .dropdown-toggle')
    $toggles.each((toggleIdx, toggle) => {
      let $toggle = $(toggle)
      let obj = { toggle: $toggle }
      let $menu = $toggle.siblings('.dropdown-menu')
      obj.items = $menu.find('a')
      this._$menus.push(obj)
    })
  },
  setLang (menu, target) {
    if (this._$menus.length === 0) this.setMenus()
    let _$menus = this._$menus
    let conf = lang[$(target).text()].header
    conf.forEach((menu, menuIdx) => {
      let _$toggle = _$menus[menuIdx].toggle
      let _$items = _$menus[menuIdx].items
      let items = menu.items
      _$toggle.html(menu.text)
      if (items) {
        _$toggle.append('<span class="caret"></span>')
        items.forEach((item, itemIdx) => {
          _$items.eq(itemIdx).text(item)
        })
      }
    })
  }
}
