#!/usr/bin/env node
import { sendWhatsApp, type SendWhatsAppInput, VendorError, GuardError } from "./core.js";
import { VERSION } from "./version.js";
const help = `agentic-whatsapp ${VERSION}\n\nUsage: agentic-whatsapp send --vendor <twilio|meta> --to <E.164> --body <text> [--live]\n\nDry run is the default. --live sends through the vendor.`;
export function parseArgs(argv: string[]): SendWhatsAppInput {
  const values: Record<string, string | boolean> = { dryRun: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--live") values.dryRun = false;
    else if (["--vendor", "--to", "--body", "--from"].includes(arg)) values[arg.slice(2)] = argv[++i] ?? "";
    else if (arg !== "send") throw new Error(`unknown argument ${arg}`);
  }
  if (values.vendor !== "twilio" && values.vendor !== "meta") throw new Error("--vendor must be twilio or meta");
  if (!values.to || !values.body) throw new Error("send needs --to and --body");
  return { vendor: values.vendor, to: String(values.to), body: String(values.body), from: values.from ? String(values.from) : undefined, dryRun: Boolean(values.dryRun) };
}
export async function runCli(argv: string[]): Promise<number> {
  if (!argv.length || argv.includes("--help") || argv.includes("-h")) { console.log(help); return 0; }
  if (argv.includes("--version") || argv.includes("-V")) { console.log(VERSION); return 0; }
  try { console.log(JSON.stringify(await sendWhatsApp(parseArgs(argv)))); return 0; }
  catch (error) { console.error(`${error instanceof GuardError || error instanceof VendorError ? error.name : "Error"}: ${error instanceof Error ? error.message : String(error)}`); return 1; }
}
if (process.argv[1]?.endsWith("cli.js")) runCli(process.argv.slice(2)).then((code) => process.exitCode = code);
