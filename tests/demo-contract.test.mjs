import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../.github/workflows/triage-one-issue.md", import.meta.url), "utf8");
const lock = await readFile(new URL("../.github/workflows/triage-one-issue.lock.yml", import.meta.url), "utf8");
const scriptMatch = source.match(/          script: \|\r?\n((?:            .*(?:\r?\n|$))+)/);
assert.ok(scriptMatch, "The authored deterministic gate must remain inspectable");
const gate = scriptMatch[1].replace(/^            /gm, "");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function runGate(input, issue) {
  let apiCalls = 0;
  let requestedNumber;
  const errors = [];
  const github = {
    rest: {
      issues: {
        get: async ({ issue_number }) => {
          apiCalls++;
          requestedNumber = issue_number;
          if (issue instanceof Error) throw issue;
          return { data: issue };
        },
      },
    },
  };
  await new AsyncFunction("process", "core", "github", "context", gate)(
    { env: { ISSUE_NUMBER: input } },
    { setFailed: message => errors.push(message) },
    github,
    { repo: { owner: "xebia", repo: "github-agentic-workflows-demo" } },
  );
  return { apiCalls, requestedNumber, errors };
}

const approved = { state: "open", labels: [{ name: "demo-approved" }] };

test("invalid input fails before any API request", async () => {
  for (const input of ["", "0", "-1", "1.5", "01", " 1", "1 ", "1e2", "1000000000", "1;echo secret"]) {
    const result = await runGate(input, approved);
    assert.equal(result.apiCalls, 0, input);
    assert.equal(result.errors.length, 1, input);
  }
});

test("approved open issues pass with exactly the input-selected number", async () => {
  for (const input of ["1", "42", "999999999"]) {
    const result = await runGate(input, approved);
    assert.equal(result.apiCalls, 1);
    assert.equal(result.requestedNumber, Number(input));
    assert.deepEqual(result.errors, []);
  }
});

test("closed, unapproved and pull-request targets are rejected", async () => {
  for (const issue of [
    { ...approved, state: "closed" },
    { ...approved, labels: [] },
    { ...approved, pull_request: { url: "https://api.github.com/repos/example/example/pulls/42" } },
  ]) {
    const result = await runGate("42", issue);
    assert.equal(result.errors.length, 1);
  }
});

test("API failures propagate rather than producing a success fallback", async () => {
  await assert.rejects(runGate("42", new Error("Not Found")), /Not Found/);
});

test("compiled metadata pins the stable compiler and declared read tools", () => {
  const metadata = JSON.parse(lock.match(/^# gh-aw-metadata: (.+)$/m)[1]);
  const manifest = JSON.parse(lock.match(/^# gh-aw-manifest: (.+)$/m)[1]);
  assert.equal(metadata.compiler_version, "v1.0.1");
  assert.equal(metadata.strict, true);
  assert.deepEqual(manifest.mcp_servers.find(server => server.name === "github").tools,
    ["get_file_contents", "issue_read", "search_issues"]);
  for (const action of manifest.actions) assert.match(action.sha, /^[a-f0-9]{40}$/);
  const outputs = manifest.mcp_servers.find(server => server.name === "safeoutputs").tools;
  for (const forbidden of ["create_issue", "close_issue", "assign_to_user", "create_pull_request", "merge_pull_request"]) {
    assert.ok(!outputs.includes(forbidden), forbidden);
  }
});

test("compiled handlers enforce fixed target, approval and output caps", () => {
  const serialized = lock.match(/GH_AW_SAFE_OUTPUTS_HANDLER_CONFIG: (".+")/)[1];
  const handlers = JSON.parse(JSON.parse(serialized));
  for (const name of ["add_comment", "add_labels"]) {
    assert.equal(handlers[name].target, "${{ inputs.issue_number }}");
    assert.deepEqual(handlers[name].required_labels, ["demo-approved"]);
    assert.equal(handlers[name].max, 1);
  }
  assert.equal(handlers.add_labels.max_labels, 2);
  assert.deepEqual(handlers.add_labels.allowed, ["bug", "enhancement", "question", "needs-info"]);
  assert.equal(handlers.add_comment.replace_older_comments, true);
  assert.equal(handlers.add_comment.max_links, 3);
  assert.ok(!handlers.create_issue);
});

test("generated agent remains read-scoped and waits for deterministic validation", () => {
  const agent = lock.split(/^  agent:\r?$/m)[1].split(/^  [a-z_]+:\r?$/m)[0];
  assert.match(agent, /      - validate_issue/);
  const permissions = agent.match(/    permissions:\r?\n((?:      .+\r?\n)+)/)[1];
  assert.match(permissions, /issues: read/);
  assert.match(permissions, /contents: read/);
  assert.match(permissions, /copilot-requests: write/);
  assert.doesNotMatch(permissions, /(?:issues|contents|pull-requests): write/);
  const normalizeIndentation = text => text.trim().split(/\r?\n/).map(line => line.trim()).join("\n");
  assert.ok(normalizeIndentation(lock).includes(normalizeIndentation(gate)),
    "Compiled workflow must preserve the deterministic gate");
  assert.doesNotMatch(source.split("---")[1], /\b(?:schedule|issue_comment|pull_request_target):/);
});
