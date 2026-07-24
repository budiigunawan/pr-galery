# Feature 06 — Email Notification to Post Author

## Summary

When a new comment or reply is posted, send an email notification to the
blog post's author via the existing Resend integration. Other commenters
(e.g., the parent comment's author, if different from the post author) are
not notified in v1.

## Requirements

- Triggered on every successful comment creation (top-level or reply).
- Recipient is always the post's author (`post.authorId`'s email) —
  regardless of whether the new comment is a reply nested under someone
  else's comment.
- If the commenter **is** the post author (commenting on their own post), no
  email is sent (don't notify people about their own actions).
- Email failure must not fail or roll back the comment creation — comment
  creation succeeds even if the email fails to send.
- Email contains at minimum: commenter's display name, an excerpt of the
  comment body (e.g., first ~200 chars), the post title, and a link back to
  the post (deep-linked to the comment if feasible, e.g., `#comment-<id>`).

## Technical Implementation

1. Reuse the project's existing Resend helper (assumed to already exist, per
   the plan's "via our existing email service (Resend)" — e.g., a
   `lib/email/sendEmail.ts` or `lib/resend.ts`). If no shared helper exists
   yet, create a minimal one:
   ```ts
   // lib/email/resend.ts
   import { Resend } from "resend";
   export const resend = new Resend(process.env.RESEND_API_KEY);
   ```
2. Add `lib/email/notifyNewComment.ts`:
   ```ts
   export async function notifyNewComment({
     post,
     comment,
     commenter,
   }: NotifyArgs) {
     if (post.authorId === commenter.id) return; // don't notify self
     if (!post.author.email) return;
     try {
       await resend.emails.send({
         from: "notifications@yourblog.com",
         to: post.author.email,
         subject: `New comment on "${post.title}"`,
         react: NewCommentEmail({ post, comment, commenter }), // or html template
       });
     } catch (err) {
       // Log and swallow — never throw back into the request path.
       console.error("Failed to send comment notification email", err);
     }
   }
   ```
3. Call `notifyNewComment(...)` from the `POST` comment-creation handler
   (Feature 02/04), **after** the comment is successfully persisted, and
   without `await`-blocking the response (fire-and-forget, or `await` it but
   wrapped in try/catch so a Resend outage doesn't 500 the request — the
   try/catch inside `notifyNewComment` already guarantees this).
4. If the project uses React Email templates elsewhere, add a
   `NewCommentEmail` component consistent with existing template patterns;
   otherwise use a plain HTML string template.
5. Add `RESEND_API_KEY` to environment variable documentation if not already
   present (assumed already configured per plan).

## Edge Cases

- Post author has no email on file (shouldn't normally happen, but guard
  anyway) → skip sending, log a warning, do not error.
- Commenter replies to a comment authored by someone other than the post
  author → email still goes only to the post author, not to the parent
  comment's author (explicit non-goal).
- High-frequency commenting on a popular post → out of scope for v1 to
  batch/digest notifications; every comment sends its own email. (Call this
  out as a known future improvement if volume becomes a problem — not a
  blocker for v1.)

## Acceptance Criteria

- [ ] Posting a top-level comment sends exactly one email to the post
      author (verified via Resend's dashboard/logs or a test double in
      dev/test environments).
- [ ] Posting a reply sends the email to the post author, not to the parent
      comment's author (when they differ).
- [ ] Post author commenting on their own post does not trigger an email.
- [ ] Comment creation still returns success to the client even if the
      Resend call throws/fails (simulate by pointing at an invalid API key
      in a test).
- [ ] Email content includes commenter name, comment excerpt, post title,
      and a working link back to the post.
