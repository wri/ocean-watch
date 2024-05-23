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
    href: '/dashboards/ocean-watch/about',
    root: '/dashboards/ocean-watch/about',
    children: [],
  },
  {
    id: 'get-involved',
    label: 'Get Involved',
    href: '/get-involved',
    root: '/get-involved',
    children: [
      {
        label: 'Suggest a story',
        href: '/get-involved/suggest-a-story',
      },
      {
        label: 'Contribute data',
        href: '/get-involved/contribute-data',
      },
      {
        label: 'Join the community',
        href: '/get-involved/join-the-community',
      },
      {
        label: 'Develop your app',
        href: '/get-involved/develop-your-app',
      },
      {
        label: 'Sign up',
        href: '/sign-in',
      },
    ],
  },
  {
    id: 'search',
    label: 'Search',
  },
];

export default { APP_HEADER_ITEMS };
