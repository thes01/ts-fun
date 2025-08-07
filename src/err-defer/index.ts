type ErrConsole = Pick<Console, "log" | "error" | "warn">;

function wrap<T>(func: (console: ErrConsole) => T): T {
  const logs: (() => void)[] = [];
  const log_all = () => logs.map((log) => log());
  const err_console: ErrConsole = {
    log: (...args) => logs.push(() => console.log(...args)),
    error: (...args) => logs.push(() => console.error(...args)),
    warn: (...args) => logs.push(() => console.warn(...args)),
  };

  try {
    const result = func(err_console);

    // Optional
    if (typeof result === "object" && result !== null && "error" in result) {
      log_all();
    }
    return result;
  } catch (e) {
    log_all();
    throw e;
  }
}

wrap((err) => {
  err.log("Hello", "world");
  err.log("World");

  throw new Error("An error occurred");
  // or: return { error: "An error occurred" };
});
