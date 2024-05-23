export const APP_HEADER_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    // used to determine if the menu should be highlighted based on the current page
    children: [],
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    href: '/dashboards',
    root: '/dashboards',
    children: [],
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://blog.resourcewatch.org',
    external: true,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    root: '/about',
    children: [
      {
        label: 'Partners',
        href: '/about/partners',
      },
      {
        label: 'FAQs',
        href: '/about/faqs',
      },
      {
        label: 'How to',
        href: '/about/howto',
      },
      {
        label: 'Contact us',
        href: '/about/contact-us',
      },
    ],
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
