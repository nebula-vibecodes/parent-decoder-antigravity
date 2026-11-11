import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router'
import { AppShell } from './components/AppShell'
import { categories } from './data'
import HomePage from './pages/HomePage'
import DecoderPage from './pages/DecoderPage'
import BrowsePage from './pages/BrowsePage'
import TermPage from './pages/TermPage'
import StartersPage from './pages/StartersPage'
import SavedPage from './pages/SavedPage'
import SuggestPage from './pages/SuggestPage'
import FeedbackPage from './pages/FeedbackPage'
import EditorialPage from './pages/EditorialPage'
import CopilotPage from './pages/CopilotPage'
import { AboutPage, PolicyPage, PrivacyPage, ReviewStatusPage } from './pages/InfoPages'
import { Link } from 'react-router'

const CATEGORY_BY_SLUG = new Map(
  categories.slice(1).map((category) => [
    category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    category,
  ]),
)

function LibraryRedirect() {
  const { category } = useParams()
  const [params] = useSearchParams()
  const next = new URLSearchParams(params)
  const resolved = category ? CATEGORY_BY_SLUG.get(category.toLowerCase()) : undefined
  if (resolved) next.set('category', resolved)
  else next.delete('category')
  const query = next.toString()
  return <Navigate to={`/browse${query ? `?${query}` : ''}`} replace />
}

function TermsRedirect() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  if (!slug) return <Navigate to="/browse" replace />
  const query = params.toString()
  return <Navigate to={`/term/${slug}${query ? `?${query}` : ''}`} replace />
}

function ApproachRedirect() {
  const [params] = useSearchParams()
  const query = params.toString()
  return <Navigate to={`/privacy${query ? `?${query}` : ''}`} replace />
}

function NotFound() {
  return <div className="not-found"><p className="eyebrow">404 · Nothing here</p><h1>This page seems to have moved on.</h1><p>No harm done. The word you were looking up is probably a search or two away.</p><div><Link className="button" to="/">Back to search</Link><Link className="button button-outline" to="/browse">Browse all terms</Link></div></div>
}

export default function App() {
  return <Routes><Route element={<AppShell />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/decoder" element={<DecoderPage />} />
    <Route path="/browse" element={<BrowsePage />} />
    <Route path="/library" element={<LibraryRedirect />} />
    <Route path="/library/:category" element={<LibraryRedirect />} />
    <Route path="/term/:slug" element={<TermPage />} />
    <Route path="/terms/:slug" element={<TermsRedirect />} />
    <Route path="/conversation-starters" element={<StartersPage />} />
    <Route path="/saved" element={<SavedPage />} />
    <Route path="/copilot" element={<CopilotPage />} />
    <Route path="/suggest" element={<SuggestPage />} />
    <Route path="/feedback" element={<FeedbackPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/approach" element={<ApproachRedirect />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/editorial-policy" element={<PolicyPage />} />
    <Route path="/editorial-review" element={<ReviewStatusPage />} />
    <Route path="/editorial" element={<EditorialPage />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>
}
