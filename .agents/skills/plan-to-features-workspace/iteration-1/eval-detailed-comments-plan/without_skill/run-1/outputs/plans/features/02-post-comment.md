# Feature 02 — Post a Comment

## Summary

Allow a logged-in reader to submit a new top-level, plain-text comment on a
blog post.

## Requirements

- Only authenticated users can submit a comment; unauthenticated users see a
  prompt to sign in instead of a comment form (or the form is hidden/disabled
  with a "Sign in to comment" CTA).
- Comment body is plain text only — no markdown rendering, no HTML
  sanitization needed for rich formatting (still HTML-escape on render to
  prevent XSS, see Feature 03).
- Max length 2000 characters, enforced both client-side (character counter,
  disabled submit past limit) and server-side (reject with 400 if exceeded).
- Empty/whitespace-only comments are rejected.
- On success, the new comment appears without a full page reload (optimistic
  UI or refetch) and the input is cleared.
- Rate limiting (Feature 07) and banned-word filtering (Feature 07) apply to
  this endpoint before a comment is persisted.
- This feature covers top-level comments; reply submission is Feature 04 but
  shares the same endpoint/validation logic.

## Technical Implementation

1. **API route** `app/api/posts/[postId]/comments/route.ts` (Next.js App
   Router route handler), `POST` method:
   - Read session via existing auth helper (e.g., `getServerSession` /
     project's auth util). 401 if no session.
   - Parse/validate body with a schema (e.g., Zod):
     ```ts
     const CreateCommentSchema = z.object({
       body: z.string().trim().min(1).max(2000),
       parentId: z.string().uuid().nullable().optional(),
     });
     ```
   - Verify `postId` exists (404 if not).
   - Run rate-limit check (Feature 07) — 429 if exceeded.
   - Run banned-word filter (Feature 07) — 400 with field-level error if
     matched.
   - If `parentId` provided, defer to Feature 04's validation (must be a
     top-level comment on the same post).
   - `prisma.comment.create({ data: { postId, authorId: session.user.id,
     parentId: parentId ?? null, body } })`.
   - Trigger email notification (Feature 06) asynchronously (don't block the
     response on email send/failure).
   - Return the created comment (with author display name/avatar) as JSON,
     201.
2. **Client form component** `components/comments/CommentForm.tsx`:
   - Textarea bound to local state, live character counter ("1234 / 2000").
   - Submit button disabled while pending, while empty, or over limit.
   - On submit: `POST` to the route above; on 400 show the specific error
     (length, banned word) inline near the textarea; on 429 show a friendly
     rate-limit message (see Feature 07); on success, clear textarea and
     prepend/insert the new comment into the visible list.
   - Hidden/disabled with sign-in CTA when no session (check via existing
     client-side session hook).
3. **Server action alternative**: if the project prefers Server Actions over
   route handlers, implement equivalently as a `"use server"` action; keep
   validation identical either way.

## Edge Cases

- Post is deleted/unpublished between page load and submit → 404, surface a
  generic "This post is no longer available" error.
- Double-submit (double click) → disable button on submit start, ignore
  duplicate in-flight requests.
- Whitespace-only body after trim → validation error "Comment can't be
  empty."

## Acceptance Criteria

- [ ] Unauthenticated user cannot submit a comment (form hidden/disabled with
      sign-in prompt; API returns 401 if called directly).
- [ ] Submitting a valid plain-text comment (<= 2000 chars) creates a row and
      shows it in the UI without full page reload.
- [ ] Submitting > 2000 chars is rejected client-side (disabled submit) and
      server-side (400) if bypassed.
- [ ] Submitting empty/whitespace-only body is rejected with an inline error.
- [ ] Markdown/HTML in the input is stored and displayed as literal text, not
      rendered (e.g., `**bold**` shows literally).
- [ ] New comment shows the correct author name and timestamp immediately.
