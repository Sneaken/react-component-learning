import { CloseOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useMergedState from '../../utils/hooks/useMergedState';
import useAnimateConfig from './hooks/useAnimateConfig';
import type { AnimatedConfig, EditableConfig, RenderTabBar, Tab, TabBarExtraContent } from './interface';
import { OnTabScroll } from './interface';
import './style/index.css';
import TabNavListWrapper from './tab-nav-list/wrapper';
import TabPanelList from './tab-panel-list';
import TabContext from './TabContext';

export type TabsType = 'line' | 'card' | 'editable-card';
export type SizeType = 'small' | 'middle' | 'large';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  activeKey?: string;
  addIcon?: ReactNode;
  animated?: boolean | AnimatedConfig;
  centered?: boolean;
  defaultActiveKey?: string;
  destroyInactiveTabPane?: boolean;
  direction?: 'ltr' | 'rtl';
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  hideAdd?: boolean;
  items?: Tab[];
  onChange?: (activeKey: string) => void;
  onEdit?: (e: MouseEvent | KeyboardEvent | string, action: 'add' | 'remove') => void;
  onTabClick?: (key: string, event: MouseEvent) => void;
  popupClassName?: string;
  renderTabBar?: RenderTabBar;
  size?: SizeType;
  tabBarGutter?: number;
  tabBarStyle?: CSSProperties;
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  type?: TabsType;

  moreIcon?: ReactNode;
  onTabScroll?: OnTabScroll;
  tabBarExtraContent?: TabBarExtraContent;
}

function Tabs(props: TabsProps, ref: Ref<HTMLDivElement>) {
  const {
    activeKey,
    addIcon,
    animated = { inkBar: true, tabPane: false },
    centered = false,
    className,
    defaultActiveKey,
    destroyInactiveTabPane,
    direction = 'ltr',
    getPopupContainer = () => document.body,
    hideAdd,
    items,
    onChange,
    onEdit,
    onTabClick,
    popupClassName,
    renderTabBar,
    size,
    tabBarGutter,
    tabBarStyle,
    tabPosition = 'top',
    type = 'line',
    moreIcon = <EllipsisOutlined />,
    onTabScroll,
    tabBarExtraContent,
    ...restProps
  } = props;
  const tabs = useMemo(
    () => (items || []).filter((item) => item && typeof item === 'object' && Object.hasOwn(item, 'key')),
    [items]
  );
  const rtl = direction === 'rtl';

  const mergedAnimated = useAnimateConfig(animated);

  let editable: EditableConfig | undefined;
  if (type === 'editable-card') {
    editable = {
      onEdit: (editType, { key, event }) => {
        onEdit?.(editType === 'add' ? event : key!, editType);
      },
      removeIcon: <CloseOutlined />,
      addIcon: addIcon || <PlusOutlined />,
      showAdd: hideAdd !== true,
    };
  }

  // ====================== Active Key ======================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<string>(() => tabs[0]?.key, {
    value: activeKey,
    defaultValue: defaultActiveKey,
  });
  const [activeIndex, setActiveIndex] = useState(() => tabs.findIndex((tab) => tab.key === mergedActiveKey));

  // Reset active key if not exist anymore
  useEffect(() => {
    let newActiveIndex = tabs.findIndex((tab) => tab.key === mergedActiveKey);
    if (newActiveIndex === -1) {
      newActiveIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1));
      setMergedActiveKey(tabs[newActiveIndex]?.key);
    }
    setActiveIndex(newActiveIndex);
  }, [tabs.map((tab) => tab.key).join('_'), mergedActiveKey, activeIndex]);

  // ======================== Events ========================
  function onInternalTabClick(key: string, e: MouseEvent | KeyboardEvent) {
    onTabClick?.(key, e as MouseEvent);
    const isActiveChanged = key !== mergedActiveKey;
    setMergedActiveKey(key);
    isActiveChanged && onChange?.(key);
  }

  // ======================== Render ========================
  const sharedProps = {
    activeKey: mergedActiveKey,
    animated: mergedAnimated,
    rtl,
    tabPosition,
  };
  const tabNavBarProps = {
    ...sharedProps,
    editable,
    extra: tabBarExtraContent,
    getPopupContainer,
    moreIcon,
    moreTransitionName: 'slide-up',
    onTabClick: onInternalTabClick,
    onTabScroll,
    panes: null,
    popupClassName,
    style: tabBarStyle,
    tabBarGutter,
  };
  return (
    <TabContext.Provider value={{ tabs }}>
      <div
        className={classnames(
          'tabs',
          `tabs-${tabPosition}`,
          {
            [`tabs-${size}`]: size,
            [`tabs-card`]: ['card', 'editable-card'].includes(type),
            [`tabs-centered`]: centered,
            [`tabs-editable-card`]: type === 'editable-card',
            [`tabs-editable`]: !!editable,
            [`tabs-rtl`]: rtl,
          },
          className
        )}
        ref={ref}
        {...restProps}
      >
        <TabNavListWrapper {...tabNavBarProps} renderTabBar={renderTabBar} />
        <TabPanelList destroyInactiveTabPane={destroyInactiveTabPane} {...sharedProps} animated={mergedAnimated} />
      </div>
    </TabContext.Provider>
  );
}

export default forwardRef(Tabs);
