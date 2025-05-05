import { ReactElement } from 'react';

export interface SidebarItemType {
  id: string;
  label: string;
  icon?: ReactElement;
  path?: string;
  active?: boolean;
  children?: SidebarItemType[];
}