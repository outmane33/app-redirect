export function isDevToolsOpen() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) return true;
  if (window.Firebug?.chrome?.isInitialized) return true;
  if (window.devtools?.isOpen) return true;

  return false;
}

export function debuggerDetection() {
  const start = performance.now();
  try {
    (() => {}).constructor("debugger")();
  } catch (e) {}
  const end = performance.now();
  return end - start > 100;
}
