let $modal = $('#module-modal')
let $modalTitle = $modal.find('#modal-title')
let $modalBody = $modal.find('#modal-body')
let $modalCertain = $modal.find('#modal-certain')
let $modalCancel = $modal.find('#modal-cancel')

let _newFile = {
  inited: false,
  certain () {
    return this.$input.val()
  },
  cancel () {
    return false
  },
  init () {
    this.changeTitle()
    let $container = $(`
      <div class="input-group">
        <span class="input-group-btn">
          <label class="btn btn-default" type="button">
            请输入文件名：
          </label>
        </span>
      </div>
    `)
    let $input = $('<input type="text" class="form-control">')
    $modalBody.append($container.append($input))
    this.$input = $input
    this.inited = true
  },
  changeTitle () {
    $modalTitle.text('新建文件')
  }
}

export default {
  curmodal: null,
  _cancelCb: null,
  _certainCb: null,
  modals: {
    'newFile': _newFile
  },
  cancel (cb) {
    if (this._cancelCb !== null) $modalCancel.off('click', this._cancelCb)
    this._cancelCb = () => {
      cb(this.curmodal.cancel())
      this.close()
    }
    $modalCancel.on('click', this._cancelCb)
  },
  certain (cb) {
    if (this._certainCb !== null) $modalCertain.off('click', this._certainCb)
    this._certainCb = () => {
      cb(this.curmodal.certain())
      this.close()
    }
    $modalCertain.on('click', this._certainCb)
  },
  open (obj) {
    let { name, cancel, certain } = obj
    let modal = this.modals[name]
    if (!modal) return
    this.curmodal = modal
    if (!modal.inited) this.init()
    else modal.changeTitle()
    if (certain) this.certain(certain)
    if (cancel) this.cancel(cancel)
    this.show()
  },
  close () {
    $modal.modal('hide')
  },
  show () {
    $modal.modal('show')
  },
  init () {
    this.curmodal.init()
  }
}
