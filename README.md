# Linky

> A simple Homebridge plugin to remotely list and control your HomeKit devices over the internet via a secure API key.

<p align="center">
  <a href="https://www.npmjs.com/package/homebridge-linky">
    <img alt="npm" src="https://img.shields.io/npm/v/homebridge-linky">
  </a>
  <a href="https://github.com/oorrwullie/homebridge-linky/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
  <a href="https://nodejs.org/en/">
    <img alt="Node.js Version" src="https://img.shields.io/node/v/homebridge-linky">
  </a>
  <a href="https://github.com/oorrwullie/homebridge-linky/actions/workflows/publish.yml">
    <img alt="Build Status" src="https://github.com/oorrwullie/homebridge-linky/actions/workflows/publish.yml/badge.svg">
  </a>
</p>

---

## Features

- 📋 List all HomeKit devices with metadata
- 🔄 Get real-time device states
- 🎛️ Control devices (On/Off/Set characteristics)
- 🔐 API Key authentication (secure and rotatable)
- 📊 Built-in `/metrics` Prometheus endpoint
- 📡 Auto-detects device reachability and status
- ⚡ Fully configurable inside Homebridge UI
- 🚀 Fully automated GitHub Actions release pipeline (with ChatGPT Release Notes!)

---

## Installation

```bash
npm install -g homebridge-linky
```

---

## Configuration (inside Homebridge UI)

| Field | Description |
|:------|:------------|
| `port` | Port the Linky server listens on (default: 8081) |
| `apiKey` | (Optional) Predefined API key. If blank, a secure random key is generated. |

---

## API Reference

All API requests require the header:

```http
x-linky-key: YOUR_API_KEY
```

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/` | `GET` | Welcome route with Linky status |
| `/healthz` | `GET` | Health check route |
| `/metrics` | `GET` | Prometheus-formatted metrics |
| `/config` | `GET` | Current server config |
| `/rotate-key-secret` | `GET` | Get the secret for rotating the API key |
| `/rotate-key` | `POST` | Rotate the API key (requires `x-linky-admin` header) |
| `/devices` | `GET` | List all HomeKit devices |
| `/device/:id` | `GET` | Get state of specific device |
| `/device/:id/on` | `POST` | Turn a device ON |
| `/device/:id/off` | `POST` | Turn a device OFF |
| `/device/:id/set` | `POST` | Set a specific characteristic |

---

## Authentication

- All normal API requests require a valid `x-linky-key` header.
- API keys can be rotated at runtime securely via the `/rotate-key` endpoint.

---

## Metrics

Exposes a Prometheus-friendly `/metrics` endpoint:

| Metric | Description |
|:-------|:------------|
| `linky_uptime_seconds` | Server uptime |
| `linky_device_count` | Total registered devices |
| `linky_device_reachable_count` | Currently reachable devices |
| `linky_memory_heap_total_bytes` | Node.js heap memory total |
| `linky_memory_heap_used_bytes` | Node.js heap memory used |
| `linky_cpu_load_average_1m/5m/15m` | CPU load averages |

---

## Contributing & Release Process

Linky uses a fully automated release pipeline powered by GitHub Actions:

- Every push to the `main` branch triggers:
  - `npm version minor` bump (e.g., v0.2.0 → v0.3.0)
  - Builds and publishes a new version to NPM
  - Generates GitHub Release Notes automatically using ChatGPT (if available)
  - Creates a new GitHub Release with the generated notes
  - Cleans up version bumps after publish, even on failure

Pre-commit hooks (powered by Husky) automatically run:

- Code formatting via Prettier
- Linting via ESLint
- TypeScript compilation
- Build script validation

> 💬 If your OpenAI API quota is exceeded, Linky falls back to static release notes ("Minor improvements and bug fixes.") to ensure uninterrupted publishing.

### Requirements

- GitHub Secrets:
  - `NPM_TOKEN` — for publishing to NPM.
  - `OPENAI_API_KEY` — (optional) for generating smarter release notes.

---

## Manual Publishing (Optional)

If needed, you can manually trigger a build and publish:

```bash
npm run build
npm version minor
npm publish
```

✅ Otherwise, everything happens automatically when you push to `main`!

---

## License

MIT © 2025 [oorrwullie](https://github.com/oorrwullie)

---

## 🤝 Contributing

We welcome contributions from the community!
Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting a pull request.

## 🛡️ Code of Conduct

We expect all contributors to follow our [Code of Conduct](./.github/CODE_OF_CONDUCT.md) to foster a welcoming environment.

## 🔒 Security

If you discover a vulnerability, please follow our [Security Policy](./.github/SECURITY.md) for responsible disclosure.
