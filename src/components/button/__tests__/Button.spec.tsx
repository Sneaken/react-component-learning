import noop from '@/utils/noop';
import { resetWarned } from '@/utils/warning';
import mountTest from '@tests/shared/mountTest';
import { act, fireEvent, render, waitFakeTimer } from '@tests/utils';
import { useState } from 'react';
import Button, { type ButtonProps } from '..';

describe('Button', () => {
  mountTest(Button);
  mountTest(() => <Button size="large" />);
  mountTest(() => <Button size="small" />);

  it('renders correctly', () => {
    const { container } = render(<Button>Follow</Button>);
    // 如果没有快照会重新生成一份
    // 如果存在快照，则跟上次生成的快照进行对比，如果一致测试通过，如果不一致则说明代码有改动。
    // 如果确实要更新快照 则传入 --update 来更新快照
    // vitest --update
    // container.firstChild 说的就是 Button 组件
    expect(container.firstChild).toMatchSnapshot();
  });

  it('mount correctly', () => {
    // 渲染正常没有抛出异常
    expect(() => render(<Button>Follow</Button>)).not.toThrow();
  });

  it('warns if size is wrong', () => {
    resetWarned();
    // vi.spyOn: Creates a spy on a method or getter/setter of an object.
    // mockImplementation: Accepts a function that will be used as an implementation of the mock.
    // 如果不传一个空函数会把错误信息打印的控制台上（从行为上来说这个正确的, 但是从看测试报告的角度来看是不想要看到的）
    const mockWarn = vi.spyOn(console, 'error').mockImplementation(noop);
    const size = 'who am I';
    // @ts-expect-error: Type '"who am I"' is not assignable to type 'SizeType'.ts(2322)
    render(<Button size={size} />);

    // toHaveBeenCalledWith:
    //   This assertion checks if a function was called at least once with certain parameters.
    //   Requires a spy function to be passed to expect.
    expect(mockWarn).toHaveBeenCalledWith('Warning: [Button] Invalid prop `size`.');

    // mockRestore:
    //   Does what mockReset does and restores inner implementation to the original function.
    //   Note that restoring mock from vi.fn() will set implementation to an empty function that returns undefined.
    //   Restoring a vi.fn(impl) will restore implementation to impl.
    //   If you want this method to be called before each test automatically, you can enable restoreMocks setting in config.
    mockWarn.mockRestore();
  });

  it('should render empty button without errors', () => {
    const { container } = render(
      <Button>
        {null}
        {undefined}
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should change loading state instantly by default', () => {
    const LoadingButton = () => {
      const [loading, setLoading] = useState<ButtonProps['loading']>(false);
      return (
        <Button loading={loading} onClick={() => setLoading(true)}>
          Button
        </Button>
      );
    };
    const { container } = render(<LoadingButton />);
    fireEvent.click(container.firstChild!);
    expect(container.querySelectorAll('.btn-loading').length).toBe(1);
  });

  it('should change loading state with delay', () => {
    const LoadingButton = () => {
      const [loading, setLoading] = useState<ButtonProps['loading']>(false);
      return (
        <Button loading={loading} onClick={() => setLoading({ delay: 1000 })}>
          Button
        </Button>
      );
    };
    const { container } = render(<LoadingButton />);
    fireEvent.click(container.firstChild!);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);
  });

  it('reset when loading back of delay', () => {
    // useFakeTimers useRealTimers 配套使用
    vi.useFakeTimers();
    const { rerender, container } = render(<Button loading={{ delay: 1000 }} />);
    rerender(<Button loading={{ delay: 2000 }} />);
    rerender(<Button loading={false} />);

    // act
    //   All it does is forward all arguments to the act function if your version of react supports act.
    //   It is recommended to use the import from @testing-library/react over react-dom/test-utils for consistency reasons.
    act(() => {
      // This method will invoke every initiated timer until the timers queue is empty.
      // It means that every timer called during runAllTimers will be fired.
      // If you have an infinite interval, it will throw after 10 000 tries.
      vi.runAllTimers();
    });

    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);

    vi.useRealTimers();
  });

  it('should not clickable when button is loading', () => {
    const onClick = vi.fn();
    const {
      container: { firstChild: buttonNode },
    } = render(
      <Button loading onClick={onClick}>
        button
      </Button>
    );
    fireEvent.click(buttonNode!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should support link button', () => {
    const { container } = render(
      <Button target="_blank" href="https://ant.design">
        link button
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders {0}, 0 and {false}', () => {
    expect(render(<Button>{0}</Button>).container.firstChild).toMatchSnapshot();
    expect(render(<Button>0</Button>).container.firstChild).toMatchSnapshot();
    expect(render(<Button>{false}</Button>).container.firstChild).toMatchSnapshot();
  });

  it('should not render as link button when href is undefined', async () => {
    const {
      container: { firstChild },
    } = render(
      <Button type="primary" href={undefined}>
        button
      </Button>
    );
    expect(firstChild).toMatchSnapshot();
  });

  it('should support to change loading', async () => {
    vi.useFakeTimers();
    const { container, rerender, unmount } = render(<Button>Button</Button>);
    rerender(<Button loading />);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(1);
    rerender(<Button loading={false} />);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);
    rerender(<Button loading={{ delay: 50 }} />);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);
    await waitFakeTimer(40, 1);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);
    await waitFakeTimer(50, 1);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(1);
    rerender(<Button loading={false} />);
    expect(container.querySelectorAll('.btn-loading')).toHaveLength(0);
    expect(unmount).not.toThrow();
    vi.useRealTimers();
  });

  it('should warning when pass type=link and ghost=true', () => {
    resetWarned();
    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button type="link" ghost />);
    expect(warnSpy).toHaveBeenCalledWith("Warning: [Button] `link` or `text` button can't be a `ghost` button.");
    warnSpy.mockRestore();
  });

  it('should warning when pass type=text and ghost=true', () => {
    resetWarned();
    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button type="text" ghost />);
    expect(warnSpy).toHaveBeenCalledWith("Warning: [Button] `link` or `text` button can't be a `ghost` button.");
    warnSpy.mockRestore();
  });

  it('should not redirect when button is disabled', () => {
    const onClick = vi.fn();
    const {
      container: { firstChild },
    } = render(
      <Button href="https://ant.design" onClick={onClick} disabled>
        click me
      </Button>
    );
    fireEvent.click(firstChild!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
