/* global AFRAME */
AFRAME.registerComponent('layer-point', {
  schema: {
    x: {type: 'array'},
    y: {type: 'array'},
    z: {type: 'array'},
    shape: {type: 'array'},
    size: {type: 'array'},
    color: {type: 'array'}
  },
  init: function () {
    this.nextMark = 0
    this.numMarks = 0
    this.markEls = []
    // offset to make default scale 0 - 1
    this.el.setAttribute('position', {x: -0.5, y: -0.5, z: -0.5})
  },
  update: function () {
    this.nextMark = 0
    this.numMarks = this.data.x.length // maybe find shortest length?
  },
  tick: function () {
    let mark
    const dataLen = this.numMarks
    const i = this.nextMark
    // nothing to do
    if (i >= dataLen) { return }
    // remove any extra entities first
    if (this.markEls.length > dataLen) {
      this.el.removeChild(this.markEls[dataLen])
      this.markEls.splice(dataLen, 1)
      return
    }
    // create new entities as needed
    if (this.nextMark >= this.markEls.length) {
      mark = document.createElement('a-entity')
      this.markEls.push(mark)
      this.el.appendChild(mark)
    } else {
      mark = this.markEls[i]
    }
    mark.setAttribute('geometry', this.makeGeometry(i))
    mark.setAttribute('material', this.makeMaterial(i))
    mark.setAttribute('animation', {
      startEvents: ['pointupdated'],
      property: 'position',
      to: [this.data.x[i], this.data.y[i], this.data.z[i]].join(' ')
    })
    if (mark.hasLoaded) {
      mark.emit('pointupdated', undefined, false)
    } else {
      mark.addEventListener(
        'loaded',
        () => mark.emit('pointupdated', undefined, false),
        {once: true}
      )
    }
    this.nextMark++
  },
  makeGeometry: function (i) {
    // get entry for the index, or the default override, or the default
    const shape = this.data.shape[this.data.shape.length === 1 ? 0 : i] || 'sphere'
    const size = this.data.size[this.data.size.length === 1 ? 0 : i] || 0.01
    const geometry = {primitive: shape}
    switch (shape) {
      case 'sphere':
      case 'tetrahedron':
        geometry.radius = size
        break
      case 'box':
        geometry.width = geometry.height = geometry.depth = size * 2
        break
    }
    return geometry
  },
  makeMaterial: function (i) {
    const color = this.data.color[this.data.color.length === 1 ? 0 : i] || '#000'
    return {color: color}
  }
})