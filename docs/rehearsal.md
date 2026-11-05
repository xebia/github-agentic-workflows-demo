# Rehearsal evidence

Observed on 5 November 2026. This records real results, not intended outcomes.

Repository: https://github.com/xebia/github-agentic-workflows-demo

Initial commit: `bf881c687f1ddc3c22bedf57e7520e5a8a18c3d1`, pushed to `main`.
GitHub API confirmed owner `xebia`, public visibility, and Actions enabled.

## Local verification

The checksum-verified gh-aw v1.0.1 Windows binary compiled the source with
`--strict --validate --no-check-update`: one success, zero warnings.
Seven dependency-free Node contract tests passed. Action references are
SHA-pinned; the generated agent job has contents/issue read permissions,
Copilot inference permission, and a dependency on the deterministic gate.
The generated handlers bind labels/comments to the selected input, enforce
the approval label, and cap label calls/label count/comments.

v1.0.1 accepts object-form read-tool counters at schema validation but emits
a subsequent frontmatter parsing warning. This demo deliberately uses its
warning-free string allowlist, with prompt-level read budgets instead.
Those budgets are not hard per-tool counters.

## Invalid input: verified fail-closed

Run: https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42002281223

Input: `issue_number=0`. Created at `2026-11-05T09:25:39Z`; completed at
`2026-11-05T09:26:30Z`: **51 seconds** elapsed including runner setup.

Role pre-activation and activation succeeded. `validate_issue` failed with
"issue_number must be a positive integer of at most nine digits".
Agent, detection, safe outputs, and conclusion were skipped. No issue was
created or modified. This establishes the invalid-input gate, not inference
entitlement or successful triage.

## Hosted deterministic tests: passed

Run: https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42002475857

Commit: `26a8f3933c5d9f1a669dd361cc12239d262605b2`.
All seven contract tests passed on the GitHub-hosted runner with Node 24.
Created `2026-11-05T09:27:05Z`, completed `2026-11-05T09:27:16Z`:
11 seconds elapsed.

## Synthetic issue inputs

After explicit approval to use the authenticated GitHub CLI, exactly three
synthetic issues were created. The pending MCP form was not submitted.

- [Well-formed reported bug](https://github.com/xebia/github-agentic-workflows-demo/issues/1)
- [Vague symptom](https://github.com/xebia/github-agentic-workflows-demo/issues/2)
- [Related, not duplicate feature](https://github.com/xebia/github-agentic-workflows-demo/issues/3)

## Well-formed report: verified successful output

Run: https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42002533738

Selected issue: 1. All seven jobs succeeded. Created at
`2026-11-05T09:27:31Z`, completed at `2026-11-05T09:32:49Z`:
**5 minutes 18 seconds** wall-clock latency.

The requested and successfully applied output was one `bug` label, with
HIGH confidence and this rationale:

> Speaker name with comma is split into multiple CSV fields instead of
> remaining a single escaped field, contradicting documented CSV export
> behavior that requires proper escaping of commas within fields.

GitHub inspection confirmed `bug` and `demo-approved`, zero comments, and
the issue still open. A complete report did not need a clarification comment;
zero comments is an allowed useful outcome.

The pinned CLI's audit reported the resolved Copilot model
`claude-haiku-4.5`, CLI `1.0.103`, approximately 128k total tokens including
cache reads, and 5.80 estimated AI credits. Agent job: approximately 1.6
minutes; detection: approximately 1.7 minutes. Audit heuristic graders also
flagged resource-heavy execution and imperfect tool-success ratios. These
are diagnostic estimates, not an invoice, vulnerability assessment, or a
claim that the model's interpretation was independently reproduced.

This successful run establishes that the existing organization-billed
Copilot path worked at rehearsal time. No credentials, organization permissions,
billing, or paid settings were changed.

## Vague report: verified useful clarification

Run: https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42003372208

Selected issue: 2. All jobs succeeded. Created at `2026-11-05T09:33:38Z`,
completed at `2026-11-05T09:38:52Z`: **5 minutes 14 seconds** elapsed.

One HIGH-confidence `needs-info` label was applied; no speculative primary
classification was added. Rationale: missing actual/expected behavior,
reproduction steps, affected export behavior, and environment.

Exactly [one comment](https://github.com/xebia/github-agentic-workflows-demo/issues/2#issuecomment-6654661985)
asked about actual/expected CSV output, reproduction inputs, and environment.
It referenced the existing comma-escaping report as a comparison and asked
whether this was related or different, without asserting duplication.
The agent-written body was under 180 words; the generated attribution/footer
is additional framework content. The issue remains open.

Audit estimated approximately 164k total tokens including cache reads and
6.39 AI credits. These are estimates, not actual invoiced spend.

## Related feature: verified distinct classification

Run:
https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42004042242

Selected issue: 3. All jobs succeeded. Created at `2026-11-05T09:38:29Z`,
completed at `2026-11-05T09:43:44Z`: **5 minutes 15 seconds** from dispatch,
including its short concurrency wait.

One HIGH-confidence `enhancement` label was applied. The structured rationale
states that optional pending-session export with a status column is new
behavior not currently promised by the product. Zero comments; issue open;
no duplicate marking. Audit estimated approximately 128k total tokens
including cache reads and 5.62 AI credits.

## Repeat: verified no extra noise

Unchanged vague-issue run:
https://github.com/xebia/github-agentic-workflows-demo/actions/runs/42004179629

All jobs succeeded. Created at `2026-11-05T09:39:31Z`, completed at
`2026-11-05T09:48:26Z`: **8 minutes 55 seconds from dispatch**, including
approximately four minutes queued behind the related-feature run.

The agent requested `noop`, not another label or comment. GitHub confirmed
exactly the original comment ID `6654661985`; its created and updated timestamps
both remain `2026-11-05T09:38:10Z`. No new comment and no rewrite occurred.
The issue remains open with `demo-approved` and `needs-info`.
Audit estimated approximately 129k total tokens including cache reads and
5.79 AI credits. A no-change decision still consumes inference and runner
resources: avoid redundant dispatches in normal operation.

## Presenter-ready contract

Use issue 2 and its verified comment as the main visible outcome, then contrast
issue 1 (`bug`, zero comments) and issue 3 (`enhancement`, not duplicate).
Show the source beside the compiled jobs, especially read-scoped `agent` and
the separately permissioned `safe_outputs`. Show the repeat run as an example
of useful abstention. Use the invalid-input run to demonstrate a deterministic
gate before inference.

The three first-pass positive runs took 5m14s to 5m18s. Prefer the verified
earlier runs for the live presentation; a new manual dispatch is optional.
This repository is ready for that bounded walkthrough, not unattended public
triage or a promise of identical answers. Only synthetic public inputs were
processed. No organization settings, persistent access, tokens, or billing
configuration were changed. No PR was opened.
