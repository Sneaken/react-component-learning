import noop from '@/utils/noop';

let warned: Record<string, boolean> = {};

type Warning = (valid: boolean, component: string, message?: string) => void;

export let warning: Warning = noop;

if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    if (!valid && console !== undefined) {
      console.error(`Warning: [${component}] ${message}`);
    }
  };
}

type Note = (valid: boolean, component: string, message?: string) => void;
export let note: Note = noop;

if (process.env.NODE_ENV !== 'production') {
  note = (valid, component, message) => {
    if (!valid && console !== undefined) {
      console.warn(`Note: [${component}] ${message}`);
    }
  };
}

export function resetWarned() {
  warned = {};
}

export function call(method: (valid: boolean, message: string) => void, valid: boolean, message: string) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

export function warningOnce(valid: boolean, message: string) {
  call(warning, valid, message);
}

export function noteOnce(valid: boolean, message: string) {
  call(note, valid, message);
}

export default warningOnce;
