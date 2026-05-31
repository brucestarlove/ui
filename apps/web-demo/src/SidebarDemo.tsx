import { useState, type ReactNode } from 'react';
import {
  PageSidebar,
  PageSidebarHeader,
  PageSidebarSearch,
  PageSidebarNav,
  PageSidebarSection,
  PageSidebarNavItem,
  PageSidebarNavGroup,
  PageSidebarFooter,
  Lane,
  LaneGrid,
  Card,
  Button,
  Chip,
} from '@starlove/ui-react';
import { ThemeToggle } from './ThemeToggle';
import {
  HomeIcon,
  MemoryIcon,
  ChatIcon,
  ClockIcon,
  ServicesIcon,
  PortIcon,
  UserIcon,
  SettingsIcon,
  MicIcon,
  SoundIcon,
  BookIcon,
  SearchIcon,
} from './icons';

type NavDef = { id: string; label: string; icon: ReactNode; badge?: ReactNode };

const WORKSPACE: NavDef[] = [
  { id: 'overview', label: 'overview', icon: <HomeIcon /> },
  { id: 'memory', label: 'memory', icon: <MemoryIcon />, badge: '128' },
  { id: 'conversations', label: 'conversations', icon: <ChatIcon />, badge: '3' },
  { id: 'timers', label: 'timers & schedules', icon: <ClockIcon /> },
];

const SYSTEM: NavDef[] = [
  { id: 'services', label: 'services', icon: <ServicesIcon /> },
  { id: 'ports', label: 'ports', icon: <PortIcon />, badge: '!' },
];

const PROFILES = [
  { id: 'nova', color: '#f472b6' },
  { id: 'sentinel', color: '#34d399' },
  { id: 'aurora', color: '#fbbf24' },
  { id: 'corona', color: '#60a5fa' },
  { id: 'comet', color: '#a78bfa' },
];

const STUDIO: NavDef[] = [
  { id: 'settings', label: 'settings', icon: <SettingsIcon /> },
  { id: 'voice-lab', label: 'voice lab', icon: <MicIcon /> },
  { id: 'soundboard', label: 'soundboard', icon: <SoundIcon /> },
  { id: 'our-journal', label: 'our journal', icon: <BookIcon /> },
];

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
}

/**
 * `sidebar` page template demo — a polished, collapsible command-deck rail:
 * gradient brand, search, labelled sections with icons + count badges, an
 * expandable profile group, a user footer, and a content region.
 */
export function SidebarDemo() {
  const [active, setActive] = useState('overview');
  const labelFor = (id: string) =>
    [...WORKSPACE, ...SYSTEM, ...STUDIO].find((n) => n.id === id)?.label ??
    PROFILES.find((p) => p.id === id)?.id ??
    id;

  const item = (n: NavDef) => (
    <PageSidebarNavItem
      key={n.id}
      icon={n.icon}
      badge={n.badge}
      active={active === n.id}
      onClick={() => setActive(n.id)}
    >
      {n.label}
    </PageSidebarNavItem>
  );

  return (
    <PageSidebar
      storageKey="demo.sidebar"
      brand={<PageSidebarHeader logo="✦" title="Starscape" subtitle="sidebar template" />}
      search={
        <PageSidebarSearch>
          <div style={{ position: 'relative' }}>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                insetInlineStart: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'inline-flex',
                color: 'var(--muted)',
                pointerEvents: 'none',
              }}
            >
              <SearchIcon />
            </span>
            <input
              className="input"
              placeholder="Search…"
              style={{ paddingInlineStart: '2rem' }}
            />
          </div>
        </PageSidebarSearch>
      }
      nav={
        <PageSidebarNav>
          <PageSidebarSection label="workspace">
            {WORKSPACE.map(item)}
          </PageSidebarSection>

          <PageSidebarSection label="system">
            {SYSTEM.map(item)}
            <PageSidebarNavGroup
              label="profiles"
              icon={<UserIcon />}
              badge={String(PROFILES.length)}
              active={PROFILES.some((p) => p.id === active)}
              defaultExpanded
            >
              {PROFILES.map((p) => (
                <PageSidebarNavItem
                  key={p.id}
                  icon={<Dot color={p.color} />}
                  active={active === p.id}
                  onClick={() => setActive(p.id)}
                >
                  {p.id}
                </PageSidebarNavItem>
              ))}
            </PageSidebarNavGroup>
          </PageSidebarSection>

          <PageSidebarSection label="studio">
            {STUDIO.map(item)}
          </PageSidebarSection>
        </PageSidebarNav>
      }
      footer={
        <PageSidebarFooter>
          <span
            aria-hidden
            className="page-sidebar-logo"
            style={{ width: 32, height: 32, fontSize: '0.8rem', borderRadius: '50%' }}
          >
            AV
          </span>
          <div className="page-sidebar-footer-text">
            <span className="page-sidebar-footer-name">astralvitz</span>
            <span className="page-sidebar-footer-meta">owner · v0.1</span>
          </div>
        </PageSidebarFooter>
      }
    >
      {/* Content header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, textTransform: 'lowercase' }}>{labelFor(active)}</h1>
          <p className="lede" style={{ margin: '0.35rem 0 0' }}>
            A collapsible rail plus a content region — the sidebar page template.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <Button variant="secondary">new</Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Stat band */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
          marginBottom: '1.75rem',
        }}
      >
        {[
          { k: 'memories', v: '1,284' },
          { k: 'conversations', v: '312' },
          { k: 'active timers', v: '7' },
          { k: 'uptime', v: '99.9%' },
        ].map((s) => (
          <Card key={s.k}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.v}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{s.k}</div>
          </Card>
        ))}
      </div>

      <LaneGrid>
        <Lane title="selected" subtitle={labelFor(active)}>
          <Card variant="feature">
            Content for “{labelFor(active)}” renders in the main region. Pick any nav
            item, expand the <strong>profiles</strong> group, or collapse the rail.
          </Card>
        </Lane>
        <Lane title="template notes" actions={<Chip tone="accent">v3</Chip>}>
          <Card variant="task">
            Collapse persists across reloads via{' '}
            <code>storageKey="demo.sidebar"</code>. When collapsed, items show
            icon-only with hover tooltips.
          </Card>
          <Card variant="task" style={{ marginTop: '0.75rem' }}>
            Fully tokenized — toggle the theme to see it re-skin.
          </Card>
        </Lane>
      </LaneGrid>
    </PageSidebar>
  );
}
