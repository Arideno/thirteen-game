import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Die from './Die'
import '../css/RollDice.css'

export const RollDice = forwardRef(({ sides, onRoll, disabled, setPlayerCanAction }, ref) => {
  const [die1, setDie1] = useState(sides[0][0])
  const [die2, setDie2] = useState(sides[0][0])
  const [rolling, setRolling] = useState(false)

  useImperativeHandle(ref, () => ({
      roll: () => {
        if (setPlayerCanAction) {
          setPlayerCanAction(false)
        }
        const d1 = sides[0][Math.floor(Math.random() * sides[0].length)]
        const d2 = sides[1][Math.floor(Math.random() * sides[1].length)]
        setDie1(d1)
        setDie2(d2)
        setRolling(true)
    
        setTimeout(() => {
          setRolling(false)
          onRoll(d1 + d2)
        }, 1000)
      }
    }),
  )

  const roll = () => {
    if (setPlayerCanAction) {
      setPlayerCanAction(false)
    }
    const d1 = sides[0][Math.floor(Math.random() * sides[0].length)]
    const d2 = sides[1][Math.floor(Math.random() * sides[1].length)]
    setDie1(d1)
    setDie2(d2)
    setRolling(true)

    setTimeout(() => {
      setRolling(false)
      onRoll(d1 + d2)
    }, 1000)
  }

  return (
    <div className="rollDice">
      <div className="rollDice-container">
        <Die face={die1} rolling={rolling} />
        <Die face={die2} rolling={rolling} />
      </div>
      <button className="rollButton" onClick={roll} disabled={rolling || disabled}>Roll</button>
    </div>
  )
})
