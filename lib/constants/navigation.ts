export const NAV_GROUPS = {
  missions: {
    label: 'Missions',
    items: [
      { href: '/launches', label: 'Launches' },
      { href: '/payloads', label: 'Payloads' },
      { href: '/history', label: 'History' },
    ]
  },
  fleet: {
    label: 'Fleet',
    items: [
      { href: '/rockets', label: 'Rockets' },
      { href: '/dragons', label: 'Dragons' },
      { href: '/capsules', label: 'Capsules' },
      { href: '/cores', label: 'Cores' },
      { href: '/ships', label: 'Ships' },
    ]
  },
  infrastructure: {
    label: 'Infrastructure',
    items: [
      { href: '/launchpads', label: 'Launch Pads' },
      { href: '/landpads', label: 'Landing Pads' },
    ]
  },
  data: {
    label: 'Data',
    items: [
      { href: '/starlink', label: 'Starlink' },
      { href: '/starlink/map', label: 'Starlink Map' },
      { href: '/analytics', label: 'Analytics' },
    ]
  },
  more: {
    label: 'More',
    items: [
      { href: '/crew', label: 'Crew' },
      { href: '/company', label: 'Company' },
      { href: '/roadster', label: 'Roadster' },
    ]
  }
} as const;

export type NavGroup = keyof typeof NAV_GROUPS;
