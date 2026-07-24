# Feature 07 — Spam Protection (Rate Limit + Banned-Word Filter)

## Summary

Two independent, lightweight anti-spam guards applied to every comment/reply
submission before it's persisted: a per-user rate limit (5 comments per 10
minutes) and a banned-word filter that blocks submission with an inline
error.

## Requirements

### Rate limiting

- Each authenticated user may create at most 5 comments (top-level or
  replies combined) in any rolling 10-minute window.
- The 6th+ attempt within the window is rejected with HTTP 429 and a
  friendly client-side message (e.g., "You're commenting too fast — try
  again in a few minutes.").
- The limit is per-user, not per-post or per-IP (matches "5 comments per
  user per 10 minutes" in the plan).
- Rate limiting does not affect reads (Feature 03) or deletes (Feature 05),
  only comment creation.

### Banned-word filter

- Submission is checked against a maintained list of banned words/phrases
  (case-insensitive, basic substring or word-boundary match).
- A match blocks submission entirely (comment is not created) and returns a
  400 with a field-level error the client renders inline near the textarea
  (e.g., "Your comment contains language that isn't allowed.") — the plan
  does not require pinpointing which word matched, so the generic message
  avoids helping bad actors probe the list.
- The filter runs server-side (authoritative) and optionally client-side as
  a fast pre-check for UX (not required, but nice-to-have since it avoids a
  round trip for obvious cases) — server-side check is the one that counts
  for acceptance.
- The word list is a simple static list to start (e.g., a JSON/TS array),
  editable by developers without a DB migration — no admin UI in v1.

## Technical Implementation

### Rate limiting

1. Simplest v1 approach reuses the `Comment` table itself (no new
   infrastructure, per the assumption that Redis isn't confirmed available):
   ```ts
   const windowStart = new Date(Date.now() - 10 * 60 * 1000);
   const recentCount = await prisma.comment.count({
     where: { authorId: session.user.id, createdAt: { gte: windowStart } },
   });
   if (recentCount >= 5) {
     return NextResponse.json(
       { error: "rate_limited", message: "You're commenting too fast — try again in a few minutes." },
       { status: 429 }
     );
   }
   ```
   - Note: this counts soft-deleted comments too (they still happened within
     the window); that's intentional — deleting a comment shouldn't let
     someone bypass the limit.
2. If the project already has a rate-limiting utility (e.g., Upstash Redis,
   `@upstash/ratelimit`) from other endpoints, prefer reusing that instead of
   the DB-count approach for lower latency — call this out as the preferred
   path if such infra is discovered during implementation, since it avoids
   an extra DB query per submission.
3. Place the rate-limit check **before** the banned-word check and before
   the DB write, so blocked spam never touches the comments table.

### Banned-word filter

1. Add `lib/comments/bannedWords.ts`:
   ```ts
   export const BANNED_WORDS = [
     // seed list — expand as needed
     "spamword1",
     "spamword2",
   ];

   export function containsBannedWord(text: string): boolean {
     const normalized = text.toLowerCase();
     return BANNED_WORDS.some((word) =>
       new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").test(normalized)
     );
   }
   ```
2. Call `containsBannedWord(body)` in the `POST` comment handler
   (Feature 02/04) immediately after basic validation (length/empty) and
   before the rate-limit DB query (cheap in-memory check first, avoids a DB
   round trip for obviously-blocked content) — order of the two checks
   relative to each other is a minor implementation detail; both must run
   before persistence.
3. Return a distinct error code (`"banned_word"`) so the client can show the
   specific inline message without depending on string-matching the error
   text.
4. Client (`CommentForm.tsx`) inspects the error code from the API response
   and renders the appropriate inline message (`rate_limited` →
   friendly-cooldown copy; `banned_word` → "contains language that isn't
   allowed" copy; generic 400 → "please check your comment and try again").

## Edge Cases

- User deletes old comments to "free up" their rate-limit window → does not
  help, since the count includes soft-deleted rows created within the
  window (see note above).
- Legitimate word gets falsely flagged (false positive) → acceptable v1
  trade-off; word list is a simple static array developers can edit directly
  in the repo without a migration.
- Reply submissions count toward the same 5-per-10-minutes budget as
  top-level comments (no separate bucket).

## Acceptance Criteria

- [ ] A user who has posted 5 comments within the last 10 minutes gets 429
      on a 6th attempt, with the client showing a friendly cooldown message.
- [ ] After the 10-minute window rolls past the oldest of those 5 comments,
      the user can post again.
- [ ] A comment body containing a banned word is rejected with 400 and an
      inline, field-level error in the form; no `Comment` row is created.
- [ ] A comment body with no banned words and under the rate limit is
      created successfully.
- [ ] Banned-word check is case-insensitive (e.g., "SpamWord1" is caught the
      same as "spamword1").
- [ ] Rate limit and banned-word checks both run server-side and cannot be
      bypassed by skipping client-side validation (verified via direct API
      call).
