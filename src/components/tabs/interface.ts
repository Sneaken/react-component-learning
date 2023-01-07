import type { CSSMotionProps } from 'rc-motion';
import type { ComponentType, CSSProperties, Key, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import type { TabNavListProps } from './tab-nav-list';
import type { TabPaneProps } from './tab-panel-list/TabPane';

export type SizeInfo = [width: number, height: number];

export type TabSizeMap = Map<Key, { width: number; height: number; left: number; top: number }>;

export interface TabOffset {
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}
export type TabOffsetMap = Map<Key, TabOffset>;

export type TabPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Tab extends TabPaneProps {
  key: string;
  label: ReactNode;
}

type RenderTabBarProps = {
  activeKey: string;
  animated: AnimatedConfig;
  extra: TabBarExtraContent;
  moreIcon: ReactNode;
  moreTransitionName: string;
  onTabClick: (key: string, e: MouseEvent | KeyboardEvent) => void;
  onTabScroll: OnTabScroll;
  style: CSSProperties;
  tabBarGutter: number;
  tabPosition: TabPosition;
};

export type RenderTabBar = (
  props: Omit<RenderTabBarProps, 'renderTabBar'>,
  DefaultTabBar: ComponentType<TabNavListProps>
) => ReactElement;

export interface TabsLocale {
  addAriaLabel?: string;
  dropdownAriaLabel?: string;
  removeAriaLabel?: string;
}

export interface EditableConfig {
  addIcon?: ReactNode;
  onEdit: (type: 'add' | 'remove', info: { key?: string; event: MouseEvent | KeyboardEvent }) => void;
  removeIcon?: ReactNode;
  showAdd?: boolean;
}

export interface AnimatedConfig {
  inkBar?: boolean;
  tabPane?: boolean;
  tabPaneMotion?: CSSMotionProps;
}

export type OnTabScroll = (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;

export type TabBarExtraPosition = 'left' | 'right';

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, ReactNode>>;

export type TabBarExtraContent = ReactNode | TabBarExtraMap;
