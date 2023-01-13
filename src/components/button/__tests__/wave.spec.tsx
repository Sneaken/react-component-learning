import userEvent from '@testing-library/user-event';
import { fireEvent, render, waitFakeTimer } from '@tests/utils';
import Button from '..';

// 一定 要 mock 影响测试的方法
vi.mock('@/utils/Dom/isVisible', () => {
  return {
    default: () => true,
  };
});
describe('click wave effect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  async function clickButton(container: HTMLElement) {
    const element = container.firstChild;
    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) }).click(element as Element);
    await waitFakeTimer(100, 1);
    fireEvent(element!, new Event('transitionstart'));
    fireEvent(element!, new Event('animationend'));
  }

  it('should have click wave effect for default button', async () => {
    const { container } = render(<Button>button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeTruthy();
  });

  it('should have click wave effect for primary button', async () => {
    const { container } = render(<Button type="primary">button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeTruthy();
  });

  it('should have click wave effect for dashed button', async () => {
    const { container } = render(<Button type="dashed">button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeTruthy();
  });

  it('should have click wave effect for ghost type button', async () => {
    const { container } = render(<Button type="ghost">button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeTruthy();
  });

  it('should not have click wave effect for link type button', async () => {
    const { container } = render(<Button type="link">button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeFalsy();
  });

  it('should not have click wave effect for text type button', async () => {
    const { container } = render(<Button type="text">button</Button>);
    await clickButton(container);
    expect(document.querySelector('.wave')).toBeFalsy();
  });
});
