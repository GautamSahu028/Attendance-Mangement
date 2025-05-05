import {
  Home,
  // LayoutDashboard,
  // Users,
  // Settings,
  // FileText,
  // BarChart2,
  // MessageSquare,
  // Bell,
  // Folder
} from "lucide-react";
import { SidebarItemType } from "./types";

export const navigationItems: SidebarItemType[] = [
  {
    id: "home",
    label: "Home",
    icon: <Home />,
    path: "/",
    active: true,
  },
  // {
  //   id: 'dashboard',
  //   label: 'Dashboard',
  //   icon: <LayoutDashboard />,
  //   path: '/dashboard',
  // },
  // {
  //   id: 'analytics',
  //   label: 'Analytics',
  //   icon: <BarChart2 />,
  //   path: '/analytics',
  // },
  // {
  //   id: 'projects',
  //   label: 'Projects',
  //   icon: <Folder />,
  //   path: '/projects',
  //   children: [
  //     {
  //       id: 'current',
  //       label: 'Current Projects',
  //       path: '/projects/current',
  //     },
  //     {
  //       id: 'archived',
  //       label: 'Archived Projects',
  //       path: '/projects/archived',
  //     }
  //   ]
  // },
  // {
  //   id: 'messages',
  //   label: 'Messages',
  //   icon: <MessageSquare />,
  //   path: '/messages',
  // },
  // {
  //   id: 'notifications',
  //   label: 'Notifications',
  //   icon: <Bell />,
  //   path: '/notifications',
  // },
  // {
  //   id: 'team',
  //   label: 'Team',
  //   icon: <Users />,
  //   path: '/team',
  // },
  // {
  //   id: 'documents',
  //   label: 'Documents',
  //   icon: <FileText />,
  //   path: '/documents',
  // },
  // {
  //   id: 'settings',
  //   label: 'Settings',
  //   icon: <Settings />,
  //   path: '/settings',
  //   children: [
  //     {
  //       id: 'profile',
  //       label: 'Profile',
  //       path: '/settings/profile',
  //     },
  //     {
  //       id: 'security',
  //       label: 'Security',
  //       path: '/settings/security',
  //     },
  //     {
  //       id: 'preferences',
  //       label: 'Preferences',
  //       path: '/settings/preferences',
  //     }
  //   ]
  // },
];
