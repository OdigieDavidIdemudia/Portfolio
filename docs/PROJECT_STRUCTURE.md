# Project structure

This repository is organized around maintainable frontend architecture.

## Suggested layout
```text
.
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
├── src/
│   ├── components/
│   ├── pages/
│   └── data/
├── public/
├── styles/
├── scripts/
└── tests/
```

## Notes
- Keep content and presentation in separate layers.
- Keep environment-sensitive values out of source control.
- Prefer reusable components over duplicated markup.
