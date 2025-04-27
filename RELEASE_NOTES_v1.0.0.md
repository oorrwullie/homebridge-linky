# Linky v1.0.0 🚀

**Initial stable release** of Linky — a lightweight API server for remote control of HomeKit devices through Homebridge.

---

## ✨ Features

- 🔑 **Secure API authentication** using strong random API keys
- 🔁 **Dynamic API key rotation** without restarting Homebridge
- 📋 **Full REST API** to list, control, and monitor HomeKit devices
- 📈 **Built-in `/metrics` endpoint** (Prometheus-compatible)
- 🩺 **Health check endpoint `/healthz`** for uptime monitoring
- ⚙️ **Dynamic `/config` endpoint** to inspect server runtime settings
- 🔒 **Rate limiting** to prevent API abuse
- 🚀 **Future-ready WebSocket support** planned for real-time updates
- 🛡️ **Admin-only protected endpoints** for API key management

---

## 🛠 Setup

Install via Homebridge UI, or manually:

```bash
npm install -g homebridge-linky
```

Configure Linky inside your Homebridge `config.json`:

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

## 📚 Documentation

- [Installation Guide](#installation)
- [API Usage](#usage)
- [Security Notes](#security)
- [Development Setup](#development)

Full documentation available in the [README.md](https://github.com/yourname/homebridge-linky/blob/main/README.md).

---

## ❤️ Thank you!

Thank you for trying out Linky!
PRs, feature requests, and suggestions are warmly welcome! ✨

---
