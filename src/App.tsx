import { useEffect } from 'react'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { DevPanel } from './components/DevPanel'
import { startMockWs } from './ws/mockWs'

export default function App() {
  useEffect(() => startMockWs(), [])

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0">
        <Board />
      </div>
      <DevPanel />
    </div>
  )
}
