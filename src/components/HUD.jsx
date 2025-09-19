import React from 'react'
import { Trophy, Zap, Percent, Sparkles } from 'lucide-react'

const HUD = ({ score, questionIndex, total, streak, usedFifty, timeLeft }) => {
  const progress = Math.round(((questionIndex) / total) * 100)
  return (
    <div className="hud">
      <div className="pill"><Trophy size={16} /> Score: {score}</div>
      <div className="pill"><Zap size={16} /> Streak: {streak}</div>
      <div className="pill"><Percent size={16} /> 50-50: {usedFifty ? 'used' : 'ready'}</div>
      <div className="pill"><Sparkles size={16} /> Time: {timeLeft}s</div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  )
}

export default HUD


