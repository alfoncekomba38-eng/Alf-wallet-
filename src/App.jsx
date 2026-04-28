import { useState, useEffect } from 'react'

export default function App() {
  const [balance, setBalance] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  const userId = "user123" // replace with Firebase auth user

  useEffect(() => {
    fetch(`http://localhost:3000/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance)
        setTimeLeft(data.remainingTime)
      })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  async function claimMining() {
    const res = await fetch("http://localhost:3000/mine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    const data = await res.json()

    alert(data.message)

    if (data.success) {
      setBalance(data.balance)
      setTimeLeft(86400)
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
        <p>1 ALF every 24h</p>
        <p>Next claim in: {formatTime(timeLeft)}</p>
        <button onClick={claimMining}>⛏ Claim Mining Reward</button>
      </div>
    </div>
  )
}
