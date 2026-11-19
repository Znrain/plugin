// Run the same server on your own machine: node local.mjs  (Node 18+)
// Then expose it with a tunnel, for example: cloudflared tunnel --url http://localhost:8787
import http from "node:http";
import { handle } from "./src/mcp.js";

const PORT = Number(process.env.PORT || 8787);

http
  .createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const request = new Request(`http://${req.headers.host || "localhost"}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : body,
    });
    const response = await handle(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  })
  .listen(PORT, () => console.log(`Fake TikTok Shop MCP (SAMPLE) on http://localhost:${PORT}/mcp`));
