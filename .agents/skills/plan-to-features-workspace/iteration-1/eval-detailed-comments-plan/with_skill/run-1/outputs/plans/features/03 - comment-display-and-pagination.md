# Feature 03: Comment Display & Pagination

## Overview

Renders the comment thread under a blog post: newest-first ordering,
20-per-page pagination, one-level nested replies grouped under their parent,
and `[deleted]` placeholders for soft-deleted comments. This is the primary
read path readers interact with.

## Requirements

- Top-level comments (those with `parentId = null`) for a post are ordered
  newest-first (`createdAt` descending).
- Top-level comments are paginated 20 at a time. Replies are **not** counted
  against the 20-per-page limit — all replies belonging to a visible
  top-level comment are shown alongside it (the plan doesn't ask for reply
  pagination, and hiding replies to a visible parent would be a confusing
  UX). If a parent has an unusually large number of replies, that's out of
  scope for this plan to solve (no reply-pagination requirement given).
- Replies are rendered nested directly under their parent comment, ordered
  oldest-first within that group (reads naturally as a reply chain; the
  plan doesn't specify reply ordering, so oldest-first reads most naturally
  — a chronological conversation under the top-level comment). Call this
  out clearly in the UI (e.g. slight indent) since it differs from the
  newest-first ordering used for top-level comments.
- A soft-deleted comment (`deletedAt` not null) renders as literal text
  `[deleted]` in place of its content, with no author name/avatar shown (or
  a neutral "deleted" placeholder instead of the original author, since the
  plan doesn't specify — showing the original author name alongside
  `[deleted]` is also acceptable if simpler, but the *content* must never be
  the original text once deleted).
- A soft-deleted top-level comment still shows its (non-deleted) replies
  nested beneath it — this is the entire reason deletion is soft rather than
  a hard delete.
- Pagination controls (e.g. "Load more" or numbered pages) fetch the next
  20 top-level comments; total comment count or "X comments" summary text
  should reflect only top-level comments plus their replies combined, or
  top-level count alone — pick one and be consistent (recommend: total count
  = top-level + reply count combined, since that's what a reader intuitively
  expects "47 comments" to mean).
- Empty state: a post with zero comments shows a friendly "No comments yet —
  be the first to comment" message rather than an empty list.
- Comment content is rendered as plain text (no HTML/markdown interpretation)
  and must be properly escaped when rendered so that any HTML-like text a
  user typed is displayed literally and never executed/rendered as markup
  (XSS prevention on the read path — React's default JSX text interpolation
  handles this as long as `dangerouslySetInnerHTML` is never used for
  comment content).

## Technical Implementation

- Add a read endpoint or server component data-fetch, e.g.
  `app/api/posts/[postId]/comments/route.ts` (`GET`) with query params
  `?page=1` (or cursor-based `?cursor=<id>`), or a direct Prisma query inside
  a React Server Component if the post page is already server-rendered —
  match whatever data-fetching convention the existing post page uses.
- Query shape (offset-based example):
  ```ts
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * 20,
    take: 20,
    include: {
      author: { select: { id: true, name: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
  ```
  Prefer cursor-based pagination (`cursor`/`take`) over offset (`skip`) if
  the existing codebase already has a cursor-pagination convention elsewhere,
  to avoid skip-based performance/consistency issues on a fast-moving list;
  otherwise offset pagination is acceptable for v1 given comments are
  unlikely to be extremely high-volume per post.
- Add a `CommentList` component (e.g.
  `components/comments/CommentList.tsx`) that renders top-level comments,
  nests `CommentItem` children for replies, and renders the `[deleted]`
  placeholder based on `deletedAt !== null` rather than trusting `content`
  directly (belt-and-suspenders with Feature 01/04's storage decision).
- Add a `CommentItem` component that both a top-level comment and a reply
  reuse, with a boolean/prop to control whether a "Reply" action is shown
  (only on top-level, non-deleted comments — replies themselves don't get a
  "Reply" action, matching the one-level nesting rule from Feature 02).
- Pagination UI: a "Load more comments" button (simplest to implement
  against 20-at-a-time) or numbered page links — either satisfies the plan;
  "Load more" is recommended for a comment-thread UX pattern.

## Dependencies

- Depends on Feature 01 (data model).
- Functionally exercised end-to-end alongside Feature 02 (needs real
  comments to display) and Feature 04 (needs deletion to test the
  `[deleted]` rendering path), but can be built/tested against seeded/mocked
  data independent of those features' implementation status.

## Acceptance Criteria

- [ ] Top-level comments for a post render newest-first.
- [ ] Exactly 20 top-level comments are shown per page/load, with a working
      mechanism to fetch the next 20.
- [ ] Replies render nested under their correct parent, oldest-first within
      the group, regardless of which page the parent appears on.
- [ ] A soft-deleted comment renders the literal text `[deleted]` and never
      renders its original stored content.
- [ ] A soft-deleted top-level comment's non-deleted replies still render
      beneath it.
- [ ] A post with no comments shows an empty-state message instead of a
      blank area.
- [ ] Comment text containing HTML/markdown-like characters (e.g. `<script>`,
      `**bold**`) renders as literal visible text and is not executed or
      interpreted as markup.
