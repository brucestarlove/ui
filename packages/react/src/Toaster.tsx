import * as React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from './useTheme';

type SonnerToasterProps = React.ComponentProps<typeof SonnerToaster>;

/**
 * Sonner Toaster wired to Starscape v3's theme. Reads useTheme().resolved and
 * passes it as `theme` so light/dark/system tracking works without the
 * consumer wiring it up. richColors and closeButton default on; everything
 * else can be passed through as props.
 *
 * Pair with `import '@starlove/ui/components/sonner';` for
 * the v3 visual treatment.
 */
export const Toaster: React.FC<SonnerToasterProps> = ({
  richColors = true,
  closeButton = true,
  ...rest
}) => {
  const { resolved } = useTheme();
  return (
    <SonnerToaster
      theme={resolved}
      richColors={richColors}
      closeButton={closeButton}
      {...rest}
    />
  );
};
