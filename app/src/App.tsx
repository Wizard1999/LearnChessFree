import { NavLink, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './lib/content'
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

const links: [string, string][] = [['/', 'Today'], ['/course', 'Course'], ['/practice', 'Practice'], ['/plan', 'My plan'], ['/progress', 'Progress'], ['/lab', 'Contrast lab'], ['/openings', 'Openings'], ['/games', 'My games'], ['/play', 'Play'], ['/library', 'Library'], ['/roadmap', 'Roadmap'], ['/settings', 'Settings']]

export default function App() {
  return (
    <ContentProvider>
      <header className="top">
        <NavLink to="/" className="brand">Chess School</NavLink>
        <nav aria-label="Main">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink>)}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/course" element={<Course />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/openings" element={<Openings />} />
        <Route path="/drill" element={<Drill />} />
        <Route path="/games" element={<Games />} />
        <Route path="/library" element={<Library />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<main className="page"><h1>Not found</h1></main>} />
      </Routes>
    </ContentProvider>
  )
}
