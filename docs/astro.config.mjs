import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Starscape Docs',
      description:
        'Documentation for Starscape UI packages, foundations, project adoption, and agent implementation rules.',
      customCss: ['./src/styles/starlight.css'],
      // Re-skin the whole page frame as the @starlove/ui `sidebar` template.
      components: {
        PageFrame: './src/components/overrides/PageFrame.astro',
        Sidebar: './src/components/overrides/Sidebar.astro',
      },
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'Getting Started', slug: 'getting-started' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { label: '@starlove/ui', slug: 'packages/ui' },
            { label: '@starlove/ui-react', slug: 'packages/ui-react' },
          ],
        },
        {
          label: 'Foundations',
          items: [
            { label: 'Theme', slug: 'foundations/theme' },
            { label: 'Motion', slug: 'foundations/motion' },
            { label: 'Focus and Accessibility', slug: 'foundations/focus' },
            { label: 'Tokens', slug: 'foundations/tokens' },
            { label: 'Page Templates', slug: 'foundations/templates' },
            { label: 'Horizontal Scroll', slug: 'foundations/horizontal-scroll' },
          ],
        },
        {
          label: 'Component System',
          items: [{ label: 'Component Index', slug: 'components' }],
        },
        {
          label: 'Projects',
          items: [
            { label: 'Project Adoption', slug: 'projects' },
            { label: 'Orbit Kanban', slug: 'projects/orbit-kanban' },
            { label: 'New Project Template', slug: 'projects/new-project-template' },
          ],
        },
        {
          label: 'Agents',
          items: [{ label: 'Implementation Rules', slug: 'agents/implementation-rules' }],
        },
      ],
    }),
  ],
});
