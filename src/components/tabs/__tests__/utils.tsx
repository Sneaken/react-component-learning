import { _rs } from '@/components/resize-observer/utils/observer';
import { act } from '@tests/utils';
import React from 'react';
import Tabs, { type TabsProps } from '..';

/**
 * |                            container                            |
 * |  extra left  |                      | operation |  extra right  |
 * |              |                             list                              |
 * |              |                       tab content                       | add |
 */

export interface HackInfo {
  container?: number;
  tabNode?: number;
  add?: number;
  more?: number;
  extra?: number;
}

export function getOffsetSizeFunc(info: HackInfo = {}) {
  return function getOffsetSize(this: any) {
    const { container = 50, extra = 10, tabNode = 20, add = 10, more = 10 } = info;

    if (this.classList.contains('tabs-nav')) {
      return container;
    }

    if (this.classList.contains('tabs-extra-content')) {
      return extra;
    }

    if (this.classList.contains('tabs-nav-list')) {
      return this.querySelectorAll('.tabs-tab').length * tabNode + add;
    }

    if (this.classList.contains('tabs-tab')) {
      return tabNode;
    }

    if (this.classList.contains('tabs-nav-add')) {
      return more;
    }

    if (this.classList.contains('tabs-nav-more')) {
      return more;
    }

    if (this.classList.contains('tabs-ink-bar')) {
      return container;
    }

    if (this.classList.contains('tabs-nav-operations')) {
      return this.querySelector('.tabs-nav-add') ? more + add : more;
    }

    // if (this.className.includes('tabs-nav-list')) {
    //   return info.list || 5 * 20 + 10;
    // }
    // if (this.className.includes('tabs-nav-add')) {
    //   return info.add || 10;
    // }
    // if (this.className.includes('tabs-nav-operations')) {
    //   return info.operation || 10;
    // }
    // if (this.className.includes('tabs-nav-more')) {
    //   return info.more || 10;
    // }
    // if (this.className.includes('tabs-dropdown')) {
    //   return info.dropdown || 10;
    // }

    throw new Error(`className not match ${this.className}`);
  };
}

export function btnOffsetPosition(this: HTMLButtonElement) {
  const btn = this;
  const btnList = Array.from(btn.parentNode!.childNodes).filter((ele) =>
    (ele as HTMLElement).className.includes('tabs-tab')
  );
  const index = btnList.indexOf(btn);
  return 20 * index;
}

export function getTransformX(container: Element) {
  const { transform } = container.querySelector<HTMLElement>('.tabs-nav-list')!.style;
  const match = transform.match(/\(([-\d.]+)px/);
  if (!match) {
    throw new Error(`Not find transformX: ${transform}`);
  }
  return Number(match[1]);
}

export function getTransformY(container: Element) {
  const { transform } = container.querySelector<HTMLElement>('.tabs-nav-list')!.style;
  const match = transform.match(/,\s*([-\d.]+)px/);
  if (!match) {
    // eslint-disable-next-line no-console
    // console.log(wrapper.find('.tabs-nav-list').html());
    throw new Error(`Not find transformY: ${transform}`);
  }
  return Number(match[1]);
}

export function getTabs(props: TabsProps = {}) {
  return (
    <Tabs
      items={[
        {
          label: 'light',
          key: 'light',
          children: 'Light',
        },
        {
          label: 'bamboo',
          key: 'bamboo',
          children: 'Bamboo',
        },
        {
          label: 'cute',
          key: 'cute',
          children: 'Cute',
        },
        {
          label: 'disabled',
          key: 'disabled',
          children: 'Disabled',
          disabled: true,
        },
        {
          label: 'miu',
          key: 'miu',
          children: 'Miu',
        },
      ]}
      {...props}
    />
  );
}

export const triggerResize = (container: Element) => {
  const target = container.querySelector('.tabs-nav');

  act(() => {
    _rs?.([{ target } as ResizeObserverEntry]);
  });
};
