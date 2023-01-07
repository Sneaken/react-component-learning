import { createContext } from 'react';
import type { Tab } from './interface';

export interface TabContextProps {
  tabs: Tab[];
}

export default createContext<TabContextProps>({ tabs: [] });
