import Button from '..';
import mountTest from '@tests/shared/mountTest';

describe('Button', () => {
  mountTest(Button);
  mountTest(() => <Button size="large" />);
  mountTest(() => <Button size="small" />);
});
