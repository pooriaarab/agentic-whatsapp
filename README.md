# agentic-whatsapp

Send one opted-in WhatsApp message.

Dry run is the default. Use `--live` only when you are ready to send.

## Install

```sh
npm install agentic-whatsapp
```

## Quick start

This previews a Twilio message. It does not send it.

```sh
npx agentic-whatsapp send --vendor twilio --to +15551234567 --body "Your order is ready"
```

## Three uses

### CLI

Use `--live` to send. Twilio needs `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
and `TWILIO_WHATSAPP_FROM`. Meta needs `META_WHATSAPP_ACCESS_TOKEN` and
`META_WHATSAPP_PHONE_NUMBER_ID`.

```sh
agentic-whatsapp send --vendor meta --to +15551234567 --body "Hello" --live
```

### Library

```ts
import { sendWhatsApp } from "agentic-whatsapp";
const receipt = await sendWhatsApp({ vendor: "twilio", to: "+15551234567", body: "Hello" });
```

### MCP

```sh
npx agentic-whatsapp-mcp
```

Call `send_whatsapp` with `vendor`, `to`, `body`, and optional `dryRun`.

## Guards

Only message people who opted in. `STOP` is preserved in every receipt so your
application can log it. Pass `quietHours: { startHour, endHour }` to the
library to block sends during a UTC window. Vendor errors are returned plainly.
