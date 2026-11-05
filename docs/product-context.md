# Workshop Queue: fictional product context

This is a synthetic issue-triage sandbox, not a deployed Xebia service. The
reported symptoms in sample issues are fictional; no product bug is claimed
to have been reproduced. The working software in this repository is the
GitHub Agentic Workflow, not Workshop Queue.

Workshop Queue lets conference organizers collect proposed sessions, review
them, and export an accepted-session schedule. It has three conceptual areas:

- Session intake: title, abstract, speaker display name, and duration.
- Review queue: pending, accepted, or declined; only organizers change status.
- Schedule export: UTF-8 CSV with title, speaker, start time, and duration.

The current documented export contains accepted sessions only, sorted by
start time. Durations are minutes. CSV fields containing commas, quotes, or
line breaks must be properly escaped. A speaker name must remain one CSV
field even if it contains a comma. This is expected behavior, so a report
that it breaks is a potential bug, not automatically an enhancement.

Exporting pending sessions is not currently supported. A request for an
optional pending-session export is an enhancement, even if another report
mentions the same CSV export feature.

A useful bug report names the area, concrete steps, expected/actual behavior,
and relevant input or environment. Request only missing facts needed to
route the issue; do not demand logs or personal data unnecessarily.

Do not infer urgency, business impact, or an actual implementation/root cause
from this specification. All issue numbers and related links must come
from real repository reads.
