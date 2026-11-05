# Triage policy

| Label | Apply when |
| --- | --- |
| `bug` | The reported behavior contradicts the documented product behavior. This does not certify reproduction. |
| `enhancement` | The request adds a behavior the product does not currently promise. |
| `question` | The issue asks for an explanation of current behavior or usage. |
| `needs-info` | Specific missing facts prevent useful routing or reproduction. State what is needed. |
| `demo-approved` | A human reviewed this synthetic input for agent access. Never add it through agent outputs. |

One primary classification at most; add `needs-info` only when justified.
Do not apply low-confidence classifications. Preserve existing labels.
Every label request carries confidence and a grounded rationale in its
structured safe output; these rationales are inspectable in the run artifacts.

Related issues are not necessarily duplicates. Compare expected behavior,
actual symptom, and context. This demo deliberately has no duplicate output.
Read at most three related candidates and update only the selected issue.

Comment only if it reduces maintainer work. Maximum one comment per run,
180 agent-written words, three links. A repeated unchanged triage should not
add another comment. The handler can replace the previous workflow comment
when new evidence materially improves it.

The hard write contract permits one label call with at most two labels and
one comment, on the input-selected issue, only while `demo-approved` remains
present. It enables no issue closing, assignment, PR creation, code edits,
merging, or cross-repository writes. The agent token has read repository
permissions; `copilot-requests: write` grants inference, not issue writes.

Manual dispatch and a pre-inference input/issue check keep routine validation
outside the model. Contributors with write, maintain, or admin access choose
the issue; simply opening a public issue never starts inference.
