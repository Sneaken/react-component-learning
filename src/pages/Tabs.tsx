import React, { forwardRef, Ref, useState } from 'react';
import { Tabs as AntdTab } from 'antd';
import { Tabs, type Tab } from '../components';

const Label = forwardRef((props, ref: Ref<any>) => {
  return <p ref={ref}>222</p>;
});

const items: Tab[] = [
  {
    children: `Content of Tab Pane 1`,
    className: '222',
    key: '1',
    label: <Label />,
  },
  {
    children: `Content of Tab Pane 2`,
    disabled: false,
    key: '2',
    label: `Tab 2`,
  },
  {
    children: `Content of Tab Pane 3`,
    key: '3',
    label: `Tab 3`,
  },
];
const PageOfTabs = () => {
  const [activeKey, setActiveKey] = useState<string>();
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const size = 'large';

  return (
    <>
      <div style={{ padding: '0 20px' }}>
        <div style={{ float: 'left', width: '40vw' }}>
          <Tabs size={size} activeKey={activeKey} onChange={onChange} items={items} />
        </div>
        <div style={{ float: 'left', width: '40vw' }}>
          <AntdTab size={size} activeKey={activeKey} onChange={onChange} items={items} />
        </div>
      </div>
    </>
  );
};

export default PageOfTabs;
