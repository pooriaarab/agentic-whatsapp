export { sendWhatsApp, checkQuietHours, isStopMessage, GuardError, VendorError } from "./core.js";
export type { SendWhatsAppInput, SendOptions, WhatsAppReceipt, QuietHours, Vendor } from "./core.js";
export const DEFAULT_BRAND = { name: "agentic-whatsapp", command: "agentic-whatsapp", description: "Send one opted-in WhatsApp message.", version: "0.1.0" };
