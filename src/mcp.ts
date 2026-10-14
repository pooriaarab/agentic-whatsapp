import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { sendWhatsApp } from "./core.js";
const shape = { vendor: z.enum(["twilio", "meta"]), to: z.string(), body: z.string(), from: z.string().optional(), dryRun: z.boolean().optional() };
export function createMcpServer(): McpServer {
 const server = new McpServer({ name: "agentic-whatsapp", version: "0.1.0" });
 server.registerTool("send_whatsapp", { description: "Send one opted-in WhatsApp message. Dry run is the default.", inputSchema: shape }, async (input) => { try { return { content: [{ type: "text", text: JSON.stringify(await sendWhatsApp(input)) }] }; } catch (error) { return { content: [{ type: "text", text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }) }], isError: true }; } });
 return server;
}
export async function startMcp(): Promise<void> { const s = createMcpServer(); await s.connect(new StdioServerTransport()); }
