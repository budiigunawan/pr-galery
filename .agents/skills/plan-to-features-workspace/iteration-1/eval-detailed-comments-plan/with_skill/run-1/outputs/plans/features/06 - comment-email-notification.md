# Feature 06: New Comment Email Notification

## Overview

Notifies a blog post's author by email when a new comment or reply is posted
on their post, using the project's existing Resend integration. Other
commenters (e.g. the author of a comment that received a reply) are not
notified — only the post author.

## Requirements

- On successful creation of a comment or reply (top-level or reply — both
  trigger this), send an email to the **post author** only.
  - This applies even when the new item is a reply to someone else's
    comment — the reply still notifies the post author, not the parent
    comment's author (per the plan: notifications go to the post author,
    not to other commenters).
- If the commenter **is** the post author (commenting on their own post), do
  not send a notification email (assumption — avoids self-notification
  noise; see Open Questions in REQUIREMENTS.md).
- Email content should include at minimum: the commenter's name, an excerpt
  or full text of the comment (plain text, consistent with how it's stored —
  no need to render/escape HTML since this is an email body, but do not
  execute/interpret it as markup either), a link back to the post (ideally
  deep-linking to the comment, e.g. `#comment-<id>` anchor, if the post page
  supports anchor scrolling — otherwise a plain link to the post is
  sufficient).
- Email sending failure must not fail or roll back the comment creation
  request (Feature 02). The comment is already saved; a failed email is
  logged (e.g. `console.error` or existing logging utility) and swallowed
  from the caller's perspective — the commenter still gets a normal success
  response.
- Sending should not meaningfully delay the comment-submission response to
  the commenter. Prefer firing the email asynchronously (e.g. not `await`ed
  inline in the critical path, or offloaded via whatever background-job/
  queue mechanism the project already has) rather than blocking the HTTP
  response on Resend's API call — but a simple `await` with try/catch is
  acceptable for v1 if the project has no existing async-job infrastructure
  and Resend's typical latency is acceptable.

## Technical Implementation

- Locate the existing Resend integration (per the plan: "our existing email
  service (Resend)") — likely a helper such as `lib/email.ts` or
  `lib/resend.ts` exporting a `sendEmail`/`resend.emails.send` wrapper.
  Reuse that helper/client rather than re-initializing a new Resend client
  or duplicating API-key handling.
- Add a dedicated function, e.g. `lib/comments/notifyPostAuthor.ts` →
  `notifyNewComment({ post, comment, commenter }): Promise<void>`, that:
  1. Skips sending if `commenter.id === post.authorId`.
  2. Fetches the post author's email (via the existing `User`/`Post`
     relations already loaded, or a lookup if not).
  3. Builds the email subject/body (e.g. "New comment on '<post title>'")
     and calls the existing Resend send helper.
  4. Catches and logs any error internally rather than throwing, so callers
     can fire-and-forget without wrapping every call site in try/catch.
- Call `notifyNewComment(...)` from the end of Feature 02's create handler,
  after the comment row is successfully persisted — not inside the same
  transaction as the insert (email sending should never be able to roll
  back a successful comment write).
- If the project has an existing background-job/queue system (e.g. a
  serverless queue, Inngest, a `after()` call in Next.js, etc.), prefer
  dispatching the notification through it; otherwise call the async
  function without blocking the response (e.g. don't `await` it directly in
  the request handler, or use Next.js's `after()` API if available in the
  project's Next.js version) so Resend latency doesn't add to the
  commenter's perceived response time.
- Add a test (unit or integration, depending on existing test conventions)
  verifying: (a) the post author receives the call/email on a top-level
  comment, (b) the post author receives it on a reply to someone else's
  comment, (c) no email is attempted when the commenter is the post author.

## Dependencies

- Depends on Feature 02 (triggered from the comment-creation flow).
- Depends on the project's existing Resend email integration already being
  configured (API key, from-address, etc.) — this feature does not set up
  Resend from scratch.

## Acceptance Criteria

- [ ] Creating a top-level comment on a post triggers exactly one email to
      that post's author.
- [ ] Creating a reply (to any top-level comment) triggers exactly one email
      to the post's author, not to the parent comment's author.
- [ ] A post author commenting on their own post does not trigger a
      notification email to themselves.
- [ ] A failure in the email-send call (e.g. Resend API error) does not
      cause the comment-creation request to fail or the comment to be
      rolled back — the comment is still created and the commenter still
      gets a success response.
- [ ] The email content includes the commenter's name, the comment text, and
      a link back to the post.
- [ ] Comment creation's response time to the commenter is not materially
      increased by a slow email-send call (verified by, e.g., artificially
      delaying the mocked Resend call in a test and confirming the API
      response returns without waiting on it, or documenting the accepted
      synchronous fallback if no async mechanism exists in the project).
