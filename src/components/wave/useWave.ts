import type { RefObject } from 'react';
import showWaveEffect from './WaveEffect';

export default function useWave(nodeRef: RefObject<HTMLElement>, className: string): VoidFunction {
  function showWave() {
    const node = nodeRef.current!;

    showWaveEffect(node, className);
  }

  return showWave;
}
