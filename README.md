# ScholarPath AI

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-5ipbaphg)

An AI-powered scholarship discovery app that matches Indian students with relevant scholarships based on their personal, academic, and financial profile.

## Features

- **Smart Profile Form** — Collects name, age, gender, state, category, annual income, education level, course, email, and phone.
- **AI-Powered Matching** — Sends the profile to a webhook-backed AI service that returns tailored scholarship recommendations.
- **Scholarship Cards** — Each result shows the scholarship name, amount, eligibility, deadline, required documents, and an apply link.
- **Loading States** — Animated, cycling status messages while the AI processes the request.
- **Empty & Error States** — Graceful fallbacks when no matches are found or the service is unreachable.
- **Responsive Design** — Optimized for mobile and desktop with a clean, modern UI built on Tailwind CSS.

## Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool & dev server)
- **Tailwind CSS** (styling)
- **lucide-react** (icons)
- Webhook-based AI backend (`https://workflow.ccbp.in/webhook-test/scholarship-assistant`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app runs on the Vite dev server (URL is printed in the terminal).

### Build

```bash
npm run build
```

The production build is output to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## How It Works

1. The user fills in their profile on the form.
2. On submit, the profile is POSTed as JSON to the configured webhook URL.
3. The AI service responds with a list of matching scholarships.
4. Scholarships are normalized and rendered as cards with apply links.
5. If no scholarships are returned, the user is asked to check their mailbox for shared information.

## Configuration

The webhook URL is defined as a constant in `src/App.tsx`:

```ts
const WEBHOOK_URL = "https://workflow.ccbp.in/webhook-test/scholarship-assistant";
```

Swap `webhook-test` for `webhook` to use the production endpoint.

## Project Structure

```
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── App.tsx        # Main app component (form, results, states)
    ├── main.tsx       # React entry point
    ├── index.css      # Tailwind directives & base styles
    └── vite-env.d.ts  # Vite type declarations
```

## License

This project is for educational/demo purposes.
