---
name: listing-quality-diagnosis
description: Diagnose TikTok Shop product listing quality and rank fixes by impact. Use when a seller asks what is wrong with their listings or how to improve product pages.
---

# Listing quality diagnosis

1. Call `list_products` for the products the seller names, or the top 20 by GMV if none are named.
2. Call `diagnose_listing_quality` for each product.
3. Group issues by type (title, images, attributes, price, stock).
4. Rank fixes by the product's GMV share and the number of products affected.
5. Show the ranked list. Offer to apply a fix only if a write tool exists for it, and ask before calling it.
