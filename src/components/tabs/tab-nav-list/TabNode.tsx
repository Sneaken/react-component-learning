import classnames from 'classnames';
import type { MouseEvent, KeyboardEvent, ReactElement, ReactNode, FocusEventHandler, CSSProperties } from 'react';
import KeyCode from '../../../utils/KeyCode';
import type { EditableConfig, Tab } from '../interface';

interface TabNodeProps {
  active: boolean;
  closable?: boolean;
  editable?: EditableConfig;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
  onFocus: FocusEventHandler;
  onResize?: (width: number, height: number, left: number, top: number) => void;
  removeAriaLabel?: string;
  removeIcon?: ReactNode;
  renderWrapper?: (node: ReactElement) => ReactElement;
  style?: CSSProperties;
  tab: Tab;
}

function TabNode({
  active,
  tab: { key, label, disabled },
  closable,
  renderWrapper,
  removeAriaLabel,
  editable,
  onClick,
  onFocus,
  style,
}: TabNodeProps) {
  const tabPrefix = `tabs-tab`;

  const removable = editable && closable !== false && !disabled;

  function onInternalClick(e: MouseEvent | KeyboardEvent) {
    if (disabled) return;
    onClick?.(e);
  }

  const node: ReactElement = (
    <div
      key={key}
      data-node-key={key}
      className={classnames(tabPrefix, {
        [`${tabPrefix}-with-remove`]: removable,
        [`${tabPrefix}-active`]: active,
        [`${tabPrefix}-disabled`]: disabled,
      })}
      style={style}
      onClick={onInternalClick}
    >
      {/* Primary Tab Button */}
      <div
        role="tab"
        aria-selected={active}
        className={`${tabPrefix}-btn`}
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : 0}
        onClick={(e) => {
          e.stopPropagation();
          onInternalClick(e);
        }}
        onKeyDown={(e) => {
          if ([KeyCode.SPACE, KeyCode.ENTER].includes(e.which)) {
            e.preventDefault();
            onInternalClick(e);
          }
        }}
        onFocus={onFocus}
      >
        {label}
      </div>

      {/*/!* Remove Button *!/*/}
      {/*{removable && (*/}
      {/*  <button*/}
      {/*    type="button"*/}
      {/*    aria-label={removeAriaLabel || 'remove'}*/}
      {/*    tabIndex={0}*/}
      {/*    className={`${tabPrefix}-remove`}*/}
      {/*    onClick={(e) => {*/}
      {/*      e.stopPropagation();*/}
      {/*      onRemoveTab(e);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {closeIcon || editable.removeIcon || '×'}*/}
      {/*  </button>*/}
      {/*)}*/}
    </div>
  );

  if (renderWrapper) return renderWrapper(node);
  return node;
}

export default TabNode;
