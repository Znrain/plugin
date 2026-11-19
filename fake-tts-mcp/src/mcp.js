// Fake TikTok Shop MCP server (SAMPLE ONLY).
// Stateless Streamable HTTP: every JSON-RPC request is answered with a JSON body.
// No real TikTok Shop API is called; every value returned is made up.

const SERVER_INFO = { name: "fake-tiktok-shop", title: "TikTok Shop (SAMPLE)", version: "0.1.0" };
const SUPPORTED_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];

const TOOLS = [
  {
    name: "get_shop_performance",
    title: "Get shop performance",
    description: "Returns GMV, orders, visitors and conversion rate for the seller's TikTok Shop over a date range. Use when the seller asks how the shop is doing. SAMPLE data only.",
    inputSchema: {
      type: "object",
      properties: {
        start_date: { type: "string", description: "Start date, YYYY-MM-DD" },
        end_date: { type: "string", description: "End date, YYYY-MM-DD" },
      },
      required: ["start_date", "end_date"],
    },
    annotations: { title: "Get shop performance", readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_products",
    title: "List products",
    description: "Lists products in the seller's shop with status, price, stock and listing quality score. SAMPLE data only.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 20, description: "How many products to return (1-20). Default 5." },
      },
    },
    annotations: { title: "List products", readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "diagnose_listing_quality",
    title: "Diagnose listing quality",
    description: "Checks one product listing against listing quality rules and returns the issues found with suggested fixes. Does not change the listing. SAMPLE data only.",
    inputSchema: {
      type: "object",
      properties: { product_id: { type: "string", description: "Product ID from list_products" } },
      required: ["product_id"],
    },
    annotations: { title: "Diagnose listing quality", readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "list_affiliate_samples",
    title: "List affiliate sample requests",
    description: "Lists affiliate creator sample requests in the last N days and whether each creator has posted content. SAMPLE data only.",
    inputSchema: {
      type: "object",
      properties: { days: { type: "integer", minimum: 1, maximum: 90, description: "Look-back window in days (1-90). Default 30." } },
    },
    annotations: { title: "List affiliate sample requests", readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "update_product_price",
    title: "Update product price",
    description: "Changes the price of one SKU. In this SAMPLE server nothing is changed; the call only echoes what would happen.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
        sku_id: { type: "string", description: "SKU ID" },
        new_price: { type: "number", exclusiveMinimum: 0, description: "New price in USD" },
      },
      required: ["product_id", "sku_id", "new_price"],
    },
    annotations: { title: "Update product price", readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "send_affiliate_invitation",
    title: "Send affiliate invitation",
    description: "Sends a target collaboration invitation to one affiliate creator. In this SAMPLE server nothing is sent; the call only echoes what would happen.",
    inputSchema: {
      type: "object",
      properties: {
        creator_id: { type: "string", description: "Creator ID from list_affiliate_samples" },
        product_ids: { type: "array", items: { type: "string" }, minItems: 1, description: "Products to invite the creator for" },
        commission_rate: { type: "number", minimum: 0.01, maximum: 0.8, description: "Commission rate, 0.01-0.8" },
      },
      required: ["creator_id", "product_ids", "commission_rate"],
    },
    annotations: { title: "Send affiliate invitation", readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
  },
];

const PRODUCTS = [
  { product_id: "P1001", name: "Sample Wireless Earbuds", status: "LIVE", price: 29.99, stock: 420, quality_score: 62 },
  { product_id: "P1002", name: "Sample Yoga Mat", status: "LIVE", price: 19.5, stock: 1200, quality_score: 88 },
  { product_id: "P1003", name: "Sample LED Desk Lamp", status: "LIVE", price: 24.0, stock: 75, quality_score: 54 },
  { product_id: "P1004", name: "Sample Phone Case", status: "LIVE", price: 9.99, stock: 3300, quality_score: 91 },
  { product_id: "P1005", name: "Sample Travel Bottle", status: "DRAFT", price: 14.0, stock: 0, quality_score: 40 },
];

const SAMPLES = [
  { creator_id: "C201", handle: "@sample_creator_a", followers: 182000, sample_delivered_days_ago: 21, posted: false },
  { creator_id: "C202", handle: "@sample_creator_b", followers: 54000, sample_delivered_days_ago: 9, posted: true },
  { creator_id: "C203", handle: "@sample_creator_c", followers: 310000, sample_delivered_days_ago: 15, posted: false },
  { creator_id: "C204", handle: "@sample_creator_d", followers: 12000, sample_delivered_days_ago: 4, posted: false },
];

class ToolInputError extends Error {}

const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

function callTool(name, args = {}) {
  switch (name) {
    case "get_shop_performance": {
      if (!isDate(args.start_date) || !isDate(args.end_date))
        throw new ToolInputError("start_date and end_date must both be dates in YYYY-MM-DD format, for example 2026-11-10.");
      return { sample: true, start_date: args.start_date, end_date: args.end_date, gmv_usd: 48210.55, orders: 1532, visitors: 61840, conversion_rate: 0.0248, gmv_change_vs_previous_period: 0.12 };
    }
    case "list_products": {
      const limit = args.limit ?? 5;
      if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new ToolInputError("limit must be an integer from 1 to 20.");
      return { sample: true, products: PRODUCTS.slice(0, limit) };
    }
    case "diagnose_listing_quality": {
      const p = PRODUCTS.find((x) => x.product_id === args.product_id);
      if (!p) throw new ToolInputError(`Unknown product_id "${args.product_id}". Call list_products to get valid IDs (P1001 to P1005).`);
      const issues = [];
      if (p.quality_score < 70) issues.push({ type: "title", detail: "Title is shorter than 25 characters", fix: "Add brand, key attribute and use case" });
      if (p.quality_score < 60) issues.push({ type: "images", detail: "Fewer than 5 main images", fix: "Add lifestyle and size images" });
      if (p.stock === 0) issues.push({ type: "stock", detail: "Out of stock", fix: "Restock or set to inactive" });
      return { sample: true, product_id: p.product_id, quality_score: p.quality_score, issues };
    }
    case "list_affiliate_samples": {
      const days = args.days ?? 30;
      if (!Number.isInteger(days) || days < 1 || days > 90) throw new ToolInputError("days must be an integer from 1 to 90.");
      return { sample: true, days, requests: SAMPLES.filter((s) => s.sample_delivered_days_ago <= days) };
    }
    case "update_product_price": {
      const p = PRODUCTS.find((x) => x.product_id === args.product_id);
      if (!p) throw new ToolInputError(`Unknown product_id "${args.product_id}".`);
      if (typeof args.new_price !== "number" || args.new_price <= 0) throw new ToolInputError("new_price must be a number greater than 0.");
      if (typeof args.sku_id !== "string" || !args.sku_id) throw new ToolInputError("sku_id is required.");
      return { sample: true, changed: false, message: `SAMPLE: would change ${p.product_id} / ${args.sku_id} from ${p.price} to ${args.new_price} USD. Nothing was changed.` };
    }
    case "send_affiliate_invitation": {
      const c = SAMPLES.find((x) => x.creator_id === args.creator_id);
      if (!c) throw new ToolInputError(`Unknown creator_id "${args.creator_id}". Call list_affiliate_samples to get valid IDs.`);
      if (!Array.isArray(args.product_ids) || args.product_ids.length === 0) throw new ToolInputError("product_ids must list at least one product ID.");
      if (typeof args.commission_rate !== "number" || args.commission_rate < 0.01 || args.commission_rate > 0.8) throw new ToolInputError("commission_rate must be a number from 0.01 to 0.8.");
      return { sample: true, sent: false, message: `SAMPLE: would invite ${c.handle} for ${args.product_ids.join(", ")} at ${(args.commission_rate * 100).toFixed(0)}% commission. Nothing was sent.` };
    }
    default:
      return undefined;
  }
}

const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result });
const rpcError = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

function handleMessage(msg) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return rpcError(msg?.id ?? null, -32600, "Invalid JSON-RPC request");
  const isNotification = !("id" in msg);
  if (isNotification) return null;
  const { id, method, params = {} } = msg;
  switch (method) {
    case "initialize": {
      const v = SUPPORTED_VERSIONS.includes(params.protocolVersion) ? params.protocolVersion : SUPPORTED_VERSIONS[0];
      return rpcResult(id, {
        protocolVersion: v,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: "SAMPLE server for rehearsing a Claude directory submission. All data is fake.",
      });
    }
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: TOOLS });
    case "tools/call": {
      if (!TOOLS.some((t) => t.name === params.name)) return rpcError(id, -32602, `Unknown tool "${params.name}". Call tools/list for the available tools.`);
      try {
        const data = callTool(params.name, params.arguments || {});
        return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data, isError: false });
      } catch (e) {
        if (e instanceof ToolInputError) return rpcResult(id, { content: [{ type: "text", text: e.message }], isError: true });
        return rpcResult(id, { content: [{ type: "text", text: `Tool ${params.name} failed: ${e.message}` }], isError: true });
      }
    }
    case "prompts/list":
      return rpcResult(id, { prompts: [] });
    case "resources/list":
      return rpcResult(id, { resources: [] });
    default:
      return rpcError(id, -32601, `Method not supported: ${method}`);
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...CORS } });

export async function handle(request) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (url.pathname === "/" && request.method === "GET")
    return new Response("Fake TikTok Shop MCP server (SAMPLE). MCP endpoint: /mcp\n", { headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS } });
  if (url.pathname !== "/mcp") return json({ error: "Not found. The MCP endpoint is /mcp" }, 404);
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST, OPTIONS", ...CORS } });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(rpcError(null, -32700, "Parse error: body must be JSON"), 400);
  }
  if (Array.isArray(body)) {
    const out = body.map(handleMessage).filter(Boolean);
    return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
  }
  const out = handleMessage(body);
  return out ? json(out) : new Response(null, { status: 202, headers: CORS });
}
