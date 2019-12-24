const langConfig = require('./lang')
const langFnMap = require('./langFnMap')
const optionalList = require('./optionalList')
const panel = require('./panel')
const _ = require('lodash')

function mergeLangFn(langConfig, fnMap) {
  for (let lang in langConfig) {
    let _modules = langConfig[lang]
    for (let _moduleName in _modules) {
      let _module = _modules[_moduleName]
      _module.forEach((obj) => {
        let id = obj.id
        let map = fnMap[_moduleName][id]
        obj.fn = map.fn
        obj.items = obj.items.map((item, idx) => {
          return {
            text: item,
            fn: map.items[idx]
          }
        })
      })
    }
  }
  return langConfig
}

function mergeOptionalListPanel (listConfig, panelConfig) {
  let groups = panelConfig.groups
  let result = { title: panelConfig.title, groups: {} }
  let resultGroups = result.groups
  for (let [group, items] of Object.entries(groups)) {
    resultGroups[group] = []
    items.forEach(item => {
      let val = listConfig.filter(listItem => listItem.label === item)[0]
      if (val) {
        resultGroups[group].push(val)
      }
    })
  }
  return result
}

function transform() {
  const lang = '中文'
  let langMap = mergeLangFn(langConfig, langFnMap)
  let panelConfig = mergeOptionalListPanel(optionalList, panel)
  return {
    header: langMap[lang].header,
    panel: panelConfig,
    editor: optionalList
  }
}

module.exports.default = module.exports = transform()
