# TikTok Shop × Claude 上架演练仓库（SAMPLE）

只用于演练 Claude 目录提交流程，所有内容都是假数据，不能用于真实提交。

| 文件夹 | 是什么 | 用在哪一步 |
|---|---|---|
| `fake-tts-mcp/` | 一个能真实连通的假 TikTok Shop 远程 MCP 服务器（6 个工具，无登录） | 连接器提交第 1 步 Connection 要填的服务器地址；第 2 步 Tools 会从它同步工具 |
| `tiktok-shop/` | 插件样例：3 个技能 + 指向 MCP 地址的 `.mcp.json` | 以后补交插件（Plugin bundle）时的 Source 步骤 |

部署假服务器：见 [fake-tts-mcp/README.md](fake-tts-mcp/README.md)。
