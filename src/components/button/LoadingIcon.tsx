import { LoadingOutlined } from '@ant-design/icons';
import CSSMotion from 'rc-motion';
import { CSSProperties } from 'react';

interface LoadingIconProps {
  existIcon: boolean;
  loading?: boolean | object;
}

const getCollapsedWidth = () => ({ width: 0, opacity: 0, transform: 'scale(0)' });
const getRealWidth = (node: HTMLElement) => ({
  width: node.scrollWidth,
  opacity: 1,
  transform: 'scale(1)',
});

function LoadingIcon({ loading, existIcon }: LoadingIconProps) {
  const visible = !!loading;

  if (existIcon) {
    return (
      <span className="btn-loading-icon">
        <LoadingOutlined />
      </span>
    );
  }
  return (
    <CSSMotion
      visible={visible}
      // We do not really use this motionName
      motionName="btn-loading-icon-motion"
      removeOnLeave
      onAppearStart={getCollapsedWidth}
      onAppearActive={getRealWidth}
      onEnterStart={getCollapsedWidth}
      onEnterActive={getRealWidth}
      onLeaveStart={getRealWidth}
      onLeaveActive={getCollapsedWidth}
    >
      {({ className, style }: { className?: string; style?: CSSProperties }, ref: any) => (
        <span className="btn-loading-icon" style={style} ref={ref}>
          <LoadingOutlined className={className} />
        </span>
      )}
    </CSSMotion>
  );
}

export default LoadingIcon;
