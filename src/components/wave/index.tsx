import isVisible from '@/utils/Dom/isVisible';
import { composeRef, supportRef } from '@/utils/ref';
import { cloneElement, isValidElement, type ReactElement, type ReactNode, Ref, useEffect, useRef } from 'react';
import './style/index.less';
import useWave from './useWave';

export interface WaveProps {
  disabled?: boolean;
  children?: ReactNode;
}

interface InjectedProps {
  ref: Ref<HTMLElement>;
}

const Wave = ({ children, disabled }: WaveProps) => {
  const containerRef = useRef<HTMLElement>(null);

  // ============================== Style ===============================
  const prefixCls = 'wave';

  // =============================== Wave ===============================
  const showWave = useWave(containerRef, prefixCls);

  // ============================== Effect ==============================
  useEffect(() => {
    const node = containerRef.current;
    // nodeType === 1 是元素节点
    if (!node || node.nodeType !== 1 || disabled) return;

    const onClick = (e: MouseEvent) => {
      // Fix radio button click twice
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        !isVisible(e.target as HTMLElement) ||
        // No need wave
        !node.getAttribute ||
        node.getAttribute('disabled') ||
        (node as HTMLInputElement).disabled ||
        node.className.includes('disabled') ||
        node.className.includes('-leave')
      ) {
        return;
      }

      showWave();
    };

    node.addEventListener('click', onClick, true);
    return () => node.removeEventListener('click', onClick, true);
  }, [disabled]);

  // ============================== Render ==============================
  if (!isValidElement(children)) {
    return (children ?? null) as unknown as ReactElement;
  }

  const ref = supportRef(children) ? composeRef((children as any).ref, containerRef) : containerRef;

  return cloneElement(children, { ref } as InjectedProps);
};

export default Wave;
