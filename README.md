# Linky

![Homebridge](https://img.shields.io/badge/homebridge-plugin-blueviolet)
![npm](https://img.shields.io/npm/v/homebridge-linky)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Linky is a simple, fast, and secure API server for controlling HomeKit devices remotely via Homebridge.

Built with performance and safety in mind, Linky exposes a lightweight REST API with dynamic key rotation, device state monitoring, metrics, and future WebSocket support.

---

## ✨ Features

- Full device listing and state reporting
- Device control (on/off/set characteristics)
- REST API secured by an API key
- Dynamic API key rotation via Homebridge UI
- Health checks and Prometheus-compatible metrics
- Fastify server optimized for embedded use
- Future WebSocket support planned
- Built with TypeScript and modern tooling

---

## 🚀 Installation

Install Linky alongside your existing Homebridge setup.

```bash
npm install -g homebridge-linky
```

Add Linky to your Homebridge config:

```json
{
  "platforms": [
    {
      "platform": "Linky",
      "name": "Linky",
      "apiKey": "<your-secure-api-key>",
      "port": 8581
    }
  ]
}
```

**Notes:**
- If no `apiKey` is specified, Linky will generate a random secure key on startup.
- API access is secured using the API key provided in HTTP headers.

---

## 🔒 Authentication

All API requests must include:

```http
x-linky-key: <your-api-key>
```

For admin actions like rotating the API key, use:

```http
x-linky-admin: <rotate-key-secret>
```

Rotate-key-secret is auto-generated and retrievable from `/rotate-key-secret`.

---

## 📚 API Endpoints

| Method | URL | Purpose |
|:-------|:----|:--------|
| `GET` | `/` | Welcome message and uptime |
| `GET` | `/healthz` | Health check status |
| `GET` | `/metrics` | Prometheus format server metrics |
| `GET` | `/config` | Basic server configuration info |
| `GET` | `/devices` | List all devices |
| `GET` | `/device/:id` | Get device state |
| `POST` | `/device/:id/on` | Turn device ON |
| `POST` | `/device/:id/off` | Turn device OFF |
| `POST` | `/device/:id/set` | Set a device characteristic |
| `GET` | `/rotate-key-secret` | Retrieve the admin rotate key secret |
| `POST` | `/rotate-key` | Rotate the API key dynamically |

---

## 📦 Example API Usage

### List Devices

```bash
curl -H "x-linky-key: <your-api-key>" http://localhost:8581/devices
```

### Turn a device ON

```bash
curl -X POST -H "x-linky-key: <your-api-key>" http://localhost:8581/device/<device-id>/on
```

### Set device brightness

```bash
curl -X POST -H "x-linky-key: <your-api-key>" -H "Content-Type: application/json" \
  -d '{"characteristic": "Brightness", "value": 75}' \
  http://localhost:8581/device/<device-id>/set
```

### Rotate API Key (admin)

```bash
curl -X POST -H "x-linky-admin: <rotate-key-secret>" http://localhost:8581/rotate-key
```

---

## 🛡 Security Best Practices

- **Keep your API key secret** — use HTTPS for production deployments.
- **Rotate your API key** periodically using the `/rotate-key` endpoint.
- **Use strong randomly generated keys** (Linky will generate one automatically if missing).

---

## 📈 Metrics Available

Exposed via `/metrics` in Prometheus format:

- `linky_uptime_seconds`
- `linky_device_count`
- `linky_device_reachable_count`
- `linky_memory_heap_total_bytes`
- `linky_memory_heap_used_bytes`
- `linky_cpu_load_average_1m`
- `linky_cpu_load_average_5m`
- `linky_cpu_load_average_15m`

---

## 🛤 Roadmap

- [x] Device listing and control
- [x] API key authentication and rotation
- [x] Health check and metrics
- [ ] Real-time WebSocket push notifications
- [ ] Bulk device state updates
- [ ] OAuth2 integration for secure external access
- [ ] Homebridge UI control panel plugin (stretch goal)

---

## 🖋 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues, submit pull requests, or suggest features.

---

## 📬 Contact

Find me on GitHub: [@oorrwullie](https://github.com/oorrwullie)

---
