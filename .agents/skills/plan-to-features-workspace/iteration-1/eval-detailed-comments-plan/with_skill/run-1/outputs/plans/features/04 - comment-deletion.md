# Feature 04: Comment Deletion

## Overview

Lets the author of a blog post delete any comment on their own post, and lets
a comment's author delete their own comment. Deletion is soft — the row is
kept and rendered as `[deleted]` (per Feature 03) so reply threads stay
intact.

## Requirements

- Two distinct authorization paths can delete a given comment:
  1. The user is the author of the **post** the comment belongs to (can
     delete any comment on that post, including replies, regardless of who
     wrote them).
  2. The user is the **author of the comment itself** (can delete only their
     own comment/reply).
- Any other authenticated user, and any unauthenticated request, is rejected
  (403/401-equivalent) with no state change.
- Deletion is soft: sets `deletedAt` to now (per Feature 01's schema). The
  row, its `postId`/`parentId`/`authorId`/`createdAt` are preserved so the
  thread structure and ordering are unaffected.
- Deleting a top-level comment does **not** cascade-delete (soft-delete) its
  replies — replies remain visible and untouched; only the parent's content
  becomes `[deleted]`. (This matches the plan's stated reason for soft delete
  — "to preserve reply threads.")
- Deleting a reply only affects that reply; it has no children to consider
  (one-level nesting).
- Deletion is idempotent from the caller's perspective: deleting an
  already-deleted comment again should not error destructively (e.g. return
  success/no-op, or a clear "already deleted" response) — exact behavior is
  an implementation choice, but it must not throw an unhandled error.
- The UI shows a delete action only to users who are authorized to use it
  (post author sees delete on every comment on their post; a regular
  commenter sees delete only on their own comments) — but this is a UX
  affordance, not a substitute for server-side authorization.

## Technical Implementation

- Add a delete endpoint, e.g. `DELETE
  app/api/posts/[postId]/comments/[commentId]/route.ts`, or a Server Action
  colocated with the comment components, matching the create endpoint's
  convention from Feature 02.
- Authorization check inside the handler:
  ```ts
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { authorId: true } } },
  });
  if (!comment) return notFound();
  const isPostAuthor = comment.post.authorId === session.user.id;
  const isCommentAuthor = comment.authorId === session.user.id;
  if (!isPostAuthor && !isCommentAuthor) return forbidden();
  ```
- Update, don't delete:
  ```ts
  await prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: new Date() },
  });
  ```
- No cascade logic needed for children — replies are independent rows; their
  `deletedAt` stays untouched.
- Client-side: a "Delete" action/button in `CommentItem` (Feature 03),
  conditionally rendered based on `currentUser.id === comment.authorId ||
  currentUser.id === post.authorId`, with a confirmation step (e.g. a simple
  confirm dialog) before firing the request, and an optimistic or
  post-response UI update that swaps the comment's rendered content to
  `[deleted]` without a full page reload.

## Dependencies

- Depends on Feature 01 (schema — `deletedAt` field).
- Depends on Feature 03 for the `[deleted]` rendering contract this feature
  triggers (the read path must already know how to render a deleted
  comment for this feature's UI to be meaningful, though the two can be
  built in parallel against an agreed-upon contract).

## Acceptance Criteria

- [ ] A post author can delete any comment or reply on their own post.
- [ ] A comment author can delete their own comment or reply, on any post.
- [ ] A user who is neither the post author nor the comment author receives
      an authorization error and the comment is unchanged.
- [ ] An unauthenticated delete request is rejected.
- [ ] Deleting a comment sets `deletedAt` rather than removing the row (row
      count for the post's comments is unchanged before/after delete).
- [ ] Deleting a top-level comment leaves its replies visible and unaffected.
- [ ] Re-deleting an already-deleted comment does not throw an unhandled
      error.
- [ ] The delete action is only visible in the UI to authorized users
      (post author or comment author).
