# SpaceX Dashboard - School assignment

## Mission

This is a project using the free SpaceX API available on Github: https://github.com/r-spacex/SpaceX-API
The data is old there, and not updated since 2/3 years, but it is good practice.

## Architecture

- React with NextJS
- Optimistic updates
- NextJS routing with a routing group
- SWR to have a better fetching engine and improve the hooks
- Charts using recharts
- A map of the world with Starlink location using leaflet
- ADR to explain some decisions app/ADR

## Blocking point

- Time. I took too much time doing tutorials.

- No tests are included, but the usage of Typescript was enforced.

- I used too much any on some of my TS files for conveniency, but it is bad practice.

- Zod validation was also used for API verification during runtime and error handling.

## Functionalities

- Lists of: Launches, Rocket and rocket types, Starlinks with status (Active/Deorbited),
- A lot of filters
- Analytics with charts: Launch Success Rate (Pie Chart), Launches Over Time (Graph), Payload to Mass Distribution (Barchart).
- A map of the world with Starlinks locations.

## Was AI used?

Yes, all the way, from the very beginning with architecture to **almost every page of this project**.

I wrote the ADRs myself. What I typed most of the prompts. This first part of the README is by me.
I fixed some very minor issues like some hard to read fonts and backgrounds, changed the position of
divs to suit my taste but that's it.

I used Claude Code with plan mode. It allows me to answer question to be sure that the implementations
will go my way and it helps Claude with creating subagents to properly architecture the project and
create the proper implementations.

It helped me discover new things and know new ways to develop apps.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
