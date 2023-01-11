import noop from '@/utils/noop';

type Warning = (valid: boolean, component: string, message?: string) => void;

export let warning: Warning = noop;

if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    if (!valid && console !== undefined) {
      console.error(`Warning: [${component}] ${message}`);
    }
  };
}
