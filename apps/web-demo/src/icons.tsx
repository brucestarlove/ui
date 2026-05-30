/* Minimal line-icon set for the sidebar demo (stroke = currentColor). */
import type { SVGProps } from 'react';

function Icon({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = () => (
  <Icon><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Icon>
);
export const MemoryIcon = () => (
  <Icon><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></Icon>
);
export const ChatIcon = () => (
  <Icon><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" /></Icon>
);
export const ClockIcon = () => (
  <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
);
export const ServicesIcon = () => (
  <Icon><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></Icon>
);
export const PortIcon = () => (
  <Icon><circle cx="12" cy="12" r="9" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /></Icon>
);
export const UserIcon = () => (
  <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></Icon>
);
export const SettingsIcon = () => (
  <Icon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9.5A1.7 1.7 0 0 0 10.6 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Icon>
);
export const MicIcon = () => (
  <Icon><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></Icon>
);
export const SoundIcon = () => (
  <Icon><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9a3 3 0 0 1 0 6M18.5 7a6 6 0 0 1 0 10" /></Icon>
);
export const BookIcon = () => (
  <Icon><path d="M4 4v15a1 1 0 0 0 1 1h14V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" /><path d="M8 4v16" /></Icon>
);
export const SearchIcon = () => (
  <Icon width="16" height="16"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>
);
