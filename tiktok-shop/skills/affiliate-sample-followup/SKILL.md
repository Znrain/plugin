---
name: affiliate-sample-followup
description: Follow up with TikTok Shop affiliate creators who received samples but have not posted. Use when a seller asks about sample ROI, unposted creators, or affiliate follow-ups.
---

# Affiliate sample follow-up

1. Call `list_affiliate_samples` for the last 30 days unless the seller gives another range.
2. Split creators into posted and not posted. For not posted, show days since the sample was delivered.
3. Draft a short, polite follow-up for the top 5 not-posted creators by follower count.
4. Only call `send_affiliate_invitation` after the seller approves each invitation.
