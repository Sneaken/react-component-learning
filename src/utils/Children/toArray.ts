import { isFragment } from 'react-is';
import { Children, ReactElement, ReactNode } from 'react';

export interface Option {
  keepEmpty?: boolean;
}

export default function toArray(children: ReactNode, option: Option = {}): ReactElement[] {
  let ret: ReactElement[] = [];

  Children.forEach(children, (child: any | any[]) => {
    if ((child === undefined || child === null) && !option.keepEmpty) return;

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, option));
    } else {
      ret.push(child);
    }
  });

  return ret;
}
