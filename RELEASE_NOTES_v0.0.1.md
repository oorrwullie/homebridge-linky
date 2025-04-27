# ✨ v0.0.1 - Initial Release 🎉

First public release of **Linky** — a lightweight, secure API server for HomeKit device control through Homebridge.

---

## 🚀 Highlights

- **Device Listing**: Query all registered HomeKit devices via `/devices`.
- **Device Control**: Turn devices on/off and set characteristics (e.g., brightness, temperature) via REST API.
- **Secure Authentication**: API key authentication with dynamic key rotation support.
- **Dynamic Key Rotation**: Admin endpoint `/rotate-key` for live API key updates without restart.
- **Health Monitoring**: Health checks available via `/healthz`.
- **Prometheus Metrics**: Real-time server and device metrics available at `/metrics`.
- **Homebridge UI Integration**: Configuration via Homebridge settings.
- **Fast, Modern Server**: Built on Fastify, TypeScript, and best practices.

---

## 🛡 Security

- All device control endpoints require an API key in the `x-linky-key` header.
- Admin operations require the special `x-linky-admin` secret.
- Key generation uses strong cryptographic randomness.

---

## 🛤 Roadmap Ahead

- Add WebSocket support for real-time device updates 🔥
- Extend bulk device control
- Optional OAuth2 external authorization layer
- Homebridge UI panel for live monitoring (stretch goal)

---

## 📚 How to Get Started

- Install via npm:
  ```bash
  npm install -g homebridge-linky
  ```
- Configure in your Homebridge `config.json` under platforms.

- Full API and usage documentation available in the [README](https://github.com/oorrwullie/homebridge-linky#readme).

---

## 🛠 Notes

- Compatible with Node.js 16+ and Homebridge latest versions.
- Developed with modern TypeScript, ESLint, and Prettier tooling.
- Future-proof architecture for easy feature extension.

---

🎉 Thank you for trying Linky!
Feel free to [open issues](https://github.com/oorrwullie/homebridge-linky/issues) or [submit pull requests](https://github.com/oorrwullie/homebridge-linky/pulls) if you have feedback!
