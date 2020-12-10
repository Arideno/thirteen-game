export class Node {
  constructor(currentSum, tempSum, time, points, action) {
    this.currentSum = currentSum
    this.tempSum = tempSum
    this.time = time
    this.points = points
    this.action = action
  }

  getChildren() {
    let children = []
        if ((this.currentSum + this.tempSum) % 13 === 0) {
          children.push(new Node(this.currentSum + this.tempSum, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum) / 13), 'add'))
        } else {
          children.push(new Node(this.currentSum + this.tempSum, 0, this.time+1, this.points, 'add'))
        }
        if (this.currentSum >= this.tempSum) {
          if ((this.currentSum - this.tempSum) % 13 === 0) {
            children.push(new Node(this.currentSum - this.tempSum, 0, this.time+1, this.points + parseInt((this.currentSum - this.tempSum) / 13), 'sub'))
          } else {
            children.push(new Node(this.currentSum - this.tempSum, 0, this.time+1, this.points, 'sub'))
          }
        }
        if ((this.currentSum + this.tempSum * 2) % 13 === 0) {
          children.push(new Node(this.currentSum + this.tempSum * 2, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum * 2) / 13), 'mul2'))
        } else {
          children.push(new Node(this.currentSum + this.tempSum * 2, 0, this.time+1, this.points, 'mul2'))
        }
        if ((this.currentSum + this.tempSum * 3) % 13 === 0) {
          children.push(new Node(this.currentSum + this.tempSum * 3, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum * 3) / 13), 'mul3'))
        } else {
          children.push(new Node(this.currentSum + this.tempSum * 3, 0, this.time+1, this.points, 'mul3'))
        }
        if ((this.currentSum + this.tempSum * 4) % 13 === 0) {
          children.push(new Node(this.currentSum + this.tempSum * 4, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum * 4) / 13), 'mul4'))
        } else {
          children.push(new Node(this.currentSum + this.tempSum * 4, 0, this.time+1, this.points, 'mul4'))
        }
        if (this.tempSum % 2 === 0) {
          if ((this.currentSum + this.tempSum / 2) % 13 === 0) {
            children.push(new Node(this.currentSum + this.tempSum / 2, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum / 2) / 13), 'div2'))
          } else {
            children.push(new Node(this.currentSum + this.tempSum / 2, 0, this.time+1, this.points, 'div2'))
          }
        }
        if (this.tempSum % 3 === 0) {
          if ((this.currentSum + this.tempSum / 3) % 13 === 0) {
            children.push(new Node(this.currentSum + this.tempSum / 3, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum / 3) / 13), 'div3'))
          } else {
            children.push(new Node(this.currentSum + this.tempSum / 3, 0, this.time+1, this.points, 'div3'))
          }
        }
        if (this.tempSum % 4 === 0) {
          if ((this.currentSum + this.tempSum / 4) % 13 === 0) {
            children.push(new Node(this.currentSum + this.tempSum / 4, 0, this.time+1, this.points + parseInt((this.currentSum + this.tempSum / 4) / 13), 'div4'))
          } else {
            children.push(new Node(this.currentSum + this.tempSum / 4, 0, this.time+1, this.points, 'div4'))
          }
        }
    return children
  }
}

export function expectimax(node, isMaxNode) {
  if (node.time > 5) {
    return node.points
  }
  const children = node.getChildren()
  if (isMaxNode) {
    let bestValue = -1
    for (let i = 0; i < children.length; i++) {
      const temp = expectimax(children[i], false)
      if (bestValue < temp) {
        bestValue = temp
      }
    }
    return bestValue
  } else {
    let sum = 0
    let used = []
    for (let i = 1; i <= 6; i++) {
      for (let j = 2; j <= 7; j++) {
        if (used.some(el => el[0] === j && el[1] === i)) {
          continue
        }
        used.push([i, j])
        let chance = 0
        if (i === j) {
          chance = 1/18
        } else if (i === 1 || j === 7) {
          chance = 1/36
        } else {
          chance = 1/18
        }
        sum += chance * expectimax(new Node(node.currentSum, i + j, node.time + 1, node.points, ''), true)
      }
    }
    return sum
  }
}