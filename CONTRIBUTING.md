# Contributing to Linky

Thank you for considering contributing to Linky! 🎉
We welcome pull requests, bug reports, suggestions, and ideas.

Please review the following guidelines to help us maintain high quality and a consistent workflow.

---

## 📋 How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of the [Linky repository](https://github.com/oorrwullie/homebridge-linky).

### 2. Create a Feature Branch

```bash
git checkout -b my-new-feature
```

### 3. Make Your Changes

- Follow existing code style (Prettier, ESLint enforced).
- Write clear commit messages.
- Update/add tests if appropriate.
- If modifying the API, update the documentation (`README.md`).

### 4. Run Tests and Lint

Before submitting, make sure your changes pass:

```bash
npm run lint
npm run build
```

Our pre-commit hooks will automatically enforce code quality.

### 5. Submit a Pull Request

Open a PR against `main` with a clear description of what you changed and why.

---

## 🧹 Code Style

- TypeScript
- Prettier formatting
- ESLint linting
- Prefer clean, minimal, readable code

We recommend installing Prettier and ESLint extensions in your editor.

---

## 🚀 Release Process

Releases are automated!
When changes are merged into `main`:

- `npm version minor` is automatically run.
- Builds are generated.
- A new release is published to GitHub and NPM.
- Release notes are generated automatically via ChatGPT if available.

You don't need to manually bump versions or publish.

---

## 🛡️ Security

If you discover any security vulnerabilities, please report them privately by opening a GitHub Security Advisory.

---

## 💬 Questions / Feedback

Feel free to open an [Issue](https://github.com/oorrwullie/homebridge-linky/issues) if you have questions, suggestions, or ideas!

---

Thanks for helping make Linky better! 🙌
