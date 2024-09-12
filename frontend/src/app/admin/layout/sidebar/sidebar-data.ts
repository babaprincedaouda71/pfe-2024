import {NavItem} from '../nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Accueil',
  },
  {
    displayName: 'Tableau de Bord',
    iconName: 'home',
    route: '/',
  },
  {
    navCap: 'Modules',
  },
  {
    displayName: 'Client',
    iconName: 'users',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Liste',
        iconName: 'list-details',
        route: 'client',
      },
      {
        displayName: 'Nouveau Client',
        iconName: 'plus',
        route: 'client/add',
      },
    ],
  },
  {
    displayName: 'Fournisseur',
    iconName: 'book',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Liste',
        iconName: 'list-details',
        route: 'vendor',
      },
      {
        displayName: 'Nouveau Formateur',
        iconName: 'plus',
        route: 'vendor/add',
      },
    ],
  },
  {
    displayName: 'Formations',
    iconName: 'file-text',
    route: 'apps/blog',
    children: [
      {
        displayName: 'Liste',
        iconName: 'list-details',
        route: 'training',
      },
      {
        displayName: 'Nouvelle Formation',
        iconName: 'plus',
        route: 'training/add',
      },
    ],
  },
  {
    displayName: 'Facturation',
    iconName: 'file-invoice',
    route: 'invoicing',
  },
  {
    navCap: 'Apps',
  },
  {
    displayName: 'Agenda',
    iconName: 'calendar-event',
    route: 'agenda',
  },
];
