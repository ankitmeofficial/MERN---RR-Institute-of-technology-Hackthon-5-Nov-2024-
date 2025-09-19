import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Percent, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import HUD from '../components/HUD.jsx'

const range = (n) => Array.from({ length: n }, (_, i) => i)

function generateQuestions(grade) {
  const opsByGrade = {
    1: ['+'],
    2: ['+', '-'],
    3: ['+', '-', '×'],
    4: ['+', '-', '×', '÷'],
    5: ['+', '-', '×', '÷'],
    6: ['+', '-', '×', '÷', '%'],
    7: ['+', '-', '×', '÷', '%'],
    8: ['+', '-', '×', '÷', '%'],
    9: ['+', '-', '×', '÷', '%', '^2'],
    10: ['+', '-', '×', '÷', '%', '^2']
  }
  const ops = opsByGrade[grade] || opsByGrade[10]

  const questions = range(12).map(() => {
    const op = ops[Math.floor(Math.random() * ops.length)]
    const max = Math.min(20 + grade * 8, 120)
    let a = Math.floor(Math.random() * max) + 1
    let b = Math.floor(Math.random() * max) + 1
    if (op === '÷') { a = a * b }
    let text = `${a} ${op} ${b}`
    let answer
    switch (op) {
      case '+': answer = a + b; break
      case '-': answer = a - b; break
      case '×': answer = a * b; break
      case '÷': answer = a / b; break
      case '%': answer = a % b; break
      case '^2': text = `${b}²`; answer = b * b; break
      default: answer = a + b
    }
    const incorrect = new Set()
    while (incorrect.size < 3) {
      const delta = Math.floor(Math.random() * 10) - 5
      const candidate = answer + delta + (delta === 0 ? 2 : 0)
      if (candidate !== answer) incorrect.add(candidate)
    }
    const options = [...incorrect, answer].sort(() => Math.random() - 0.5)
    return { text, answer, options }
  })
  return questions
}

const Quiz = ({ grade, onFinish, pushHistory }) => {
  const [questions] = useState(() => generateQuestions(grade))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [usedFiftyThisQ, setUsedFiftyThisQ] = useState(false)
  const [hiddenIndices, setHiddenIndices] = useState([])
  const [timeLeft, setTimeLeft] = useState(20)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [index])

  useEffect(() => {
    if (timeLeft === 0) handleAnswer(null)
  }, [timeLeft])

  const q = questions[index]
  const total = questions.length

  const handleFifty = () => {
    if (usedFiftyThisQ) return
    const correctIdx = q.options.indexOf(q.answer)
    const wrongs = q.options.map((v, i) => i).filter(i => i !== correctIdx)
    const toHide = wrongs.sort(() => Math.random() - 0.5).slice(0, 2)
    setHiddenIndices(toHide)
    setUsedFiftyThisQ(true)
    toast("50-50 used: potential points reduced by 80% for this question")
  }

  const basePoints = 100
  const timeBonus = Math.round((timeLeft / 20) * 20)
  const streakBonus = streak >= 3 ? 15 : 0

  const handleAnswer = (choice) => {
    const isCorrect = choice === q.answer
    let gained = 0
    if (isCorrect) {
      const raw = basePoints + timeBonus + streakBonus
      gained = usedFiftyThisQ ? Math.round(raw * 0.2) : raw
      setScore(s => s + gained)
      setStreak(s => s + 1)
      toast.success(`Correct! +${gained} pts`)
    } else {
      setStreak(0)
      toast.error('Oops! Wrong answer')
    }
    const next = index + 1
    if (next < total) {
      setIndex(next)
      setHiddenIndices([])
      setUsedFiftyThisQ(false)
      setTimeLeft(20)
    } else {
      const summary = { timestamp: Date.now(), grade, score, total, accuracy: Math.round((score > 0 ? score : 0) / (basePoints * total) * 100) }
      pushHistory(summary)
      setShowReward(true)
      setTimeout(() => onFinish(score), 800)
    }
  }

  return (
    <div className="container">
      <div className="card card-pad">
        <HUD score={score} questionIndex={index} total={total} streak={streak} usedFifty={usedFiftyThisQ} timeLeft={timeLeft} />
        <div className="spacer" />
        <div className="title">Q{index + 1}. {q.text} = ?</div>
        <div className="grid grid-2">
          {q.options.map((opt, i) => (
            <AnimatePresence key={i}>
              {!hiddenIndices.includes(i) && (
                <motion.button
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="option"
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </motion.button>
              )}
            </AnimatePresence>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button disabled={usedFiftyThisQ} className="btn btn-accent" onClick={handleFifty}><Percent size={16} /> 50-50</button>
        </div>
      </div>
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.45)' }}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card card-pad center" style={{ textAlign: 'center' }}>
              <Sparkles size={48} />
              <div className="title">Level Cleared!</div>
              <div className="subtitle">You earned a reward chest</div>
              <button className="btn btn-primary" onClick={() => setShowReward(false)}>Claim</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Quiz


