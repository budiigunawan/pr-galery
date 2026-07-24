# Feature 02: Comment Submission

## Overview

Lets a logged-in reader post a plain-text top-level comment on a blog post,
or a plain-text reply to an existing top-level comment (one level deep only).
This is the core write path everything else (display, deletion, spam
protection, email notification) hooks into.

## Requirements

- Only authenticated users may submit a comment or reply. Unauthenticated
  requests are rejected with a 401-equivalent error; the UI should not render
  a comment form (or should render a disabled state prompting sign-in) for
  logged-out visitors.
- A comment/reply body is plain text only — no markdown rendering, no rich
  text input. Any HTML/markdown-like syntax submitted is treated as literal
  text (see also output-escaping note in Feature 03 — this feature is
  responsible for not attempting to parse it, not for output escaping).
- Max length is 2000 characters. Reject (with a clear inline error) any
  submission over the limit; also reject empty/whitespace-only submissions.
- A comment may target:
  - A post directly (`parentId` omitted) — creates a top-level comment.
  - An existing top-level comment (`parentId` set) — creates a reply.
- Nesting is capped at one level: if the referenced `parentId` itself already
  has a non-null `parentId` (i.e. it's a reply, not a top-level comment), the
  request must be rejected with a clear error (e.g. "Replies can't be nested
  further"). This must be enforced server-side, not just hidden in the UI
  (e.g. by only showing a "Reply" affordance on top-level comments).
- The referenced post must exist, and (if replying) the parent comment must
  exist and be a top-level comment. Replying under a *soft-deleted*
  top-level comment is explicitly allowed — the plan preserves threads
  specifically so replies remain visible under a `[deleted]` parent. A reply
  is rejected only when the post doesn't exist, the parent id doesn't exist
  at all, or the parent id refers to a comment that is itself a reply.
- On success, the new comment is persisted with the current user as author,
  `createdAt` set to now, and `deletedAt` null.
- This feature must integrate with (call into) the spam/abuse checks from
  Feature 05 (rate limit + banned-word filter) and trigger the email
  notification from Feature 06 after a successful create — but this feature
  file covers the core create path and its own validation; the internals of
  those checks are specified in their own feature files.

## Technical Implementation

- Add a server-side write path, e.g. a Route Handler such as
  `app/api/posts/[postId]/comments/route.ts` (`POST`) or a Server Action
  co-located with the post page, matching whatever convention the rest of
  the app's mutations already use (confirm against the actual repo; this
  plan doesn't have codebase access).
- Request payload: `{ content: string, parentId?: string }`; `postId` comes
  from the route/URL, not the body.
- Validation order (fail fast, return the first applicable error):
  1. Auth check — reject if no session/user.
  2. Content validation — non-empty after trim, ≤ 2000 characters.
  3. Rate-limit check (Feature 05) — reject if over quota.
  4. Banned-word check (Feature 05) — reject if it matches.
  5. Post existence check.
  6. If `parentId` present: parent existence + parent-is-top-level check.
  7. Create the `Comment` row.
  8. Fire the email notification (Feature 06) — should not block or fail the
     request if the email send fails (log and continue; see Feature 06 for
     failure-handling detail).
- Use a Prisma transaction only if step 7 needs to be paired with another
  write (e.g. a rate-limit counter table in Feature 05); a plain `create` is
  sufficient otherwise.
- Client-side: a comment form component (new, e.g.
  `components/comments/CommentForm.tsx`) with a plain `<textarea>` (no
  rich-text editor), a live/near-live character counter against the
  2000-char max, and inline error rendering for: not-signed-in, too-long,
  empty, rate-limited, and banned-word-matched states (the latter two
  surfaced via the API error response from Feature 05).
- The same form component is reused for both "new top-level comment" and
  "reply to comment X" — parameterize by an optional `parentId` prop, and by
  convention only show the "Reply" action/form on top-level comments (UI
  affordance mirroring the one-level-deep server rule).

## Dependencies

- Depends on Feature 01 (Comment data model must exist).
- Calls into Feature 05 (rate limit + banned-word checks) during validation.
- Triggers Feature 06 (email notification) on success.

## Acceptance Criteria

- [ ] Logged-out users cannot create a comment via the API (server-enforced,
      not just hidden UI) and see a sign-in prompt instead of a comment form.
- [ ] Submitting content over 2000 characters is rejected with an inline
      error and no row is created.
- [ ] Submitting empty or whitespace-only content is rejected.
- [ ] A top-level comment (`parentId` omitted) is created successfully for a
      valid post and authenticated user.
- [ ] A reply to a top-level comment is created successfully with the
      correct `parentId`.
- [ ] A reply targeting another reply (i.e. `parentId` refers to a comment
      that itself has a `parentId`) is rejected server-side with a clear
      error.
- [ ] A reply targeting a soft-deleted top-level comment is still accepted.
- [ ] A comment/reply targeting a nonexistent post or nonexistent parent
      comment id is rejected with a clear error.
- [ ] Submitted content is stored and later rendered exactly as typed (no
      markdown parsing applied) — verified by submitting text containing
      markdown-like syntax (e.g. `**bold**`) and confirming it displays
      literally.
