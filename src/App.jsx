import { useState, useEffect } from 'react'

export default function App() {
  const [balance, setBalance] = useState(0)
  const [timeLeft, setTimeLeft] = useState(86400)
  const reward = 1

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  function claimMining() {
    if (timeLeft === 0) {
      setBalance(balance + reward)
      setTimeLeft(86400)
      alert("You earned 1 ALF")
    } else {
      alert("Mining not ready yet")
    }
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <div className="container">
      <h1>🚀 ALF Mining App</h1>
      <div className="card">
        <h2>Wallet Balance</h2>
        <p>{balance} ALF</p>
      </div>
      <div className="card">
        <h2>Mining Reward</h2>
        <p>{reward} ALF every 24h</p>
        <p>Next claim in: {formatTime(timeLeft)}</p>
        <button onClick={claimMining}>⛏ Claim Mining Reward</button>
      </div>
    </div>
  )
}
