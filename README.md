# Linky

[![npm version](https://img.shields.io/npm/v/homebridge-linky.svg)](https://www.npmjs.com/package/homebridge-linky)
[![homebridge verified](https://badgen.net/badge/homebridge/verified/green)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A simple, fast, secure API server to control HomeKit devices remotely via Homebridge.

Built for minimal overhead, full observability, and dynamic secure API access.

---

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
  - [General API Endpoints](#general-api-endpoints)
  - [Device Control Endpoints](#device-control-endpoints)
  - [Admin/Key Management Endpoints](#adminkey-management-endpoints)
- [Security](#-security)
- [Development](#-development)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Contributing](#️-contributing)

---

## ✨ Features

- List, control, and monitor HomeKit devices over REST API
- Secure authentication with API keys
- Dynamic API key rotation
- Built-in `/healthz`, `/metrics`, and `/config` endpoints
- Full Prometheus-compatible metrics
- Future-ready for WebSocket real-time events

---

## 📦 Installation

Install via Homebridge UI, or manually:

```bash
npm install -g homebridge-linky
```

Add to your Homebridge `config.json`:

```json
{
  "platforms": [
    {
      "platform": "Linky",
      "port": 8081,
      "apiKey": "your-secure-api-key-here"
    }
  ]
}
```

---

## 🚀 Usage

After installation and Homebridge restart:

- API available at: `http://<your-homebridge-ip>:8081`
- Authenticate all requests with header:

```http
x-api-key: YOUR_API_KEY
```

---

### General API Endpoints

| Method | Path | Description |
|:------|:----|:------------|
| `GET` | `/` | Welcome/info |
| `GET` | `/healthz` | Health check |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/config` | Current configuration info |

---

### Device Control Endpoints

| Method | Path | Description |
|:------|:----|:------------|
| `GET` | `/devices` | List all HomeKit devices |
| `GET` | `/device/:id` | Get a specific device's state |
| `POST` | `/device/:id/on` | Turn a device ON |
| `POST` | `/device/:id/off` | Turn a device OFF |
| `POST` | `/device/:id/set` | Set a specific device characteristic |

---

### Admin/Key Management Endpoints

| Method | Path | Description |
|:------|:----|:------------|
| `GET` | `/rotate-key-secret` | Retrieve the current rotate-key secret (internal use) |
| `POST` | `/rotate-key` | Rotate the API key (requires admin header) |

---

### Example: List Devices

```bash
curl -X GET http://localhost:8081/devices -H "x-api-key: YOUR_API_KEY"
```

---

## 🔒 Security

- All API calls require a secure, random API key
- API key can be rotated at runtime without restarting Homebridge
- `/rotate-key` protected by a dynamic secret known only at runtime
- Rate limiting built-in to prevent abuse

---

## 🛠 Development

Clone repo:

```bash
git clone https://github.com/yourname/homebridge-linky.git
cd homebridge-linky
npm install
```

Build the project:

```bash
npm run build
```

Run for development:

```bash
npm run dev
```

Lint code:

```bash
npm run lint
```

Auto-fix lint issues:

```bash
npm run lint:fix
```

---

## 🗺️ Future Roadmap

- 🔥 Add WebSocket real-time device update support
- 📲 Add optional push notifications for device events
- 🛡️ Allow per-device fine-grained API permissions
- 📝 Add automatic device status history logging
- 📊 Add `/stats` endpoint with more detailed usage analytics
- 🖥️ Build a simple web dashboard frontend for managing devices
- 🧠 Explore HomeKit automations integration (v2.0+)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## ❤️ Contributing

PRs, feature requests, and suggestions are welcome!

---
