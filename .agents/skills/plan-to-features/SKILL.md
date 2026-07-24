---
name: plan-to-features
description: Converts a plan, idea, or rough spec into a detailed implementation plan split into discrete "features," each with its own requirements, technical implementation steps, and acceptance criteria, written out as separate files under plans/. Use this whenever the user wants to turn a plan into a structured feature breakdown, asks to "split the plan into features," "break this down into implementation-ready pieces," "write out the requirements and feature files," or is about to hand off a plan to be built (by sub-agents, teammates, or in a future session) and needs it decomposed first. Also trigger when the user references a plans/ folder, plans/REQUIREMENTS.md, or plans/features/ structure, even if they don't say "feature breakdown" explicitly.
---

# Plan to Features

Turn a plan into an implementation-ready set of documents: one `plans/REQUIREMENTS.md`
overview, and one file per feature under `plans/features/`. The point is to hand
someone (a sub-agent, a teammate, or future-you) a feature file they can implement
from without needing to re-derive scope, design decisions, or "done" criteria.

## Why split into features at all

A single sprawling plan document is hard to implement from: it's unclear where one
unit of work ends and another begins, acceptance criteria get buried in prose, and
parallelizing the work (e.g. handing pieces to different sub-agents) is awkward.
Splitting into features fixes this — each feature file is a self-contained
implementation ticket. Keep that goal in mind rather than following the structure
below as rote steps: if a "feature" is really two independent pieces of work, split
it further; if two features are so tightly coupled they can't be built or reviewed
separately, merge them.

## Step 1: Gather the plan

Look for the plan in this order:
1. **Already in the conversation** — the user may have just discussed or pasted a
   plan. Use that as the source instead of asking them to repeat it.
2. **A file or directory the user points to** — read it in full.
3. **Neither** — ask the user for the plan or idea before going further. Don't
   invent scope from a one-line request; a vague plan produces vague, unusable
   feature files.

If the plan is missing key decisions (tech stack, target users, what's explicitly
out of scope), ask clarifying questions now rather than guessing — the whole value
of this output is that someone can implement from it without further back-and-forth.
Resolve ambiguity before writing files, not by hedging inside them.

## Step 2: Identify the features

A "feature" here is a self-contained, independently implementable and testable
unit of work — not necessarily a user-facing feature. Split along natural
boundaries: a distinct piece of UI, a backend capability, a data model change, an
integration, a migration. Good signals for where to split:

- It could reasonably be built, tested, and reviewed on its own (or by a
  different person/agent) without blocking on another feature's internals.
- It has its own clear "done" state, separate from the others.

Avoid two failure modes:
- **Too coarse**: "Build the dashboard" as one feature when it's really auth,
  data-fetching, and three distinct views — the file becomes another sprawling
  document and defeats the purpose.
- **Too fine**: splitting a single form's validation from its submit handler into
  two features that can't sensibly ship independently — this just creates
  bookkeeping overhead.

Order features roughly by build sequence (foundational/blocking work first), since
the numbering will imply that order to whoever picks this up.

Once you have the feature list, briefly confirm it with the user before writing
every file in full — it's much cheaper to fix scope at this stage than to rewrite
five feature files after the fact. A quick "here's how I'd split this — sound
right?" is enough; you don't need a full round-trip if the plan was already
detailed and unambiguous.

## Step 3: Write `plans/REQUIREMENTS.md`

This is the overview a reader opens first — it should let them understand the
whole plan and find their way to the right feature file without reading all of
them. Use this structure:

```markdown
# Requirements

## Overview
[What is being built and why, 1-2 paragraphs. The problem this solves.]

## Goals
[What this plan is trying to achieve, as a bulleted list]

## Non-Goals
[Explicitly out of scope — prevents scope creep and re-litigating decisions later]

## Assumptions & Constraints
[Tech stack, existing systems being integrated with, key decisions already made]

## Feature Index
| # | Feature | Summary |
|---|---------|---------|
| 01 | [name](features/01%20-%20feature-name.md) | One-line description |
| 02 | [name](features/02%20-%20feature-name.md) | One-line description |

## Open Questions
[Anything still unresolved — don't silently guess these, list them here]
```

Omit a section only if it's genuinely empty (e.g. no open questions) — don't pad
sections with filler to match the template.

## Step 4: Write one file per feature

Path: `plans/features/NN - feature-name.md`, where `NN` is a zero-padded two-digit
number (`01`, `02`, ... `10`, `11`) matching build order, and `feature-name` is a
short kebab-case slug. Zero-padding keeps directory listings sorted correctly past
feature 9.

Use this structure for every feature file:

```markdown
# Feature NN: [Feature Name]

## Overview
[1-2 sentences: what this feature is and why it exists in the plan]

## Requirements
[Detailed, specific functional and non-functional requirements. Specific enough
that someone unfamiliar with the discussion that produced this plan could
implement it without guessing. Include edge cases and error states that matter.]

## Technical Implementation
[Concrete implementation steps: files/modules likely touched, data model or
schema changes, API contracts, key algorithms or logic, sequencing if steps are
order-dependent. Reference real paths and existing patterns in the codebase where
you know them — don't invent file paths you haven't verified. If you're unsure of
the exact file, name the area/module instead of guessing a path.]

## Dependencies
[Other features (by number) this depends on or blocks, if any. Omit if none.]

## Acceptance Criteria
[A checklist of specific, verifiable conditions that define "done" for this
feature. Each item should be objectively checkable — testable behavior, not vague
qualities like "works well".]
- [ ] Criterion 1
- [ ] Criterion 2
```

Write requirements and acceptance criteria specific enough to catch scope
disagreements now, while they're cheap to fix, rather than during implementation.
A requirement like "handle errors gracefully" isn't useful — say what should
happen for which errors.

## Step 5: Confirm the output

After writing all files, tell the user what was created (the file tree is enough
— don't paste every file's contents back into the chat) and ask if any feature
needs to be split, merged, or reordered before they move on to implementation.

## A note on scope

This skill produces *planning documents*, not code. Don't start implementing any
feature as part of running this skill — the output is the handoff artifact itself.
If the user asks you to now go build feature 03, treat that as a new, separate
request.
