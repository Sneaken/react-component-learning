import classnames from 'classnames';
import { forwardRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type TabPaneProps = {
  tab?: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  children?: ReactNode;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: ReactNode;

  // Pass by TabPaneList
  tabKey?: string;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
};

const TabPane = forwardRef<HTMLDivElement, TabPaneProps>(({ className, style, active, children, tabKey }, ref) => {
  return (
    <div
      role="tabpanel"
      tabIndex={active ? 0 : -1}
      style={style}
      className={classnames('tabs', active && 'tabs-active', className)}
      ref={ref}
    >
      {children}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  TabPane.displayName = 'TabPane';
}

export default TabPane;
