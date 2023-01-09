import TabNavList, { type TabNavListProps } from './';

export type TabNavListWrapperProps = Required<
  Omit<
    TabNavListProps,
    | 'children'
    | 'className'
    | 'renderTabBar'
    | 'style'
    | 'editable'
    | 'extra'
    | 'tabBarGutter'
    | 'onTabScroll'
    | 'popupClassName'
  >
> &
  TabNavListProps;

function TabNavListWrapper({ renderTabBar, ...restProps }: TabNavListWrapperProps) {
  if (renderTabBar) return renderTabBar(restProps, TabNavList);
  return <TabNavList {...restProps} />;
}

export default TabNavListWrapper;
