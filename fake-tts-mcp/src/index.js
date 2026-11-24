// Cloudflare Workers entry point.
import { handle } from "./mcp.js";

// OpenAI plugin directory domain verification token (plain text, token only).
const OPENAI_APPS_CHALLENGE = "JN-qW89x3ImXsBYA8y9ID0HQrPvKXzdTRwPQzyqjLOA";

export default {
  fetch: (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/.well-known/openai-apps-challenge") {
      return new Response(OPENAI_APPS_CHALLENGE, {
        headers: { "content-type": "text/plain" },
      });
    }
    return handle(request);
  },
};
