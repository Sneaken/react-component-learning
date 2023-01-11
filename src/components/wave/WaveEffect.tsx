import raf from '@/utils/raf';
import { render, unmount } from '@/utils/React/render';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { getTargetWaveColor } from './util';

import './style/index.less';

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

export interface WaveEffectProps {
  className: string;
  target: HTMLElement;
}

const WaveEffect: FC<WaveEffectProps> = (props) => {
  const { className, target } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const [color, setWaveColor] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState<number[]>([]);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const waveStyle = {
    left,
    top,
    width,
    height,
    borderRadius: borderRadius.map((radius) => `${radius}px`).join(' '),
  } as CSSProperties & {
    [name: string]: number | string;
  };

  if (color) {
    waveStyle['--wave-color'] = color;
  }

  function syncPos() {
    const nodeStyle = getComputedStyle(target);

    // Get wave color from target
    setWaveColor(getTargetWaveColor(target));

    // Rect
    setLeft(target.offsetLeft);
    setTop(target.offsetTop);
    setWidth(target.offsetWidth);
    setHeight(target.offsetHeight);

    // Get border radius
    const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = nodeStyle;

    setBorderRadius(
      [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius].map((radius) =>
        validateNum(parseFloat(radius))
      )
    );
  }

  useEffect(() => {
    if (target) {
      // We need delay to check position here
      // since UI may change after click
      const id = raf(() => {
        syncPos();

        setEnabled(true);
      });

      // Add resize observer to follow size
      let resizeObserver: ResizeObserver;
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(syncPos);

        resizeObserver.observe(target);
      }

      return () => {
        raf.cancel(id);
        resizeObserver?.disconnect();
      };
    }
  }, []);

  if (!enabled) return null;

  return (
    <CSSMotion
      visible
      motionAppear
      motionName="wave-motion"
      motionDeadline={5000}
      onAppearEnd={(_, event) => {
        if (event.deadline || (event as TransitionEvent).propertyName === 'opacity') {
          const holder = divRef.current?.parentElement!;
          unmount(holder).then(() => {
            holder.parentElement?.removeChild(holder);
          });
        }
        return false;
      }}
    >
      {({ className: motionClassName }) => (
        <div ref={divRef} className={classNames(className, motionClassName)} style={waveStyle} />
      )}
    </CSSMotion>
  );
};

export default function showWaveEffect(node: HTMLElement, className: string) {
  // Create holder
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node.parentElement?.appendChild(holder);

  render(<WaveEffect target={node} className={className} />, holder);
}
