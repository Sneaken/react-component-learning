import { ReactElement, ReactNode, RefObject } from 'react';
import toArray from '@/utils/Children/toArray';
import { warning } from '@/utils/warning';
import SingleObserver from './single-observer';

export interface SizeInfo {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

export type OnResize = (size: SizeInfo, element: HTMLElement) => void;

export interface ResizeObserverProps {
  /** Pass to ResizeObserver.Collection with additional data */
  data?: any;
  children: ReactNode | ((ref: RefObject<any>) => ReactElement);
  disabled?: boolean;
  /** Trigger if element resized. Will always trigger when first time render. */
  onResize?: OnResize;
}

const INTERNAL_PREFIX_KEY = 'observer-key';

function ResizeObserver(props: ResizeObserverProps) {
  const { children } = props;
  const childNodes = typeof children === 'function' ? [children] : toArray(children);
  if (process.env.NODE_ENV !== 'production') {
    if (childNodes.length > 1) {
      warning(
        false,
        'Find more than one child node with `children` in ResizeObserver. Please use ResizeObserver.Collection instead.'
      );
    } else if (childNodes.length === 0) {
      warning(false, '`children` of ResizeObserver is empty. Nothing is in observe.');
    }
  }

  return childNodes.map((child, index) => {
    const key = (child as unknown as ReactNode as ReactElement)?.key || `${INTERNAL_PREFIX_KEY}-${index}`;
    return (
      <SingleObserver {...props} key={key}>
        {child}
      </SingleObserver>
    );
  }) as any as ReactElement;
}

export default ResizeObserver;
