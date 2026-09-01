# What's Left

Free UK money tools. Type numbers in. Get a straight answer.

Calculators for take-home pay, a monthly budget, debt payoff, emergency funds, rent versus buy, and converting bills. For UK individuals — not a bank, and not payroll or business tax software.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Live site: [https://whatsleft.money](https://whatsleft.money).

```bash
npm test
npm run build
npm start
```

## Tax rates

PAYE, National Insurance and student loan figures for the **2026/27** tax year live in [`src/lib/uk-tax.ts`](src/lib/uk-tax.ts). Update that file when HMRC publishes new bands. The take-home tool labels results as an estimate for that year.

Pension contributions are modelled as salary sacrifice (they reduce taxable pay and employee NI).

## Deploy

This is a standard Next.js app. Deploy on Vercel or Render with `npm run build`. No database or auth is required.

## What this is not

No Open Banking, no user accounts, no PDF generation, no payments. “Email me this” opens a `mailto:` draft in your own mail app. Some tools persist numbers in `localStorage`.
