+++
title = "T3 Code: one control surface for all your coding agents"
description = "Not a harness, not another subscription: T3 Code drives the Claude Code, Codex and Cursor agents you already pay for, from desktop, browser or phone."
slug = "t3-code-agent-control-surface"
date = 2026-11-11T09:00:00+01:00
updated = 2026-11-11T09:00:00+01:00
draft = false
aliases = ["/blog/2026/11/11/t3-code-agent-control-surface/"]

[extra]
lead = "You already have the agents. What you are missing is one place to drive them all, from your desk or your phone."
authors = ["UpCreid"]
+++

Claude Code in one terminal, Codex in another, Cursor somewhere else: the agents are good, the way we juggle them is not. **T3 Code** (MIT, ~56k GitHub stars) attacks exactly that gap, and it is careful about what it claims to be.

## Not a harness

The README calls it an *agent harness control surface*. The nuance is real: T3 Code gives no tools to any model and runs nothing itself. Claude Code, Codex, Cursor, Grok Build, OpenCode, Antigravity and others already do that. T3 Code spawns those CLIs, wraps them in a proper interface, and lets you reach them remotely. Your subscription stays yours; T3 is free, and there is nothing to buy.

## What you get

- **Every client**: Electron desktop app, web app (app.t3.codes), iOS and Android.
- **Remote first**: agents run on the machine hosting the server. `t3 up` exposes it through T3 Connect, LAN pairing or Tailscale. Close the laptop, the VPS or desktop keeps working, and the phone is just a remote.
- **Permission modes**, per thread: Supervised, Auto-accept edits, Auto, Full access. Subagent requests land in the parent conversation.
- **Worktrees** to isolate each task, plus a cleanup screen, because they eat disk fast.

## Install

```bash
curl -fsSL https://t3.codes/install.sh | sh
t3
```

Also available via Homebrew (`t3-code` cask), the AUR (`t3code-bin`), winget, scoop and nixpkgs.

## Before you commit

- It is **early**: expect bugs, and big contributions are not accepted yet.
- **No local models**, by deliberate choice.
- Claude runs through Anthropic's Agent SDK: the 5-hour limit drains faster than with Claude Code directly. Weekly limits are unaffected, and the bug is on Anthropic's side.
- Code goes to your provider, not to T3 servers. Telemetry is product usage only and can be turned off.
- T3 Connect is free for three machines; more requires a paid T3 Chat plan, unless you self-host or use Tailscale.

## Verdict

T3 Code does not make your agents smarter. It makes them reachable, comparable and properly supervised, which is most of what daily agent work actually needs. If you juggle two harnesses or want to prompt from the couch, it is the best free option I have tried. If you live happily in a single CLI, your terminal is still fine.
