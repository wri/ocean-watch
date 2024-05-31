export const APP_HEADER_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    // used to determine if the menu should be highlighted based on the current page
    children: [],
  },
  {
    id: 'coastal-profiles',
    label: 'Coastal Profiles',
    href: '/dashboards/ocean-watch/country',
    root: '/dashboards/ocean-watch/country',
    children: [],
  },
  {
    id: 'coral-reef-dashboards',
    label: 'Coral Reef Dashboards',
    href: '/dashboards/coral-reef-dashboards',
    root: '/dashboards/coral-reef-dashboards',
    children: [],
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    root: '/about',
    children: [],
  },
  {
    id: 'partners',
    label: 'Partners',
    href: '/dashboards/ocean-watch/partners',
    root: '/dashboards/ocean-watch/partners',
    children: [],
  },
];

export default { APP_HEADER_ITEMS };
