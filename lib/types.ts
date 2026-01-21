import COUNTRIES from '@/data/countries.json';

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}



export type SelectMenuOption =(typeof COUNTRIES)[number];
