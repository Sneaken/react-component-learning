import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { ReactElement } from 'react';

const MARK = '__rc_react_root__';

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

function modernRender(node: ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container);

  root.render(node);

  container[MARK] = root;
}

export function render(node: ReactElement, container: ContainerType) {
  modernRender(node, container);
}

// ========================= Unmount ==========================
async function modernUnmount(container: ContainerType) {
  // Delay to unmount to avoid 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();

    delete container[MARK];
  });
}

export async function unmount(container: ContainerType) {
  return modernUnmount(container);
}
