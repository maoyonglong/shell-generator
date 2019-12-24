import './panel.scss'
import _ from 'lodash'

let $accordion = $('#accordion')
let $searchInput = $('#module-panel input')
let $searchList = $searchInput.siblings('.search-result-list')

let isHideSearchList = true

function inputHandler (e) {
  $searchList.html('')
  let comms = global.modules.editor.optionalList
  let value = $(e.target).val()
  let re = new RegExp(value)
  let isAppended = false
  comms.forEach(comm => {
    if (re.test(comm.label)) {
      isAppended = true
      $searchList.append(`<li><a>${comm.label}<a></li>`)
    }
  })
  if (!isAppended) $searchList.html('<li><a>nothing...<a></li>')
}

$searchInput.on('focus', () => {
  $searchList.show()
})

$searchInput.on('blur', () => {
  if (isHideSearchList) $searchList.hide()
})

$searchInput.on('input', _.throttle(inputHandler, 100))

$searchList.on('click', (e) => {
  let $target = $(e.target)
  if ($target.prop('tagName') === 'A') {
    let text = $target.text()
    if (text !== 'nothing...') global.modules.editor.insertLine(text)
  }
})

$searchList.on('mouseover', (e) => {
  isHideSearchList = false
})

$searchList.on('mouseout', (e) => {
  isHideSearchList = true
})

function getHeight () {
  return $(window).height() -
  $('#module-header').outerHeight(true) -
  $('#module-footer').outerHeight(true) -
  $('#module-panel .title').outerHeight(true) -
  $('#module-panel .input-wrap').outerHeight(true) +
  'px'
}

function setHeight () {
  let height = getHeight()
  $accordion.css({
    height
  })
  $searchList.css({
    height
  })
}

setHeight()

$(window).on('resize', setHeight)

$accordion.on('click', function (e) {
  let $target = $(e.target)
  let $el = null
  if ($target.hasClass('comm')) $el = $target
  else if ($target.hasClass('list-item-group')) $el = $target.children('.comm')
  if ($el !== null) {
    global.modules.editor.insertLine($el.text() + '\r\n')
  }
})

$("[data-toggle='popover']").popover({
  trigger: 'hover',
  placement: 'left'
})

export default {

}
