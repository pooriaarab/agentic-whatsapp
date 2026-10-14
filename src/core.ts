export type Vendor = "twilio" | "meta";

export interface SendWhatsAppInput {
  vendor: Vendor;
  to: string;
  body: string;
  from?: string;
  dryRun?: boolean;
}

export interface WhatsAppReceipt {
  vendor: Vendor;
  to: string;
  body: string;
  dryRun: boolean;
  id?: string;
  at: string;
}

export class GuardError extends Error {
  readonly code = "GUARD_DENIED";
  constructor(message: string) { super(message); this.name = "GuardError"; }
}

export class VendorError extends Error {
  readonly code = "VENDOR_FAILED";
  constructor(message: string, readonly status?: number) { super(message); this.name = "VendorError"; }
}

export interface QuietHours { startHour: number; endHour: number; }
export interface SendOptions {
  quietHours?: QuietHours;
  now?: () => Date;
  fetchFn?: typeof fetch;
  env?: Record<string, string | undefined>;
}

export function isStopMessage(body: string): boolean {
  return body.trim().toUpperCase() === "STOP";
}

export function checkQuietHours(hours: QuietHours | undefined, now = new Date()): void {
  if (!hours) return;
  const { startHour, endHour } = hours;
  if (![startHour, endHour].every((hour) => Number.isInteger(hour) && hour >= 0 && hour <= 24)) {
    throw new Error("quiet hours must use integer UTC hours from 0 to 24");
  }
  const hour = now.getUTCHours();
  const blocked = startHour <= endHour ? hour >= startHour && hour < endHour : hour >= startHour || hour < endHour;
  if (blocked) throw new GuardError(`quiet hours block sends from ${startHour}:00 to ${endHour}:00 UTC`);
}

function required(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) throw new VendorError(`missing ${key} for live send`);
  return value;
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text();
  return text || response.statusText;
}

export async function sendWhatsApp(input: SendWhatsAppInput, options: SendOptions = {}): Promise<WhatsAppReceipt> {
  if (!/^\+[1-9]\d{6,14}$/.test(input.to)) throw new GuardError("to must be an E.164 phone number");
  if (!input.body.trim()) throw new GuardError("body must not be empty");
  checkQuietHours(options.quietHours, options.now?.());
  const dryRun = input.dryRun ?? true;
  const receipt: WhatsAppReceipt = { vendor: input.vendor, to: input.to, body: input.body, dryRun, at: (options.now?.() ?? new Date()).toISOString() };
  if (dryRun) return receipt;

  const env = options.env ?? process.env;
  const fetchFn = options.fetchFn ?? fetch;
  let response: Response;
  try {
    if (input.vendor === "twilio") {
      const sid = required(env, "TWILIO_ACCOUNT_SID");
      const token = required(env, "TWILIO_AUTH_TOKEN");
      const from = input.from ?? required(env, "TWILIO_WHATSAPP_FROM");
      const form = new URLSearchParams({ To: `whatsapp:${input.to}`, From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`, Body: input.body });
      response = await fetchFn(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: "POST", headers: { authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
    } else {
      const token = required(env, "META_WHATSAPP_ACCESS_TOKEN");
      const phoneNumberId = required(env, "META_WHATSAPP_PHONE_NUMBER_ID");
      response = await fetchFn(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to: input.to.slice(1), type: "text", text: { body: input.body } }) });
    }
  } catch (error) {
    if (error instanceof VendorError) throw error;
    throw new VendorError(`vendor request failed: ${String(error)}`);
  }
  if (!response.ok) throw new VendorError(`vendor returned ${response.status}: ${await parseError(response)}`, response.status);
  const data = await response.json() as { sid?: string; messages?: Array<{ id?: string }> };
  return { ...receipt, dryRun: false, id: input.vendor === "twilio" ? data.sid : data.messages?.[0]?.id };
}
