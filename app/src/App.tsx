import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { ContentProvider, RequireFullContent } from './lib/content'
import { Today } from './pages/Today'
import { Course } from './pages/Course'
import { LessonPage } from './pages/LessonPage'
import { Practice } from './pages/Practice'
import { Placement } from './pages/Placement'
import { PlayPage } from './pages/PlayPage'
import { Openings } from './pages/Openings'
import { Games } from './pages/Games'
import { Library } from './pages/Library'
import { Settings } from './pages/Settings'
import { Progress } from './pages/Progress'
import { PlanPage } from './pages/Plan'
import { Lab } from './pages/Lab'
import { Drill } from './pages/Drill'
import { Roadmap } from './pages/Roadmap'
import { SettingsDrawer } from './components/SettingsDrawer'
import { BRAND } from './brand'

const links: [string, string][] = [['/', 'Today'], ['/course', 'Course'], ['/practice', 'Practice'], ['/plan', 'My plan'], ['/progress', 'Progress'], ['/lab', 'Contrast lab'], ['/openings', 'Openings'], ['/games', 'My games'], ['/play', 'Play'], ['/library', 'Library'], ['/roadmap', 'Roadmap']]

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  return (
    <ContentProvider>
      <header className="top">
        <NavLink to="/" className="brand">{BRAND.name}</NavLink>
        <nav aria-label="Main">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink>)}
        </nav>
        <button type="button" className="settingsbtn" aria-haspopup="dialog" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}>Settings</button>
      </header>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/course" element={<RequireFullContent><Course /></RequireFullContent>} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/practice" element={<RequireFullContent><Practice /></RequireFullContent>} />
        <Route path="/placement" element={<RequireFullContent><Placement /></RequireFullContent>} />
        <Route path="/plan" element={<RequireFullContent><PlanPage /></RequireFullContent>} />
        <Route path="/lab" element={<RequireFullContent><Lab /></RequireFullContent>} />
        <Route path="/progress" element={<RequireFullContent><Progress /></RequireFullContent>} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/openings" element={<Openings />} />
        <Route path="/drill" element={<Drill />} />
        <Route path="/games" element={<RequireFullContent><Games /></RequireFullContent>} />
        <Route path="/library" element={<RequireFullContent><Library /></RequireFullContent>} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<main className="page"><h1>Not found</h1></main>} />
      </Routes>
    </ContentProvider>
  )
}
