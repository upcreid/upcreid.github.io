+++
title = "ThinkRail: JetBrains builds a real IDE around the pi coding agent"
description = "ThinkRail wraps the pi coding agent in a desktop-class IDE: isolated git worktrees, a spec graph the agent actually reads, and turn-by-turn code review. Here is what it does, how to install it, and where it still hurts."
slug = "thinkrail-agentic-ide"
date = 2026-11-10T10:00:00+01:00
updated = 2026-11-10T10:00:00+01:00
draft = false
aliases = ["/blog/2026/11/10/thinkrail-agentic-ide/"]

[extra]
lead = "Not another chat panel bolted onto an editor: a thin GUI around pi, where every task gets its own worktree and every project keeps its specs."
authors = ["UpCreid"]
+++

There is a moment, after a few weeks of vibe coding in a terminal, when you notice you are no longer programming. You are watching a transcript scroll, scrolling back to figure out which file the agent touched, and typing `git diff` in a panic. The agent is fine. Your workflow is not.

**ThinkRail** is JetBrains' answer to that. It is an *agentic IDE*: a real editor, a real terminal, a real diff viewer, wrapped around the **pi** coding agent. It comes from the JetBrains **InnovationHub** incubator, not from the IntelliJ team, and it is **open source (Apache-2.0), free, and account-less**. That last part matters more than it sounds: no login, no seat, no telemetry-driven upsell for the app itself.

## What ThinkRail actually is

ThinkRail is not an IntelliJ plugin, and it is not another fork of VS Code. It is a thin host: the `pi` engine runs **in-process** inside ThinkRail and owns the hard parts (models, skills, context compaction, token cost, session state). ThinkRail owns everything around it: workspaces, the GUI, and the typed contract between the engine and the UI.

Under the hood, the architecture is refreshingly boring, in the best sense:

- an HTTP + WebSocket host (Bun) with one `pi` session per chat;
- a versioned, typed protocol between host and UI;
- a React web client, shipped independently;
- two front-ends for the same engine: a native desktop app (packaged with Electrobun) and a `thinkrail` CLI that opens the same UI in your browser.

Because it is a *host*, ThinkRail never assembles prompts behind your back. Your `~/.pi` configuration is the source of truth: providers, models, skills, extensions, chat history. You can start a session in ThinkRail and continue it from the pi CLI, or the other way round. This is the opposite of the usual vendor lock-in play, and it is the single most important design decision in the product.

## Workspaces: agents deserve worktrees, not your working tree

The core idea is simple: a **project** is any local git repo, and a **workspace** is a `git worktree` cut from it. Each workspace gets its own branch, its own working directory, its own files, terminals, diffs and chats.

In practice, you click "Start building", pick a base branch, write a description (which doubles as the first prompt), and the agent starts working in `~/.thinkrail/worktrees/<project>/workspace-1`. Your checkout is untouched. If the agent rewrites a file, deletes something, or runs a formatter you did not ask for, the damage is contained to that branch. You merge what you like and delete the rest.

The consequence everyone underestimates: **parallelism becomes safe**. Three agents on three worktrees cannot fight over the same files, because they are not in the same directory. One can refactor a module while another rewrites the specs, and neither will discover a half-written file from the other.

Small details that show the feature was actually used: workspaces that are finished park themselves on a **Settled** shelf when their PR merges or closes, or after a configurable idle period (one, three, seven or fourteen days, or never); and they come back the moment you touch them again.

## Spec-driven development, without the ceremony

The second pillar is the **spec graph**. Every module can carry a `SPEC.md` file with a YAML header that links it to the others:

```yaml
---
id: module-server
type: module-design
status: active
parent: architecture
depends-on: [goal-and-requirements]
tags: [engine, contracts]
---
```

The `status` field alone (`draft`, `active`, `stale`, `done`, `deprecated`) is worth the price of admission: a spec cannot silently rot, because its staleness is written down. At the root of the repo you keep `goal-and-requirements.md` and `architecture.md`; below, one `SPEC.md` per genuine module.

The crucial part is not the format, it is who maintains it. ThinkRail bundles a `pi-spec-graph` extension that gives the agent dedicated `spec_*` tools to search, navigate and update the graph. When a change moves a boundary or breaks a contract, the spec is supposed to be updated **in the same turn**, never after. The agent reads the nearest spec instead of the whole codebase, which keeps its context small and its answers grounded.

This is Spec-Driven Development as JetBrains frames it: documentation comes back not because managers asked for it, but because it is the cheapest way to keep an agent on course across sessions. The specs are the guardrails — always present, never in the way when things go well.

## The IDE part is not decorative

A chat panel is not an IDE. ThinkRail ships the boring, indispensable pieces:

- **Monaco tabs** (the VS Code editor engine), with syntax highlighting, rendered Markdown and a source toggle;
- a **file tree** scoped to the active worktree, with a changed-files filter;
- a **git changes panel** that diffs the workspace branch live, while the agent is still typing;
- **real PTYs**, so you can run your tests yourself while the agent keeps working;
- a **review panel** where you collect line comments and send them back to the agent in one message.

The review flow is the feature I did not expect to care about. When a turn changes files, it ends with a receipt like `3 files changed · +27 −4` and a **Review turn** button. Those numbers do not come from the agent's own claims: the host snapshots the worktree at the start and at the end of the run, so a formatter or a shell `sed` counts too. You then read everything in one scroll, with `Keep`, `Revert`, and `Ask agent about this hunk` on each hunk, and `J` to jump to the next unreviewed file. `Keep` is keyed to the hunk content, so it survives line shifts.

That single design change — *review the turn, not the chat log* — is what turns an agent from a toy into a colleague.

## Chat, models, and the small things that matter

The chat is built for real work rather than demos:

- several concurrent sessions per workspace, **each with its own model and reasoning effort**;
- you can **steer a running turn** or queue a follow-up instead of waiting for the agent to finish;
- live token accounting: input, output, cache reads and writes, cost, and how full the context window is;
- a **plan** shared between you and the agent, with a full page showing each finished step's summary and verification;
- background resources (commands, subagents, MCP servers) in one popup;
- **`⌘K` / `Ctrl+K` / double-tap Shift** opens one box that finds chats *and messages inside them*, workspaces, projects, files, specs and plans, runs app commands, and — when empty — lists every chat waiting on you across all projects. That last trick fixes the real bottleneck of parallel agents: noticing which one is blocked on a question.
- interactive tools: the agent can ask you structured multiple-choice questions in the chat instead of guessing, draw Mermaid diagrams, and show before/after mockups you can comment on like a diff.

On the model side, ThinkRail has **no accounts of its own**. You sign in with JetBrains AI or connect any provider through pi's auth. You can also point it at a company gateway or a local model server — Ollama, LM Studio, vLLM, llama.cpp, LiteLLM, sglang — through Settings → Providers → Add server: paste an address, click *Find models*, save. It lands in pi's `models.json`, so the pi CLI benefits from the same configuration, and the API key never reaches the browser.

Extensions follow the same philosophy. You can install any pi package by npm name, git URL or local folder, see what it adds before enabling it, and switch individual packages, extensions, skills or pi built-ins on and off. Bundled extensions include `pi-web-access`, `pi-visualize`, `pi-spec-graph`, `pi-thinkrail-workflow` and `pi-todos`. Skills are discovered from `~/.pi`, `~/.claude`, `~/.codex`, `~/.copilot` and `~/.gemini`, plus the project-local equivalents — so an existing Claude Code setup is not wasted.

MCP is supported without the usual footguns: servers come from your `mcp.json` or from Settings, secrets must be `${VAR}` or `!command` references (pasting credentials into a URL is refused), servers shipped by a repository stay off until you approve exactly what they will run, and any call that may change data asks first — `Deny`, `Allow once`, `Allow in this chat`, `Always allow`.

## Installing it and doing a first task

Get the desktop build from [thinkrail.ai](https://thinkrail.ai/) (macOS Apple Silicon or Intel, Windows x64, Linux x64/ARM64), or use the CLI:

```bash
# macOS, Linux, WSL (and Windows under Git Bash)
curl -fsSL https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/JetBrains/thinkrail/main/install.ps1 | iex

thinkrail ~/code/my-repo
```

On Linux, the desktop build is the fussy one: you need glibc 2.38+ and GTK 3 / WebKitGTK 4.1 / Ayatana AppIndicator 3 / librsvg 2, which in practice means Ubuntu 24.04 or newer:

```bash
sudo apt install libgtk-3-0 libwebkit2gtk-4.1-0 \
  libayatana-appindicator3-1 librsvg2-2
```

Then a sane first session looks like this:

1. Open a repo. If you have none ready, *Start a new project* creates an empty git repository.
2. Go to Settings and connect a provider (JetBrains AI or your own key), then pick a default model.
3. Create a workspace from `main` and describe the task in one sentence — that description is the first prompt.
4. Let the agent work. Watch the diff land in the Changes panel; open a terminal if you want to run the tests yourself.
5. Press **Review turn**, read the whole change, keep or revert hunks, and send comments back if something is off.
6. Publish the branch and open a pull request from the top bar. ThinkRail shows the CI checks and the review decision, and lets you mark ready, merge, or delete the remote branch.
7. Merge or close the PR, and the workspace settles itself.

For spec-driven work, add a fifth step: ask the agent to write or update the `SPEC.md` of the module it touched, and check the Specs panel to see the graph. After a few tasks, the specs become the thing you read before opening the code.

## What it does well

**Isolation is real.** Worktrees are not a gimmick: they are the only mechanism I have seen that makes parallel agents genuinely safe with a shared repository, without copying the whole repo or inventing a proprietary workspace format.

**The agent keeps its memory of intent.** Specs plus skills plus a shared plan mean a new session does not restart from zero. The graph keeps context small, and the `spec_*` tools make the agent responsible for its own documentation.

**Nothing is locked in.** Apache-2.0, no account, your providers, your `~/.pi`, your `models.json`, your git. You can leave ThinkRail and keep your setup, or run the CLI in a browser over SSH on a remote machine.

**The GUI is honest about the agent.** Snapshotted diffs, per-hunk review, token cost in the header, resources and subagents visible: you always know what happened, how much it cost, and what is still running.

**It is free.** The app costs nothing; you pay your model provider, and that is it.

## Where it still hurts

**It is a 0.x product.** Version 0.3.1 at the time of writing (November 2026). Expect rough edges, nightly channels, and features that move between releases. The release notes themselves list caveats — for instance, keep/revert only works on the branch diff, not on the single-turn view, and very large diffs start collapsed.

**It is pi-only.** ThinkRail is a host for one engine. If your workflow is built around Claude Code, Cursor or Codex, this is not a drop-in replacement — there are community forks experimenting with that, but the official product is deliberately about pi. The bet is that a minimal, extensible harness plus a good GUI beats a monolith.

**Linux packaging is the weak spot.** Ubuntu 24.04+ effectively, unsigned builds, no notarized macOS CLI. The Windows CLI and desktop binaries are signed, macOS desktop DMGs are signed and notarized, macOS CLI is signed but not notarized. On Linux, expect to verify checksums yourself.

**It phones home by default.** Launches, chat creation, message sends and provider connections are collected under a random installation ID; error reports are always sent, with the error type and location in ThinkRail's own code, never prompts or file paths. You can opt out of the additional sharing with `thinkrail --no-analytics` or `THINKRAIL_NO_ANALYTICS=1`. It is mild as telemetry goes, but it is on by default, so decide deliberately.

**Spec-driven development is a discipline, not a switch.** If you and the agent do not maintain the `SPEC.md` files, the graph becomes archaeology. The tooling helps; it does not replace the habit.

**You still have to review.** The whole point is to make review cheap, not optional. An agent with a shell, a worktree and merge rights will eventually produce something plausible and wrong; the receipt and the per-hunk review exist precisely because trust must be verified.

## Verdict

ThinkRail is the most coherent answer I have seen to a question the industry is still fumbling: *what does an IDE look like when the code is written by an agent?* Not a chat sidebar glued to the old editor, not a browser sandbox that hides the filesystem, but a workspace manager where the unit of work is an isolated branch, the unit of review is a turn, and the unit of memory is a spec graph.

It is early, it is pi-only, and its Linux packaging will annoy some people. But the ideas are right, the implementation is refreshingly small, and the price — free, open source, no account, bring your own model — makes it a very cheap experiment. If you already live in pi, install it today. If you do not, it is the best excuse I know to try pi.
