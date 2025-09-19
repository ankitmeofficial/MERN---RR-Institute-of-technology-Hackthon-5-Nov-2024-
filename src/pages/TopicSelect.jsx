import React from 'react'
import { motion } from 'framer-motion'

const range = (n) => Array.from({ length: n }, (_, i) => i)

const TopicSelect = ({ onSelect }) => {
  return (
    <div className="container">
      <div className="card card-pad">
        <div className="title">Choose your grade</div>
        <div className="subtitle">Pick 1-10 to tailor questions to your level.</div>
        <div className="grid grid-4">
          {range(10).map(i => (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              key={i}
              onClick={() => onSelect(i + 1)}
              className="option"
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>Grade {i + 1}</div>
                <div className="badge">Math</div>
              </div>
              <div className="subtitle" style={{ marginTop: 6 }}>Adaptive arithmetic and logic</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopicSelect


