import React, { forwardRef, Ref, useState } from 'react';
import { Tabs as AntdTab } from 'antd';
import { Tabs } from '../components';

const Label = forwardRef((props, ref: Ref<any>) => {
  return <p ref={ref}>222</p>;
});

const items = [
  {
    label: <Label />,
    key: '1',
    className: '222',
    children: `Content of Tab Pane 1`,
  },
  {
    label: `Tab 2`,
    key: '2',
    children: `Content of Tab Pane 2`,
  },
  {
    label: `Tab 3`,
    key: '3',
    children: `Content of Tab Pane 3`,
  },
];
const PageOfTabs = () => {
  const [activeKey, setActiveKey] = useState<string>();
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <>
      <div style={{ padding: '0 20px' }}>
        <div style={{ float: 'left', width: '40vw' }}>
          <Tabs activeKey={activeKey} onChange={onChange} items={items} />
        </div>
        <div style={{ float: 'left', width: '40vw' }}>
          <AntdTab activeKey={activeKey} onChange={onChange} items={items} />
        </div>
      </div>
    </>
  );
};

export default PageOfTabs;
