import React, { useEffect, useMemo, useState, createContext, useContext } from 'react'
import './App.css'
import { Toaster, toast } from 'sonner'
import { Moon, Sun, Trophy, Sparkles, RefreshCcw, Percent, Zap, BarChart3, ShieldQuestion } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import Header from './components/Header.jsx'
import TopicSelect from './pages/TopicSelect.jsx'
import Quiz from './pages/Quiz.jsx'
import Stats from './pages/Stats.jsx'

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

const THEME_KEY = 'eduplay-theme'
const STORAGE_KEY = 'eduplay-history'

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })
const useTheme = () => useContext(ThemeContext)
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])
  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

const range = (n) => Array.from({ length: n }, (_, i) => i)

function generateQuestions(grade) {
  // Basic arithmetic mix by grade, with difficulty scaling in numbers and operations
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
    if (op === '÷') { a = a * b } // ensure divisibility
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






const AppShell = () => {
  const { theme, toggle } = useTheme()
  const [grade, setGrade] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [viewStats, setViewStats] = useState(false)

  const pushHistory = (entry) => {
    setHistory(prev => {
      const next = [...prev, entry]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const reset = () => {
    setGrade(null)
    setViewStats(false)
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Header theme={theme} onToggleTheme={toggle} onReset={reset} onViewStats={() => setViewStats(v => !v)} />
      {!grade && !viewStats && <TopicSelect onSelect={setGrade} />}
      {grade && !viewStats && <Quiz grade={grade} onFinish={() => setGrade(null)} pushHistory={pushHistory} />}
      {viewStats && <Stats history={history} />}
    </>
  )
}

const App = () => (
  <ThemeProvider>
    <AppShell />
  </ThemeProvider>
)

export default App