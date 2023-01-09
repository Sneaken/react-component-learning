import { forwardRef } from 'react';
import type { CSSProperties, Ref } from 'react';
import type { EditableConfig } from '../interface';

export interface AddButtonProps {
  editable?: EditableConfig;
  style?: CSSProperties;
}

function AddButton({ editable, style }: AddButtonProps, ref: Ref<HTMLButtonElement>) {
  if (!editable || editable.showAdd === false) return null;

  return (
    <button
      ref={ref}
      type="button"
      className="tabs-nav-add"
      style={style}
      aria-label="Add tab"
      onClick={(event) => {
        editable.onEdit('add', {
          event,
        });
      }}
    >
      {editable.addIcon || '+'}
    </button>
  );
}

export default forwardRef(AddButton);
