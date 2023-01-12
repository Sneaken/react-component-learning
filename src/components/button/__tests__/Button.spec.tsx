import mountTest from '@tests/shared/mountTest';
import { render } from '@tests/utils';
import Button from '..';

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
});
