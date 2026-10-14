import { describe, expect, it, vi } from "vitest";
import { GuardError, VendorError, sendWhatsApp } from "./core.js";
describe("sendWhatsApp", () => {
 it("defaults to dry run", async () => expect(await sendWhatsApp({ vendor: "twilio", to: "+15551234567", body: "STOP" })).toMatchObject({ dryRun: true, body: "STOP" }));
 it("honors quiet hours", async () => await expect(sendWhatsApp({ vendor: "meta", to: "+15551234567", body: "Hi" }, { quietHours: { startHour: 9, endHour: 17 }, now: () => new Date("2020-01-01T10:00:00Z") })).rejects.toBeInstanceOf(GuardError));
 it("surfaces vendor errors", async () => { const fetchFn = vi.fn().mockResolvedValue(new Response("bad", { status: 400 })); await expect(sendWhatsApp({ vendor: "meta", to: "+15551234567", body: "Hi", dryRun: false }, { fetchFn, env: { META_WHATSAPP_ACCESS_TOKEN: "x", META_WHATSAPP_PHONE_NUMBER_ID: "y" } })).rejects.toBeInstanceOf(VendorError); });
});
