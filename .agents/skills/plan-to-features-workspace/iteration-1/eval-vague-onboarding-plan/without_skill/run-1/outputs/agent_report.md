I did not write any files. Given how little product context is in this request, my genuine instinct is to ask clarifying questions before drafting an implementation-ready feature breakdown — writing detailed feature files now would require guessing at things that materially change what the features should be.

**What's missing that blocks a real breakdown:**

The request describes the *problem* (empty dashboard, no guidance) and a *shape* (a few steps, progress indicator, fast, not annoying) but gives zero information about the product itself. "Get them to their first meaningful action faster" is the crux of an onboarding flow, and I don't know what that action is — is this a project-management tool where it's "create your first project," a CRM where it's "add a contact," a data tool where it's "connect a source"? Each implies a completely different set of onboarding steps, different empty-state copy, and different completion criteria. Writing steps without that would mean fabricating a product.

**Questions I'd ask before drafting:**

1. What does the product actually do, and what's the one "first meaningful action" we want a new user to reach (e.g., create X, invite a teammate, connect Y, complete setup step Z)?
2. Roughly how many steps do you have in mind — 2-3 lightweight prompts, or more like a 5-6 step wizard? Should it be skippable, or a forced sequence before reaching the dashboard?
3. Does this apply uniformly to every new signup, or does it vary by role/plan/use case?
4. Is there any existing empty-state, tooltip, or checklist pattern already in the product we should build on, or is this fully greenfield?
5. Any target metric (e.g., % completing onboarding, time-to-first-action) that should inform acceptance criteria for these features?

**Reasoning:** The project's own AGENTS.md rules (loaded automatically for this repo) are explicit — "Always ask clarifying questions," "Never assume design, tech stack or features" in planning mode — and this request sits squarely in that bucket: no existing plans/ folder, no codebase to infer domain from, and the user says outright the steps aren't picked yet. Drafting a plausible-looking feature breakdown here would mean inventing the product's core workflow, which risks producing something that reads as implementation-ready but is actually built on a wrong guess about what the app does. Asking these five questions first is cheap; guessing wrong on the "first meaningful action" would waste the whole exercise.
