# Feature 04 — Nested Replies (One Level)

## Summary

Allow a logged-in reader to reply directly to a top-level comment. Replies
are visually nested one level; replying to a reply is not allowed.

## Requirements

- Each top-level comment has a "Reply" action that reveals a reply form
  (reuses the comment composer from Feature 02).
- Replies do **not** get their own "Reply" action — a reply-to-a-reply UI
  path must not exist in the UI, and the API must reject it even if called
  directly.
- A reply is visually indented/nested under its parent top-level comment.
- Replies inherit the same validation as top-level comments: auth required,
  plain text, max 2000 chars, rate limiting, banned-word filter.
- Replies are ordered oldest-first within their parent (chronological
  conversation order), independent of the newest-first ordering of top-level
  comments.
- Creating a reply triggers the same post-author email notification as a
  top-level comment (Feature 06) — not a notification to the parent comment's
  author, per the plan ("New comments... trigger an email... to the post
  author (not to other commenters)").

## Technical Implementation

1. Extend the `POST /api/posts/[postId]/comments` handler from Feature 02:
   - Accept optional `parentId` in the request body.
   - If `parentId` present:
     - Load the parent comment; 404 if missing or belongs to a different
       `postId`.
     - **Depth check**: reject with 400 (`"Replies can only be one level
       deep"`) if `parent.parentId !== null` (i.e., the parent is itself a
       reply).
     - Create the new comment with `parentId` set to the validated parent id.
2. **Client**: `components/comments/Comment.tsx` renders a "Reply" button
   only when `comment.parentId === null` (i.e., only on top-level comments).
   Clicking it toggles an inline `CommentForm` scoped to that parent, passing
   `parentId` on submit.
3. **Rendering**: `CommentList` groups replies under their parent (already
   fetched via the `include: { replies: ... }` query from Feature 03) and
   renders them in a visually indented block, ordered by `createdAt asc`.
4. No schema change needed beyond the `parentId` self-relation already added
   in Feature 01.

## Edge Cases

- Client somehow sends `parentId` pointing at a reply (e.g., stale UI state,
  direct API call) → server enforces the depth check regardless of UI state;
  this is the authoritative guard.
- Parent comment gets soft-deleted while a reply form is open → reply
  creation should still succeed (replying under a "[deleted]" comment is
  allowed; the thread structure is preserved intentionally).
- Parent comment belongs to a different post than the one in the URL/route
  param → 404/400, never silently reparent.

## Acceptance Criteria

- [ ] "Reply" action appears only on top-level comments, never on replies.
- [ ] Submitting a reply creates a `Comment` row with `parentId` set to the
      correct top-level comment.
- [ ] Reply renders visually nested/indented under its parent, ordered
      oldest-first among sibling replies.
- [ ] Direct API call attempting to reply to a reply (`parentId` = an
      existing reply's id) returns 400 and creates no row.
- [ ] Replying to a comment on a *different* post than the URL's `postId`
      is rejected.
- [ ] Reply submission triggers the post-author email notification (Feature
      06), same as a top-level comment.
