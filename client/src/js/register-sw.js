export const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js");
    });
  } else {
    console.error("Service workers are not supported in this browser.");
  }
};
