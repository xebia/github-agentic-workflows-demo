### Context

Synthetic report for the Workshop Queue demo; not an observed production bug.

### Steps to reproduce

1. Accept a 30-minute session titled "Practical agents" with speaker display
   name `Doe, Sam`.
2. Set its start time to `2026-11-11T14:00:00+01:00`.
3. Export accepted sessions as CSV.
4. Open the CSV in LibreOffice Calc using comma-separated fields and UTF-8.

### Expected behavior

The speaker name remains a single field and the row has the same number of
columns as the header.

### Actual behavior (fictional report)

The name appears as two fields, `Doe` and `Sam`; subsequent fields shift
one column. Names without a comma import correctly.

### Environment

Workshop Queue demo scenario, LibreOffice Calc 25.8 on Windows 11.
There are no real customer records or credentials in this sample.
