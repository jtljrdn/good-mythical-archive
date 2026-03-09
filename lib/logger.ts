const colors = {
  reset: "\x1b[0m",
  grey: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
} as const;

function timestamp() {
  return new Date().toISOString();
}

function format(level: string, color: string, args: unknown[]) {
  const ts = `${colors.grey}${timestamp()}${colors.reset}`;
  const tag = `${color}[${level}]${colors.reset}`;
  return [ts, tag, ...args];
}

export const logger = {
  log(...args: unknown[]) {
    console.log(...format("LOG", colors.blue, args));
  },
  warn(...args: unknown[]) {
    console.warn(...format("WARN", colors.yellow, args));
  },
  error(...args: unknown[]) {
    console.error(...format("ERROR", colors.red, args));
  },
  debug(...args: unknown[]) {
    console.debug(...format("DEBUG", colors.grey, args));
  },
};
