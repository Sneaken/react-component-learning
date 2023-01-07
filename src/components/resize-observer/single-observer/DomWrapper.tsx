import { Component, type ReactElement } from 'react';

interface DomWrapperProps {
  children: ReactElement;
}

/**
 * 为什么用 CC 不用 FC ?
 * 配合 findDOMNode 能获取函数组件渲染在页面上的 DOM Node
 */
class DomWrapper extends Component<DomWrapperProps> {
  render() {
    return this.props.children;
  }
}

export default DomWrapper;
