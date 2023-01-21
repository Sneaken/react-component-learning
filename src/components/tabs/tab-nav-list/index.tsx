import classnames from 'classnames';
import type {
  CSSProperties,
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
  SetStateAction,
} from 'react';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { ResizeObserver } from '../..';
import raf from '../../../utils/raf';
import { useComposeRef } from '@/utils/ref';
import { stringify } from '@/utils/stringify';
import useOffsets from '../hooks/useOffsets';
import useRaf, { useRafState } from '../hooks/useRaf';
import useSyncState from '../hooks/useSyncState';
import useTouchMove from '../hooks/useTouchMove';
import useVisibleRange from '../hooks/useVisibleRange';
import type {
  AnimatedConfig,
  EditableConfig,
  OnTabScroll,
  RenderTabBar,
  SizeInfo,
  TabBarExtraContent,
  TabPosition,
  TabSizeMap,
} from '../interface';
import TabContext from '../TabContext';
import AddButton from './AddButton';
import ExtraContent from './ExtraContent';
import OperationNode from './OperationNode';
import TabNode from './TabNode';

export interface TabNavListProps {
  activeKey: string;
  animated?: AnimatedConfig;
  centered?: boolean;
  children?: (node: ReactElement) => ReactElement;
  className?: string;
  editable?: EditableConfig;
  extra?: TabBarExtraContent;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  moreIcon?: ReactNode;
  moreTransitionName?: string;
  onTabClick: (activeKey: string, e: MouseEvent | KeyboardEvent) => void;
  onTabScroll?: OnTabScroll;
  popupClassName?: string;
  renderTabBar?: RenderTabBar;
  rtl: boolean;
  style?: CSSProperties;
  tabBarGutter?: number;
  tabPosition: TabPosition;
}

const getSize = (refObj: RefObject<HTMLElement>): SizeInfo => {
  const { offsetWidth = 0, offsetHeight = 0 } = refObj.current || {};
  return [offsetWidth, offsetHeight];
};

const getUnitValue = (size: SizeInfo, tabPositionTopOrBottom: boolean) => {
  return size[tabPositionTopOrBottom ? 0 : 1];
};

function TabNavList(props: TabNavListProps, ref: Ref<HTMLDivElement>) {
  const {
    activeKey,
    animated,
    centered,
    children,
    editable,
    extra,
    onTabClick,
    onTabScroll,
    rtl,
    style,
    tabBarGutter,
    tabPosition,
  } = props;
  const { tabs } = useContext(TabContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const extraLeftRef = useRef<HTMLDivElement>(null);
  const extraRightRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const operationsRef = useRef<HTMLDivElement>(null);
  const innerAddButtonRef = useRef<HTMLButtonElement>(null);

  const tabPositionTopOrBottom = tabPosition === 'top' || tabPosition === 'bottom';

  const [transformLeft, setTransformLeft] = useSyncState(0, (next, prev) => {
    if (tabPositionTopOrBottom && onTabScroll) {
      onTabScroll({ direction: next > prev ? 'left' : 'right' });
    }
  });
  const [transformTop, setTransformTop] = useSyncState(0, (next, prev) => {
    if (!tabPositionTopOrBottom && onTabScroll) {
      onTabScroll({ direction: next > prev ? 'top' : 'bottom' });
    }
  });

  const [containerExcludeExtraSize, setContainerExcludeExtraSize] = useState<SizeInfo>([0, 0]);
  const [tabContentSize, setTabContentSize] = useState<SizeInfo>([0, 0]);
  const [addSize, setAddSize] = useState<SizeInfo>([0, 0]);
  const [operationSize, setOperationSize] = useState<SizeInfo>([0, 0]);

  const [tabSizes, setTabSizes] = useRafState<TabSizeMap>(new Map());
  const tabOffsets = useOffsets(tabs, tabSizes, tabContentSize[0]);

  // ========================== Unit =========================
  const containerExcludeExtraSizeValue = getUnitValue(containerExcludeExtraSize, tabPositionTopOrBottom);
  const tabContentSizeValue = getUnitValue(tabContentSize, tabPositionTopOrBottom);
  const addSizeValue = getUnitValue(addSize, tabPositionTopOrBottom);
  const operationSizeValue = getUnitValue(operationSize, tabPositionTopOrBottom);

  const needScroll = containerExcludeExtraSizeValue < tabContentSizeValue + addSizeValue;
  const visibleTabContentValue = needScroll
    ? containerExcludeExtraSizeValue - operationSizeValue
    : containerExcludeExtraSizeValue - addSizeValue;

  // ========================== Util =========================
  const operationsHiddenClassName = `tabs-nav-operations-hidden`;

  let transformMin = 0;
  let transformMax = 0;

  if (!tabPositionTopOrBottom) {
    transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
    transformMax = 0;
  } else if (rtl) {
    transformMin = 0;
    transformMax = Math.max(0, tabContentSizeValue - visibleTabContentValue);
  } else {
    transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
    transformMax = 0;
  }

  if (centered) {
    transformMin = Math.min(0, (visibleTabContentValue - tabContentSizeValue) / 2);
    transformMax = -transformMin;
  }

  function alignInRange(value: number): number {
    if (value < transformMin) return transformMin;
    if (value > transformMax) return transformMax;
    return value;
  }

  // ========================= Mobile ========================
  const touchMovingRef = useRef<number>();
  const [lockAnimation, setLockAnimation] = useState<number>();

  function doLockAnimation() {
    setLockAnimation(Date.now());
  }

  function clearTouchMoving() {
    window.clearTimeout(touchMovingRef.current);
  }

  useTouchMove(tabsWrapperRef, (offsetX, offsetY) => {
    function doMove(setState: Dispatch<SetStateAction<number>>, offset: number) {
      setState((value) => alignInRange(value + offset));
    }

    // Skip scroll if place is enough
    if (containerExcludeExtraSizeValue >= tabContentSizeValue) return false;

    if (tabPositionTopOrBottom) {
      doMove(setTransformLeft, offsetX);
    } else {
      doMove(setTransformTop, offsetY);
    }

    clearTouchMoving();
    doLockAnimation();

    return true;
  });

  useEffect(() => {
    clearTouchMoving();
    if (lockAnimation) {
      touchMovingRef.current = window.setTimeout(() => {
        setLockAnimation(0);
      }, 100);
    }
    return clearTouchMoving;
  }, [lockAnimation]);

  // ===================== Visible Range =====================
  // Render tab node & collect tab offset
  const [visibleStart, visibleEnd] = useVisibleRange(
    tabOffsets,
    // Container
    visibleTabContentValue,
    // Transform
    tabPositionTopOrBottom ? transformLeft : transformTop,
    // Tabs
    tabContentSizeValue,
    // Add
    addSizeValue,
    // Operation
    operationSizeValue,
    { ...props, tabs }
  );

  // ======================== Dropdown =======================
  const startHiddenTabs = tabs.slice(0, visibleStart);
  const endHiddenTabs = tabs.slice(visibleEnd + 1);
  const hiddenTabs = [...startHiddenTabs, ...endHiddenTabs];

  // ========================= Scroll ========================
  const scrollToTab = (key = activeKey) => {
    const tabOffset = tabOffsets.get(key) || {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    if (tabPositionTopOrBottom) {
      // ============ Align with top & bottom ============
      let newTransform = transformLeft;

      if (centered) {
        // 最左边被遮住
        if (tabOffset.left < transformMax - transformLeft) {
          newTransform = transformMax - tabOffset.left;
        }
        // 最右边被遮住
        else if (tabOffset.left + tabOffset.width > transformMax - transformLeft + visibleTabContentValue) {
          newTransform = transformMax - (tabOffset.left + tabOffset.width - visibleTabContentValue);
        }
      } else {
        // RTL
        if (rtl) {
          if (tabOffset.right < transformLeft) {
            newTransform = tabOffset.right;
          } else if (tabOffset.right + tabOffset.width > transformLeft + visibleTabContentValue) {
            newTransform = tabOffset.right + tabOffset.width - visibleTabContentValue;
          }
        }
        // LTR
        // 左侧被遮住
        else if (tabOffset.left < -transformLeft) {
          newTransform = -tabOffset.left;
        }
        // 右侧被遮住
        else if (tabOffset.left + tabOffset.width > -transformLeft + visibleTabContentValue) {
          newTransform = -(tabOffset.left + tabOffset.width - visibleTabContentValue);
        }
      }

      setTransformTop(0);
      setTransformLeft(alignInRange(newTransform));
    } else {
      // ============ Align with left & right ============
      let newTransform = transformTop;

      if (tabOffset.top < -transformTop) {
        newTransform = -tabOffset.top;
      } else if (tabOffset.top + tabOffset.height > -transformTop + visibleTabContentValue) {
        newTransform = -(tabOffset.top + tabOffset.height - visibleTabContentValue);
      }

      setTransformLeft(0);
      setTransformTop(alignInRange(newTransform));
    }
  };

  // ========================== Tab ==========================
  const tabNodeStyle: CSSProperties = {};
  if (tabPosition === 'top' || tabPosition === 'bottom') {
    tabNodeStyle[rtl ? 'marginRight' : 'marginLeft'] = tabBarGutter;
  } else {
    tabNodeStyle.marginTop = tabBarGutter;
  }

  const tabNodes: ReactElement[] = tabs.map((tab, i) => {
    const { key } = tab;
    return (
      <TabNode
        key={key}
        tab={tab}
        /* first node should not have margin left */
        style={i === 0 ? undefined : tabNodeStyle}
        closable={tab.closable}
        editable={editable}
        active={key === activeKey}
        renderWrapper={children}
        onClick={(e) => {
          onTabClick?.(key, e);
        }}
        onFocus={() => {
          scrollToTab(key);
          if (!tabsWrapperRef.current) return;
          // Focus element will make scrollLeft change which we should reset back
          if (!rtl) {
            tabsWrapperRef.current.scrollLeft = 0;
          }
          tabsWrapperRef.current.scrollTop = 0;
        }}
      />
    );
  });

  // Update buttons records
  const updateTabSizes = () => {
    if (!tabListRef.current) return;
    setTabSizes(() => {
      const newSizes: TabSizeMap = new Map();
      tabs.forEach(({ key }) => {
        const btnNode = tabListRef.current?.querySelector<HTMLElement>(`[data-node-key="${key}"]`);
        if (btnNode) {
          newSizes.set(key, {
            width: btnNode.offsetWidth,
            height: btnNode.offsetHeight,
            left: btnNode.offsetLeft,
            top: btnNode.offsetTop,
          });
        }
      });
      return newSizes;
    });
  };

  useEffect(() => {
    updateTabSizes();
  }, [tabs.map((tab) => tab.key).join('_'), activeKey]);

  const onListHolderResize = useRaf(() => {
    // Update wrapper records
    const containerSize = getSize(containerRef);
    const extraLeftSize = getSize(extraLeftRef);
    const extraRightSize = getSize(extraRightRef);
    setContainerExcludeExtraSize([
      containerSize[0] - extraLeftSize[0] - extraRightSize[0],
      containerSize[1] - extraLeftSize[1] - extraRightSize[1],
    ]);

    const newAddSize = getSize(innerAddButtonRef);
    setAddSize(newAddSize);

    const newOperationSize = getSize(operationsRef);
    setOperationSize(newOperationSize);

    // Which includes add button size
    const tabContentFullSize = getSize(tabListRef);
    setTabContentSize([tabContentFullSize[0] - newAddSize[0], tabContentFullSize[1] - newAddSize[1]]);

    // Update buttons records
    updateTabSizes();
  });

  // =================== Link & Operations ===================
  const [inkStyle, setInkStyle] = useState<CSSProperties>();

  const activeTabOffset = tabOffsets.get(activeKey);

  // Delay set ink style to avoid remove tab blink
  const inkBarRafRef = useRef<number>();

  function cleanInkBarRaf() {
    inkBarRafRef.current && raf.cancel(inkBarRafRef.current);
  }

  useEffect(() => {
    const newInkStyle: CSSProperties = {};

    if (activeTabOffset) {
      if (tabPositionTopOrBottom) {
        if (rtl) {
          newInkStyle.right = activeTabOffset.right;
        } else {
          newInkStyle.left = activeTabOffset.left;
        }

        newInkStyle.width = activeTabOffset.width;
      } else {
        newInkStyle.top = activeTabOffset.top;
        newInkStyle.height = activeTabOffset.height;
      }
    }

    cleanInkBarRaf();
    inkBarRafRef.current = raf(() => {
      setInkStyle(newInkStyle);
    });

    return cleanInkBarRaf;
  }, [activeTabOffset, tabPositionTopOrBottom, rtl]);

  // ========================= Effect ========================
  useEffect(() => {
    scrollToTab();
  }, [
    activeKey,
    centered,
    stringify(activeTabOffset!),
    stringify(tabOffsets),
    tabPositionTopOrBottom,
    tabContentSizeValue,
  ]);

  // Should recalculate when rtl changed
  useEffect(() => {
    onListHolderResize();
  }, [rtl]);

  // ========================= Render ========================
  const hasDropdown = !!hiddenTabs.length;
  const wrapPrefix = 'tabs-nav-wrap';
  let pingLeft: boolean = false;
  let pingRight: boolean = false;
  let pingTop: boolean = false;
  let pingBottom: boolean = false;

  if (tabPositionTopOrBottom) {
    if (rtl) {
      pingRight = transformLeft > 0;
      pingLeft = transformLeft + containerExcludeExtraSizeValue < tabContentSizeValue;
    } else {
      pingLeft = transformLeft < 0;
      pingRight = -transformLeft + containerExcludeExtraSizeValue < tabContentSizeValue;
    }
  } else {
    pingTop = transformTop < 0;
    pingBottom = -transformTop + containerExcludeExtraSizeValue < tabContentSizeValue;
  }

  return (
    <ResizeObserver onResize={onListHolderResize}>
      <div ref={useComposeRef(ref, containerRef)!} role="tablist" className="tabs-nav" style={style}>
        <ExtraContent ref={extraLeftRef} position="left" extra={extra} />
        <div
          className={classnames(wrapPrefix, {
            [`${wrapPrefix}-ping-left`]: pingLeft,
            [`${wrapPrefix}-ping-right`]: pingRight,
            [`${wrapPrefix}-ping-top`]: pingTop,
            [`${wrapPrefix}-ping-bottom`]: pingBottom,
          })}
          ref={tabsWrapperRef}
        >
          <ResizeObserver onResize={onListHolderResize}>
            <div
              ref={tabListRef}
              className="tabs-nav-list"
              style={{
                transform: `translate(${transformLeft}px, ${transformTop}px)`,
                transition: lockAnimation ? 'none' : undefined,
              }}
            >
              {tabNodes}
              <AddButton
                ref={innerAddButtonRef}
                editable={editable}
                style={{
                  ...(tabNodes.length === 0 ? undefined : tabNodeStyle),
                  visibility: hasDropdown ? 'hidden' : undefined,
                }}
              />

              <div
                className={classnames(`tabs-ink-bar`, {
                  [`tabs-ink-bar-animated`]: animated?.inkBar,
                })}
                style={inkStyle}
              />
            </div>
          </ResizeObserver>
        </div>

        <OperationNode
          id={''}
          mobile={false}
          {...props}
          ref={operationsRef}
          tabs={hiddenTabs}
          className={classnames({ [operationsHiddenClassName]: !hasDropdown })}
          tabMoving={!!lockAnimation}
        />
        <ExtraContent ref={extraRightRef} position="right" extra={extra} />
      </div>
    </ResizeObserver>
  );
}

export default forwardRef(TabNavList);
