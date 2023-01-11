import type { ComponentType } from 'react';
import { it, describe, expect } from 'vitest';
import { render } from '../utils';

export default function mountTest(Component: ComponentType) {
  describe(`mount and unmount`, () => {
    it(`component could be updated and unmounted without errors`, () => {
      const { unmount, rerender } = render(<Component />);
      expect(() => {
        rerender(<Component />);
        unmount();
      }).not.toThrow();
    });
  });
}
