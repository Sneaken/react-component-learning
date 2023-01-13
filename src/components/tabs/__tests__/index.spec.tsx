import KeyCode from '@/utils/KeyCode';
import { spyElementPrototypes } from '@tests/domHook';
import { getOffsetSizeFunc, HackInfo } from './utils';
import mountTest from '@tests/shared/mountTest';
import { fireEvent, render, waitFakeTimer } from '@tests/utils';
import { Mock } from 'vitest';
import Tabs, { Tab, TabsProps } from '..';

describe('Tabs', () => {
  let domSpy: ReturnType<typeof spyElementPrototypes>;

  const hackOffsetInfo: HackInfo = {};

  beforeEach(() => {
    Object.keys(hackOffsetInfo).forEach((key) => {
      delete hackOffsetInfo[key as keyof HackInfo];
    });
  });

  beforeAll(() => {
    domSpy = spyElementPrototypes(HTMLElement, {
      scrollIntoView: () => {},
      offsetWidth: {
        get: getOffsetSizeFunc(hackOffsetInfo),
      },
    });
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  mountTest(() => (
    <Tabs
      items={[
        {
          key: 'xx',
          label: 'xx',
        },
      ]}
    />
  ));

  describe('editable-card', () => {
    let handleEdit: Mock;
    let wrapper: ReturnType<typeof render>['container'];
    const key = 'foo';

    beforeEach(() => {
      handleEdit = vi.fn();
      const { container } = render(
        <Tabs
          type="editable-card"
          onEdit={handleEdit}
          items={[
            {
              label: 'foo',
              key,
            },
          ]}
        />
      );
      wrapper = container;
    });

    it('add card', () => {
      fireEvent.click(wrapper.querySelector('.tabs-nav-add')!);
      expect(handleEdit.mock.calls[0][1]).toBe('add');
    });

    it('remove card', () => {
      fireEvent.click(wrapper.querySelector('.anticon-close')!);
      expect(handleEdit).toHaveBeenCalledWith(key, 'remove');
    });

    it('validateElement', () => {
      expect(wrapper.querySelectorAll('.tabs-tab')).toHaveLength(1);
    });
  });

  describe('tabPosition', () => {
    it('position in left', () => {
      const { container } = render(
        <Tabs
          tabPosition="left"
          items={[
            {
              label: 'foo',
              key: '1',
              children: 'foo',
            },
          ]}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('position in right', () => {
      const { container } = render(
        <Tabs
          tabPosition="right"
          items={[
            {
              label: 'foo',
              key: '1',
              children: 'foo',
            },
          ]}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('position in top', () => {
      const { container } = render(
        <Tabs
          tabPosition="top"
          items={[
            {
              label: 'foo',
              key: '1',
              children: 'foo',
            },
          ]}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('position in bottom', () => {
      const { container } = render(
        <Tabs
          tabPosition="bottom"
          items={[
            {
              label: 'foo',
              key: '1',
              children: 'foo',
            },
          ]}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('renderTabBar', () => {
    it('custom-tab-bar', () => {
      const { container } = render(
        <Tabs
          items={[
            {
              label: 'foo',
              key: '1',
            },
          ]}
          renderTabBar={() => <div>custom-tab-bar</div>}
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('tabBarGutter should work', () => {
    const items: Tab[] = Array.from({ length: 3 }).map((_, i) => {
      return {
        label: i,
        key: i,
        children: i,
      };
    }) as any;
    const { container: wrapper } = render(<Tabs items={items} tabBarGutter={4} />);
    expect(wrapper.firstChild).toMatchSnapshot();
    const { container: wrapper2 } = render(<Tabs items={items} tabBarGutter={4} tabPosition="left" />);
    expect(wrapper2.firstChild).toMatchSnapshot();
  });

  function getTabs(props: TabsProps = {}) {
    const mergedProps = {
      items: [
        {
          label: 'light',
          key: 'light',
          children: 'Light',
        },
        {
          label: 'bamboo',
          key: 'bamboo',
          children: 'Bamboo',
        },
        {
          label: 'cute',
          key: 'cute',
          children: 'Cute',
        },
      ],
      ...props,
    };

    return <Tabs {...mergedProps} />;
  }

  it('disabled not change', () => {
    const onChange = vi.fn();

    const { container } = render(
      getTabs({
        defaultActiveKey: 'light',
        items: [
          {
            label: 'light',
            key: 'light',
            children: 'Light',
          },
          {
            label: 'disabled',
            key: 'disabled',
            children: 'Disabled',
            disabled: true,
          },
        ],
        onChange,
      })
    );

    fireEvent.click(container.querySelector('.tabs-tab-disabled')!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Skip invalidate children', () => {
    const { container } = render(
      getTabs({
        items: [
          {
            label: 'light',
            key: 'light',
            children: 'Light',
          },
          'not me' as any,
        ],
      })
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('strictMode should show correct ink bar', () => {
    vi.useFakeTimers();

    const { container } = render(
      <Tabs
        items={new Array(2).fill(0).map((_, index) => ({
          label: `Tab ${index}`,
          key: `${index}`,
          children: `Content of Tab Pane ${index}`,
        }))}
        activeKey="0"
      />
    );

    waitFakeTimer(0, 100);

    expect(container.querySelector<HTMLElement>('.tabs-ink-bar')?.style?.width).toBe('20px');

    vi.useRealTimers();
  });

  describe('onChange and onTabClick should work', () => {
    const list: { name: string; trigger: (container: HTMLElement) => void }[] = [
      {
        name: 'outer div',
        trigger: (container) => fireEvent.click(container.querySelectorAll('.tabs-tab')[2]),
      },
      {
        name: 'inner button',
        trigger: (container) => fireEvent.click(container.querySelectorAll('.tabs-tab .tabs-tab-btn')[2]),
      },
      {
        name: 'inner button key down',
        trigger: (container) =>
          fireEvent.keyDown(container.querySelectorAll('.tabs-tab .tabs-tab-btn')[2], {
            which: KeyCode.SPACE,
            keyCode: KeyCode.SPACE,
            charCode: KeyCode.SPACE,
          }),
      },
    ];

    list.forEach(({ name, trigger }) => {
      it(name, () => {
        const onChange = vi.fn();
        const onTabClick = vi.fn();
        const { container } = render(getTabs({ onChange, onTabClick }));

        trigger(container);
        expect(onTabClick).toHaveBeenCalledWith('cute', expect.anything());
        expect(onChange).toHaveBeenCalledWith('cute');
      });
    });

    it('should not trigger onChange when click current tab', () => {
      const onChange = vi.fn();
      const onTabClick = vi.fn();
      const { container } = render(getTabs({ onChange, onTabClick }));

      fireEvent.click(container.querySelector('.tabs-tab')!);
      expect(onTabClick).toHaveBeenCalledWith('light', expect.anything());
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
