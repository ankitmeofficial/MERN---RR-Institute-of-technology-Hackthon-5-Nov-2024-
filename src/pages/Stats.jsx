import React, { useMemo } from 'react'
import { Chart as ChartJS, BarElement, RadialLinearScale, RadarController, Filler } from 'chart.js'
import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2'

ChartJS.register(BarElement, RadialLinearScale, RadarController, Filler)

const Stats = ({ history }) => {
  const last = history.slice(-8)
  const lastScore = last.at(-1)?.score ?? 0
  const doughnutData = useMemo(() => ({
    labels: ['Score', 'Left'],
    datasets: [{
      data: [lastScore, Math.max(0, 1200 - lastScore)],
      backgroundColor: ['#34d399', '#1f2a44']
    }]
  }), [lastScore])

  const lineData = useMemo(() => ({
    labels: last.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Score',
      data: last.map(h => h.score),
      borderColor: '#4a86e8',
      backgroundColor: 'rgba(74,134,232,0.20)'
    }]
  }), [history])

  const barData = useMemo(() => ({
    labels: last.map(h => `G${h.grade}`),
    datasets: [{
      label: 'Accuracy %',
      data: last.map(h => h.accuracy ?? Math.round((h.score / 1200) * 100)),
      backgroundColor: '#4a86e8'
    }]
  }), [history])

  const radarData = useMemo(() => ({
    labels: ['Speed', 'Consistency', 'Accuracy', 'Endurance', 'Focus'],
    datasets: [{
      label: 'Skill Profile',
      data: [
        Math.min(100, Math.round((lastScore % 1200) / 12)),
        Math.min(100, Math.round((history.slice(-5).reduce((a, b) => a + (b.score > 0 ? 1 : 0), 0) / 5) * 100)),
        Math.min(100, Math.round((last.at(-1)?.accuracy ?? 60))),
        Math.min(100, Math.round((last.length / 8) * 100)),
        Math.min(100, 70)
      ],
      backgroundColor: 'rgba(74,134,232,0.20)',
      borderColor: '#4a86e8'
    }]
  }), [history])

  const baseOptions = { plugins: { legend: { labels: { color: 'var(--color-text)' } } } }

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card card-pad">
          <div className="title">Latest Score</div>
          <Doughnut data={doughnutData} options={baseOptions} />
        </div>
        <div className="card card-pad">
          <div className="title">Progress Over Time</div>
          <Line data={lineData} options={{ ...baseOptions, scales: { x: { ticks: { color: 'var(--color-text)' } }, y: { ticks: { color: 'var(--color-text)' } } } }} />
        </div>
        <div className="card card-pad">
          <div className="title">Accuracy by Grade</div>
          <Bar data={barData} options={{ ...baseOptions, scales: { x: { ticks: { color: 'var(--color-text)' } }, y: { ticks: { color: 'var(--color-text)' } } } }} />
        </div>
        <div className="card card-pad">
          <div className="title">Skill Radar</div>
          <Radar data={radarData} options={{ ...baseOptions, scales: { r: { pointLabels: { color: 'var(--color-text)' }, grid: { color: 'rgba(255,255,255,0.15)' } } } }} />
        </div>
      </div>
    </div>
  )
}

export default Stats


