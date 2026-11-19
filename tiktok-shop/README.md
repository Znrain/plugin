# TikTok Shop plugin for Claude

> SAMPLE ONLY. This repository is a rehearsal copy. URLs and tool names are placeholders.

This plugin gives Claude a set of skills for TikTok Shop sellers. It works together with the
TikTok Shop connector, which signs you in with your own seller account through OAuth and exposes
read and write tools from the TikTok Shop Open Platform.

## What's included

| Skill | What it does |
|---|---|
| `weekly-shop-review` | Builds a week-over-week performance review of GMV, orders, visitors and conversion |
| `listing-quality-diagnosis` | Finds products with listing quality issues and ranks the fixes by impact |
| `affiliate-sample-followup` | Lists creators who received samples but have not posted, and drafts follow-up invitations |

## What the plugin connects to

The plugin declares one remote MCP server in `.mcp.json`: `https://mcp.tiktokshop.example/mcp`. It is the same server as the
TikTok Shop connector listed in the directory. The plugin does not run local code, does not install
packages, and does not send data to any other destination.

## Data

All shop data is read from TikTok Shop through the connector after you authorize it. Write actions
(price updates, affiliate invitations) run only after you confirm each one in Claude. See the privacy
policy: https://www.tiktokshop.example/legal/privacy

## Support

https://partner.tiktokshop.example/support or ai-open-platform@tiktokshop.example
