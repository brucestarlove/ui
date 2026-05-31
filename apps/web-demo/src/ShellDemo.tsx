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
 * `shell` page template demo — the single-column app shell: Starscape
 * background, a fixed topbar, centered scrollable content, and a Toaster.
 */
export function ShellDemo() {
  return (
    <PageShell
      background
      footer={<Toaster />}
      topbar={
        <Topbar>
          <TopbarBrand>✨ shell template</TopbarBrand>
          <TopbarSpacer />
          <ThemeToggle />
        </Topbar>
      }
    >
      <section className="demo-hero">
        <h1>The shell template</h1>
        <p className="lede">
          A single-column app shell — animated background, a fixed topbar, and a
          scrollable content region. The same layout the preview app itself uses,
          promoted into <code>@starlove/ui/templates/shell</code>.
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
            Drop any content into <code>&lt;PageShell&gt;</code> — it fills the
            centered main region below the topbar.
          </p>
        </Lane>
      </LaneGrid>
    </PageShell>
  );
}
