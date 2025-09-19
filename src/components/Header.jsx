import React from 'react'
import { Moon, Sun, BarChart3, RefreshCcw, ShieldQuestion } from 'lucide-react'

const Header = ({ theme, onToggleTheme, onReset, onViewStats }) => (
  <div className="header container">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <ShieldQuestion className="logo" />
      <div>
        <div className="title" style={{ margin: 0 }}>SkillUp EduPlay</div>
        <div className="subtitle">Level up your math with gamified challenges</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <button className="btn btn-ghost" onClick={onViewStats}><BarChart3 size={16} /> Stats</button>
      <button className="btn btn-ghost" onClick={onReset}><RefreshCcw size={16} /> Reset</button>
    </div>
  </div>
)

export default Header


