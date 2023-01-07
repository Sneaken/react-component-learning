import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { findDOMNode } from 'react-dom';
import type { ResizeObserverProps } from '../';
import { composeRef, supportRef } from '../../../utils/ref';
import { CollectionContext } from '../Collection';
import { observe, ResizeListener, unobserve } from '../utils/observer';
import DomWrapper from './DomWrapper';

export interface SingleObserverProps extends ResizeObserverProps {
  children: ReactElement | ((ref: RefObject<Element>) => ReactElement);
}

function SingleObserver(props: SingleObserverProps) {
  const { children, disabled } = props;
  const elementRef = useRef<Element>(null);
  const wrapperRef = useRef<DomWrapper>(null);

  const onCollectionResize = React.useContext(CollectionContext);

  // =========================== Children ===========================
  const isRenderProps = typeof children === 'function';
  const mergedChildren = isRenderProps ? children(elementRef) : children;

  // ============================= Size =============================
  const sizeRef = useRef({
    width: -1,
    height: -1,
    offsetWidth: -1,
    offsetHeight: -1,
  });

  // ============================= Ref ==============================
  const canRef = !isRenderProps && isValidElement(mergedChildren) && supportRef(mergedChildren);

  const originRef: Ref<Element> = canRef ? (mergedChildren as any).ref : null;
  const mergedRef = useMemo(() => composeRef<Element>(originRef, elementRef), [originRef, elementRef]);

  // =========================== Observe ============================
  const propsRef = useRef<SingleObserverProps>(props);
  propsRef.current = props;

  // Handler
  const onInternalResize = useCallback<ResizeListener>((target: Element) => {
    const { onResize, data } = propsRef.current;

    const { width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    /**
     * Resize observer trigger when content size changed.
     * In most case we just care about element size,
     * let's use `boundary` instead of `contentRect` here to avoid shaking.
     */
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);

    if (
      sizeRef.current.width !== fixedWidth ||
      sizeRef.current.height !== fixedHeight ||
      sizeRef.current.offsetWidth !== offsetWidth ||
      sizeRef.current.offsetHeight !== offsetHeight
    ) {
      const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };
      sizeRef.current = size;

      // IE is strange, right?
      const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
      const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;

      const sizeInfo = {
        ...size,
        offsetWidth: mergedOffsetWidth,
        offsetHeight: mergedOffsetHeight,
      };

      // Let collection know what happened
      onCollectionResize?.(sizeInfo, target as HTMLElement, data);

      if (onResize) {
        // defer the callback but not defer to next frame
        Promise.resolve().then(() => {
          onResize(sizeInfo, target as HTMLElement);
        });
      }
    }
  }, []);

  // Dynamic observe
  useEffect(() => {
    // 当 children 不能 挂 ref 的时候 才需要 wrapperRef
    // 因为不知道 elementRef.current 到底是不是 DOM Node 节点，所以用 findDOMNode 包一层比较保险
    const currentElement = findDOMNode(elementRef.current) || findDOMNode(wrapperRef.current);

    if (currentElement && !disabled) {
      observe(currentElement as HTMLElement, onInternalResize);
    }

    return () => unobserve(currentElement as Element, onInternalResize);
  }, [elementRef.current, disabled]);

  return (
    <DomWrapper ref={wrapperRef}>
      {canRef
        ? cloneElement(mergedChildren as any, {
            ref: mergedRef,
          })
        : mergedChildren}
    </DomWrapper>
  );
}

export default SingleObserver;
