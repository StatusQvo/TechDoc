//https://www.figma.com/file/A05IKMZaE1BKbweYGmOxIK/Untitled?type=design&node-id=1-254&mode=design&t=ECrj2HYUUJJSXw4h-0

//on Start
const onStart = function () {
  const $inputElt = document.querySelectorAll('#form-Elt input')

  $inputElt.forEach((Input, index) => {
    let InId = Input.id
    document.querySelector(`#${InId}`).setAttribute('autocomplete', 'off')
  })
}
//
onStart()
//
////Global constant
const modalMapObj = [
  {
    location: 'Apartments1',
    code: 'M1',
    id: 'map360M1',
  },
  {
    location: 'none',
    code: 'Brochure',
    id: 'btn-brochure',
  },
]
/////

class modalMap {
  constructor() {
    this.id = null
    this.class2Hide = 'visuallyhidden'
    this.DOMelt = this._findDOMElt()
  }

  _findDOMElt() {
    const resObj = {}
    resObj.mainMap = document.querySelector('.modal-main')
    resObj.btnBr = resObj.mainMap.querySelector('#btn-brochure')
    resObj.BbigContainer = document.querySelector('.form-info')
    resObj.MbigContainer = document.querySelector('.panarama-view')
    return resObj
  }

  ///event Delegation
  _eventModalMain(event) {
    const { target } = event
    if (
      target.localName === 'button' &&
      target.parentNode.className === 'modal-main'
    ) {
      //if pressed loc
      const $idElt = target?.id
      this._checkIdElt($idElt)
      if ($idElt && this.id) {
        //id exist on map
        event.preventDefault()

        if (this.id === this.DOMelt.btnBr.id) {
          //brochure
          const $modalBrWin = this.DOMelt.BbigContainer
          const isHidden = this._checkIfclassExist($modalBrWin, this.class2Hide)

          this._BrochureShowHide($modalBrWin, isHidden)
        } else {
          //map button
          const $modalMapWin = this.DOMelt.MbigContainer
          const isHidden = this._checkIfclassExist(
            $modalMapWin,
            this.class2Hide
          )
          //1 - if closed then just open, 2 - if opened then check id (other map button open another view)
          this._setPanaramaViewByID($idElt)
          this._changeVisibilityStat($modalMapWin, isHidden)
          //Clear div from Viewer 360
          const $MapViewerContainer =
            $modalMapWin.querySelector('.panarama-img').children

          if ($MapViewerContainer && $MapViewerContainer.length > 1) {
            Array.from($MapViewerContainer).forEach(($elt) => {
              $elt.remove()
            })
          }
        }
      }
    }
  }

  modalMainAction() {
    const $modalMain = this.DOMelt.mainMap
    $modalMain.addEventListener('click', this._eventModalMain.bind(this))
  }

  //Event on the dialog window ////
  brochureAction() {
    const $modalBrWin = this.DOMelt.BbigContainer
    $modalBrWin.addEventListener('click', this._eventBrochure.bind(this))
  }

  panaramaAction() {
    const $modalMapWin = this.DOMelt.MbigContainer
    $modalMapWin.addEventListener('click', this._eventPanaramaView.bind(this))
  }

  ////Modal Windows

  //Brochure
  _eventBrochure(event) {
    const { target } = event
    const $modalBrWin = this.DOMelt.BbigContainer
    const isHidden = this._checkIfclassExist($modalBrWin, this.class2Hide)

    if (!isHidden) {
      //if visible = add event

      if (target.localName === 'button' && target.type === 'submit') {
        event.preventDefault()
        this._BrochureInputForm()
      } else if (target.parentNode.classList.contains('close-modal')) {
        this._BrochureShowHide($modalBrWin, isHidden) //Input need to clear before visability change
      }
    }
  }

  _BrochureInputForm() {
    /// Sent packet with Input data to server
    console.log('[promise] Input data need 2 sent to Server')
    /// ****  /////
  }

  _BrochureShowHide($modalBrWin, isHidden) {
    this._changeVisibilityStat($modalBrWin, isHidden) // when brochure pushed - always changed
    if (isHidden) {
      this._BrochureClearInput($modalBrWin) // clear Input
    }
  }

  _BrochureClearInput($brElt = null) {
    if ($brElt) {
      const allInputs = $brElt.querySelectorAll('input')
      const inputIdArr = []
      for (let i = 0; i < allInputs.length; i++) {
        inputIdArr.push(allInputs[i].id)
      }
      inputIdArr.forEach((val) => {
        let $inputElement = $brElt.querySelector(`#${val}`)
        $inputElement.value = ''
      })
    }
  }

  //PANARAMA//
  _eventPanaramaView(event) {
    const { target } = event
    const $modalMapWin = this.DOMelt.MbigContainer
    const isHidden = this._checkIfclassExist($modalMapWin, this.class2Hide)

    if (!isHidden && target.parentNode.classList.contains('close-modal')) {
      //Clear div from Viewer 360
      const $MapViewerContainer =
        $modalMapWin.querySelector('.panarama-img').children

      if ($MapViewerContainer) {
        //All deleted
        Array.from($MapViewerContainer).forEach(($elt) => {
          $elt.remove()
        })

        //if visible and close button pushed = add event Close-on-Cross-Button
        this._changeVisibilityStat($modalMapWin, isHidden)
      }
    }
  }

  ///Panarama view set by ID
  _setPanaramaViewByID($idElt) {
    if ($idElt) {
      const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/'

      const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('.panarama-img'),
        panorama: 'img/3.png',
      })

      console.log('[viewer]', viewer)
    }
  }

  /////CHECK DATA/////////
  _checkIdElt(idElt) {
    modalMapObj.forEach(({ location, code, id }) => {
      if (id === idElt) {
        this.id = id
      }
    })
  }

  _checkIfclassExist(parentNode = null, className) {
    if (parentNode) {
      return Boolean(parentNode.classList.contains(className))
    } else {
      return parentNode
    }
  }

  _changeVisibilityStat($Modal, isHidden) {
    if (isHidden) {
      $Modal.tabIndex = '0'
      $Modal.ariaHidden = 'false'
    } else {
      $Modal.tabIndex = '-1'
      $Modal.ariaHidden = 'true'
    }
    $Modal.classList.toggle(this.class2Hide)
  }
}

///event Delegation
const modalBtn = new modalMap('M1', 'map360M1')
modalBtn.modalMainAction()
modalBtn.brochureAction()
modalBtn.panaramaAction()
