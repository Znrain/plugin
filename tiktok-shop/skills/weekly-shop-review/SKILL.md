---
name: weekly-shop-review
description: Build a week-over-week TikTok Shop performance review. Use when a seller asks how their shop did last week, wants a weekly report, or asks why GMV went up or down.
---

# Weekly shop review

1. Call `get_shop_performance` for the last full week and the week before.
2. Compare GMV, orders, visitors and conversion rate. Report each change as an absolute and a percentage.
3. If GMV changed by more than 10%, call `list_products` sorted by GMV change and name the top 3 products behind it.
4. End with at most three suggested actions, each tied to a number above.

Keep the report short: one table, then the actions. Do not change anything in the shop.
