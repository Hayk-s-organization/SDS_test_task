# SDS Test Task - Task Management Application

A modern, responsive task management application built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- ✨ Create, read, update, and delete tasks
- 🎯 Filter tasks by status and priority
- 🔍 Search functionality
- 📱 Fully responsive design
- 🎨 Beautiful UI with Radix UI components
- ♿ Accessible components following ARIA guidelines
- 🚀 Optimistic UI updates

## Tech Stack

- **Framework:** Next.js 16.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI
- **State Management:** SWR
- **Form Validation:** Joi
- **Code Quality:** ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint and auto-fix issues
npm run format       # Format all files with Prettier
npm run format:check # Check if files are formatted correctly
```

## Code Formatting with Prettier

This project uses Prettier for consistent code formatting across the codebase.

### Prettier Configuration

The Prettier configuration is defined in `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 120,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "proseWrap": "preserve"
}
```

### Using Prettier

**Format all files:**

```bash
npm run format
```

**Check formatting without making changes:**

```bash
npm run format:check
```

**Format specific files:**

```bash
npx prettier --write "path/to/file.tsx"
```

### IDE Integration

#### VS Code

Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and add to your settings:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### WebStorm / IntelliJ IDEA

1. Go to `Settings/Preferences` → `Languages & Frameworks` → `JavaScript` → `Prettier`
2. Set Prettier package: `node_modules/prettier`
3. Enable "On save" or "On Reformat Code"

## ESLint Configuration

ESLint is configured to work seamlessly with Prettier. The configuration includes:

- Next.js recommended rules
- Prettier integration (no conflicts)
- TypeScript support
- React Hooks rules
- Accessibility rules

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── styles/             # Global styles
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run `npm run lint` and `npm run format` before committing
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Code Style Guidelines

- Follow the Prettier configuration for formatting
- Use TypeScript for type safety
- Follow React best practices and hooks rules
- Ensure all components are accessible
- Write meaningful variable and function names
- Keep components small and focused

## License

This project is licensed under the MIT License.
