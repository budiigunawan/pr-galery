# Feature 03 — View Comments (Newest-First, Paginated)

## Summary

Display comments under a blog post, newest top-level comment first, 20 per
page, with each top-level comment showing its (unpaginated) replies inline.

## Requirements

- Comments list is scoped to top-level comments (`parentId IS NULL`) for a
  given post, ordered by `createdAt DESC`.
- Pagination: 20 top-level comments per page. Replies to a shown top-level
  comment are not separately paginated — all replies under a visible parent
  render together (reply volume is expected to be low; see Feature 04).
- Pagination control: "Load more" button or numbered pages — implementation
  choice, but must not require a full page reload (client-side fetch).
- Deleted comments render as "[deleted]" in place (see Feature 05) rather
  than being excluded from the list or the count.
- Total comment count (including replies, excluding nothing) is shown near
  the section heading, e.g., "42 Comments".
- Plain-text body is rendered safely (HTML-escaped) — never `dangerouslySetInnerHTML`
  on raw user input.
- Empty state: "No comments yet — be the first to share your thoughts."

## Technical Implementation

1. **API route** `app/api/posts/[postId]/comments/route.ts`, `GET` method:
   - Query params: `cursor` (last seen top-level comment id or createdAt, for
     cursor-based pagination) or `page` (if offset-based is simpler given
     expected volume).
   - Recommended: cursor-based on `createdAt` to avoid skipped/duplicated
     rows as new comments arrive between page loads.
   - Query:
     ```ts
     prisma.comment.findMany({
       where: { postId, parentId: null },
       orderBy: { createdAt: "desc" },
       take: 20,
       ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
       include: {
         author: { select: { id: true, name: true, image: true } },
         replies: {
           orderBy: { createdAt: "asc" },
           include: { author: { select: { id: true, name: true, image: true } } },
         },
       },
     });
     ```
   - Response includes `items`, `nextCursor` (null if no more pages), and a
     separate lightweight `count` query (`prisma.comment.count({ where: {
     postId } })`, counting both top-level and replies) for the header total.
2. **Server component** `components/comments/CommentSection.tsx`:
   - Server-renders the first page (SSR) for SEO/initial paint; hydrates a
     client component for subsequent "Load more" fetches.
3. **Client component** `components/comments/CommentList.tsx` /
   `Comment.tsx`:
   - Renders author name, relative timestamp (e.g., "3 days ago"), body text,
     and a nested `replies` block (Feature 04) under each top-level comment.
   - "Load more" button calls the `GET` endpoint with the last `nextCursor`
     and appends results.
4. Render deleted comments (`isDeleted: true`) with body replaced by
   "[deleted]" and author name replaced or kept per product choice — this
   plan keeps original author name greyed out (e.g., "Jane D." in muted
   text) since hiding the author isn't required by the plan, only the body.

## Edge Cases

- Post with zero comments → empty state, no pagination control.
- Last page has fewer than 20 items → "Load more" button disappears / is
  disabled after `nextCursor` is null.
- A top-level comment with many replies still renders all replies (no cap in
  v1); note as a potential future feature (paginate replies) if reply volume
  grows.

## Acceptance Criteria

- [ ] Comments render newest-first by `createdAt` for top-level comments.
- [ ] Exactly 20 top-level comments load per page/request.
- [ ] "Load more" fetches the next 20 without a full page reload and appends
      to the existing list.
- [ ] Comment count near the heading matches total comments (top-level +
      replies) including soft-deleted ones.
- [ ] A soft-deleted comment shows "[deleted]" in place, still occupies its
      position in the thread, and its replies (if any) remain visible.
- [ ] Raw HTML/script in a comment body renders as inert text, not executed
      markup (verify with a comment containing `<script>` or `<b>` tags).
- [ ] Empty-comments state renders the "no comments yet" message.
