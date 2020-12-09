import React from 'react'
import '../css/Die.css'

export default function Die({ face, rolling }) {
  return (
    <div className={`die ${rolling && "shaking"}`}>{face}</div>
  )
}
