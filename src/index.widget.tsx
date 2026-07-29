import React from "react";
import { createRoot, Root as ReactRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Flag } from "./types/widget";

export interface WidgetOptions {
  containerElementId: string;
  name: string;
  flag: Flag;
}

declare global {
  interface Window {
    renderReactWidget: (config: string) => void;
    unmountReactWidget: (containerElementId: string) => void;
  }
}

const widgetRoots: Record<string, ReactRoot> = {};

const getOptionsFromDataAttributes = (
  element: HTMLElement
): Partial<WidgetOptions> => ({
  name: element.getAttribute("data-name") || "",
  flag: (element.getAttribute("data-flag") ?? "dashboard") as Flag,
});

window.renderReactWidget = (config: string) => {
  let parsedOptions: Partial<WidgetOptions> = {};

  try {
    parsedOptions = JSON.parse(config);
  } catch {
    // If config is not JSON, assume it's the container id.
  }

  const containerId =
    parsedOptions.containerElementId || config;

  const container = document.getElementById(containerId);

  if (!container) {
    console.error(
      `Container "${containerId}" not found.`
    );
    return;
  }

  const dataOptions =
    getOptionsFromDataAttributes(container);

  const finalOptions: WidgetOptions = {
    containerElementId: containerId,
    name:
      parsedOptions.name ??
      dataOptions.name ??
      "",
    flag:
      parsedOptions.flag ??
      dataOptions.flag ??
      "dashboard",
  };

  if (!finalOptions.name) {
    console.error(
      "Missing required field: name"
    );
    return;
  }

  let root = widgetRoots[containerId];

  if (!root) {
    root = createRoot(container);
    widgetRoots[containerId] = root;
  }

  root.render(
    <React.StrictMode>
      <App flag={finalOptions.flag} />
    </React.StrictMode>
  );
};

window.unmountReactWidget = (
  containerElementId: string
) => {
  const root =
    widgetRoots[containerElementId];

  if (root) {
    root.unmount();
    delete widgetRoots[containerElementId];
  }
};