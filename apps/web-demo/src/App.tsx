import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { toast } from 'sonner';

type Direction = 'ltr' | 'rtl';
import {
  EpicAccordion,
  LoadingScreen,
  Prose,
  Section,
  Starscape,
  Terminal,
  WelcomeDialog,
  useClickOutside,
  useContextMenu,
  useDisclosure,
  useEscapeKey,
  useMotion,
  useScrollAware,
  useStepper,
  useTheme,
  useTooltipPlacement,
} from '@starlove/ui-react';
import { Toaster } from '@starlove/ui-react/toaster';
import { ShellDemo } from './ShellDemo';
import { SidebarDemo } from './SidebarDemo';

type DemoView = 'components' | 'shell' | 'sidebar';

const DEMO_VIEWS: { id: DemoView; label: string }[] = [
  { id: 'components', label: 'components' },
  { id: 'shell', label: 'shell' },
  { id: 'sidebar', label: 'sidebar' },
];

function initialView(): DemoView {
  if (typeof window === 'undefined') return 'components';
  const h = window.location.hash.replace('#', '') as DemoView;
  return DEMO_VIEWS.some((v) => v.id === h) ? h : 'components';
}

const PREVIEW_VERSION = 'v3.2';

export function App() {
  const [view, setView] = useState<DemoView>(initialView);

  // Deep-link: ?theme=light|dark forces the theme (handy for sharing/screenshots).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = new URLSearchParams(window.location.search).get('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
  }, []);

  // Keep the URL hash in sync with the selected view.
  useEffect(() => {
    if (typeof window !== 'undefined') window.location.hash = view;
  }, [view]);

  return (
    <>
      <nav className="demo-view-switch" aria-label="Demo view">
        {DEMO_VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className="demo-view-switch-btn"
            data-active={view === v.id ? '' : undefined}
            aria-pressed={view === v.id}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>
      {view === 'components' && <ComponentsGallery />}
      {view === 'shell' && <ShellDemo />}
      {view === 'sidebar' && <SidebarDemo />}
    </>
  );
}

function ComponentsGallery() {
  const theme = useTheme();
  const motion = useMotion();
  const [direction, setDirection] = useState<Direction>('ltr');
  useScrollAware();
  useTooltipPlacement();

  // Flip <html dir> for RTL preview — exercises the logical-property sweep.
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    return () => document.documentElement.removeAttribute('dir');
  }, [direction]);

  return (
    <div className="demo-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Starscape />
      <Topbar
        theme={theme}
        motion={motion}
        direction={direction}
        setDirection={setDirection}
      />
      <main id="main" tabIndex={-1} className="demo-main">
        <ReleaseBanner />
        <Hero />
        <section className="lane-grid">
          <ButtonsLane />
          <ArcLabLane />
          <FormFieldsLane />
          <SlidersLane />
          <CompactInputsLane />
          <TabsLane />
          <SegmentedLane />
          <AlertsLane />
          <AccordionLane />
          <SectionAccordionLane />
          <EpicAccordionLane />
          <EmptyStateLane />
          <EmptyStateLgLane />
          <UniversalCardsLane />
          <MediaCardLane />
          <BezelCardsLane />
          <BadgesAvatarsLane />
          <ProgressLoadersLane />
          <StepperLane />
          <NumberedListLane />
          <StarListLane />
          <DescriptionListLane />
          <OverlaysLane />
          <PopoverLane />
          <ContextMenuLane />
          <ToastsLane />
          <TableLane />
          <PaginationLane />
          <BreadcrumbLane />
          <CodeBlockLane />
          <TerminalLane />
          <ProseLane />
          <ScrollbarLane />
          <TypographyLane />
          {/* Full-width composite "feature band" lanes close out the gallery. */}
          <TimelineLane />
          <StatsLane />
        </section>
      </main>
      <Toaster />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Release banner — the .alert[data-variant="banner"] example, page-top.
// ---------------------------------------------------------------------------

function ReleaseBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div
      className="alert"
      data-tone="info"
      role="status"
      style={{ marginBottom: '1.5rem' }}
    >
      <span className="alert-icon" aria-hidden>★</span>
      <div className="alert-body">
        <strong className="alert-title">{PREVIEW_VERSION} is here.</strong>{' '}
        A full React component layer (typed wrappers for Button, Card, Modal, Table, and ~20 more), the experimental <code>data-variant="arc"</code> button — a Starscape-colored adaptation of the Hermes dashboard's animated-rim technique — and an MIT license.
      </div>
      <button className="alert-close" aria-label="Dismiss" onClick={() => setShow(false)}>×</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topbar — uses the library's .topbar; backgroundless until you scroll.
// ---------------------------------------------------------------------------

// ss-orbit chrome: search, New Card composer, board dropdown, theme toggle,
// and a Settings drawer with a working tabbed pane. Overlays render as siblings
// of the <header> (not inside it) so their fixed positioning stays independent.
const DEMO_BOARDS = [
  { slug: 'orbit-prod', name: 'Orbit · production' },
  { slug: 'nebula-stg', name: 'Nebula · staging' },
  { slug: 'comet-sbx', name: 'Comet · sandbox' },
];
const DEMO_CARDS = [
  { title: 'Build the v3 design system', state: 'epic' },
  { title: 'Add Sonner toast theming', state: 'feature' },
  { title: 'Generalize the lane container', state: 'task' },
  { title: 'Drawer slides past viewport on iOS', state: 'bug' },
  { title: 'Port the ss-orbit chrome', state: 'task' },
];

function Topbar({
  theme, motion, direction, setDirection,
}: {
  theme: ReturnType<typeof useTheme>;
  motion: ReturnType<typeof useMotion>;
  direction: Direction;
  setDirection: (d: Direction) => void;
}) {
  const newCard = useDisclosure();
  const board = useDisclosure();
  const settings = useDisclosure();
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const boardWrapRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState('');
  const [currentBoard, setCurrentBoard] = useState('orbit-prod');
  const [tab, setTab] = useState<'appearance' | 'lanes' | 'notes'>('appearance');

  const noMotion = motion.mode === 'reduce';
  const q = query.trim().toLowerCase();
  const searchOpen = q.length > 0;
  const hits = searchOpen ? DEMO_CARDS.filter(c => c.title.toLowerCase().includes(q)) : [];
  const boardName = DEMO_BOARDS.find(b => b.slug === currentBoard)?.name ?? 'Board';

  useClickOutside(searchWrapRef, () => setQuery(''), { enabled: searchOpen });
  useEscapeKey(() => setQuery(''), { enabled: searchOpen });
  useClickOutside(boardWrapRef, board.close, { enabled: board.isOpen });
  useEscapeKey(board.close, { enabled: board.isOpen });
  useEscapeKey(newCard.close, { enabled: newCard.isOpen });
  useEscapeKey(settings.close, { enabled: settings.isOpen });

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand">
          Starscape <span className="badge" data-tone="accent" style={{ marginInlineStart: 6 }}>{PREVIEW_VERSION}</span>
        </div>

        <div className="controls">
          <span className="topbar-controls-gap" />

          <div className="topbar-search" ref={searchWrapRef}>
            <input
              type="search"
              placeholder="Search cards, comments, decisions…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {searchOpen && (
              <div className="search-results">
                {hits.length ? hits.map(h => (
                  <button
                    type="button"
                    className="search-hit"
                    key={h.title}
                    onClick={() => { setQuery(''); toast(`Open: ${h.title}`); }}
                  >
                    <span className="search-hit-main">
                      <span className="search-hit-title">{h.title}</span>
                    </span>
                    <span className="search-hit-state">{h.state}</span>
                  </button>
                )) : (
                  <div className="search-hit" style={{ color: 'var(--muted)', cursor: 'default' }}>
                    <span className="search-hit-main">
                      <span className="search-hit-title">No matches for “{query}”.</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="topbar-ctl-shrink"
            data-variant="cta"
            onClick={newCard.toggle}
            {...newCard.triggerProps}
          >
            <span aria-hidden style={{ marginInlineEnd: 4 }}>+</span>New Card
          </button>

          <div className="topbar-menu" ref={boardWrapRef}>
            <button
              type="button"
              className="topbar-chip topbar-ctl-shrink"
              onClick={board.toggle}
              {...board.triggerProps}
            >
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="4" y="4" width="6" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="4" width="6" height="16" rx="1.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="topbar-chip-label">{boardName}</span>
              <span aria-hidden>▾</span>
            </button>
            {board.isOpen && (
              <div className="menu-flyout menu-flyout--align-end" role="menu" {...board.surfaceProps}>
                <div className="menu-flyout-head">Board</div>
                <div className="menu-flyout-list">
                  {DEMO_BOARDS.map(b => (
                    <button
                      type="button"
                      key={b.slug}
                      role="menuitem"
                      className={`menu-flyout-item${b.slug === currentBoard ? ' is-current' : ''}`}
                      onClick={() => { setCurrentBoard(b.slug); board.close(); }}
                    >
                      <span className="menu-flyout-item-title">{b.name}</span>
                      <span className="menu-flyout-item-meta">{b.slug}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Motion — 2-way (no-motion | motion), no leading label. */}
          <div className="segmented" role="radiogroup" aria-label="Motion" data-size="sm">
            <button className="segmented-option" role="radio" aria-checked={noMotion}
              onClick={() => motion.setMode('reduce')}>no-motion</button>
            <button className="segmented-option" role="radio" aria-checked={!noMotion}
              onClick={() => motion.setMode('full')}>motion</button>
          </div>

          {/* Direction — ltr | rtl, no leading label. */}
          <div className="segmented" role="radiogroup" aria-label="Writing direction" data-size="sm">
            <button className="segmented-option" role="radio" aria-checked={direction === 'ltr'}
              onClick={() => setDirection('ltr')}>ltr</button>
            <button className="segmented-option" role="radio" aria-checked={direction === 'rtl'}
              onClick={() => setDirection('rtl')}>rtl</button>
          </div>

          <button
            type="button"
            className="topbar-btn topbar-ctl-shrink"
            data-variant="theme"
            aria-label={`Switch to ${theme.resolved === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => theme.setMode(theme.resolved === 'dark' ? 'light' : 'dark')}
          >
            {theme.resolved === 'dark' ? (
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2.2M12 19.8V22M3.5 12H5.7M18.3 12h2.2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5" />
              </svg>
            ) : (
              <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="topbar-btn topbar-ctl-shrink"
            data-variant="ghost"
            onClick={settings.open}
            {...settings.triggerProps}
          >
            <svg className="topbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </button>
        </div>
      </header>

      {/* New Card composer */}
      <div
        className={`create-flyout-backdrop${newCard.isOpen ? ' is-visible' : ''}`}
        onClick={newCard.close}
      />
      <div className={`create-flyout${newCard.isOpen ? ' is-open' : ''}`} {...newCard.surfaceProps}>
        <div className="create-flyout-inner">
          <div className="create-flyout-head">
            <h2>New card</h2>
            <button type="button" className="create-flyout-close" aria-label="Close" onClick={newCard.close}>×</button>
          </div>
          <form
            className="create-flyout-form"
            onSubmit={e => { e.preventDefault(); newCard.close(); toast.success('Card created'); }}
          >
            <input type="text" name="title" placeholder="Title — what is this card?" required />
            <textarea name="description" placeholder="Description (optional)" />
            <div className="create-flyout-grid">
              <label>Lane
                <select className="select-chevron-field" defaultValue="todo">
                  <option value="todo">To do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </label>
              <label>Type
                <select className="select-chevron-field" defaultValue="task">
                  <option value="epic">Epic</option>
                  <option value="feature">Feature</option>
                  <option value="task">Task</option>
                  <option value="bug">Bug</option>
                </select>
              </label>
              <label>Priority
                <select className="select-chevron-field" defaultValue="2">
                  <option value="0">Maybe</option>
                  <option value="1">Low</option>
                  <option value="2">Med</option>
                  <option value="3">High</option>
                </select>
              </label>
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>

      {/* Settings drawer — working tabbed pane */}
      <div
        className={`drawer-backdrop${settings.isOpen ? ' is-visible' : ''}`}
        onClick={settings.close}
      />
      <aside className={`drawer is-settings is-wide${settings.isOpen ? ' is-open' : ''}`} {...settings.surfaceProps}>
        <header className="drawer-header">
          <div className="drawer-title-block">
            <span className="drawer-eyebrow">Settings</span>
            <h2 className="drawer-title">{boardName}</h2>
          </div>
          <button type="button" className="drawer-close" aria-label="Close" onClick={settings.close}>×</button>
          <nav className="drawer-tabs" role="tablist" aria-label="Settings sections">
            {(['appearance', 'lanes', 'notes'] as const).map(t => (
              <button
                type="button"
                key={t}
                role="tab"
                className={`drawer-tab${tab === t ? ' is-active' : ''}`}
                aria-selected={tab === t}
                onClick={() => setTab(t)}
              >{t[0].toUpperCase() + t.slice(1)}</button>
            ))}
          </nav>
        </header>
        <div className="drawer-inner">
          {tab === 'appearance' && (
            <>
              <div className="drawer-section">
                <fieldset className="appearance-theme-field">
                  <legend>Theme</legend>
                  <div className="appearance-theme-options">
                    {(['light', 'dark'] as const).map(mode => (
                      <label className="appearance-theme-option" key={mode}>
                        <input
                          type="radio"
                          name="theme-pref"
                          value={mode}
                          checked={theme.resolved === mode}
                          onChange={() => theme.setMode(mode)}
                        />
                        <span className="appearance-theme-option-mark" aria-hidden>{mode === 'light' ? '☀' : '☾'}</span>
                        <span className="appearance-theme-option-label">{mode === 'light' ? 'Light' : 'Dark'}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="drawer-section board-rename-section">
                <h3>Board Name</h3>
                <p className="description">
                  Rename the board display name only. The canonical URL slug stays <strong>{currentBoard}</strong>,
                  so existing board links keep working.
                </p>
                <form
                  className="field-form"
                  onSubmit={e => { e.preventDefault(); toast.success('Board display name saved'); }}
                >
                  <label>
                    <span>Display name</span>
                    <input name="name" defaultValue={boardName} maxLength={120} required />
                  </label>
                  <button type="submit" data-variant="secondary">Rename Board</button>
                </form>
              </div>

              <div className="drawer-section">
                <h3>Snapshot</h3>
                <p className="description">
                  Export a local board snapshot or import another board without replacing this one.
                </p>
                <div className="deployment-actions">
                  <button type="button" data-variant="secondary" onClick={() => toast('Export started')}>Export</button>
                  <button type="button" data-variant="secondary" onClick={() => toast('Import picker opened')}>Import as New Board</button>
                </div>
              </div>
            </>
          )}
          {tab === 'lanes' && (
            <div className="drawer-section">
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>
                Lane configuration would live here — reorder, rename, WIP limits.
              </p>
            </div>
          )}
          {tab === 'notes' && (
            <div className="drawer-section">
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>
                Project notes &amp; context for <strong>{boardName}</strong>.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  const [welcome, setWelcome] = useState(false);
  return (
    <header className="demo-hero">
      <div className="eyebrow">design system · {PREVIEW_VERSION}</div>
      <h1>
        <span className="text-gradient">A pure-CSS palette</span> for cosmic web apps.
      </h1>
      <p className="lede">
        Starscape {PREVIEW_VERSION} ships tokens, base type, two backgrounds (parchment + animated starfield),
        and a generous component set. No Tailwind, no shadcn — just CSS and a thin React layer
        for theming and Sonner toasts.
      </p>
      <div className="demo-row">
        <button data-variant="cta">Get started</button>
        <button data-variant="ghost" onClick={() => setWelcome(true)}>Read the docs</button>
        <button data-variant="command">$ pnpm add @starlove/ui</button>
      </div>
      <WelcomeDialog
        open={welcome}
        onClose={() => setWelcome(false)}
        logo="/Starscape-Star.png"
        edition="Preview edition"
        title="Welcome to Starscape UI"
        lede="A pure-CSS design system with an optional React layer. This preview shows every component, live, in light and dark."
        notices={[
          { label: 'Heads up', content: 'The ARC button variants are experimental and may still change.' },
          {
            label: 'Install',
            content: (
              <>
                Run <code>pnpm add @starlove/ui</code> — add{' '}
                <code>@starlove/ui-react</code> for the typed components.
              </>
            ),
          },
        ]}
        ctaLabel="Got it"
      />
    </header>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

function ButtonsLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Buttons</h3>
        <span className="badge">5</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="demo-row">
          <button>primary</button>
          <button data-variant="secondary">secondary</button>
          <button data-variant="ghost">ghost</button>
          <button data-variant="translucent">translucent</button>
          <button data-variant="cta">epic CTA</button>
          <button data-variant="command">$ orbit deploy</button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ARC lab — experimental data-variant="arc" rim behaviors, tints, and shapes.
// ---------------------------------------------------------------------------

function ArcLabLane() {
  // <EpicAccordion> owns the collapse + lazy-mount: these rows (the page's
  // heaviest cluster of always-on rim animations) don't mount until expanded.
  const [loading, setLoading] = useState(false);
  const note = { color: 'var(--muted)', fontSize: '0.78rem' } as const;
  return (
    <EpicAccordion title="ARC lab" count={10}>
      <div className="demo-row" style={{ alignItems: 'center' }}>
        <button data-variant="arc">arc</button>
        <button data-variant="cta" data-cta="bstar">bstar</button>
        <button data-variant="arc" data-arc="comet">comet</button>
        <button data-variant="arc" data-arc="trace">trace</button>
        <button data-variant="arc" data-arc="holo">holo</button>
      </div>
      <div className="demo-row" style={{ alignItems: 'center' }}>
        <button data-variant="arc" data-arc="success">success</button>
        <button data-variant="arc" data-arc="danger">danger</button>
        <button data-variant="arc" data-arc="info">info</button>
        <span style={note}>semantic rim tints — danger runs faster</span>
      </div>
      <div className="demo-row" style={{ alignItems: 'center' }}>
        <button data-variant="arc-star" aria-label="Favorite" />
        <button data-variant="arc-hex">deploy</button>
        <button data-variant="arc-shield">confirm</button>
        <span style={note}>clip-path shapes — shimmer fill</span>
      </div>
      <div className="demo-row" style={{ alignItems: 'center' }}>
        <button
          data-variant="arc"
          data-loading={loading ? 'fill' : undefined}
          aria-busy={loading || undefined}
          onClick={() => {
            if (loading) return;
            setLoading(true);
            window.setTimeout(() => {
              setLoading(false);
              toast.success('Saved');
            }, 2000);
          }}
        >{loading ? 'saving…' : 'save'}</button>
        <span style={note}>loading toggles on click</span>
      </div>
    </EpicAccordion>
  );
}

// ---------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------

function FormFieldsLane() {
  const [notify, setNotify] = useState(true);
  const [autosave, setAutosave] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [region, setRegion] = useState('us-east');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Record<string, boolean>>({
    docs: true, tasks: false, notes: false,
  });
  const itemValues = Object.values(items);
  const allChecked = itemValues.every(Boolean);
  const noneChecked = itemValues.every(v => !v);
  const toggleAll = (next: boolean) =>
    setItems(Object.fromEntries(Object.keys(items).map(k => [k, next])));
  const masterRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = !allChecked && !noneChecked;
    }
  }, [allChecked, noneChecked]);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Form fields</h3>
      </header>
      <div className="lane-body lane-stack">
        <div className="form-row">
          <label htmlFor="demo-name">Display name</label>
          <input id="demo-name" placeholder="Bruce Skywalker" defaultValue="Bruce Skywalker" />
          <span className="form-help">Visible to teammates.</span>
        </div>

        <div className="form-row">
          <label htmlFor="demo-search">Search</label>
          <div className="input-search">
            <input
              id="demo-search"
              type="search"
              placeholder="Search spaces, people, files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="input-search-clear"
              aria-label="Clear search"
              onClick={() => setSearch('')}
            >×</button>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="demo-region">Region</label>
          <select id="demo-region" className="select-chevron-field" defaultValue="us-east">
            <option value="us-east">US East (Virginia)</option>
            <option value="us-west">US West (Oregon)</option>
            <option value="eu-west">EU West (Dublin)</option>
            <option value="ap-south">Asia Pacific (Mumbai)</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="demo-bio">Bio</label>
          <textarea id="demo-bio" rows={3} placeholder="Tell us about yourself…" />
          <span className="form-error">Bio cannot exceed 280 characters.</span>
        </div>

        <div className="form-row">
          <span style={{ marginBottom: '0.35rem', color: 'var(--ink)', fontSize: '0.82rem', fontWeight: 600 }}>
            Deploy region (radio)
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { v: 'us-east', l: 'US East · Virginia' },
              { v: 'us-west', l: 'US West · Oregon' },
              { v: 'eu-west', l: 'EU West · Dublin' },
            ].map(o => (
              <label key={o.v} className="radio">
                <input
                  type="radio"
                  name="demo-region-radio"
                  checked={region === o.v}
                  onChange={() => setRegion(o.v)}
                />
                <span className="radio-label">{o.l}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="lane-stack" style={{ gap: '0.5rem' }}>
          <label className="check">
            <input
              type="checkbox"
              checked={analytics}
              onChange={e => setAnalytics(e.target.checked)}
            />
            <span className="check-label">Share anonymous usage data</span>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.6rem 0.7rem', border: '1px solid var(--line)', borderRadius: 12 }}>
            <label className="check">
              <input
                ref={masterRef}
                type="checkbox"
                checked={allChecked}
                onChange={e => toggleAll(e.target.checked)}
              />
              <span className="check-label" style={{ fontWeight: 700 }}>
                Sync all (indeterminate when partial)
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingInlineStart: '1.6rem' }}>
              {(['docs', 'tasks', 'notes'] as const).map(k => (
                <label key={k} className="check">
                  <input
                    type="checkbox"
                    checked={items[k]}
                    onChange={e => setItems({ ...items, [k]: e.target.checked })}
                  />
                  <span className="check-label">Sync {k}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={notify}
              onChange={e => setNotify(e.target.checked)}
            />
            <span className="switch-track" aria-hidden="true" />
            <span className="switch-label">Email me weekly updates</span>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={autosave}
              onChange={e => setAutosave(e.target.checked)}
            />
            <span className="switch-track" aria-hidden="true" />
            <span className="switch-label">Autosave drafts</span>
          </label>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Universal cards
// ---------------------------------------------------------------------------

function UniversalCardsLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Cards · universal</h3>
      </header>
      <div className="lane-body lane-stack">
        <article className="card">
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Onboarding nearly complete</h4>
          <p style={{ marginTop: 8, color: 'var(--muted)', fontSize: '0.85rem' }}>
            Two more steps to publish your first space. We'll guide you through.
          </p>
          <div className="progress" role="progressbar" aria-valuenow={75} style={{ marginTop: 12 }}>
            <div className="progress-bar" style={{ ['--value' as string]: '75%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.78rem', color: 'var(--muted)' }}>
            <span>3 of 4 complete</span>
            <span>about 5 min left</span>
          </div>
        </article>

        <article className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" data-size="lg" data-color="violet">AS</div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Aeva Skywalker</h4>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>aeva@orbit.dev · principal engineer</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            <span className="chip" data-tone="accent">infra</span>
            <span className="chip" data-tone="success">on-call</span>
            <span className="chip">EU/west</span>
          </div>
        </article>

        <article className="card" data-variant="epic" style={{ position: 'relative' }}>
          <span className="chip" data-tone="warning" style={{ position: 'absolute', top: 12, right: 12 }}>
            popular
          </span>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Pro</h4>
          <p style={{ margin: '4px 0 12px', color: 'var(--muted)', fontSize: '0.78rem' }}>
            For growing teams.
          </p>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            $24<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}> / seat / mo</span>
          </div>
          <ul style={{ margin: '12px 0', padding: '0 0 0 1rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
            <li>Unlimited spaces</li>
            <li>Priority support</li>
            <li>Audit log</li>
          </ul>
          <button data-variant="cta" style={{ width: '100%' }}>Start free trial</button>
        </article>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bezel cards (v3 type system)
// ---------------------------------------------------------------------------

function BezelCardsLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Cards · bezel variants</h3>
        <span className="lane-subtitle">data-variant + .type-pill</span>
      </header>
      <div className="lane-body lane-stack">
        <article className="card" data-variant="epic">
          <span className="type-pill" data-variant="epic">epic · OBJ-44</span>
          <h4 style={{ margin: '6px 0 4px', fontSize: '0.95rem' }}>Build the v3 design system</h4>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>Cross-cutting initiative · 6 sub-tasks</p>
        </article>
        <article className="card" data-variant="feature">
          <span className="type-pill" data-variant="feature">feature · F-101</span>
          <h4 style={{ margin: '6px 0 4px', fontSize: '0.95rem' }}>Add Sonner toast theming</h4>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>3 components · 2 days</p>
        </article>
        <article className="card" data-variant="task">
          <span className="type-pill" data-variant="task">task · T-007</span>
          <h4 style={{ margin: '6px 0 4px', fontSize: '0.95rem' }}>Generalize lane container</h4>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>Drop the column-specific cruft</p>
        </article>
        <article className="card" data-variant="bug">
          <span className="type-pill" data-variant="bug">bug · #482</span>
          <h4 style={{ margin: '6px 0 4px', fontSize: '0.95rem' }}>Drawer slides past viewport on iOS</h4>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>Reproducible on iOS 18 · regression</p>
        </article>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Badges & avatars
// ---------------------------------------------------------------------------

function BadgesAvatarsLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Badges, chips, avatars</h3>
      </header>
      <div className="lane-body lane-stack">
        <div className="demo-row">
          <span className="chip">default</span>
          <span className="chip" data-tone="accent">accent</span>
          <span className="chip" data-tone="success">success</span>
          <span className="chip" data-tone="warning">warning</span>
          <span className="chip" data-tone="danger">danger</span>
        </div>
        <div className="demo-row">
          <span className="chip" data-variant="solid">solid</span>
          <span className="chip" data-variant="solid" data-tone="accent">accent</span>
          <span className="chip" data-variant="solid" data-tone="success">success</span>
          <span className="chip" data-variant="solid" data-tone="warning">warning</span>
          <span className="chip" data-variant="solid" data-tone="danger">danger</span>
        </div>
        <div className="demo-row">
          <span className="dot" />
          <span className="dot" data-live />
          <span className="dot" data-live data-tone="success" />
          <span className="dot" data-live data-tone="accent" />
          <span className="dot" data-count>9</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            <code>.dot</code> — presence glow, <code>data-live</code> tone halo
          </span>
        </div>
        <div className="demo-row">
          <span className="badge">3</span>
          <span className="badge">128</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            <code>.badge</code> — numeric count
          </span>
        </div>
        <div className="demo-row">
          <span className="type-pill" data-variant="epic">epic</span>
          <span className="type-pill" data-variant="feature">feature</span>
          <span className="type-pill" data-variant="task">task</span>
          <span className="type-pill" data-variant="bug">bug</span>
          <span className="type-pill" data-variant="done">done</span>
        </div>
        <div className="demo-row">
          <div className="avatar-stack" data-tooltip="Aeva, Bruce, Lyra and 5 more">
            <div className="avatar" data-color="violet">AS</div>
            <div className="avatar" data-color="cyan">BR</div>
            <div className="avatar" data-color="amber">LY</div>
            <div className="avatar">+5</div>
          </div>
          <div className="avatar" data-size="sm" data-color="rose" data-status="online">JM</div>
          <div className="avatar" data-color="cyan" data-status="busy">KZ</div>
          <div className="avatar" data-color="amber" data-status="away">LY</div>
          <div className="avatar" data-size="lg" data-color="accent" data-status="live">BS</div>
          <div className="avatar" data-size="lg" data-color="violet" data-featured>AE</div>
        </div>
        <div className="demo-row">
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            avatars: <code>data-status="online|busy|away"</code> dot · <code>live</code> orbit ring · <code>data-featured</code> iridescent ring
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Progress & loaders
// ---------------------------------------------------------------------------

function ProgressLoadersLane() {
  const [pct, setPct] = useState(38);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Progress & loaders</h3>
      </header>
      <div className="lane-body lane-stack">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>
            <span>Indexing</span>
            <span>{pct}%</span>
          </div>
          <div className="progress" role="progressbar" aria-valuenow={pct}>
            <div className="progress-bar" style={{ ['--value' as string]: `${pct}%` }} />
          </div>
          <div className="demo-row" style={{ marginTop: 8 }}>
            <button data-variant="ghost" onClick={() => setPct(p => Math.max(0, p - 10))}>−10</button>
            <button data-variant="ghost" onClick={() => setPct(p => Math.min(100, p + 10))}>+10</button>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>Indeterminate</div>
          <div className="progress" data-indeterminate role="progressbar" aria-label="Loading" />
        </div>

        <div className="demo-row" style={{ alignItems: 'center' }}>
          <span className="spinner" data-size="sm" aria-label="Loading" />
          <span className="spinner" aria-label="Loading" />
          <span className="spinner" data-size="lg" aria-label="Loading" />
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>3 sizes</span>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8 }}>Skeleton placeholder</div>
          <div className="card" style={{ animation: 'none' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="skeleton skeleton-circle" />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8 }}>Boot splash · &lt;LoadingScreen&gt;</div>
          <SplashPreview />
        </div>
      </div>
    </section>
  );
}

// The full-bleed boot splash (also shown on first load via index.html).
// Replays it fullscreen for a few seconds so it can be inspected in the gallery.
function SplashPreview() {
  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fade = setTimeout(() => setHiding(true), 2200);
    const done = setTimeout(() => {
      setShow(false);
      setHiding(false);
    }, 2600);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, [show]);

  return (
    <>
      <button data-variant="ghost" onClick={() => setShow(true)} disabled={show}>
        Replay boot splash
      </button>
      {show && (
        <LoadingScreen
          label="Loading Starscape UI…"
          logo="/Starscape-Star.png"
          hiding={hiding}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Numbered list (CSS counter pattern)
// ---------------------------------------------------------------------------

function NumberedListLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">List · numbered</h3>
        <span className="lane-subtitle">CSS counter</span>
      </header>
      <div className="lane-body">
        <ol className="list-numbered">
          <li>
            <strong>Install</strong>
            <span>Run <code>pnpm add @starlove/ui</code> at the root of your app.</span>
          </li>
          <li>
            <strong>Import</strong>
            <span>Add <code>import '@starlove/ui'</code> to your entry file.</span>
          </li>
          <li>
            <strong>Theme</strong>
            <span>Default is system-aware. Force with <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>.</span>
          </li>
          <li>
            <strong>Compose</strong>
            <span>Use <code>.lane</code>, <code>.card</code>, <code>.topbar</code> — drop in primitives, no className gymnastics.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Star list (clip-path star marker)
// ---------------------------------------------------------------------------

function StarListLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">List · stars</h3>
        <span className="lane-subtitle">clip-path</span>
      </header>
      <div className="lane-body">
        <ul className="list-stars">
          <li>
            <strong>Pure CSS</strong>
            <span>No Tailwind, no shadcn. Drop into any framework or zero-build site.</span>
          </li>
          <li>
            <strong>Theme-aware tokens</strong>
            <span>One vocabulary, three resolutions: light, dark, system.</span>
          </li>
          <li>
            <strong>Animated starscape</strong>
            <span>SVG-free starfield with a slow opacity twinkle. Reduced-motion safe.</span>
          </li>
          <li>
            <strong>Sonner-ready</strong>
            <span>The React layer wraps Sonner with a theme-tracking <code>{'<Toaster />'}</code>.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Overlays
// ---------------------------------------------------------------------------

function OverlaysLane() {
  const drawer = useDisclosure();
  const modal = useDisclosure();
  const flyout = useDisclosure();
  const flyoutWrapRef = useRef<HTMLDivElement | null>(null);

  // Three hooks replace ~20 lines of manual event wiring. The flyout closes
  // on outside-click and Escape; the modal/drawer close on Escape (their
  // backdrops handle outside-click via onClick).
  useClickOutside(flyoutWrapRef, flyout.close, { enabled: flyout.isOpen });
  useEscapeKey(flyout.close, { enabled: flyout.isOpen });
  useEscapeKey(modal.close, { enabled: modal.isOpen });
  useEscapeKey(drawer.close, { enabled: drawer.isOpen });

  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Overlays</h3>
      </header>
      <div className="lane-body lane-stack">
        <div className="demo-row">
          <button onClick={modal.open} {...modal.triggerProps}>Open modal</button>
          <button data-variant="ghost" onClick={drawer.open} {...drawer.triggerProps}>Open drawer</button>
          <div ref={flyoutWrapRef} style={{ position: 'relative' }}>
            <button data-variant="ghost" onClick={flyout.toggle} {...flyout.triggerProps}>Menu ▾</button>
            <div
              className={`flyout ${flyout.isOpen ? 'is-open' : ''}`}
              style={{ top: '100%', marginTop: 6, right: 0 }}
              {...flyout.surfaceProps}
            >
              <div className="flyout-section-label">Workspace</div>
              <button className="flyout-item">New space</button>
              <button className="flyout-item">Invite teammate</button>
              <div className="flyout-separator" />
              <button className="flyout-item">Settings</button>
              <button className="flyout-item" aria-disabled="true">Archived (3)</button>
            </div>
          </div>
        </div>
        <div className="demo-row">
          <button data-tooltip="up here" data-tooltip-placement="top">tooltip ↑</button>
          <button data-tooltip="down here" data-tooltip-placement="bottom">tooltip ↓</button>
          <button data-tooltip="left side" data-tooltip-placement="left">tooltip ←</button>
          <button data-tooltip="right side" data-tooltip-placement="right">tooltip →</button>
        </div>
      </div>

      <div className={`modal-backdrop ${modal.isOpen ? 'is-visible' : ''}`} onClick={modal.close} />
      <div
        className={`modal ${modal.isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        {...modal.surfaceProps}
      >
        <header className="modal-header">
          <h3 className="modal-title">Confirm publish</h3>
          <button
            data-variant="ghost"
            aria-label="Close"
            style={{ minHeight: 'auto', padding: '0.25rem 0.55rem', borderRadius: 8 }}
            onClick={modal.close}
          >×</button>
        </header>
        <div className="modal-body">
          <p>Publishing makes this space visible to everyone in your org. You can revert any time.</p>
        </div>
        <footer className="modal-footer">
          <button data-variant="ghost" onClick={modal.close}>Cancel</button>
          <button data-variant="cta" onClick={() => { modal.close(); toast.success('Published'); }}>
            Publish
          </button>
        </footer>
      </div>

      <div className={`drawer-backdrop ${drawer.isOpen ? 'is-visible' : ''}`} onClick={drawer.close} />
      <aside className={`drawer ${drawer.isOpen ? 'is-open' : ''}`} {...drawer.surfaceProps}>
        <header className="drawer-header">
          <div>
            <div className="drawer-eyebrow">space settings</div>
            <h3 className="drawer-title">Orbit · production</h3>
          </div>
          <button
            className="drawer-close"
            aria-label="Close"
            onClick={drawer.close}
          >×</button>
        </header>
        <div className="drawer-body lane-stack">
          <div className="form-row">
            <label htmlFor="d-name">Name</label>
            <input id="d-name" defaultValue="Orbit · production" />
          </div>
          <div className="form-row">
            <label htmlFor="d-vis">Visibility</label>
            <select id="d-vis" className="select-chevron-field" defaultValue="org">
              <option value="org">Organization</option>
              <option value="public">Public</option>
              <option value="private">Just me</option>
            </select>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="switch-track" aria-hidden="true" />
            <span className="switch-label">Allow guests</span>
          </label>
        </div>
        <footer className="drawer-footer">
          <button data-variant="ghost" onClick={drawer.close}>Cancel</button>
          <button onClick={() => { drawer.close(); toast.success('Saved'); }}>Save</button>
        </footer>
      </aside>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function TabsLane() {
  const [pill, setPill] = useState('overview');
  const [under, setUnder] = useState('activity');
  const [vert, setVert] = useState('general');
  const pillTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'members',  label: 'Members' },
    { id: 'billing',  label: 'Billing', disabled: true },
  ];
  const underTabs = [
    { id: 'all',     label: 'All' },
    { id: 'mine',    label: 'Mine' },
    { id: 'starred', label: 'Starred' },
    { id: 'archive', label: 'Archived' },
  ];
  const vertTabs = [
    { id: 'general', label: '⚙ General' },
    { id: 'members', label: '👥 Members' },
    { id: 'billing', label: '💳 Billing' },
    { id: 'audit',   label: '📜 Audit log' },
  ];
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Tabs</h3>
        <span className="lane-subtitle">pill · underline · vertical</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="tabs" role="tablist" aria-label="Workspace section">
          {pillTabs.map(t => (
            <button
              key={t.id}
              role="tab"
              className="tab"
              aria-selected={pill === t.id}
              aria-disabled={t.disabled}
              disabled={t.disabled}
              onClick={() => !t.disabled && setPill(t.id)}
            >{t.label}</button>
          ))}
        </div>

        <div className="tabs" data-variant="underline" role="tablist" aria-label="Filter">
          {underTabs.map(t => (
            <button
              key={t.id}
              role="tab"
              className="tab"
              aria-selected={under === t.id}
              onClick={() => setUnder(t.id)}
            >{t.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div
            className="tabs"
            data-variant="underline"
            data-orientation="vertical"
            role="tablist"
            aria-label="Settings"
            style={{ minWidth: '9.5rem' }}
          >
            {vertTabs.map(t => (
              <button
                key={t.id}
                role="tab"
                className="tab"
                aria-selected={vert === t.id}
                onClick={() => setVert(t.id)}
              >{t.label}</button>
            ))}
          </div>
          <div style={{ flex: 1, padding: '0.4rem 0', color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            Showing the <strong style={{ color: 'var(--ink)' }}>{vertTabs.find(t => t.id === vert)?.label}</strong> panel.
            Vertical tabs use logical inline-start borders, so the underline mirrors in RTL.
          </div>
        </div>

        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.82rem' }}>
          Selected: <strong style={{ color: 'var(--ink)' }}>{pill}</strong> · {under} · {vert}
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Segmented
// ---------------------------------------------------------------------------

function SegmentedLane() {
  const [view, setView] = useState<'list' | 'grid' | 'map'>('list');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Segmented control</h3>
        <span className="lane-subtitle">topbar uses this too</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="segmented" role="radiogroup" aria-label="View">
          {(['list', 'grid', 'map'] as const).map(v => (
            <button
              key={v}
              className="segmented-option"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
            >{v}</button>
          ))}
        </div>

        <div className="segmented" data-size="sm" role="radiogroup" aria-label="Size · sm">
          {(['sm', 'md', 'lg'] as const).map(s => (
            <button
              key={s}
              className="segmented-option"
              role="radio"
              aria-checked={size === s}
              onClick={() => setSize(s)}
            >{s}</button>
          ))}
        </div>

        <div className="segmented" data-size="lg" role="radiogroup" aria-label="Size · lg">
          <button className="segmented-option" role="radio" aria-checked="true">Daily</button>
          <button className="segmented-option" role="radio" aria-checked="false">Weekly</button>
          <button className="segmented-option" role="radio" aria-checked="false" aria-disabled="true" disabled>Monthly</button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Alerts / banners
// ---------------------------------------------------------------------------

function AlertsLane() {
  const [show, setShow] = useState(true);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Alerts &amp; banners</h3>
        <span className="lane-subtitle">persistent · in-flow</span>
      </header>
      <div className="lane-body lane-stack">
        {/* Banner variant — square corners, edge-to-edge, no inline borders.
            Wrapped in a negative-margin div so it breaks out of the lane's
            padding and shows the true edge-to-edge form. */}
        <div style={{ marginInline: '-1rem', marginBlockStart: '-0.5rem' }}>
          <div className="alert" data-variant="banner" data-tone="warning" role="status">
            <span className="alert-icon" aria-hidden>⚠</span>
            <div className="alert-body">
              <strong className="alert-title">Scheduled maintenance tonight, 02:00–02:30 UTC.</strong>{' '}
              Brief read-only window while we migrate the audit-log shard.
            </div>
          </div>
        </div>
        <div className="alert" data-tone="info" role="status">
          <span className="alert-icon" aria-hidden>ℹ︎</span>
          <div className="alert-body">
            <strong className="alert-title">New region available</strong>
            <p className="alert-message">EU South (Milan) opened today. Existing spaces won't migrate automatically.</p>
          </div>
        </div>
        <div className="alert" data-tone="warning" role="status">
          <span className="alert-icon" aria-hidden>⚠</span>
          <div className="alert-body">
            <strong className="alert-title">Trial ends in 3 days</strong>
            <p className="alert-message">Add a payment method to keep your spaces.</p>
            <div className="alert-actions">
              <button data-variant="cta" style={{ minHeight: 0, padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                Add payment
              </button>
              <button data-variant="ghost" style={{ minHeight: 0, padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                Remind later
              </button>
            </div>
          </div>
        </div>
        <div className="alert" data-tone="success" role="status">
          <span className="alert-icon" aria-hidden>✓</span>
          <div className="alert-body">
            <strong className="alert-title">All systems nominal</strong>
            <p className="alert-message">No active incidents in the last 30 days.</p>
          </div>
        </div>
        <div className="alert" data-tone="danger" role="alert">
          <span className="alert-icon" aria-hidden>!</span>
          <div className="alert-body">
            <strong className="alert-title">Background sync failed</strong>
            <p className="alert-message">Last attempt 14m ago. We'll retry automatically.</p>
          </div>
        </div>
        {show && (
          <div className="alert" role="status">
            <span className="alert-icon" aria-hidden>★</span>
            <div className="alert-body">
              <strong className="alert-title">Tip: try Cmd K to open the palette</strong>
              <p className="alert-message">Dismiss this and we won't bring it up again.</p>
            </div>
            <button className="alert-close" aria-label="Dismiss" onClick={() => setShow(false)}>×</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyStateLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Empty states</h3>
        <span className="lane-subtitle">sm · md · lg</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="card" style={{ padding: 0 }}>
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden>★</div>
            <h3 className="empty-state-title">No spaces yet</h3>
            <p className="empty-state-body">
              Spaces hold your projects, channels, and starscape boards.
            </p>
            <div className="empty-state-actions">
              <button data-variant="cta">Create your first space</button>
              <button data-variant="ghost">Take a tour</button>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div className="empty-state" data-size="sm">
            <div className="empty-state-icon" aria-hidden>?</div>
            <h3 className="empty-state-title">No matching results</h3>
            <p className="empty-state-body">Try a broader query or clear the filters.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Empty state — large, full-page hero variant. Spans 2 columns at wider widths.
// ---------------------------------------------------------------------------

function EmptyStateLgLane() {
  return (
    <section className="lane lane-span-2">
      <header className="lane-head">
        <h3 className="lane-title">Empty state · lg</h3>
        <span className="lane-subtitle">full-page hero variant</span>
      </header>
      <div className="lane-body">
        <div className="empty-state" data-size="lg">
          <div className="empty-state-icon" aria-hidden>✦</div>
          <h3 className="empty-state-title">Welcome to Starscape</h3>
          <p className="empty-state-body">
            Your workspace is empty. Create a space to drop in projects, channels, or anything else worth orbiting.
          </p>
          <div className="empty-state-actions">
            <button data-variant="cta">Create a space</button>
            <button data-variant="ghost">Import from existing tool</button>
            <button data-variant="command">$ starscape init</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sonner toasts
// ---------------------------------------------------------------------------

function ToastsLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Toasts · sonner</h3>
        <span className="lane-subtitle">richColors + theme-aware</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="demo-row">
          <button data-variant="ghost" onClick={() => toast.message('Heads up', { description: 'Just letting you know.' })}>
            message
          </button>
          <button data-variant="ghost" onClick={() => toast.info('Sync started', { description: 'Indexing 1,204 documents.' })}>info</button>
          <button data-variant="ghost" onClick={() => toast.success('Published', { description: 'Visible to everyone in your org.' })}>success</button>
          <button data-variant="ghost" onClick={() => toast.warning('Rate limited', { description: 'Backing off for 30 seconds.' })}>warning</button>
          <button data-variant="ghost" onClick={() => toast.error('Could not save', { description: 'Check your connection and try again.' })}>error</button>
        </div>
        <div className="demo-row">
          <button onClick={() => toast.promise(
            new Promise(res => setTimeout(res, 1500)),
            { loading: 'Saving…', success: 'Saved', error: 'Save failed' }
          )}>promise toast</button>
          <button onClick={() => toast('Action toast', { action: { label: 'Undo', onClick: () => toast.success('Reverted') } })}>
            with action
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Composite — Activity timeline
// ---------------------------------------------------------------------------

function TimelineLane() {
  const items = [
    { who: 'Aeva',  t: '2m ago',  what: 'merged ',   target: 'feat/sonner-theming', tone: 'success' as const, init: 'AS', a: 'violet' as const },
    { who: 'Bruce', t: '14m ago', what: 'commented on ', target: '#482 · drawer regression', tone: 'accent' as const,  init: 'BR', a: 'cyan' as const },
    { who: 'Lyra',  t: '1h ago',  what: 'closed ',     target: 'OBJ-44 — design system v3', tone: 'success' as const, init: 'LY', a: 'amber' as const },
    { who: 'Kai',   t: 'today',   what: 'opened ',     target: 'docs site sync', tone: 'warning' as const, init: 'KZ', a: 'rose' as const },
  ];
  return (
    <section className="lane lane-span-2">
      <header className="lane-head">
        <h3 className="lane-title">Composite · activity feed</h3>
        <span className="badge">{items.length}</span>
      </header>
      <div className="lane-body lane-stack">
        {items.map((it, i) => (
          <article key={i} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="avatar" data-color={it.a}>{it.init}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
                <strong>{it.who}</strong> {it.what}
                <span className="chip" data-tone={it.tone} style={{ marginLeft: 4 }}>{it.target}</span>
              </div>
              <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: '0.74rem' }}>{it.t}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Composite — Stats dashboard
// ---------------------------------------------------------------------------

function StatsLane() {
  const stats = [
    { label: 'Active users',    value: '12,408', delta: '+4.2%', tone: 'success', pct: 72, hint: 'last 30d vs prev' },
    { label: 'Pending requests', value: '37',     delta: '−18%',  tone: 'warning', pct: 18, hint: 'avg wait 4m' },
    { label: 'Error rate',       value: '0.03%',  delta: '+0.01', tone: 'danger',  pct: 4,  hint: 'p95 since Tue' },
  ] as const;
  return (
    <section className="lane lane-span-2">
      <header className="lane-head">
        <h3 className="lane-title">Composite · stats dashboard</h3>
      </header>
      <div className="lane-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(15rem, 100%), 1fr))', gap: 12 }}>
        {stats.map(s => (
          <article key={s.label} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: 0 }}>{s.label}</div>
              <span className="chip" data-tone={s.tone}>{s.delta}</span>
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: 8, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div className="progress" style={{ marginTop: 10 }}>
              <div className="progress-bar" style={{ ['--value' as string]: `${s.pct}%` }} />
            </div>
            <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: '0.74rem' }}>{s.hint}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

function TypographyLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Typography</h3>
      </header>
      <div className="lane-body lane-stack">
        <div className="eyebrow">section label</div>
        <h2 style={{ margin: 0, fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)' }}>Display heading at clamp() scale</h2>
        <p className="lede">
          Lede paragraphs use a softer ink so the heading dominates. Read at a comfortable 1.05rem with 1.55 line-height.
        </p>
        <p style={{ margin: 0 }}>
          Body copy with <strong>strong</strong>, <em>emphasis</em>, an <a href="#">inline link</a>, and{' '}
          <code>{`code`}</code>. Try <span className="kbd">⌘</span> <span className="kbd">/</span> for help.
        </p>
        <pre><code>{`function greet(name) {
  return \`hello, \${name}\`;
}`}</code></pre>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sliders
// ---------------------------------------------------------------------------

// Uncontrolled sliders: the fill var + the readout are written straight to the
// DOM in onInput (via refs), so dragging triggers NO React re-render per tick —
// the right fix for range lag (memoization wouldn't help a controlled input).
function SlidersLane() {
  const volOut = useRef<HTMLSpanElement>(null);
  const threshOut = useRef<HTMLElement>(null);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Sliders</h3>
      </header>
      <div className="lane-body lane-stack">
        <div className="control-row">
          <label className="control-label">
            Volume
            <input
              type="range" className="slider" min={0} max={100} defaultValue={64}
              style={{ '--value': 64 } as CSSProperties}
              onInput={e => {
                const el = e.currentTarget;
                el.style.setProperty('--value', el.value);
                if (volOut.current) volOut.current.textContent = `${el.value}%`;
              }}
            />
            <span className="control-value" ref={volOut}>64%</span>
          </label>
        </div>
        <div className="slider" data-size="lg">
          <span className="slider-head"><b>Threshold</b><b ref={threshOut}>0.42</b></span>
          <input
            type="range" min={0} max={1} step={0.01} defaultValue={0.42}
            style={{ '--value': 42 } as CSSProperties}
            onInput={e => {
              const el = e.currentTarget;
              el.style.setProperty('--value', String(+el.value * 100));
              if (threshOut.current) threshOut.current.textContent = (+el.value).toFixed(2);
            }}
          />
        </div>
        <div className="control-row">
          <label className="control-label">
            Disabled
            <input
              type="range" className="slider" defaultValue={30} disabled
              style={{ '--value': 30 } as CSSProperties}
            />
          </label>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Compact inputs — small single-purpose controls (number field, tag input,
// rating) grouped into one lane with labeled subsections, so each doesn't
// claim a whole panel for a sliver of content.
// ---------------------------------------------------------------------------

function CompactInputsLane() {
  const [qty, setQty] = useState(8);
  const clamp = (n: number) => Math.max(0, Math.min(99, n));
  const [tags, setTags] = useState(['design', 'starscape', 'css']);
  const [draft, setDraft] = useState('');
  const addTag = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setDraft('');
  };
  const [rating, setRating] = useState(4);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Compact inputs</h3>
        <span className="lane-subtitle">number · tags · rating</span>
      </header>
      <div className="lane-body lane-stack">
        <div className="eyebrow" style={{ marginBottom: 0 }}>Number field</div>
        <div className="control-row">
          <div className="number-field">
            <button className="number-step" aria-label="Decrease"
              onClick={() => setQty(q => clamp(q - 1))} disabled={qty <= 0}>−</button>
            <input
              inputMode="numeric" aria-label="Quantity" value={qty}
              onChange={e => setQty(clamp(+e.target.value || 0))}
            />
            <button className="number-step" aria-label="Increase"
              onClick={() => setQty(q => clamp(q + 1))} disabled={qty >= 99}>+</button>
          </div>
          <div className="number-field" data-size="sm">
            <button className="number-step" aria-label="Decrease">−</button>
            <input inputMode="numeric" aria-label="Small" defaultValue={2} />
            <button className="number-step" aria-label="Increase">+</button>
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 0 }}>Tag input</div>
        <div className="tag-input">
          {tags.map(t => (
            <span className="tag" key={t}>
              {t}
              <button
                className="tag-remove" aria-label={`Remove ${t}`}
                onClick={() => setTags(tags.filter(x => x !== t))}
              >×</button>
            </span>
          ))}
          <input
            type="text" placeholder="Add tag…" aria-label="Add tag"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); addTag(); }
              if (e.key === 'Backspace' && !draft && tags.length) {
                setTags(tags.slice(0, -1));
              }
            }}
          />
        </div>

        <div className="eyebrow" style={{ marginBottom: 0 }}>Rating</div>
        <fieldset className="rating" aria-label="Rate this" style={{ alignSelf: 'flex-start' }}>
          {[5, 4, 3, 2, 1].map(v => (
            <Fragment key={v}>
              <input
                type="radio" name="rate" id={`rate-${v}`} value={v}
                checked={rating === v} onChange={() => setRating(v)}
              />
              <label htmlFor={`rate-${v}`} title={`${v} stars`}>{v} stars</label>
            </Fragment>
          ))}
        </fieldset>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

function AccordionLane() {
  const [open, setOpen] = useState<string | null>('shape');
  const item = (id: string, title: string, body: string) => (
    <details
      className="accordion" open={open === id}
      onToggle={e => { if ((e.target as HTMLDetailsElement).open) setOpen(id); }}
    >
      <summary>{title}</summary>
      <div className="accordion-body">{body}</div>
    </details>
  );
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Accordion</h3>
      </header>
      <div className="lane-body">
        <div className="accordion-group">
          {item('shape', 'Shape', 'Corner radius, border width and style. Native <details>; single-open is coordinated in React.')}
          {item('layout', 'Layout', 'Density, base spacing unit, and effects like glow strength.')}
          {item('motion', 'Motion', 'Durations and easing. Respects reduced-motion — the chevron spin drops.')}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Accordion · badge (Section) — the 2nd accordion type, ported from ss-orbit
// ---------------------------------------------------------------------------

function SectionAccordionLane() {
  const [open, setOpen] = useState<string | null>('mcp');
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Accordion · badge</h3>
      </header>
      <div className="lane-body">
        <Section
          title="Connect your agent"
          mark="MCP"
          open={open === 'mcp'}
          onToggle={e => setOpen(e.currentTarget.open ? 'mcp' : o => (o === 'mcp' ? null : o))}
        >
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Point your MCP client at the Orbit server and the board shows up as tools.
          </p>
        </Section>
        <Section
          title="Appearance"
          mark="UI"
          open={open === 'ui'}
          onToggle={e => setOpen(e.currentTarget.open ? 'ui' : o => (o === 'ui' ? null : o))}
        >
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Theme, motion, and density preferences — the gradient badge keys each section.
          </p>
        </Section>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Accordion · epic (EpicAccordion) — the Arc Lab disclosure, on its own
// ---------------------------------------------------------------------------

function EpicAccordionLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Accordion · epic</h3>
      </header>
      <div className="lane-body">
        <EpicAccordion title="Release checklist" count={4} defaultOpen>
          <ul className="list-stars" style={{ margin: 0 }}>
            <li>Bump versions to 0.4.0</li>
            <li>Build the React layer</li>
            <li>Dry-run <code>pnpm -r publish</code></li>
            <li>Tag &amp; publish to npm</li>
          </ul>
        </EpicAccordion>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Terminal — dark code-snippet shell, ported from ss-orbit
// ---------------------------------------------------------------------------

function TerminalLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Terminal</h3>
      </header>
      <div className="lane-body">
        <Terminal
          code={[
            '# the CSS design system',
            'pnpm add @starlove/ui',
            '',
            '# optional: typed React components',
            'pnpm add @starlove/ui-react sonner',
          ].join('\n')}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Prose — rendered markdown + preserved text, ported from ss-orbit
// ---------------------------------------------------------------------------

function ProseLane() {
  const md = [
    '<h3>Markdown</h3>',
    '<p>Rendered markdown with <a href="#">links</a>, <code>inline code</code>, and task lists:</p>',
    '<ul class="task-list">',
    '<li class="task-item"><input type="checkbox" checked disabled /> wrappers shipped</li>',
    '<li class="task-item task-item-done"><input type="checkbox" checked disabled /> css ported</li>',
    '</ul>',
    '<blockquote>Block quotes get a teal rail and a tinted fill.</blockquote>',
  ].join('');
  const log = [
    '$ orbit status',
    '  ● server    running   :7777',
    '  ● database  ok        3 boards, 142 tickets',
    '  ● mcp       attached  claude-code',
  ].join('\n');
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Prose · markdown + preserved</h3>
      </header>
      <div className="lane-body lane-stack">
        <Prose variant="markdown" html={md} />
        <Prose variant="preserved">{log}</Prose>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Media card
// ---------------------------------------------------------------------------

function MediaCardLane() {
  const [state, setState] = useState<'idle' | 'playing' | 'error'>('idle');
  const [kept, setKept] = useState(true);
  const cycle = () =>
    setState(s => (s === 'idle' ? 'playing' : s === 'playing' ? 'error' : 'idle'));
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Cards · media (audition)</h3>
      </header>
      <div className="lane-body">
        <article className="media-card" data-selected={kept ? 'true' : 'false'}>
          <header>
            <div>
              <strong>Nebula pad — warm</strong>
              <span>suno · v3.5 · 0:18</span>
            </div>
            <button
              className="media-play" data-state={state}
              aria-label={state === 'playing' ? 'Pause' : 'Play'}
              onClick={cycle}
            >
              {state === 'playing' ? 'Pause' : state === 'error' ? 'Retry' : 'Play'}
            </button>
          </header>
          <div className="media-envelope" aria-hidden>
            <span style={{ width: '62%' }} />
          </div>
          <div className="media-card-chips">
            <span className="chip" data-tone="accent">ambient</span>
            <span className="chip">loopable</span>
            <span className="chip" data-tone="warning">−3 LUFS</span>
          </div>
          <p className="media-card-note">Analyzed: 0.42 RMS, soft transient, no clipping.</p>
          <div className="media-card-actions">
            <button onClick={() => { setKept(true); toast.success('Kept'); }}>Keep</button>
            <button data-variant="ghost" onClick={() => { setKept(false); toast('Discarded'); }}>Discard</button>
          </div>
        </article>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

function StepperLane() {
  const labels = ['Account', 'Profile', 'Workspace', 'Done'];
  const s = useStepper(labels.length, 1);
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Stepper</h3>
        <span className="badge">{s.current + 1}/{s.total}</span>
      </header>
      <div className="lane-body lane-stack">
        <ol className="stepper">
          {labels.map((l, i) => (
            <li key={l} className="step" data-state={s.stateOf(i)}>
              <span className="step-dot">{i + 1}</span>
              <span className="step-label">{l}</span>
            </li>
          ))}
        </ol>
        <div className="demo-row">
          <button data-variant="ghost" onClick={s.prev} disabled={s.isFirst}>Back</button>
          <button onClick={s.next} disabled={s.isLast}>Next</button>
        </div>
        <ol className="stepper" data-orientation="vertical">
          {labels.slice(0, 3).map((l, i) => (
            <li key={l} className="step" data-state={s.stateOf(i)}>
              <span className="step-dot">{i + 1}</span>
              <span className="step-label">{l}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Description list
// ---------------------------------------------------------------------------

function DescriptionListLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Description list</h3>
      </header>
      <div className="lane-body lane-stack">
        <dl className="description-list">
          <div><dt>Plan</dt><dd>Starscape Pro</dd></div>
          <div><dt>Seats</dt><dd>12 of 25</dd></div>
          <div><dt>Renewal</dt><dd>May 19, 2026</dd></div>
        </dl>
        <dl className="description-list" data-layout="stacked">
          <div><dt>API endpoint</dt><dd><code>https://api.starscape.dev/v3</code></dd></div>
          <div><dt>Region</dt><dd>us-east</dd></div>
        </dl>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

function PopoverLane() {
  const pop = useDisclosure();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(wrapRef, pop.close, { enabled: pop.isOpen });
  useEscapeKey(pop.close, { enabled: pop.isOpen });
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Popover</h3>
      </header>
      <div className="lane-body">
        <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button data-variant="ghost" onClick={pop.toggle} {...pop.triggerProps}>
            Filters ▾
          </button>
          <div
            className={`popover ${pop.isOpen ? 'is-open' : ''}`}
            data-placement="bottom"
            role="dialog"
            style={{ top: '100%', marginTop: 10, insetInlineStart: 0 }}
            {...pop.surfaceProps}
          >
            <div className="popover-arrow" aria-hidden />
            <header className="popover-head">Filters</header>
            <div className="popover-body lane-stack">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="switch-track" aria-hidden="true" />
                <span className="switch-label">Open only</span>
              </label>
              <label className="control-label">
                Sort
                <select className="select-chevron-field" defaultValue="recent">
                  <option value="recent">Most recent</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
            <footer className="popover-foot">
              <button data-variant="ghost" onClick={pop.close}>Reset</button>
              <button onClick={() => { pop.close(); toast.success('Filters applied'); }}>Apply</button>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------

function ContextMenuLane() {
  const menu = useContextMenu();
  const menuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(menuRef, menu.close, { enabled: menu.isOpen });
  useEscapeKey(menu.close, { enabled: menu.isOpen });
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Context menu</h3>
      </header>
      <div className="lane-body">
        <div
          onContextMenu={menu.onContextMenu}
          style={{
            display: 'grid', placeItems: 'center', minHeight: '6rem',
            border: '1px dashed var(--line)', borderRadius: 12,
            color: 'var(--muted)', fontSize: '0.85rem',
          }}
        >
          Right-click anywhere in this area
        </div>
        {menu.isOpen && (
          <div ref={menuRef} className="context-menu" role="menu" {...menu.menuProps}>
            <div className="flyout-section-label">Item</div>
            <button className="flyout-item" role="menuitem"
              onClick={() => { menu.close(); toast('Renamed'); }}>Rename</button>
            <button className="flyout-item" role="menuitem"
              onClick={() => { menu.close(); toast('Duplicated'); }}>Duplicate</button>
            <div className="flyout-separator" />
            <button className="flyout-item" data-danger role="menuitem"
              onClick={() => { menu.close(); toast.error('Deleted'); }}>Delete</button>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Data table
// ---------------------------------------------------------------------------

function TableLane() {
  const rows = [
    { name: 'Orbit · production', owner: 'AV', status: 'accent', tag: 'live', usage: 1204 },
    { name: 'Nebula staging', owner: 'JK', status: 'warning', tag: 'building', usage: 318 },
    { name: 'Comet sandbox', owner: 'RL', status: 'danger', tag: 'error', usage: 27 },
    { name: 'Pulsar archive', owner: 'MT', status: undefined, tag: 'idle', usage: 0 },
  ];
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Data table</h3>
        <span className="badge">{rows.length}</span>
      </header>
      <div className="lane-body">
        <div className="table-wrap scroll-themed">
          <table className="table" data-zebra>
            <thead>
              <tr>
                <th data-sortable aria-sort="ascending">Space</th>
                <th>Owner</th>
                <th>Status</th>
                <th data-numeric data-sortable>Requests</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td><span className="avatar" data-size="sm" aria-hidden>{r.owner}</span></td>
                  <td><span className="chip" data-tone={r.status}>{r.tag}</span></td>
                  <td data-numeric>{r.usage.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function PaginationLane() {
  const [page, setPage] = useState(3);
  const total = 9;
  const pages = [1, 2, 3, 4, 5];
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Pagination</h3>
      </header>
      <div className="lane-body lane-stack">
        <nav className="pagination" aria-label="Pagination">
          <button className="pagination-item" data-nav
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
          {pages.map(p => (
            <button
              key={p} className="pagination-item"
              aria-current={page === p ? 'page' : undefined}
              onClick={() => setPage(p)}
            >{p}</button>
          ))}
          <span className="pagination-gap">…</span>
          <button className="pagination-item"
            aria-current={page === total ? 'page' : undefined}
            onClick={() => setPage(total)}>{total}</button>
          <button className="pagination-item" data-nav
            onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}>Next ›</button>
        </nav>
        <nav className="pagination" data-size="sm" aria-label="Compact pagination">
          <button className="pagination-item" data-nav disabled>‹</button>
          <button className="pagination-item" aria-current="page">1</button>
          <button className="pagination-item">2</button>
          <button className="pagination-item">3</button>
          <button className="pagination-item" data-nav>›</button>
        </nav>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

function BreadcrumbLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Breadcrumb</h3>
      </header>
      <div className="lane-body lane-stack">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="#breadcrumb">Home</a></li>
            <li><a href="#breadcrumb">Projects</a></li>
            <li><a href="#breadcrumb">Starscape UI</a></li>
            <li><span aria-current="page">Components</span></li>
          </ol>
        </nav>
        <nav className="breadcrumb" aria-label="Truncating breadcrumb">
          <ol>
            <li><a href="#breadcrumb">Workspace</a></li>
            <li><a href="#breadcrumb">A very long space name that should ellipsis nicely</a></li>
            <li><span aria-current="page">Settings</span></li>
          </ol>
        </nav>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Code block
// ---------------------------------------------------------------------------

function CodeBlockLane() {
  const snippet = `npm i @starlove/ui
import "@starlove/ui";

// or à-la-carte
import "@starlove/ui/components/button";`;
  const lines = snippet.split('\n');
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Code block</h3>
      </header>
      <div className="lane-body">
        <figure className="code-block">
          <figcaption className="code-block-head">
            <span className="code-block-name">install.sh</span>
            <button
              className="code-block-copy"
              onClick={() => {
                void navigator.clipboard?.writeText(snippet);
                toast.success('Copied to clipboard');
              }}
            >Copy</button>
          </figcaption>
          <pre className="scroll-themed" data-numbered>
            <code>{lines.map((l, i) => (
              <span className="line" key={i}>{l || ' '}</span>
            ))}</code>
          </pre>
        </figure>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Scrollbar utility
// ---------------------------------------------------------------------------

function ScrollbarLane() {
  return (
    <section className="lane">
      <header className="lane-head">
        <h3 className="lane-title">Themed scrollbar</h3>
      </header>
      <div className="lane-body">
        <div
          className="scroll-themed"
          style={{
            maxHeight: '8rem', overflow: 'auto', padding: 'var(--space-4)',
            border: '1px solid var(--line)', borderRadius: 12,
            color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7,
          }}
        >
          <p style={{ marginTop: 0 }}>
            <code>.scroll-themed</code> tints the scrollbar with the accent token —
            teal-ish in light, starlight in dark. Scroll this box to see it.
          </p>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} style={{ margin: '0 0 0.6rem' }}>
              Line {i + 1} — the thumb flips color with the theme because it reads
              <code> --scrollbar-thumb</code>, which is redefined per theme.
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
