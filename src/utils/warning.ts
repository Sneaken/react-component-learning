export function warning(valid: boolean, message: string) {
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
}
