# agentic-whatsapp

[![npm version](https://img.shields.io/npm/v/agentic-whatsapp)](https://www.npmjs.com/package/agentic-whatsapp)
[![Monthly downloads](https://img.shields.io/npm/dm/agentic-whatsapp)](https://www.npmjs.com/package/agentic-whatsapp)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/license/mit)

agentic-whatsapp is an open-source WhatsApp text messaging wrapper for Node.js applications and AI agents, with Twilio and Meta WhatsApp Cloud API adapters.

## Install

```sh
npm install agentic-whatsapp
```

Requires Node.js 18 or later. Includes TypeScript declarations and two direct runtime dependencies.

## Preview your first message

```js
import { sendWhatsApp } from "agentic-whatsapp";
const receipt = await sendWhatsApp({
  vendor: "twilio", to: "+15551234567", body: "Your order is ready",
});
console.log(receipt.dryRun, receipt.to, receipt.body);
```

Expect `true`, `+15551234567`, and `Your order is ready`. No API keys or network calls are required.
Set `dryRun: false` for live SDK sends. Only send to contacts who opted in.

## Features and coverage

- Preview one message or send plain text through a vendor.
- Validate E.164 recipient numbers and nonempty message bodies.
- Block SDK sends during an optional UTC quiet-hours window.
- Detect exact `STOP` text with `isStopMessage` for application handling.

| Vendor | Status | Environment keys |
| --- | --- | --- |
| Twilio | Implemented: Messages API | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` |
| Meta WhatsApp Cloud API | Implemented: Graph API v21.0 text messages | `META_WHATSAPP_ACCESS_TOKEN`, `META_WHATSAPP_PHONE_NUMBER_ID` |

Two vendor paths are implemented. Tests use mocked HTTP responses; this rewrite includes no live credential checks.
Export credentials in your shell, or pass an `env` map through SDK options. The package does not load `.env` files.
Twilio's sender can also come from the `from` input.

## Runtime surfaces

```sh
npx agentic-whatsapp send --vendor twilio --to +15551234567 --body "Your order is ready"
npx agentic-whatsapp --help
npx agentic-whatsapp --version
npx agentic-whatsapp-mcp
```

The CLI has one send command, with `--vendor`, `--to`, `--body`, optional `--from`, and `--live`.
The Model Context Protocol (MCP) server exposes one tool: `send_whatsapp`.
Quiet hours are SDK options; the CLI and MCP tool do not expose them.

## Behavior limits

The package does not store consent, process inbound messages, or automatically enforce opt-outs.
`isStopMessage` is a helper; `sendWhatsApp` does not call it or maintain a suppression list.
Templates, media, delivery polling, automatic retries, and request timeouts are not implemented.
A returned vendor ID describes API acceptance, not confirmed delivery. A successful response can omit an ID.
There is no cost-report API or managed messaging service.

## Links and status

[Package](https://www.npmjs.com/package/agentic-whatsapp) · [Source and support](https://github.com/pooriaarab/agentic-whatsapp)

Version 0.1.1 APIs can change. Public case studies are not yet published.
Run `npm run build`, `npm run typecheck`, and `npm test` before contributing.

## License

MIT.
