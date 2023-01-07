import { forwardRef, isValidElement, ReactNode } from 'react';
import type { TabBarExtraPosition, TabBarExtraContent, TabBarExtraMap } from '../interface';

interface ExtraContentProps {
  position: TabBarExtraPosition;
  extra?: TabBarExtraContent;
}

const ExtraContent = forwardRef<HTMLDivElement, ExtraContentProps>(({ position, extra }, ref) => {
  if (!extra) return null;

  let content: ReactNode;

  // Parse extra
  let assertExtra: TabBarExtraMap = {};
  if (typeof extra === 'object' && !isValidElement(extra)) {
    assertExtra = extra as TabBarExtraMap;
  } else {
    assertExtra.right = extra;
  }

  if (position === 'right') {
    content = assertExtra.right;
  }

  if (position === 'left') {
    content = assertExtra.left;
  }

  if (!content) return null;

  return (
    <div className="extra-content" ref={ref}>
      {content}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  ExtraContent.displayName = 'ExtraContent';
}

export default ExtraContent;
