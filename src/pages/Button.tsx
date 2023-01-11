import { Button } from '@/components';
import { AppleOutlined } from '@ant-design/icons';
import { Button as AntdButton, Checkbox, Form, Input, Radio } from 'antd';
import { type HTMLAttributeAnchorTarget } from 'react';

const icon = <AppleOutlined />;

function ButtonOfPage() {
  const [form] = Form.useForm();

  const size = Form.useWatch('size', form);
  const type = Form.useWatch('type', form);
  const shape = Form.useWatch('shape', form);
  const block = Form.useWatch('block', form);
  const danger = Form.useWatch('danger', form);
  const disabled = Form.useWatch('disabled', form);
  const ghost = Form.useWatch('ghost', form);
  const showIcon = Form.useWatch('showIcon', form);
  const children = Form.useWatch('children', form);
  const loading = Form.useWatch('loading', form);
  const href = Form.useWatch('href', form);
  const target: HTMLAttributeAnchorTarget = Form.useWatch('target', form);

  return (
    <div>
      <Form form={form} initialValues={{ size: 'middle' }}>
        <Form.Item label="size" name="size">
          <Radio.Group>
            <Radio.Button value="small">small</Radio.Button>
            <Radio.Button value="middle">middle</Radio.Button>
            <Radio.Button value="large">large</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="type" name="type">
          <Radio.Group>
            <Radio.Button value="default">default</Radio.Button>
            <Radio.Button value="primary">primary</Radio.Button>
            <Radio.Button value="ghost">ghost</Radio.Button>
            <Radio.Button value="dashed">dashed</Radio.Button>
            <Radio.Button value="link">link</Radio.Button>
            <Radio.Button value="text">text</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="shape" name="shape">
          <Radio.Group>
            <Radio.Button value="default">default</Radio.Button>
            <Radio.Button value="circle">circle</Radio.Button>
            <Radio.Button value="round">round</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="target" name="target">
          <Radio.Group>
            <Radio.Button value="_self">_self</Radio.Button>
            <Radio.Button value="_blank">_blank</Radio.Button>
            <Radio.Button value="_parent">_parent</Radio.Button>
            <Radio.Button value="_top">_top</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="block" name="block" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="danger" name="danger" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="disabled" name="disabled" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="loading" name="loading" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="ghost" name="ghost" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="showIcon" name="showIcon" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="children" name="children">
          <Input />
        </Form.Item>
        <Form.Item label="href" name="href">
          <Input allowClear />
        </Form.Item>
      </Form>
      <div style={{ float: 'left', width: '40vw' }}>
        <Button
          size={size}
          type={type}
          shape={shape}
          block={block}
          danger={danger}
          disabled={disabled}
          ghost={ghost}
          icon={showIcon ? icon : undefined}
          children={children}
          loading={loading}
          href={href}
          target={target}
        />
      </div>
      <div style={{ float: 'left', width: '40vw' }}>
        <AntdButton
          size={size}
          type={type}
          shape={shape}
          block={block}
          danger={danger}
          disabled={disabled}
          ghost={ghost}
          icon={showIcon ? icon : undefined}
          children={children}
          loading={loading}
          href={href}
          target={target}
        />
      </div>
    </div>
  );
}

export default ButtonOfPage;
