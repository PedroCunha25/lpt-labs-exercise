# The Online Store

A small e-commerce application built for the LTP Labs frontend challenge: a product listing with sorting, filtering and pagination, a product detail page, and a shopping cart.

## Running the project

The project needs Node 22.22 or later, which is what React Router v8 requires. The version is pinned in `.nvmrc`.

```bash
nvm use
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Other scripts:

| Script                 | What it does                         |
| ---------------------- | ------------------------------------ |
| `npm run build`        | Production build                     |
| `npm run typecheck`    | Generates route types and runs `tsc` |
| `npm run format`       | Formats with Prettier                |
| `npm run format:check` | Checks formatting without writing    |

A pre-commit hook formats staged files, and a pre-push hook runs the type check and the build.

## Stack

- **React Router v8** in framework mode, with server-side rendering
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** on Base UI primitives
- **DummyJSON** as the product API

The brief asked for Remix and allowed any version, naming React Router v7 as the most recent. By the time I started, v8 had been released. I checked with you before choosing it: loaders, actions and the routing structure work the same way in both, so nothing the brief asks for depends on that choice.

## How it is organised

```
app/
├── root.tsx              Root layout, header count loader
├── routes.ts             Route configuration
├── routes/
│   ├── home.tsx          Product list, filters, pagination
│   ├── product.tsx       Product detail, add to cart
│   └── cart.tsx          Cart page, quantity and removal
├── components/
│   ├── layout/           Header, footer
│   ├── product/          Cards, grid, filters, gallery, pagination
│   ├── cart/             Cart row, order summary
│   └── ui/               shadcn components
├── lib/
│   ├── api.server.ts     DummyJSON client
│   ├── cart.server.ts    Cart cookie session
│   └── product-search-params.ts
└── types/
```

Route files hold the loader, the action and the composition of the page. Anything with markup of its own lives in `components/`, grouped by the part of the app it belongs to.

Files ending in `.server.ts` never reach the browser bundle. That is where the API client and the cart session live.

## Decisions worth explaining

### List state lives in the URL, not in component state

Sorting, selected categories and the current page are all search params. A filtered view can be shared, survives a refresh and works with the browser's back button, and the loader re-runs on its own when the URL changes. There is no `useState` behind any of those controls.

Everything the loader reads is validated before it reaches the API: sorting is restricted to a known set of values, unknown category slugs are dropped, and the page number is clamped to the range that exists. DummyJSON ignores an invalid `sortBy` silently rather than erroring, so that check has to happen on our side.

### Multiple categories are filtered on the server

The design shows checkboxes, so more than one category can be active. DummyJSON returns nothing when several categories are passed to `/products/category/{slug}`, so with two or more selected the full catalogue is fetched once and then filtered, sorted and paginated inside the loader. The catalogue is 194 products and the request takes around 0.2s, which makes this cheaper than it sounds — and it stays on the server rather than shifting work to the browser.

With no category or a single one, the API endpoint does all of it and no extra work is needed.

### The cart is a server-side cookie session

The cart is stored in a signed cookie, not in `localStorage`. Only `{ id, quantity }` goes in; product titles and prices are resolved in the loader from those ids, so the cookie stays small and prices are never taken from the client.

This is also what makes the actions real. Adding, removing and changing quantity are form submissions handled on the server, and after each one React Router revalidates the loaders — which is why the count on the header icon updates on its own. There is no context, no store and no client-side cart state anywhere in the app.

Quantity changes are derived from the cart on the server. The form only says which direction to move, never what the new quantity should be.

### What is in the design but has no behaviour

The cart summary shows shipping, a checkout button, a PayPal line and a promo code field. None of these exist in the API or in the brief, so they are reproduced visually without logic behind them. Shipping is fixed at $20, which matches the figures in the design. Inventing checkout or coupon behaviour would have meant guessing at requirements that were never stated.

The same applies to the search and account icons in the header, and to the navigation links other than Home.

### Interface components come from shadcn

Anything with behaviour and accessibility attached — the sort select, category checkboxes, sheets, accordion, carousel, pagination — uses shadcn components rather than being written by hand. Plain layout is written directly in Tailwind; the navigation is a `<nav>` with links, since a dropdown component would be machinery for five flat links.

One consequence is worth stating plainly: those components need JavaScript to be operated. Page rendering, navigation and pagination work without it, because they are server-rendered and use real links, but the sort dropdown and the category checkboxes do not. That was a deliberate trade for visual fidelity and consistency, not an oversight.

### Notes on the design

The Figma shows two different sets of navigation links across its three screens. I picked one and used it everywhere, on the assumption that the difference was not intentional.

The artboards are 1440px wide. I treated that as the width the designer drew at rather than a fixed width for the site, so the layout uses the full viewport with responsive padding.

Mobile and tablet screens were not in the Figma, so the responsive behaviour is my own: the category sidebar becomes a sheet opened from the toolbar, mirroring the navigation menu in the header, and the product grid drops from three columns to two and then one.

## What is not here

No tests. The brief does not ask for them and the time was better spent on the features and on matching the design. The type check and the production build both run before every push, which catches the class of error that matters most here.

No deployment. The brief asks for a repository.

## Accessibility

Icon-only buttons have labels, images have alt text, every interactive element is reachable by keyboard with a visible focus ring, and each page has a heading — hidden where the design has no visible title. Product images are lazy loaded.
