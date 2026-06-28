---
title: "How GenAI Systems Actually Work"
description: "The architecture that matters for security review."
pubDatetime: 2026-03-25T20:40:00Z
draft: false
tags:
  - genai
  - ai-security
  - architecture
  - rag
  - agents
---

> **tl;dr:** The model is only one part of a GenAI system. What matters for security is what reaches the model, what the model can influence, and what controls still exist when the model is wrong.

Most AI security reviews begin with the model.

That makes sense. The model is the unfamiliar part. It can hallucinate, follow instructions in surprising ways, and behave just inconsistently enough to make any security reviewer suspicious.

But in most real systems, the model is only one component.

It sits inside a larger application that decides what reaches it, what context gets added, what tools it can use, and what happens after it produces output.

That is the more useful place to start.

Viewed that way, the security questions become much clearer. The question is no longer "is the model safe?" in the abstract. The question becomes: how is the system put together, where are the trust boundaries, and what can model output actually change?

## Start with the system, not the model

Imagine a company rolling out an internal AI assistant for employees. It answers questions about internal processes, retrieves documents from a knowledge base, remembers a little prior context, and can create tickets or trigger workflows when needed.

That sounds straightforward enough. Many people would describe it as a chatbot connected to internal knowledge.

From a security perspective, that summary leaves out the part that matters.

The useful questions are about the architecture around the model. What data gets pulled into context? Which inputs are treated as trustworthy, and which are not? What can the assistant influence downstream? Where is authorization enforced? If the model is wrong in a completely ordinary way, what stops the rest of the system from following it?

That shift in perspective makes GenAI security much easier to reason about.

## The architecture lens

A very common mental shortcut is to picture an AI system like this:

**user input → model output**

That picture is simple. It is also too simple for most real applications.

Real GenAI systems usually include an application layer.

That layer assembles context, hidden system instructions, retrieval results, memory, tools, filtering logic, and connections to downstream systems that may receive or act on model output.

Once those pieces are visible, the review target changes. You are no longer looking at a model in isolation. You are looking at a system that combines inputs with different trust levels and allows probabilistic model output to influence real actions.

The model produces language.

The architecture decides whether that language stays a response or influences what the system does next.

In practice, those surrounding systems tend to follow a few common architectural patterns.

## Three system patterns that matter

Different kinds of GenAI systems often get grouped together as if they were basically the same thing. They are not.

![Basic LLM](@/assets/images/2026/how-ai-systems-actually-work/basic-llm-nb.png)

A basic LLM application is still primarily text in, text out. The application assembles context, sends it to a model, and returns the result. If the model cannot influence anything beyond its own reply, the security consequences are more contained. That does not make the system safe, but it does keep the risk closer to content generation than to systems control.

![RAG System](@/assets/images/2026/how-ai-systems-actually-work/rag-system-nb.png)

A retrieval-augmented generation (RAG) system adds retrieval. The application [retrieves documents, snippets, or records from some external corpus](https://www.pinecone.io/learn/retrieval-augmented-generation/) and includes them in the model input. That changes what the model can **see**. Once retrieval exists, the important questions shift toward provenance, corpus quality, retrieval scope, metadata, and whether retrieved material is being treated as more trustworthy than it deserves.

![LLM Agent](@/assets/images/2026/how-ai-systems-actually-work/llm-agent-nb.png)

An agent goes further still. For the purpose of this article, it is useful to think of an [LLM agent as a system that runs tools in a loop to achieve a goal](https://simonwillison.net/2025/Sep/18/agents/). The model selects tools, receives results, and continues until it completes or fails. That changes what the model can **do**. A tool-using system may be able to query internal systems, create tickets, send messages, update records, call APIs, or trigger workflows. That is not just a chatbot with extra convenience features. It is a different class of system with a different authority model.

> Retrieval changes what the model can see. Agents change what the model can do.

## Context paths and action paths

One of the most useful ways to think about these systems is to separate two paths: the path that shapes the model’s context, and the path that turns model output into system effects.

![Security-Relevant Anatomy of a GenAI System](@/assets/images/2026/how-ai-systems-actually-work/security-relevant-anatomy.png)

The **context path** determines what reaches the model. That includes user input, uploaded files, retrieved documents, conversation history, memory, hidden system instructions, and in some cases tool outputs that get fed back into the loop.

The **action path** determines what the model can influence once it has produced output. That may include tool calls, parameter selection, workflow triggering, downstream system actions, or changes to persistent state.

These paths are related, but they are not the same.

That distinction makes security reviews much more effective. If the context path is weak, the model may reason from untrusted or misleading material. If the action path is weak, even an ordinary model mistake can start to affect real decisions and actions.

That is where content risk can turn into systems risk.

## The questions that clarify the system

A few questions can make the architecture visible very quickly:

- Where does untrusted input enter the system?
- What context is treated as trusted, and why?
- What can the model influence directly? What can it influence indirectly through another service, workflow, or human decision?
- Where is authorization actually enforced?
- What still prevents damage when the model is wrong in a completely ordinary way?

These questions matter because they keep the focus on the system instead of on the marketing category of “AI”.

If those questions cannot be answered clearly, the architecture is probably not understood clearly either. And if the architecture is poorly understood, security claims about the system are usually weaker than they sound.

## Why this helps security review

Once you adopt the architecture lens, several things become easier to see.

Prompts stop looking like hard security boundaries. Retrieval starts to look like a new data path with trust and scoping consequences. Tool use starts to look like delegated influence over systems and actions.

That makes it easier to choose controls that actually match the problem.

It also becomes clearer why prompt wording alone cannot carry the full burden of policy, why internal data is not automatically trustworthy, and why logging is not the same thing as containment.

The architecture does not remove the risk, but it does show you where the risk really lives.

## What to do in practice

Before threat-modeling an AI feature, ask the team to draw the system on one page.

Not a vague box labeled “AI”. An actual architecture view.

At minimum, the diagram should show:

- what enters the model
- what additional context can be added
- whether retrieval exists
- whether memory persists
- whether tools exist
- which downstream systems can be influenced
- where deterministic controls live outside the model

Then push the conversation one step further:

- Which inputs are untrusted?
- Which are semi-trusted?
- Which are treated as policy?
- What can the model only suggest?
- What can it actually trigger?

If the system cannot be drawn clearly, it is probably not understood clearly enough yet. That is not a failure. It is a useful signal.

Once the system is visible, the later security work becomes much easier. Trust boundaries are easier to identify. Control placement becomes more obvious. Retrieval can be reviewed as a data-path problem. Tool use can be reviewed by asking what the model can trigger and what those triggers are allowed to reach.

## Closing

The most useful thing to understand about GenAI security is that the model is rarely the whole story.

The real story is the architecture around it:

- what reaches the model
- what the system treats as trusted
- what the model can influence
- where hard controls live
- what happens next when the model is wrong

> The model generates text. The architecture decides whether that text matters.
