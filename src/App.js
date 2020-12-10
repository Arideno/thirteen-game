import {RollDice} from './components/RollDice'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import './css/App.css'
import { expectimax, Node } from './utils'

function App() {
  const [playerTempSum, setPlayerTempSum] = useState(0)
  const [computerTempSum, setComputerTempSum] = useState(0)
  const [playerCurrentSum, setPlayerCurrentSum] = useState(0)
  const [computerCurrentSum, setComputerCurrentSum] = useState(0)
  const [playerPoints, setPlayerPoints] = useState(0)
  const [computerPoints, setComputerPoints] = useState(0)
  const [turnPlayer, setTurnPlayer] = useState(true)
  const [playerCanAction, setPlayerCanAction] = useState(false)
  const [canDiv2, setCanDiv2] = useState(false)
  const [canDiv3, setCanDiv3] = useState(false)
  const [canDiv4, setCanDiv4] = useState(false)
  const [canSub, setCanSub] = useState(false)
  const [playerTimes, setPlayerTimes] = useState(0)
  const [computerTimes, setComputerTimes] = useState(0)
  const [computerCanMove, setComputerCanMove] = useState(false)
  const computerDice = useRef(null)
  const interval = useRef()

  const handleAdd = () => {
    setPlayerCurrentSum(playerCurrentSum + playerTempSum)
    setPlayerTempSum(0)
  }

  const handleSub = () => {
    setPlayerCurrentSum(playerCurrentSum - playerTempSum)
    setPlayerTempSum(0)
  }

  const handleMul2 = () => {
    setPlayerCurrentSum(playerCurrentSum + playerTempSum * 2)
    setPlayerTempSum(0)
  }

  const handleMul3 = () => {
    setPlayerCurrentSum(playerCurrentSum + playerTempSum * 3)
    setPlayerTempSum(0)
  }

  const handleMul4 = () => {
    setPlayerCurrentSum(playerCurrentSum + playerTempSum * 4)
    setPlayerTempSum(0)
  }

  const handleDiv2 = () => {
    setPlayerCurrentSum(playerCurrentSum + parseInt(playerTempSum / 2))
    setPlayerTempSum(0)
  }

  const handleDiv3 = () => {
    setPlayerCurrentSum(playerCurrentSum + parseInt(playerTempSum / 3))
    setPlayerTempSum(0)
  }

  const handleDiv4 = () => {
    setPlayerCurrentSum(playerCurrentSum + parseInt(playerTempSum / 4))
    setPlayerTempSum(0)
  }

  useEffect(() => {
    setPlayerCanAction(false)
    if (playerCurrentSum % 13 === 0) {
      setPlayerPoints(playerPoints + parseInt(playerCurrentSum / 13))
    }
    setPlayerTimes(playerTimes + 1)
  }, [playerCurrentSum])

  useEffect(() => {
    if (playerTimes > 5) {
      setTurnPlayer(false)
      setPlayerTimes(1)
      makeComputerRoll()
    }
  }, [playerTimes])

  useEffect(() => {
    if (computerTimes > 5) {
      setTurnPlayer(true)
      setComputerTimes(1)
    }
  }, [computerTimes])

  useEffect(() => {
    if (computerCurrentSum % 13 === 0) {
      setComputerPoints(computerPoints + parseInt(computerCurrentSum / 13))
    }
    setComputerTimes(computerTimes + 1)
  }, [computerCurrentSum])

  useEffect(() => {
    if (!turnPlayer) {
      computerMoves()
    } else {
      clearInterval(interval.current)
    }
  }, [turnPlayer])

  useEffect(() => {
    const node = computerMakeDecision(computerCurrentSum, computerTempSum, computerTimes + 1, computerPoints)
    console.log(node)
    if (node.action === 'add') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum)
    } else if (node.action === 'sub') {
      setComputerCurrentSum(computerCurrentSum - computerTempSum)
    } else if (node.action === 'mul2') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum * 2)
    } else if (node.action === 'mul3') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum * 3)
    } else if (node.action === 'mul4') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum * 4)
    } else if (node.action === 'div2') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum / 2)
    } else if (node.action === 'div3') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum / 3)
    } else if (node.action === 'div4') {
      setComputerCurrentSum(computerCurrentSum + computerTempSum / 4)
    }
  }, [computerTempSum])

  const computerMoves = () => {
    interval.current = setInterval(() => {
      makeComputerRoll()
    }, 3000)
  }

  const makeComputerRoll = () => {
    computerDice.current.roll()
  }

  const computerMakeDecision = (sum, temp, times, points) => {
    const node = new Node(sum, temp, times, points, '')
    const children = node.getChildren()
    let bestValue = -1
    let bestNode = null
    for (let i = 0; i < children.length; i++) {
      const temp = expectimax(children[i], false)
      if (bestValue < temp) {
        bestValue = temp
        bestNode = children[i]
      }
    }
    return bestNode
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6 d-flex justify-content-start">
          <div>
            <h2>Player ({playerTimes}/5)</h2>
            <h3>Current sum: {playerCurrentSum}</h3>
            <h4>Points: {playerPoints}</h4>
            <RollDice sides={[[1,2,3,4,5,6], [2,3,4,5,6,7]]} onRoll={(sum) => {
              setPlayerTempSum(sum)
              setPlayerCanAction(true)
              if (sum % 2 === 0) {
                setCanDiv2(true)
              } else {
                setCanDiv2(false)
              }

              if (sum % 3 === 0) {
                setCanDiv3(true)
              } else {
                setCanDiv3(false)
              }

              if (sum % 4 === 0) {
                setCanDiv4(true)
              } else {
                setCanDiv4(false)
              }

              if (playerCurrentSum >= sum) {
                setCanSub(true)
              } else {
                setCanSub(false)
              }
            }} setPlayerCanAction={setPlayerCanAction} disabled={!turnPlayer || playerCanAction} />
            <div className="actions mt-3">
              <button disabled={!turnPlayer || !playerCanAction} onClick={handleAdd}>Add</button>
              <button disabled={!turnPlayer || !playerCanAction || !canSub} onClick={handleSub}>Sub</button>
              <button disabled={!turnPlayer || !playerCanAction} onClick={handleMul2}>Mul 2</button>
              <button disabled={!turnPlayer || !playerCanAction} onClick={handleMul3}>Mul 3</button>
              <button disabled={!turnPlayer || !playerCanAction} onClick={handleMul4}>Mul 4</button>
              <button disabled={!turnPlayer || !playerCanAction || !canDiv2} onClick={handleDiv2}>Div 2</button>
              <button disabled={!turnPlayer || !playerCanAction || !canDiv3} onClick={handleDiv3}>Div 3</button>
              <button disabled={!turnPlayer || !playerCanAction || !canDiv4} onClick={handleDiv4}>Div 4</button>
            </div>
          </div>
        </div>
        <div className="col-6 d-flex justify-content-end">
          <div>
            <h2>Computer ({computerTimes}/5)</h2>
            <h3>Current sum: {computerCurrentSum}</h3>
            <h4>Points: {computerPoints}</h4>
            <RollDice ref={computerDice} sides={[[1,2,3,4,5,6], [2,3,4,5,6,7]]} onRoll={(sum) => {
              setComputerTempSum(sum)
            }} disabled />
            <div className="actions mt-3">
              <button disabled>Add</button>
              <button disabled>Sub</button>
              <button disabled>Mul 2</button>
              <button disabled>Mul 3</button>
              <button disabled>Mul 4</button>
              <button disabled>Div 2</button>
              <button disabled>Div 3</button>
              <button disabled>Div 4</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
