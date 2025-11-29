import { isDevToolsOpen } from "./devtools-detectors";

export function setupConsoleProtection(onDetected) {
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    dir: console.dir,
  };

  let count = 0;

  console.log = function (...args) {
    count++;
    if (count > 3 && isDevToolsOpen()) onDetected();
    return original.log.apply(console, args);
  };

  console.dir = function (...args) {
    if (isDevToolsOpen()) onDetected();
    return original.dir.apply(console, args);
  };

  return () => {
    console.log = original.log;
    console.warn = original.warn;
    console.error = original.error;
    console.dir = original.dir;
  };
}

export function setupToStringTrap(onDetected) {
  const element = document.createElement("div");
  let detected = false;

  Object.defineProperty(element, "id", {
    get: () => {
      if (!detected) {
        detected = true;
        onDetected();
      }
      return "trapped";
    },
  });

  const interval = setInterval(() => {
    console.log("%c", element);
    console.clear();
  }, 5000);

  return () => clearInterval(interval);
}
