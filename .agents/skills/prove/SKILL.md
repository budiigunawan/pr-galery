---
name: prove
description: Verify that a feature, bug fix, or task is genuinely complete and working before telling the user it's done — using live browser testing via the Playwright MCP, screenshots, and visual/functional analysis as hard evidence, not code-reading or "it should work" reasoning. Trigger this whenever the user explicitly asks to "prove it works," "verify," "double check your implementation," "show me evidence," or similar — and also trigger it proactively, without being asked, right before declaring any non-trivial feature, UI change, or bug fix complete. A clean build, passing types, or a code review is not proof; only running the app and observing the actual behavior is.
---

# Prove It Works

Code that type-checks and reads correctly can still be broken at runtime — wrong state, a form that doesn't wire to its handler, a layout that collapses, an API that 500s on the exact input the feature is meant to handle. The only way to actually know a feature works is to run it and observe it the way a user would. This skill is the difference between "I implemented X" and "I watched X work."

## When to use this

- The user explicitly asks for proof, verification, or a double-check.
- Proactively, right before you tell the user a feature/fix/task is done — especially anything touching UI, an API route, or user-facing behavior. Don't wait to be asked; claiming completion without having watched it work is the failure mode this skill exists to prevent.

If the user is mid-conversation and clearly just wants a quick opinion or a code review (not a completion claim), this skill doesn't need to fire — it's for the moment work is about to be marked done.

## The workflow

### 1. Re-derive what "working" means

Before touching the browser, write down (even just in your own reasoning) the concrete, checkable claims the feature makes: what should the user be able to do, what should they see, what should NOT happen. Pull this from the original request/plan, not from your implementation — if you derive success criteria from your own code, you'll only ever confirm what you already believe.

### 2. Sanity-check the diff

`git status` / `git diff` — confirm what actually changed matches what you intend to prove. This catches the easy stuff (forgot to save a file, edited the wrong component) before you spend time on browser testing.

### 3. Get the app running

Check whether a dev server is already up before starting a new one (avoids port conflicts and duplicate processes). If this project has a `run` skill, prefer it — it already knows the right launch pattern for this codebase. Otherwise start it the standard way for the stack and wait for it to be ready before navigating.

### 4. Exercise it live with the Playwright MCP

This is the core of the proof. A single screenshot of a page loading is not evidence a feature works — it's evidence a page renders.

- Navigate to the actual surface the feature lives on.
- Perform the real user actions the feature enables: click through the flow, fill and submit forms, trigger the state changes — don't just load the page and look at it.
- Cover the golden path *and* at least one edge or error case (empty state, invalid input, a boundary condition) — features usually break at the edges, not the middle.
- Take a screenshot at each meaningful state transition (before action, after action, error state if applicable), not just one final shot. A sequence of screenshots tells the story; one screenshot only shows the ending.
- After actions that hit the backend, check `mcp__playwright__browser_console_messages` for JS errors and `mcp__playwright__browser_network_requests` for failed calls. A feature that "looks right" with a 500 in the network tab underneath it is not working.

### 5. Actually look at the screenshots

Don't just note that a screenshot was captured — open it and describe what's in it, in enough detail to show you looked: layout, copy, states, whether it matches the acceptance criteria from step 1. If this project has a design system doc (e.g. `DESIGN.md`), check the screenshot against it — spacing, color usage, component patterns — since a feature that works functionally but violates the design system isn't actually done per this project's own bar.

### 6. Non-UI work: use the equivalent hard evidence

Not everything has a browser surface. For APIs, CLI tools, scripts, or backend logic, the Playwright path doesn't apply — but the standard doesn't relax, the medium changes. Run the actual command, hit the actual endpoint (curl or an HTTP client), or run the actual test suite, and capture the real output. Paste it in, don't paraphrase it ("the tests passed" is not the same as showing the passing output).

### 7. Report the proof

Structure the report so the user can verify your verification:

- A checklist mapping each claim from step 1 to pass/fail.
- The screenshots (or command output) that back each claim, inline, in sequence.
- Anything that didn't work or looked off — surfaced plainly, not smoothed over. If something's broken, fix it and re-run the relevant steps before reporting completion; don't report a partial pass as done.

## What breaks this skill's whole purpose

- Declaring something works because the code looks right, types check, or the build succeeded — none of these are runtime evidence.
- Taking one screenshot of a page loading and calling it proof of a feature working.
- Skipping the console/network check — a broken request under a fine-looking screenshot is exactly the kind of bug this process exists to catch.
- Only testing the happy path when the feature has any edge cases at all.
- If the Playwright MCP isn't available, there's no display, or the app genuinely can't be run in this environment — say that plainly and explain what verification was and wasn't possible. Do not fabricate a screenshot's contents or quietly skip verification while still claiming the feature is proven.
