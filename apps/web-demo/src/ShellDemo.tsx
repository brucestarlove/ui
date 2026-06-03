import {
  PageShell,
  Topbar,
  TopbarBrand,
  TopbarSpacer,
  Button,
  Card,
  Lane,
  LaneGrid,
} from '@starlove/ui-react';
import { Toaster } from '@starlove/ui-react/toaster';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

/**
 * `shell` page template demo — the framed-board app shell shared by the
 * Starscape apps (ss-orbit, ss-nebula): Starscape background, a static topbar,
 * an Orbit-style framed board holding the page content, and a signature footer.
 */
export function ShellDemo() {
  return (
    <PageShell
      background
      board
      footer={
        <>
          <footer className="frame-footer" aria-label="Application signature">
            <span className="frame-footer-title">Shell</span>
            <span className="frame-footer-subtitle">
              <em>a Starscape app</em>
            </span>
          </footer>
          <Toaster />
        </>
      }
      topbar={
        <Topbar scrollAware={false}>
          <TopbarBrand>✨ shell template</TopbarBrand>
          <TopbarSpacer />
          <ThemeToggle />
        </Topbar>
      }
    >
      <section className="demo-hero">
        <h1>The shell template</h1>
        <p className="lede">
          The framed-board app shell — animated background, a static topbar, and an
          Orbit-style board that fills the space between the rail and the signature
          footer and scrolls its own content. The same layout ss-orbit and ss-nebula
          use, promoted into <code>@starlove/ui/templates/shell</code> behind{' '}
          <code>&lt;PageShell board&gt;</code>.
        </p>
        <div className="demo-row" style={{ marginTop: '1.25rem' }}>
          <Button onClick={() => toast.success('Hello from the shell template')}>
            Fire a toast
          </Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </section>

      <LaneGrid>
        <Lane title="Recent" count={3}>
          <Card variant="feature">A feature card</Card>
          <Card variant="task" style={{ marginTop: '0.75rem' }}>
            A task card
          </Card>
          <Card variant="bug" style={{ marginTop: '0.75rem' }}>
            A bug card
          </Card>
        </Lane>
        <Lane title="Notes">
          <p style={{ margin: 0 }}>
            Drop any content into <code>&lt;PageShell board&gt;</code> — it sits inside
            the framed board, which fills the space below the topbar and scrolls on its own.
          </p>
        </Lane>
      </LaneGrid>
    </PageShell>
  );
}
