import Wave from '@/components/wave';
import omit from '@/utils/omit';
import { warning } from '@/utils/warning';
import classnames from 'classnames';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { createRef, forwardRef, useEffect, useState } from 'react';
import LoadingIcon from './LoadingIcon';

import './style/index.less';

export type SizeType = 'small' | 'middle' | 'large';

export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text';

export type ButtonShape = 'default' | 'circle' | 'round';

export interface BaseButtonProps {
  // 将按钮宽度调整为其父宽度的选项
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  // 使按钮背景透明
  ghost?: boolean;
  href?: string;
  htmlType?: string;
  icon?: ReactNode;
  loading?: boolean | { delay?: number };
  onClick?: (event: MouseEvent) => void;
  shape?: ButtonShape;
  size?: SizeType;
  target?: string;
  type?: ButtonType;
}

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
  Omit<AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonHTMLType = 'submit' | 'button' | 'reset';

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
  Omit<ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

type Loading = number | boolean;

function isUnBorderedButtonType(type: ButtonType | undefined) {
  return type === 'text' || type === 'link';
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function InternalButton(props, ref) {
  const {
    block = false,
    children,
    className,
    danger,
    disabled,
    ghost,
    htmlType = 'button' as ButtonProps['htmlType'],
    icon,
    loading = false,
    shape = 'default',
    size = 'middle',
    type = 'default',
    ...rest
  } = props;

  const [innerLoading, setLoading] = useState<Loading>(!!loading);
  // 如果外部没绑定 ref
  // 但是为什么用 createRef
  const buttonRef = (ref as any) || createRef<HTMLButtonElement | HTMLAnchorElement>();

  // =============== Update Loading ===============
  const loadingOrDelay: Loading = typeof loading === 'boolean' ? loading : loading?.delay || true;

  useEffect(() => {
    let delayTimer: number | null = null;

    if (typeof loadingOrDelay === 'number') {
      delayTimer = window.setTimeout(() => {
        delayTimer = null;
        setLoading(loadingOrDelay);
      }, loadingOrDelay);
    } else {
      setLoading(loadingOrDelay);
    }

    return () => {
      if (!delayTimer) return;
      window.clearTimeout(delayTimer);
      delayTimer = null;
    };
  }, [loadingOrDelay]);

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    if (innerLoading || disabled) {
      e.preventDefault();
      return;
    }
    (onClick as MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  if (process.env.NODE_ENV !== 'production') {
    switch (size) {
      case 'large':
      case 'small':
      case 'middle':
      case undefined:
        break;
      default:
        warning(!size, 'Button', 'Invalid prop `size`.');
    }
  }

  warning(!(ghost && isUnBorderedButtonType(type)), 'Button', "`link` or `text` button can't be a `ghost` button.");

  // react-router 里面 Link 组件 允许使用自定义 组件 需要透传 navigate （可能是旧版本的react-router-dom 待定）
  const linkButtonRestProps = omit(rest as AnchorButtonProps & { navigate: any }, ['navigate']);

  const hrefAndDisabled = linkButtonRestProps.href !== undefined && disabled;

  const iconType = innerLoading ? 'loading' : icon;

  const _className = classnames(
    'btn',
    {
      'btn-background-ghost': ghost && !isUnBorderedButtonType(type),
      'btn-block': block,
      'btn-dangerous': !!danger,
      'btn-disabled': hrefAndDisabled,
      'btn-icon-only': !children && children !== 0 && iconType,
      'btn-loading': innerLoading,
      // 'btn-rtl': direction === 'rtl',
      [`btn-${shape}`]: shape !== 'default' && shape,
      [`btn-${size}`]: size,
      [`btn-${type}`]: type,
    },
    className
  );

  const iconNode = icon && !innerLoading ? icon : <LoadingIcon existIcon={!!icon} loading={!!innerLoading} />;

  // href="" 也是 有意义的
  if (linkButtonRestProps.href !== undefined) {
    return (
      <a {...linkButtonRestProps} className={_className} onClick={handleClick} ref={buttonRef}>
        {iconNode}
        {children}
      </a>
    );
  }

  let buttonNode = (
    <button {...rest} className={_className} ref={buttonRef} type={htmlType} disabled={disabled} onClick={handleClick}>
      {iconNode}
      {children}
    </button>
  );

  if (!isUnBorderedButtonType(type)) {
    // 点击会出现波浪的动画
    buttonNode = <Wave disabled={!!innerLoading}>{buttonNode}</Wave>;
  }

  return buttonNode;
});

if (process.env.NODE_ENV !== 'production') {
  Button.displayName = 'Button';
}

export default Button;
