import classnames from 'classnames';
import type { CSSProperties, FocusEventHandler, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import KeyCode from '../../../utils/KeyCode';
import type { EditableConfig, Tab } from '../interface';

interface TabNodeProps {
  active: boolean;
  closable?: boolean;
  editable?: EditableConfig;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
  onFocus: FocusEventHandler;
  onResize?: (width: number, height: number, left: number, top: number) => void;
  removeIcon?: ReactNode;
  renderWrapper?: (node: ReactElement) => ReactElement;
  style?: CSSProperties;
  tab: Tab;
}

function TabNode({
  active,
  tab: { key, label, disabled, closeIcon },
  closable,
  renderWrapper,
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

  function onRemoveTab(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    editable!.onEdit('remove', {
      key,
      event,
    });
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

      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          aria-label="remove"
          tabIndex={0}
          className={`${tabPrefix}-remove`}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveTab(e);
          }}
        >
          {closeIcon || editable.removeIcon || '×'}
        </button>
      )}
    </div>
  );

  if (renderWrapper) return renderWrapper(node);
  return node;
}

export default TabNode;
