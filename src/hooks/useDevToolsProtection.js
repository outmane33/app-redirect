import { useEffect, useRef } from "react";
import { isDevToolsOpen, debuggerDetection } from "../utils/devtools-detectors";
import {
  setupConsoleProtection,
  setupToStringTrap,
} from "../utils/devtools-protections";

export function useDevToolsProtection(redirectUrl) {
  const cleanupFuncsRef = useRef([]);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const handleDetection = () => {
      if (hasDetectedRef.current) return;
      hasDetectedRef.current = true;

      console.clear();
      document.body.innerHTML = "";

      if (redirectUrl) {
        window.location.replace(redirectUrl);
      }
    };

    // Initial check
    if (isDevToolsOpen()) {
      handleDetection();
      return;
    }

    // Continuous DevTools check
    const devToolsCheckInterval = setInterval(() => {
      if (isDevToolsOpen()) handleDetection();
    }, 1000);
    cleanupFuncsRef.current.push(() => clearInterval(devToolsCheckInterval));

    // Resize Detection
    const handleResize = () => {
      if (isDevToolsOpen()) handleDetection();
    };
    window.addEventListener("resize", handleResize);
    cleanupFuncsRef.current.push(() =>
      window.removeEventListener("resize", handleResize)
    );

    // Visibility Change
    const handleVisibility = () => {
      if (!document.hidden && isDevToolsOpen()) handleDetection();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    cleanupFuncsRef.current.push(() =>
      document.removeEventListener("visibilitychange", handleVisibility)
    );

    // Focus Check
    const handleFocus = () => {
      if (debuggerDetection() || isDevToolsOpen()) handleDetection();
    };
    window.addEventListener("focus", handleFocus);
    cleanupFuncsRef.current.push(() =>
      window.removeEventListener("focus", handleFocus)
    );

    // Keyboard Shortcuts
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          [73, 74, 67].includes(e.keyCode)) ||
        ((e.ctrlKey || e.metaKey) && [85, 83].includes(e.keyCode))
      ) {
        e.preventDefault();
        e.stopPropagation();
        if ([123, 73, 74, 67].includes(e.keyCode)) {
          handleDetection();
        }
        return false;
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    cleanupFuncsRef.current.push(() =>
      document.removeEventListener("keydown", handleKeyDown, true)
    );

    // Context Menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDevToolsOpen()) handleDetection();
      return false;
    };
    document.addEventListener("contextmenu", handleContextMenu, true);
    cleanupFuncsRef.current.push(() =>
      document.removeEventListener("contextmenu", handleContextMenu, true)
    );

    // Mouse Movement
    let lastCheck = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastCheck > 2000) {
        lastCheck = now;
        if (isDevToolsOpen()) handleDetection();
      }
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    cleanupFuncsRef.current.push(() =>
      document.removeEventListener("mousemove", handleMouseMove)
    );

    // Selection & Copy Prevention
    const preventSelection = (e) => {
      if (isDevToolsOpen()) {
        e.preventDefault();
        handleDetection();
        return false;
      }
    };
    const preventCopy = (e) => {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", "");
      if (isDevToolsOpen()) handleDetection();
      return false;
    };
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("copy", preventCopy);
    cleanupFuncsRef.current.push(() => {
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("copy", preventCopy);
    });

    // Drag prevention
    const preventDrag = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener("dragstart", preventDrag);
    cleanupFuncsRef.current.push(() =>
      document.removeEventListener("dragstart", preventDrag)
    );

    // Advanced Protections
    cleanupFuncsRef.current.push(setupConsoleProtection(handleDetection));
    cleanupFuncsRef.current.push(setupToStringTrap(handleDetection));

    // Auto-redirect
    const autoRedirectTimer = setTimeout(() => {
      if (redirectUrl && !hasDetectedRef.current) {
        window.location.replace(redirectUrl);
      }
    }, 500);
    cleanupFuncsRef.current.push(() => clearTimeout(autoRedirectTimer));

    // Cleanup
    return () => {
      cleanupFuncsRef.current.forEach((cleanup) => cleanup());
      cleanupFuncsRef.current = [];
    };
  }, [redirectUrl]);
}
