# Job Applications CLI

A TypeScript CLI tool for tracking job applications using Ink, Drizzle ORM, and pglite (embedded Postgres).

## Features
- Add new job applications with company, link, platform, and status
- List all applications in a table-like format
- Update application status or delete applications
- Fast search and selection using QuickSearchInput
- ESC key navigation for quick back/exit
- Data stored locally in embedded Postgres (pglite)

## Technologies
- TypeScript
- Ink (CLI UI)
- ink-form, ink-select-input, ink-quicksearch-input
- Drizzle ORM
- pglite

## Getting Started

### Install dependencies
```bash
npm install
```

### Create database
```bash
npm run drizzle:migrate
```

### Run the CLI
```bash
npm run build && npm run start
```
