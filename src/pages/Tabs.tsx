import { AppleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Radio, Tabs as AntdTab } from 'antd';
import { type KeyboardEvent, type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { type SizeType, type Tab, type TabPosition, Tabs, type TabsType } from '../components';

const CheckboxGroup = Checkbox.Group;

type PositionType = 'left' | 'right';
const OperationsSlot: Record<PositionType, ReactNode> = {
  left: <Button className="tabs-extra-demo-button">Left Extra Action</Button>,
  right: <Button>Right Extra Action</Button>,
};
const options = ['left', 'right'];

const PageOfTabs = () => {
  const [items, setItems] = useState<Tab[]>([]);
  useEffect(() => {
    setItems(
      new Array(10).fill(null).map((_, i) => {
        const id = String(i);
        return {
          label: (
            <>
              {Math.random() > 0.5 ? <AppleOutlined /> : null}
              {`Tab-${id}`}
            </>
          ),
          key: id,
          disabled: Math.random() > 0.5,
          children: `Content of tab ${id}`,
          closable: Math.random() > 0.5,
        };
      })
    );
  }, []);

  const [activeKey, setActiveKey] = useState<string>();
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const [form] = Form.useForm();

  const defaultActiveKey = '0';

  const centered: boolean = Form.useWatch('centered', form);

  const tabPosition: TabPosition = Form.useWatch('tabPosition', form);

  const size: SizeType = Form.useWatch('size', form);

  const direction: 'ltr' | 'rtl' = Form.useWatch('direction', form);

  const type: TabsType = Form.useWatch('type', form);

  const hideAdd: boolean = Form.useWatch('hideAdd', form);

  const [position, setPosition] = useState<PositionType[]>([]);

  const tabBarExtraContent = useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce((acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }), {});
  }, [position]);

  const add = () => {
    const newActiveKey = `newTab${items.length + 1}`;
    const newPanes = [...items];
    newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: string | MouseEvent | KeyboardEvent, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      if (typeof targetKey === 'string') remove(targetKey);
    }
  };

  return (
    <>
      <div>
        <Form
          form={form}
          size="small"
          initialValues={{
            size: 'middle',
            direction: 'ltr',
            centered: false,
            tabPosition: 'top',
            type: 'line',
            hideAdd: false,
          }}
        >
          <Form.Item label="size" name="size">
            <Radio.Group>
              <Radio.Button value="small">Small</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="large">Large</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="tabPosition" name="tabPosition">
            <Radio.Group>
              <Radio.Button value="top">top</Radio.Button>
              <Radio.Button value="bottom">bottom</Radio.Button>
              <Radio.Button value="left">left</Radio.Button>
              <Radio.Button value="right">right</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="direction" name="direction">
            <Radio.Group>
              <Radio.Button value="ltr">ltr</Radio.Button>
              <Radio.Button value="rtl">rtl</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="type" name="type">
            <Radio.Group>
              <Radio.Button value="line">line</Radio.Button>
              <Radio.Button value="card">card</Radio.Button>
              <Radio.Button value="editable-card">editable-card</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="centered" name="centered" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item label="hideAdd" name="hideAdd" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item label="tabBarExtraContent">
            <CheckboxGroup
              options={options}
              value={position}
              onChange={(value) => {
                setPosition(value as PositionType[]);
              }}
            />
          </Form.Item>
        </Form>
        <div style={{ float: 'left', width: '40vw' }}>
          <Tabs
            type={type}
            direction={direction}
            activeKey={activeKey}
            centered={centered}
            defaultActiveKey={defaultActiveKey}
            items={items}
            onChange={onChange}
            size={size}
            tabPosition={tabPosition}
            tabBarExtraContent={tabBarExtraContent}
            hideAdd={hideAdd}
            onEdit={onEdit}
          />
        </div>
        <div style={{ float: 'left', width: '40vw' }}>
          <AntdTab
            type={type}
            direction={direction}
            activeKey={activeKey}
            centered={centered}
            defaultActiveKey={defaultActiveKey}
            items={items}
            onChange={onChange}
            size={size}
            tabPosition={tabPosition}
            tabBarExtraContent={tabBarExtraContent}
            hideAdd={hideAdd}
            onEdit={onEdit}
          />
        </div>
      </div>
    </>
  );
};

export default PageOfTabs;
