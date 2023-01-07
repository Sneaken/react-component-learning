import { type Ref, useRef } from 'react';
import { isMemo } from 'react-is';

export function fillRef<T>(ref: Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && Object.hasOwn(ref, 'current')) {
    // MutableRefObject
    (ref as any).current = node;
  }
}

/**
 * Merge refs into one ref function to support ref passing.
 */
export function composeRef<T>(...refs: Ref<T>[]): Ref<T> {
  const refList = refs.filter((ref) => ref);
  if (refList.length <= 1) return refList[0];

  return (node: T) => {
    refs.forEach((ref) => {
      fillRef(ref, node);
    });
  };
}

interface Cache<Value, Condition> {
  condition?: Condition;
  value?: Value;
}

export function useComposeRef<T>(...refs: Ref<T>[]): Ref<T> | undefined {
  const cacheRef = useRef<Cache<Ref<T>, Ref<T>[]>>({});
  const shouldUpdate = (prev: Ref<T>[], next: Ref<T>[]) =>
    prev.length === next.length && prev.every((ref, i) => ref === next[i]);

  if (!Object.hasOwn(cacheRef.current, 'value') || shouldUpdate(cacheRef.current.condition!, refs)) {
    cacheRef.current.value = composeRef(...refs);
    cacheRef.current.condition = refs;
  }

  return cacheRef.current.value;
}

export function supportRef(nodeOrComponent: any): boolean {
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;
  // Function component node 不是 forwardRef 包裹的时候是不能挂载 ref 的
  if (typeof type === 'function' && !type.prototype?.render) return false;
  // Class component 没有 render 函数也是一样
  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) return false;
  return true;
}
