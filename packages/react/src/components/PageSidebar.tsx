import * as React from 'react';
import { cx } from './cx';

/* ------------------------------------------------------------------ *
 * Collapse state — controlled, or uncontrolled with optional
 * localStorage persistence.
 * ------------------------------------------------------------------ */

function readStored(key: string | undefined, fallback: boolean): boolean {
  if (!key || typeof window === 'undefined') return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v == null ? fallback : v === '1';
  } catch {
    return fallback;
  }
}

function useCollapsed(
  controlled: boolean | undefined,
  defaultCollapsed: boolean,
  storageKey: string | undefined,
  onChange: ((collapsed: boolean) => void) | undefined,
): [boolean, () => void] {
  const isControlled = controlled != null;
  const [internal, setInternal] = React.useState(() =>
    readStored(storageKey, defaultCollapsed),
  );
  const collapsed = isControlled ? (controlled as boolean) : internal;

  const toggle = React.useCallback(() => {
    const next = !collapsed;
    if (!isControlled) {
      setInternal(next);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, next ? '1' : '0');
        } catch {
          /* ignore quota / privacy-mode errors */
        }
      }
    }
    onChange?.(next);
  }, [collapsed, isControlled, storageKey, onChange]);

  return [collapsed, toggle];
}

/* ------------------------------------------------------------------ *
 * PageSidebar
 * ------------------------------------------------------------------ */

export interface PageSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand / header block (see `PageSidebar.Header` or `.Brand`). */
  brand?: React.ReactNode;
  /** Optional search slot, rendered below the header (see `PageSidebar.Search`). */
  search?: React.ReactNode;
  /** Navigation (see `PageSidebar.Nav` + `.Section`/`.NavItem`/`.NavGroup`). */
  nav?: React.ReactNode;
  /** Footer block pinned to the bottom (see `PageSidebar.Footer`). */
  footer?: React.ReactNode;
  /** @deprecated single-line footer; prefer `footer` + `PageSidebar.Footer`. */
  sidebarFooter?: React.ReactNode;
  /** Render the collapse toggle button (default true). */
  collapsible?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled (default false). */
  defaultCollapsed?: boolean;
  /** Fired whenever the collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Persist the uncontrolled collapsed state under this localStorage key. */
  storageKey?: string;
  /** Labels for the collapse toggle ([expanded, collapsed]). */
  toggleLabels?: [React.ReactNode, React.ReactNode];
  /** Extra class on the inner `<main>`. */
  mainClassName?: string;
}

interface PageSidebarComponent
  extends React.ForwardRefExoticComponent<
    PageSidebarProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof Header;
  Brand: typeof Brand;
  Search: typeof Search;
  Nav: typeof Nav;
  Section: typeof Section;
  NavItem: typeof NavItem;
  NavGroup: typeof NavGroup;
  NavDivider: typeof NavDivider;
  Footer: typeof Footer;
}

/**
 * `sidebar` page template — a two-column app layout with a collapsible left
 * navigation rail (264px ↔ 72px) and a content region. Compose the rail from
 * the `PageSidebar.*` sub-components.
 *
 * ```tsx
 * <PageSidebar
 *   brand={<PageSidebar.Header logo="✦" title="aeva" subtitle="command deck" />}
 *   search={<PageSidebar.Search><input className="input" placeholder="Search…" /></PageSidebar.Search>}
 *   nav={
 *     <PageSidebar.Nav>
 *       <PageSidebar.Section label="workspace">
 *         <PageSidebar.NavItem icon={<HomeIcon />} active badge="3">overview</PageSidebar.NavItem>
 *         <PageSidebar.NavGroup label="profile" icon={<UserIcon />} defaultExpanded>
 *           <PageSidebar.NavItem>aeva</PageSidebar.NavItem>
 *         </PageSidebar.NavGroup>
 *       </PageSidebar.Section>
 *     </PageSidebar.Nav>
 *   }
 *   footer={<PageSidebar.Footer>…</PageSidebar.Footer>}
 *   storageKey="app.sidebar"
 * >
 *   …content…
 * </PageSidebar>
 * ```
 *
 * Pair with `import '@starlove/ui/templates/sidebar';` (or the kitchen-sink).
 */
export const PageSidebar = React.forwardRef<HTMLDivElement, PageSidebarProps>(
  function PageSidebar(
    {
      brand,
      search,
      nav,
      footer,
      sidebarFooter,
      collapsible = true,
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      storageKey,
      toggleLabels = ['collapse', 'expand'],
      mainClassName,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [collapsed, toggle] = useCollapsed(
      collapsedProp,
      defaultCollapsed,
      storageKey,
      onCollapsedChange,
    );

    return (
      <div
        ref={ref}
        className={cx('page-sidebar-app', className)}
        data-collapsed={collapsed ? '' : undefined}
        {...rest}
      >
        <aside className="page-sidebar">
          {brand}
          {search}
          {nav}
          {footer}
          {sidebarFooter && <div className="page-sidebar-foot">{sidebarFooter}</div>}
          {collapsible && (
            <div className="page-sidebar-toggle-wrap">
              <button
                type="button"
                className="page-sidebar-toggle"
                onClick={toggle}
                aria-pressed={collapsed}
                aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
                title={collapsed ? 'expand sidebar' : 'collapse sidebar'}
              >
                <span className="page-sidebar-toggle-icon" aria-hidden>
                  {collapsed ? '»' : '«'}
                </span>
                <span className="page-sidebar-toggle-label">
                  {collapsed ? toggleLabels[1] : toggleLabels[0]}
                </span>
              </button>
            </div>
          )}
        </aside>
        <main className={cx('page-sidebar-main', mainClassName)}>{children}</main>
      </div>
    );
  },
) as PageSidebarComponent;

/* ------------------------------------------------------------------ *
 * Sub-components
 * ------------------------------------------------------------------ */

export interface PageSidebarHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Logo/mark shown in the gradient square (glyph, initial, or icon). */
  logo?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const Header = React.forwardRef<HTMLDivElement, PageSidebarHeaderProps>(
  function PageSidebarHeader(
    { logo, title, subtitle, className, children, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx('page-sidebar-header', className)} {...rest}>
        {logo != null && <div className="page-sidebar-logo" aria-hidden>{logo}</div>}
        {(title != null || subtitle != null) && (
          <div className="page-sidebar-titles">
            {title != null && <span className="page-sidebar-title">{title}</span>}
            {subtitle != null && (
              <span className="page-sidebar-subtitle">{subtitle}</span>
            )}
          </div>
        )}
        {children}
      </div>
    );
  },
);

export interface PageSidebarBrandProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const Brand = React.forwardRef<HTMLDivElement, PageSidebarBrandProps>(
  function PageSidebarBrand({ title, subtitle, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cx('page-sidebar-brand', className)} {...rest}>
        {title != null && <h1>{title}</h1>}
        {subtitle != null && <span className="page-sidebar-brand-sub">{subtitle}</span>}
        {children}
      </div>
    );
  },
);

const Search = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function PageSidebarSearch({ className, ...rest }, ref) {
    return <div ref={ref} className={cx('page-sidebar-search', className)} {...rest} />;
  },
);

const Nav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function PageSidebarNav({ className, ...rest }, ref) {
    return <nav ref={ref} className={cx('page-sidebar-nav', className)} {...rest} />;
  },
);

export interface PageSidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Uppercase section label shown above the items. */
  label?: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, PageSidebarSectionProps>(
  function PageSidebarSection({ label, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cx('page-sidebar-section', className)} {...rest}>
        {label != null && <div className="page-sidebar-section-label">{label}</div>}
        {children}
      </div>
    );
  },
);

export interface PageSidebarNavItemProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Highlight as the current item. */
  active?: boolean;
  /** Leading icon/glyph. */
  icon?: React.ReactNode;
  /** Trailing count badge. */
  badge?: React.ReactNode;
  /** Trailing element (e.g. a chevron) — overrides `badge` placement order. */
  trailing?: React.ReactNode;
  /** Element to render as (default `'button'`; pass `'a'` for links). */
  as?: React.ElementType;
  /** Apply the smaller nested-child styling (no leading accent rail). */
  child?: boolean;
}

const NavItem = React.forwardRef<HTMLElement, PageSidebarNavItemProps>(
  function PageSidebarNavItem(
    { active, icon, badge, trailing, as, child, title, className, children, ...rest },
    ref,
  ) {
    const Comp = (as ?? 'button') as React.ElementType;
    const autoTitle = title ?? (typeof children === 'string' ? children : undefined);
    return (
      <Comp
        ref={ref}
        className={cx(
          'page-sidebar-nav-item',
          child && 'page-sidebar-nav-child',
          className,
        )}
        data-active={active ? '' : undefined}
        title={autoTitle}
        {...(Comp === 'button' ? { type: 'button' } : {})}
        {...rest}
      >
        {icon != null && (
          <span className="page-sidebar-nav-icon" aria-hidden>
            {icon}
          </span>
        )}
        {children != null && <span className="page-sidebar-nav-label">{children}</span>}
        {badge != null && <span className="page-sidebar-nav-badge">{badge}</span>}
        {trailing}
      </Comp>
    );
  },
);

function ChevronIcon() {
  return (
    <span className="page-sidebar-nav-chevron" aria-hidden>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export interface PageSidebarNavGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  /** The parent row label. */
  label?: React.ReactNode;
  /** Leading icon on the parent row. */
  icon?: React.ReactNode;
  /** Trailing count badge on the parent row. */
  badge?: React.ReactNode;
  /** Mark the parent row active. */
  active?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled (default false). */
  defaultExpanded?: boolean;
  /** Fired when the group expands/collapses. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Render the parent row as this element (default `'button'`). */
  as?: React.ElementType;
}

const NavGroup = React.forwardRef<HTMLDivElement, PageSidebarNavGroupProps>(
  function PageSidebarNavGroup(
    {
      label,
      icon,
      badge,
      active,
      expanded: expandedProp,
      defaultExpanded = false,
      onExpandedChange,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isControlled = expandedProp != null;
    const [internal, setInternal] = React.useState(defaultExpanded);
    const expanded = isControlled ? (expandedProp as boolean) : internal;

    const toggle = () => {
      const next = !expanded;
      if (!isControlled) setInternal(next);
      onExpandedChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cx('page-sidebar-nav-group', className)}
        data-expanded={expanded ? '' : undefined}
        {...rest}
      >
        <NavItem
          as={as}
          icon={icon}
          badge={badge}
          active={active}
          trailing={<ChevronIcon />}
          className="page-sidebar-nav-parent"
          aria-expanded={expanded}
          onClick={toggle}
        >
          {label}
        </NavItem>
        <div className="page-sidebar-nav-children">
          <div className="page-sidebar-nav-children-inner">{children}</div>
        </div>
      </div>
    );
  },
);

const NavDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function PageSidebarNavDivider({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx('page-sidebar-nav-divider', className)}
      {...rest}
    />
  );
});

const Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function PageSidebarFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx('page-sidebar-footer', className)} {...rest} />;
  },
);

PageSidebar.Header = Header;
PageSidebar.Brand = Brand;
PageSidebar.Search = Search;
PageSidebar.Nav = Nav;
PageSidebar.Section = Section;
PageSidebar.NavItem = NavItem;
PageSidebar.NavGroup = NavGroup;
PageSidebar.NavDivider = NavDivider;
PageSidebar.Footer = Footer;
