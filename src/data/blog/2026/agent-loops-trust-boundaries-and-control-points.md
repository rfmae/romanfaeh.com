---
title: "How Agent Loops Change Security: Trust Boundaries and Control Points"
description: "How agent loops change AI security, introduce new trust boundaries, and require controls beyond the model itself."
pubDatetime: 2026-06-26T22:30:00Z
draft: false
tags:
  - ai-security
  - agentic-ai
  - owasp
  - mitre-atlas
  - threat-modeling
---

> **tl;dr:** Agent loops fundamentally change the security model. Because the system can choose actions, observe results, and continue across multiple steps, security is no longer just about model outputs—it is about controlling the entire execution loop.

In previous posts, we looked at the basic architecture of generative AI systems, what reaches the model, and how retrieval shapes context. Those systems mainly generate responses. Agentic systems go a step further: they can plan, act, observe results, and continue across multiple steps. That changes the security model. Let's look at why.

## What an agentic system can do

What makes an agentic system different is not a single capability but the combination of several.

- **reason about a goal or task**
- **plan the next step**
- **use tools or external workflows**
- **observe the results**
- **maintain state across steps**
- **repeat until a stopping condition is reached**

Taken together, these capabilities allow the system to execute a sequence of actions instead of producing a single response. That is the fundamental security change.

> In an agentic system, model output can affect what gets looked up, changed, sent, saved, and what the system does next.

Those capabilities do not exist on their own. They have to be implemented somewhere in the surrounding system. That implementation is where many of the security questions begin.

![Agent Core Capabilities](@/assets/images/2026/agent-loops-trust-boundaries-and-control-points/agent-core-capabilities.png)

To understand where those capabilities come from, we first need to look at the surrounding architecture. That is also where security controls belong.

## Single-agent architecture

Even the simplest agentic system consists of more than a model. Several surrounding components work together to execute the agent loop.

You usually have one agent loop with:

- a **model**, which uses the current context to determine the next step in the loop
- an **orchestrator or agent runtime**, that manages the loop, executes actions, passes results back, and enforces limits
- **permissions and policy controls**, responsible for defining what the agent is allowed to call and under what constraints
- **tools**, such as search, browser actions, database queries, APIs, messaging, code execution, or workflow triggers
- **tool results**, that are fed back into the loop for the next decision the model can use
- **state or memory**, which may carry forward prior steps, summaries, scratchpad notes, or saved context
- **stopping conditions**, such as step limits, timeouts, success checks, failure conditions, or approval gates

The model is only one component of an agentic system. The runtime decides which tools are available, how results are returned, when the loop stops, and which actions require additional checks. Because those decisions determine what the system is allowed to do, they are also the right place to enforce security controls such as tool restrictions, parameter validation, approval gates, and stopping conditions.

Even in a single-agent system, the security challenge is no longer limited to model output. The system has to control how that output influences actions, tool calls, and persisted state across multiple steps.

![Single-Agent Architecture](@/assets/images/2026/agent-loops-trust-boundaries-and-control-points/single-agent-architecture.png)
_The single-agent architecture diagram is taken and adapted from the OWASP Agentic AI document._

Multi-agent systems build on the same pattern, but introduce additional trust boundaries between agents.

## Multi-agent architecture

A multi-agent architecture extends the same execution loop across multiple cooperating agents. That creates new trust boundaries.

Instead of one agent handling the whole task, the system splits work across multiple agents with different roles. One agent may plan the task, another retrieve information, a third execute tools, and a fourth review or summarize the results.

That structure improves specialization and separation of duties. At the same time, it expands the attack surface because every interaction between agents becomes another point where trust has to be established.

Every interaction between agents creates another point where trust has to be established. These trust boundaries become an important part of the system's security model.

As a result, the system depends on communication between agent loops.

Instructions, summaries, tool results, and intermediate decisions may pass from one agent to another. Some systems also introduce shared memory, delegated subtasks, role-based permissions, or chains of review between agents. Once one agent is compromised, its outputs may become trusted inputs for the next agent. A weak handoff can become a trusted input for the next agent. A compromised summary can steer later actions without anyone noticing where the original problem started.

Multi-agent security is not simply single-agent security repeated several times. The architecture introduces new trust boundaries between agents. Communication paths, handoffs, and coordination logic therefore become part of the security model.

Multi-agent systems do not just add more components. They create more opportunities for the same flaw to spread.

![Multi-Agent Architecture](@/assets/images/2026/agent-loops-trust-boundaries-and-control-points/multi-agent-architecture.png)
_The multi-agent architecture diagram is taken and adapted from the OWASP Agentic AI document._

To understand where those risks arise, it helps to look at the trust boundaries within an agentic system.

## Trust boundaries in an agentic system

Understanding trust boundaries becomes much easier when looking at the system as a series of five zones. Christian Schneider introduced this model in his post on [threat modeling agentic AI](https://christian-schneider.net/blog/threat-modeling-agentic-ai/) as a practical way to trace how attacks move through an agentic system.

Instead of treating threats as isolated issues in separate components, the zones show how an attack progresses through the system. A malicious input can enter through one channel, redirect planning in the next step, trigger a tool call after that, persist in memory, and eventually spread through agent-to-agent coordination.

![Agentic AI Threat Zones](@/assets/images/2026/agent-loops-trust-boundaries-and-control-points/agentic-ai-threat-zones.png)

### Zone 1: Input surfaces

Data enters the agent context through the input surface.

That includes direct user prompts, uploaded files, retrieved documents, API responses, browser content, email content, and tool output returned from external systems.

Entering the loop does not make something trustworthy. Retrieved text, webpage content, or tool output may still be incomplete, stale, adversarial, or misleading.

### Zone 2: Planning and reasoning

The planning layer is where the model interprets the goal, decides what matters, and proposes the next step.

The model should not be treated as the final authority. Attacker-controlled input can shift priorities, redirect the task, or change what the system tries to do next.

> The problem is often not one faulty output. It is a misdirected plan.

### Zone 3: Tool execution

Tool execution turns model output into action.

Tools can query data, call APIs, modify files, send messages, run code, open browser sessions, or trigger workflows. Choosing the right tool is only part of the problem. Parameters matter just as much. A model can choose the right tool with the wrong file path, tenant, record, recipient, or query.

The runtime matters here. The model may generate an action, but the orchestration layer should still decide what is allowed to run, under what conditions, and with what constraints.

### Zone 4: Memory and state

Some agent systems persist conversation history, intermediate notes, summaries, extracted facts, working memory, or longer-term state.

This state can improve continuity. It can also preserve flawed assumptions and feed them back into later steps with more weight than warranted. Once memory captures a flawed inference, it may reinforce that mistake in later steps.

### Zone 5: Inter-agent communication

In multi-agent systems, agents may hand work to other agents, exchange messages, or pass intermediate results across roles.

This creates another trust boundary. A compromised instruction, weak summary, or misleading intermediate result can move from one agent to another through normal coordination. The system may look modular while still spreading the same compromised reasoning across the network.

The five-zone view helps explain why attacks rarely stay in one place. An input enters through one zone, changes reasoning in another, triggers action in a third, persists in a fourth, and may spread through a fifth.

A real-world incident illustrates how an attack can move through multiple zones in practice.

### EchoLeak as an attack path across the zones

EchoLeak is a good real-world example of how an attack can move across multiple trust zones. The issue, disclosed by Aim Labs (the research team at Aim Security) and tracked as CVE-2025-32711, affected Microsoft 365 Copilot. The researchers showed how attacker-controlled content could enter through email (**Zone 1**) and affect what the system did next when the user later asked Copilot an unrelated question (**Zone 2**). The exfiltration mechanic in **Zone 3** was specific: Copilot would render a markdown image whose URL contained data extracted from the user’s context, and the outbound request was smuggled through allowlisted Microsoft domains such as Teams and SharePoint to bypass the Content Security Policy. Importantly, the published attack remained a single-session exfiltration. **Zone 4** therefore represents a hypothetical extension of the same attack path rather than a documented part of EchoLeak. A comparable pattern could also extend into **Zone 5** in a multi-agent system, where compromised intermediate results may spread through normal handoffs between agents. Microsoft patched the issue server-side and reported no in-the-wild exploitation.

EchoLeak illustrates how a single attack can move through multiple trust zones. [MITRE ATLAS](https://atlas.mitre.org/) provides a broader framework for describing and analyzing those attack paths across AI systems.

MITRE ATLAS complements this perspective by cataloging adversary tactics and techniques against AI systems in an ATT&CK-style framework. Instead of viewing incidents as isolated failures, it helps analysts trace how attacks progress through a chain of actions.

Understanding the attack path is only the first step. The next question is where controls should be placed to interrupt that path.

## Where to put controls in an agentic system

[OWASP Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) provides a practical reference point.

One way to think about those controls is to place them around the loop and map them to the zones where they matter.

### Controls for Zone 1: Input surfaces

Input controls preserve the boundary between external content and trusted instructions.

Useful controls include:

- **schema, file-type, size, and format validation** for uploaded files, API responses, and other structured inputs
- **content scanning and risk scoring** for retrieved text, browser content, email, and external payloads
- **explicit trust labeling** so externally supplied content remains distinguishable from trusted application instructions
- **separation between instructions and data** so untrusted content does not silently gain system-level authority
- **source attribution and provenance tracking** so the runtime knows where content came from and how it entered the context

These controls do not make untrusted text safe. A valid document can still contain malicious instructions, and normalized input can still manipulate the model. The goal is to preserve the input’s trust level and prevent external content from entering the loop as if it were authoritative.

### Controls for Zone 2: Planning and reasoning

At the planning layer, the system has to catch goal drift before it turns into action.

At this stage, the system should enforce controls such as:

- **goal-consistency validation** so proposed steps remain aligned with the user’s objective and the system’s intended purpose
- **task and role scoping** so the model cannot expand its authority beyond the current assignment
- **behavioral constraints** preventing the agent from modifying its own goals or reinforcing an unintended objective
- **step limits, timeouts, and budget limits** so planning cannot continue indefinitely
- **decision logging and anomaly detection** for unusual goal changes, repeated reversals, or plans that fall outside expected behavior

Planning decisions should always remain subject to validation. The model can propose a plan, but it should not be the final authority on whether that plan is acceptable. The surrounding system should detect goal drift and stop a manipulated plan before it becomes an executed action.

### Controls for Zone 3: Tool execution

Tool execution is the first point where model output becomes enforceable system behavior.

Typical safeguards include:

- **tool allowlists** so the agent can invoke only explicitly permitted capabilities
- **function-level authorization** so access is checked for each operation rather than only at the tool level
- **parameter validation** so file paths, recipients, queries, tenant identifiers, and other arguments are checked before execution
- **scoped and just-in-time credentials** so tools receive only the permissions they need and only for as long as required
- **read/write separation** so actions with side effects require stronger controls than lookups
- **risk-based approval gates** for financial, administrative, destructive, or otherwise high-impact actions
- **rate limiting and execution quotas** to contain repeated or excessive tool use
- **sandboxing and execution isolation** for risky capabilities such as code execution and browser automation
- **complete tool-call logging** so actions and their parameters can be audited and reconstructed

Choosing a tool is only the beginning. The runtime should still decide whether that action is authorized, valid, and safe to execute.

### Controls for Zone 4: Memory and state

Memory controls decide what information is allowed to persist and influence future runs.

Important controls include:

- **session isolation** so state from one user, task, or tenant does not leak into another
- **context-aware memory access** so agents can retrieve only state relevant to their current task
- **validation before persistence** so generated summaries, extracted facts, and intermediate conclusions are checked before being stored
- **source attribution for memory updates** so persisted knowledge retains its origin and trust level
- **bounded retention and expiration** so stale or unnecessary state does not influence future decisions indefinitely
- **versioned snapshots and rollback** so corrupted state can be identified and restored
- **logging and anomaly detection** for unusual memory writes, repeated modification, or unexpected knowledge changes

Persisted state deserves the same scrutiny as external input. Information should not become trusted simply because the system stored it. Every write creates a possible path for today’s manipulated state to influence tomorrow’s decisions.

### Controls for Zone 5: Inter-agent communication

Inter-agent controls prevent one compromised handoff from becoming a network-wide failure.

Effective controls include:

- **mutual agent authentication** so each participant can verify the identity of the agent it is communicating with
- **message integrity and encryption** so handoffs cannot be silently altered or read in transit
- **role-restricted communication and delegation** so agents interact only through explicitly permitted paths
- **structured, provenance-carrying handoffs** so messages identify their source, purpose, evidence, and trust level
- **validation of summaries and delegated outputs** before one agent’s result becomes another agent’s instruction
- **independent or consensus validation** before high-risk decisions or system modifications are accepted
- **agent-specific rate limits and execution quotas** to prevent flooding and cascading resource exhaustion
- **cross-agent logging and anomaly detection** for unexpected role changes, abnormal task delegation, conflicting decisions, or unusual communication patterns

Modularity does not automatically create isolation. If agents trust each other’s messages without verification, one compromised component can spread manipulated instructions through normal coordination. The system should authenticate every participant, constrain every handoff, and preserve enough traceability to identify where the failure began.

Across all five zones, the principle is the same: the model should not be the final authority over trust, planning, execution, persistence, or delegation. Those decisions belong in the surrounding deterministic system.

## Conclusion

If you want to analyze an agentic system, the five-zone framework is a good place to start. It helps you see how attacks move through the system instead of treating each component in isolation.

If you want to understand the attack path itself, MITRE ATLAS helps trace how attacks progress through AI systems. Its catalog of adversary tactics and techniques supports analyzing attacks as a chain rather than as isolated failures.

To secure that system, put the controls in the surrounding deterministic layer: the runtime, tool boundaries, validation logic, approval gates, and stopping conditions. Do not rely on the model itself to be the control layer.

[OWASP’s Agentic AI Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) provides a practical reference because it connects agent-specific risks to concrete safeguards. That makes it easier to choose controls that match the actual attack path.

> In agent systems, the main problem is not that the model can act once. It is that the system may let it keep going.
