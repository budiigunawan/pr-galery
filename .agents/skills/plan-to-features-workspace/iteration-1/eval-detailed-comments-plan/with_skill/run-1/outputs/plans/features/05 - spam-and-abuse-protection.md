# Feature 05: Spam & Abuse Protection

## Overview

Adds two basic anti-spam checks to comment submission: a per-user rate limit
(5 comments per 10 minutes) and a banned-word filter that blocks submission
and returns an inline error. Both checks run as part of Feature 02's create
flow, before a comment is persisted.

## Requirements

- **Rate limiting**: A single authenticated user may create at most 5
  comments (top-level or replies, counted together) within any rolling
  10-minute window. A 6th attempt within the window is rejected with a
  clear, user-facing inline error (e.g. "You're commenting too quickly —
  try again in a few minutes.") and no row is created.
  - The window is rolling (based on the timestamps of the user's last 5
    comments), not a fixed clock-aligned bucket — e.g. if a user's 5
    comments were at 10:00–10:03, they can comment again starting at 10:10,
    not just at the top of the next 10-minute clock interval.
  - The limit is per-user, not per-post or per-IP (per the plan: "5 comments
    per user per 10 minutes").
- **Banned-word filter**: Before persisting, comment content is checked
  against a configured list of banned words/phrases. A match blocks the
  submission entirely (not just flags it for moderation) and returns a
  clear inline error (e.g. "Your comment contains language that isn't
  allowed.") without revealing which specific word triggered it (avoids
  helping users find the boundary of the filter, and avoids double-posting
  the banned word back to them).
  - Matching is case-insensitive.
  - Matching is whole-word (word-boundary aware) by default, to avoid false
    positives from banned words appearing as substrings of innocuous words
    (documented as an open question/assumption in REQUIREMENTS.md — revisit
    if the actual banned-word list needs substring matching for phrases).
  - The banned-word list is a static, developer-maintained config (e.g. a
    JSON/TS array) for v1 — no admin UI to manage it, per the plan's "simple
    banned-word filter" framing.
- Both checks apply to replies exactly as they do to top-level comments (no
  carve-out).
- Both checks run server-side as authoritative validation; a client-side
  character counter (Feature 02) is a UX nicety, not a substitute for either
  check.

## Technical Implementation

- **Rate limiting** implementation:
  - Simplest approach given the existing Postgres/Prisma stack: query the
    `Comment` table itself — `prisma.comment.count({ where: { authorId,
    createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } } })` — and
    reject if the count is `>= 5`. This reuses the `(authorId, createdAt)`
    index from Feature 01 and needs no new table.
  - If the project already has a shared cache (Redis/Upstash) or a rate-
    limiting library (e.g. `@upstash/ratelimit`) in use elsewhere, prefer
    that for lower latency and to avoid an extra DB round-trip per
    submission — but the Postgres-count approach above is the default
    assumption for this plan since no existing infra was confirmed.
  - Expose this as a small, testable helper, e.g.
    `lib/comments/rateLimit.ts` → `checkCommentRateLimit(userId): Promise<{
    allowed: boolean }>`, called from the create handler (Feature 02) before
    the banned-word check.
- **Banned-word filter** implementation:
  - Maintain the list in a config file, e.g. `lib/comments/bannedWords.ts`
    exporting a `string[]`.
  - Implement matching with a word-boundary regex per term (e.g. `new
    RegExp(\`\\b${escapeRegExp(word)}\\b\`, "i")`), checked against the
    trimmed comment content.
  - Expose as `lib/comments/bannedWordFilter.ts` →
    `containsBannedWord(content: string): boolean`, called from the create
    handler (Feature 02) after the rate-limit check.
- Both helpers return simple booleans/results that Feature 02's handler maps
  to distinct, user-readable error messages/codes (e.g. `RATE_LIMITED` vs.
  `BANNED_WORD`) so the client form (Feature 02) can render the correct
  inline copy.
- Add unit tests for both helpers in isolation (e.g.
  `lib/comments/rateLimit.test.ts`, `lib/comments/bannedWordFilter.test.ts`)
  independent of the full submission flow, since these are pure/mockable
  logic units.

## Dependencies

- Depends on Feature 01 (uses the `Comment` table/index for the rate-limit
  count).
- Integrates into Feature 02's create flow (called from the submission
  handler); Feature 02's acceptance criteria assume these checks exist.

## Acceptance Criteria

- [ ] A user's 6th comment within a rolling 10-minute window is rejected
      with a distinct rate-limit error, and no comment row is created for
      that attempt.
- [ ] After enough time passes that fewer than 5 of the user's comments fall
      within the trailing 10-minute window, they can comment again.
- [ ] The rate limit counts top-level comments and replies together, per
      user, not per post.
- [ ] Submitting content containing a banned word (exact case-insensitive
      whole-word match) is rejected with a distinct inline error, and no
      comment row is created.
- [ ] A banned word appearing only as a substring of a longer, allowed word
      does not trigger a false-positive rejection.
- [ ] Both checks apply identically to reply submissions, not just
      top-level comments.
- [ ] Rate-limit and banned-word helpers have passing unit tests independent
      of the HTTP submission handler.
