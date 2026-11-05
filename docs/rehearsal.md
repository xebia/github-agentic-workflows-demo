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

## Positive triage: not yet verified

At this point the app's issue-creation tool reports that the project's linked
GitHub account is unavailable. The GitHub MCP fallback opened an interactive
issue form but did not create an issue. Read-only CLI inspection confirmed
the repository had no issues.

CLI authentication and repository push work; these do not establish that
Copilot inference is enabled for the organization. No credentials, permissions,
billing, or paid settings were changed. Do not present the demo as stage-ready
until a positive run produces and applies useful triage.
