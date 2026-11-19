# Fake TikTok Shop MCP server (SAMPLE)

一个**假的** TikTok Shop 远程 MCP 服务器，只用来演练 Claude 目录的连接器提交流程。不调用任何真实 TikTok Shop 接口，所有返回数据都是编的；两个写操作工具（改价、发邀约）也只回显“会做什么”，不会真的改任何东西。

- 传输方式：Streamable HTTP（无状态，每个请求直接返回 JSON）
- 登录：无（authless）。真实 TTS MCP 必须走 OAuth，这里为了能马上连通先省略
- MCP 地址：`https://<你的域名>/mcp`
- 6 个工具，全部带 `title` 和 `readOnlyHint` / `destructiveHint`：

| 工具 | 类型 |
|---|---|
| get_shop_performance | 只读 |
| list_products | 只读 |
| diagnose_listing_quality | 只读 |
| list_affiliate_samples | 只读 |
| update_product_price | 写（destructive） |
| send_affiliate_invitation | 写（destructive） |

## 方法 A：部署到 Cloudflare Workers（推荐，免费，得到一个长期可用的 https 地址）

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Znrain/plugin/tree/main/fake-tts-mcp)

1. 点上面的按钮（仓库需要是公开的），用 Cloudflare 账号登录（没有就免费注册一个）
2. 按页面提示授权 GitHub、确认项目名 `fake-tts-mcp`，点 Deploy
3. 部署完成后得到地址 `https://fake-tts-mcp.<你的子域>.workers.dev`
4. 浏览器打开这个地址，看到 `Fake TikTok Shop MCP server (SAMPLE)` 就说明活了
5. 提交门户里填的地址是：`https://fake-tts-mcp.<你的子域>.workers.dev/mcp`（注意结尾的 `/mcp`）

命令行部署（会用终端的话）：

```bash
cd fake-tts-mcp
npm install
npx wrangler login
npx wrangler deploy
```

## 方法 B：在自己电脑上跑 + 临时隧道（不注册任何账号，但关掉电脑就失效）

需要 Node 18+ 和 cloudflared（Mac：`brew install cloudflared`）。

```bash
cd fake-tts-mcp
node local.mjs                                   # 终端 1：本地跑在 http://localhost:8787/mcp
cloudflared tunnel --url http://localhost:8787   # 终端 2：打印出 https://xxxx.trycloudflare.com
```

门户里填 `https://xxxx.trycloudflare.com/mcp`。两个终端都要一直开着。

## 自测

```bash
npx @modelcontextprotocol/inspector --cli https://<你的地址>/mcp --transport http --method tools/list
```

也可以在 Claude 里 **Customize > Connectors > Add custom connector** 填这个地址，在对话里调用工具试一下。
