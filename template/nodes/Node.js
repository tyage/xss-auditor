export default class Node {
  constructor() {
    this.children = []
    this.parent = null
  }
  matchWith() {
    throw new Error('not implemented yet')
  }
  addChild(child) {
    if (child === null) {
      return
    }

    this.children.push(child)
    child.parent = this
  }
  addChildren(children) {
    children.forEach(child => this.addChild(child))
  }
}
