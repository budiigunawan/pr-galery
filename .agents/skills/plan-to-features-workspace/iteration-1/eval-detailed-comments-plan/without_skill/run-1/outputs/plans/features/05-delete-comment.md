# Feature 05 — Delete a Comment (Soft Delete)

## Summary

Let a comment's own author delete it, and let the blog post's author delete
any comment on their own post. Deleted comments are never hard-removed —
they render as "[deleted]" so replies and thread structure survive.

## Requirements

- A "Delete" action is visible to:
  - The comment's own author, on their own comment (top-level or reply).
  - The post's author, on **any** comment under their post (including
    replies, and including comments not authored by them).
- No one else sees or can trigger delete (verified server-side, not just
  hidden client-side).
- Deleting sets `isDeleted = true` and does not remove the row. The stored
  `body` may be cleared/overwritten server-side as well (so the original
  text isn't recoverable via API even though the row persists) — this plan
  chooses to clear it, since "preserve reply threads" doesn't require
  preserving the original text.
- Once deleted, the UI shows "[deleted]" in place of the body, disables
  further replies to it are still allowed (deleting a comment does not lock
  its replies) and hides the Delete/Reply actions on the now-deleted comment
  itself (a deleted comment can't be deleted again or replied to further —
  actually replies remain allowed; see Edge Cases).
- Deletion is not reversible in v1 (no "undo" or restore UI).

## Technical Implementation

1. **API route** `app/api/comments/[commentId]/route.ts`, `DELETE` method:
   - Load the comment, including `post.authorId` and `comment.authorId`.
   - 404 if comment doesn't exist or is already deleted (idempotency choice:
     treat re-delete of an already-deleted comment as a no-op 200, simplest
     for double-click races — pick one and document it; this plan uses
     no-op 200).
   - Authorize: allow if `session.user.id === comment.authorId` OR
     `session.user.id === comment.post.authorId`. Otherwise 403.
   - Update: `prisma.comment.update({ where: { id }, data: { isDeleted: true,
     body: "" } })`.
   - Return 200 with the updated (now-deleted) comment shape so the client
     can swap in "[deleted]" without a refetch.
2. **Client**: `components/comments/Comment.tsx`
   - Show a "Delete" button when the current user matches either allowed
     role (fetch/pass down `postAuthorId` and `currentUserId` as props from
     the server component).
   - Confirm via a lightweight confirm dialog ("Delete this comment?") before
     calling the endpoint.
   - On success, replace the rendered body with "[deleted]" in place (no
     removal from the DOM list, no re-indexing of replies).
3. Rendering logic (shared with Feature 03): whenever `comment.isDeleted`,
   render fixed text "[deleted]" instead of `comment.body`, and hide that
   comment's own Reply/Delete actions (nothing left to reply meaningfully
   to the deleted text is still allowed per product decision — replies stay
   enabled on deleted top-level comments so the thread can continue; only
   the Delete action on an already-deleted comment is hidden).

## Edge Cases

- Comment author deletes their own comment that already has replies →
  replies remain, parent shows "[deleted]", replies still fully visible and
  repliable-to is moot since replies can't have their own replies (Feature
  04) — no special handling needed beyond the soft-delete render.
- Post author deletes a comment authored by someone else → allowed per spec;
  no notification is sent to the original commenter (out of scope, matches
  "no notifications to commenters" in REQUIREMENTS.md).
- Both the comment author and the post author are the same person (post
  author commenting on their own post) → delete allowed trivially, one
  authorization check passes.
- Race: two authorized users delete concurrently → idempotent no-op on the
  second call, no error surfaced to the second caller (comment already shows
  "[deleted]" after refetch).

## Acceptance Criteria

- [ ] Comment author sees and can use Delete on their own comment; result
      shows "[deleted]" in place, row is not removed from the DB.
- [ ] Post author sees and can use Delete on any comment/reply under their
      post, including ones they didn't author.
- [ ] A third-party logged-in user (not comment author, not post author)
      cannot see a Delete action and gets 403 if calling the endpoint
      directly.
- [ ] Unauthenticated request to the delete endpoint returns 401.
- [ ] After deletion, replies to the deleted comment (if any) remain visible
      and intact.
- [ ] Deleting an already-deleted comment does not error (idempotent) per
      the no-op decision above, or errors gracefully if a different decision
      is made — behavior must be intentional and documented in code.
