# Give a Meal

A platform that connects meal donors with people experiencing food insecurity. Partner restaurants accept meal donations from customers, and individuals in need can browse and reserve available meals nearby.

## How it works

1. **Restaurants** sign up and list meal items they offer
2. **Donors** contribute meals at partner restaurants (tracked via the platform)
3. **People in need** find nearby restaurants with available meals and reserve them using the Give a Meal app

The platform includes a public-facing website, a donor portal, a business management layer for restaurants, and an admin dashboard powered by [Payload CMS](https://payloadcms.com).

## Tech stack

- **Next.js 15** (React 19, TypeScript)
- **Payload CMS v3** — admin panel, auth, data modeling, background jobs
- **MongoDB** — database
- **Google Maps API** — location-based restaurant discovery
- **Nodemailer** — transactional emails (magic link login, donation confirmations)
- **Expo Push Notifications** — alerts for the companion mobile app

## Getting started

### Prerequisites

- Node.js >= 20
- MongoDB running locally (default: `mongodb://localhost:27017`)

### Setup

```bash
# Install dependencies
npm install

# Copy the sample env file and fill in your values
cp .env.sample .env

# Start the dev server
npm run dev
```

The app runs at [localhost:3000](http://localhost:3000). The admin panel is at [localhost:3000/admin](http://localhost:3000/admin).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `PAYLOAD_SECRET` | Yes | Any random string, used to sign auth tokens |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_BASE_URL` | Yes | Where the app is hosted (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Google Maps JS API key (for location search) |
| `GOOGLE_GEOCODING_API_KEY` | No | Separate key for server-side geocoding (can match the above in dev) |
| `OPENAI_API_KEY` | No | For automated i18n translation |
| `SMTP_USER` / `SMTP_PASS` / `SMTP_HOST` | No | SMTP credentials for sending emails |
| `INBOUND_EMAIL` | No | Address shown as the sender |


## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint
npm run translate        # Sync i18n dictionaries (requires OPENAI_API_KEY)
npm run generate:types   # Regenerate TypeScript types from Payload schema
```

## i18n

The app supports English and Spanish. Dictionaries live in `src/dictionaries/`.

To add new copy: add the key to either language file, then run `npm run translate`. The script finds keys that exist in only one dictionary and translates them into the other using OpenAI.

Pages are generated for each language automatically at build time.

## Project structure

```
src/
├── app/
│   ├── (frontend)/[lang]/   # Public pages (give-a-meal, get-a-meal, donors, restaurants)
│   ├── (payload)/            # Payload admin panel
│   └── api/custom/           # REST API routes (auth, donations, businesses, etc.)
├── collections/              # Payload data models (Users, Businesses, Donations, etc.)
├── components/               # React components
├── sections/                 # Landing page sections
├── dictionaries/             # i18n translation files (en.json, es.json)
├── lib/                      # API middleware, auth helpers, server actions
├── strategies/               # Magic link auth strategy
└── payload.config.ts         # Payload CMS config
```
