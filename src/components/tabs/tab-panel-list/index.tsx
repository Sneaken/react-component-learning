import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import React, { useContext } from 'react';
import { AnimatedConfig, TabPosition } from '../interface';
import TabContext from '../TabContext';
import TabPane from './TabPane';

interface TabPanelListProps {
  activeKey: string;
  animated?: AnimatedConfig;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;
}

function TabPanelList({ activeKey, animated, tabPosition, destroyInactiveTabPane }: TabPanelListProps) {
  const { tabs } = useContext(TabContext);

  const tabPanePrefixCls = `tabs-tabpane`;

  return (
    <div className="tabs-content-holder">
      <div
        className={classnames('tabs-content', `tabs-content-${tabPosition}`, {
          [`tabs-content-animated`]: animated?.tabPane,
        })}
      >
        {tabs.map(({ key, forceRender, style: paneStyle, className: paneClassName, ...restTabProps }) => {
          const active = key === activeKey;

          return (
            <CSSMotion
              key={key}
              visible={active}
              forceRender={forceRender}
              removeOnLeave={!!destroyInactiveTabPane}
              leavedClassName={`${tabPanePrefixCls}-hidden`}
              {...animated?.tabPaneMotion}
            >
              {({ style: motionStyle, className: motionClassName }, ref) => {
                return (
                  <TabPane
                    {...restTabProps}
                    active={active}
                    style={{
                      ...paneStyle,
                      ...motionStyle,
                    }}
                    className={classnames(paneClassName, motionClassName)}
                    ref={ref}
                  />
                );
              }}
            </CSSMotion>
          );
        })}
      </div>
    </div>
  );
}

export default TabPanelList;
