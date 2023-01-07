import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { SizeInfo } from './';

type onCollectionResize = (size: SizeInfo, element: HTMLElement, data: any) => void;

export const CollectionContext = createContext<onCollectionResize | null>(null);

export interface ResizeInfo {
  size: SizeInfo;
  data: any;
  element: HTMLElement;
}
export interface CollectionProps {
  children?: ReactNode;
  onBatchResize?: (resizeInfo: ResizeInfo[]) => void;
}

function Collection({ children, onBatchResize }: CollectionProps) {
  const resizeIdRef = useRef(0);
  const resizeInfosRef = useRef<ResizeInfo[]>([]);

  const onCollectionResize = useContext(CollectionContext);

  const onResize = useCallback<onCollectionResize>(
    (size, element, data) => {
      resizeIdRef.current += 1;
      const currentId = resizeIdRef.current;

      resizeInfosRef.current.push({
        size,
        element,
        data,
      });

      Promise.resolve().then(() => {
        if (currentId === resizeIdRef.current) {
          onBatchResize?.(resizeInfosRef.current);
          resizeInfosRef.current = [];
        }
      });

      // Continue bubbling if parent exist
      onCollectionResize?.(size, element, data);
    },
    [onBatchResize, onCollectionResize]
  );

  return <CollectionContext.Provider value={onResize}>{children}</CollectionContext.Provider>;
}

export default Collection;
