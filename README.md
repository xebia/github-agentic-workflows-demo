# GitHub Agentic Workflows: one useful triage

A public Xebia demo for **GitHub Universe To You, 11 November 2026**:
**Turning Repository Work into Repeatable Agent Tasks**.

The contract is deliberately small: a maintainer selects **one reviewed open
issue**; the agent reads repository context, requests up to **two justified
labels** and **one useful comment**; a separate permission-scoped job applies
allowed outputs. It never fixes code, closes/assigns issues, sweeps the backlog,
or creates/merges PRs. The fictional Workshop Queue product supplies realistic
issue context, not a claim of a deployed application.

## What to show

1. Open a sample issue and explain what a maintainer needs to decide.
2. Open [the source](.github/workflows/triage-one-issue.md): trigger, read
   permissions, tools, bounded outputs, then the natural-language task.
3. Open [the generated workflow](.github/workflows/triage-one-issue.lock.yml).
   Markdown is authored; GitHub Actions executes the committed `.lock.yml`.
4. Dispatch the workflow with that issue number. Inspect the agent, detection,
   and safe-output jobs, then the actual labels/comment on the issue.
5. Ask whether the output reduced maintainer work. Successful execution alone
   is not evidence of correct triage.

## Pinned tooling and setup

Use Git, GitHub CLI, and **gh-aw v1.0.1** (stable release checked 5 November
2026). This source was checked against v1.0.1 docs/source, not an unpinned
gallery example. Do not compile it with an older extension.

```powershell
Set-Location C:\Repos\Xebia\github-agentic-workflows-demo
gh extension install github/gh-aw --pin v1.0.1
gh aw --version
gh aw compile triage-one-issue --strict --validate --no-check-update
git diff -- .github/workflows
```

If already installed at another version, choose an explicit pinned install
in your own environment, or download the v1.0.1 platform binary and verify its
SHA-256 against that release's `checksums.txt`. Do not casually upgrade someone
else's global tools. Commit both source and generated lock after any change.
Compiler validation checks syntax/contracts, not model correctness or runtime
entitlement. Docker image validation needs Docker; absence is not proof that
images were independently scanned.

Run the dependency-free deterministic gate and compiled-contract tests with
Node.js 22 or newer:

```powershell
node --test tests\demo-contract.test.mjs
```

These cover invalid inputs, approval/open-issue/PR checks, propagated API
failures, generated read permissions, tool allowlists, action pins, and output
targets/caps. They do not substitute for a real inference/output rehearsal.

Actions must be enabled and the organization must already support Copilot
inference through `copilot-requests: write` with centralized billing. No PAT is
required for this configured path. **Do not create credentials or change billing
or organization policy to make the demo run.** If inference is denied, record
the real failure and ask the owner to choose an authorized setup separately.
An existing `COPILOT_GITHUB_TOKEN` does not override this inference path.

## Labels and inputs

Create the demo taxonomy deterministically (not through the model), once:

```powershell
gh label create demo-approved --repo xebia/github-agentic-workflows-demo --color 5319E7 --description "Human-reviewed synthetic demo input"
gh label create needs-info --repo xebia/github-agentic-workflows-demo --color D876E3 --description "Specific information needed for useful triage"
```

GitHub's default `bug`, `enhancement`, and `question` labels are used unchanged;
if absent, create them according to [the policy](docs/triage-policy.md).
Review samples before marking them approved; never put real confidential
records or secrets in this public repository.

```powershell
gh issue create --repo xebia/github-agentic-workflows-demo --title "CSV export splits a speaker name containing a comma" --body-file samples\well-formed.md --label demo-approved
gh issue create --repo xebia/github-agentic-workflows-demo --title "Export looks wrong" --body-file samples\vague.md --label demo-approved
gh issue create --repo xebia/github-agentic-workflows-demo --title "Allow pending sessions in draft CSV export" --body-file samples\related-not-duplicate.md --label demo-approved
```

These intentionally demonstrate a clear reported bug, appropriate uncertainty,
and related-but-not-duplicate behavior. Use the issue numbers returned by GitHub,
not numbers assumed from this README.

## Run and rehearse

From **Actions > Triage one approved demo issue > Run workflow**, select `main`
and enter one approved open issue number. Or use the CLI (replace `1` with the
actual number):

```powershell
gh workflow run triage-one-issue.lock.yml --repo xebia/github-agentic-workflows-demo --ref main -f issue_number=1
gh run list --repo xebia/github-agentic-workflows-demo --workflow triage-one-issue.lock.yml --limit 5
gh run view RUN_ID --repo xebia/github-agentic-workflows-demo
gh issue view 1 --repo xebia/github-agentic-workflows-demo --comments
gh aw audit RUN_ID
```

Capture the real run URL, commit SHA, job results, requested/applied outputs,
elapsed wall-clock time, and any inference failure. Read artifacts before
sharing them; never publish raw credentials/logs wholesale.

| Case | Human evaluation rubric (not an exact scripted answer) |
| --- | --- |
| Well-formed | `bug`; no unnecessary information request; distinguish the pending-export feature if linked; no invented root cause. |
| Vague | `needs-info`; focused questions about input, steps, and expected/actual output; abstain from a guessed primary label. |
| Related feature | `enhancement`; explain that pending selection differs from malformed CSV; no duplicate classification. |
| Repeat unchanged issue | No extra comment; unchanged useful conclusions do not justify noise. |
| Invalid number or unapproved issue | Fail the deterministic gate before inference, without issue writes. |

Do not repeatedly dispatch a failing engine. Keep a verified earlier run as
the stage fallback; if no run succeeded, say explicitly that runtime readiness
is blocked, rather than presenting a fabricated outcome.

## Safeguards and limits

Only manual dispatch; no schedules, issue-open triggers, or unrestricted public
comment commands. Role allowlist is explicitly admin/maintainer/write. Input
validation, open-issue check, and human approval label are deterministic and
run before inference. Output targets are bound to the selected input, not `*`,
and handlers recheck the approval label. Repository reads are restricted to this
public demo; only three read tools are exposed. The prompt budgets two context
reads, six issue/comment reads, and two searches; these are instructions, not
hard per-tool counters (v1.0.1's object-form tool counters emit a compiler
frontmatter parsing warning, so this demo uses its compatible string allowlist).
No shell, editing, browser, custom MCP, or cross-repository access is enabled
for the agent. No automatic status comments or reactions inflate the output count.
Automatic failure-issue reporting is disabled; failures remain visible in Actions.
The compiler may grant framework/output jobs broader issue/PR scopes for its
generic handlers; the agent remains read-scoped and the selected open-issue
gate plus fixed output targets constrain this demo's write path.

The agent has an eight-minute job timeout, twelve turns, a 20-AI-credit
best-effort limit, and no harness retries. Concurrency serializes this workflow;
do not queue many runs. Detection and output processing are additional jobs, so
eight minutes is not a whole-run latency or invoice guarantee. AI-credit estimates
are not a paid-account spending limit; Actions and inference billing are separate.

Safe outputs restrict actions, not truth. Prompt injection filtering/detection
are defense in depth, not a correctness guarantee. Humans still inspect applied
labels, rationales, citations, and whether the comment is useful.

## Primary references

- [Pinned release](https://github.com/github/gh-aw/releases/tag/v1.0.1)
- [v1.0.1 source and docs](https://github.com/github/gh-aw/tree/v1.0.1/docs/src/content/docs)
- [Workflow structure](https://github.github.com/gh-aw/reference/workflow-structure/)
- [Safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)
- [Copilot authentication](https://github.github.com/gh-aw/reference/auth/)

Live website references may describe newer releases. The compiled lock is the
reviewable executable artifact for this demo.
