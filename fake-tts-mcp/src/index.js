// Cloudflare Workers entry point.
import { handle } from "./mcp.js";

export default {
  fetch: (request) => handle(request),
};
