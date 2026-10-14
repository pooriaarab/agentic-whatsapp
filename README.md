# agentic-whatsapp

Send an opted-in WhatsApp message with **Twilio** or the **Meta WhatsApp Cloud API**. This CLI, MCP server, and agent library sends one message at a time. Dry run is the default.

Only send to a contact who has opted in.

## Install

```sh
npm install agentic-whatsapp
```

## Vendors

| Brand | Environment key | Live command |
| --- | --- | --- |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` | `agentic-whatsapp send --vendor twilio --to +15551234567 --body "Your order is ready" --live` |
| Meta WhatsApp Cloud API | `META_WHATSAPP_ACCESS_TOKEN`, `META_WHATSAPP_PHONE_NUMBER_ID` | `agentic-whatsapp send --vendor meta --to +15551234567 --body "Your order is ready" --live` |

## Quick start

This previews a Twilio message. It does not use the network or send a message.

```sh
npx agentic-whatsapp send --vendor twilio --to +15551234567 --body "Your order is ready"
```

Use `--live` only after you confirm that the contact opted in. The live adapters call Twilio or Meta over HTTPS.

## Three uses

### CLI

```sh
agentic-whatsapp send --vendor meta --to +15551234567 --body "Hello" --live
```

### Library

```ts
import { sendWhatsApp } from "agentic-whatsapp";

const receipt = await sendWhatsApp({
  vendor: "twilio",
  to: "+15551234567",
  body: "Hello",
});
```

### MCP

```sh
npx agentic-whatsapp-mcp
```

Call `send_whatsapp` with `vendor`, `to`, `body`, and optional `dryRun`.

## Guards

Only message people who opted in. `STOP` is preserved in every receipt so your application can log it. Pass `quietHours: { startHour, endHour }` to the library to block sends during a UTC window. Vendor errors are returned plainly.
