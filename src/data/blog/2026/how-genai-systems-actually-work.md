---
author: Roman Faeh
pubDatetime: 2026-03-25T23:15:00Z
title: "How GenAI Systems Actually Work: The Security-Relevant Architecture"
featured: true
draft: false
tags:
  - llm
  - security
  - agents
  - ai systems
description:
  Why security reviews improve when they treat the model as part of a larger system.
---

**Why security reviews improve when they treat the model as part of a larger system**

Most AI security reviews begin with the model.

That is understandable. The model is the strange part, the probabilistic part, the part everyone points at and calls “AI.” It can hallucinate, follow instructions in surprising ways, and behave just inconsistently enough to make any security practitioner suspicious on sight.

But in most real systems, the model is not the whole story. It sits inside a larger architecture that determines what reaches it, what context gets added, what it can influence, and what still prevents damage when it is wrong.

That is the more useful place to start.

Once you see GenAI systems this way, many security questions become easier to reason about. The problem is no longer “is the model safe?” in the abstract. The problem becomes much more concrete: how is the system put together, where are the trust boundaries, and what can model output actually change?

## A concrete example

Imagine a company rolling out an internal AI assistant for employees. It answers questions about internal processes, retrieves documents from the company knowledge base, remembers a little prior context, and can create tickets or trigger workflows when needed.

That sounds straightforward enough. Many people would summarize it as a chatbot connected to internal knowledge.

From a security perspective, though, that summary leaves out the parts that matter most.

The useful questions are not whether the model sounds intelligent or whether the prompt is written well. The useful questions are about the architecture around it. What data is pulled into the model context? Which inputs are treated as trustworthy, and which are not? What can the assistant influence downstream? Where is authorization enforced? If the model is wrong in a completely ordinary way, what keeps the rest of the system from following it off a cliff?

That is the shift this post is trying to make. GenAI security starts making more sense once you stop treating the model as the entire application.

## The architecture lens

A surprisingly common mental shortcut is to picture an AI system as:

**user input → model output**

That picture is simple, but it is usually too simple to be useful.

Real GenAI applications nearly always involve more than a prompt and a response. There is usually an application layer assembling context, hidden system instructions shaping behavior, retrieval pulling in external material, memory or state being carried forward, tools being invoked, policy or filtering logic being applied, and downstream systems that can receive or act on what the model produces.

Once those pieces are visible, the review target changes. You are no longer looking at a model in isolation. You are looking at a system that combines inputs with different trust levels, translates language into decisions, and sometimes connects probabilistic output to real actions.

That broader view is what makes later security analysis much clearer.

It also leads to a better mental model. The model does produce language, and model behavior matters. But the architecture determines whether that language remains a harmless answer, becomes trusted context for the next step, or turns into something that can influence workflows, systems, and state.

That is why the surrounding system matters so much. Models become security-relevant not only because they generate text, but because they are connected to data, tools, and control points in ways that shape what happens next.

## Three system patterns that matter

One reason GenAI discussions get muddy is that different system patterns are often grouped together as if they were basically the same thing. They are not.

![LLM vs. RAG vs. Agent](@/assets/images/diagram-llm-vs-rag-vs-agent.png)

<figure>
  <img src="/assets/images/diagram-llm-vs-rag-vs-agent.png" />
  <figcaption>
    <strong>Diagram 2 — Basic LLM App vs RAG System vs Agent.</strong>
    These patterns are not interchangeable. A basic LLM app generates output, RAG adds external context, and an agent runs tools in a loop to achieve a goal.
  </figcaption>
</figure>

A basic LLM application is still mostly text in, text out. The application assembles context, sends it to a model, and returns the result. If the model cannot influence anything beyond its own reply, the security consequences are comparatively contained. That does not make the system safe, but it does keep the risk closer to content generation than to systems control.

A RAG system adds retrieval. Now the model is no longer working only from prompt context. The application [retrieves documents, snippets, or records from some external corpus](https://www.pinecone.io/learn/retrieval-augmented-generation/) and includes them in the model input. That changes what the model can **see**. At that point, the important questions shift toward provenance, corpus quality, indexing, retrieval scope, metadata, and whether retrieved material is being treated as more trustworthy than it deserves. Retrieval improves context; it does not automatically create trust.

An agent goes further still. A practical definition is that [an LLM agent runs tools in a loop to achieve a goal](https://simonwillison.net/2025/Sep/18/agents/). The model selects tools, receives results, and continues until it completes or fails. That changes what the model can **do**. And that is where the threat model changes materially. A tool-using system may be able to query internal systems, create tickets, send messages, update records, call APIs, or trigger workflows. That is not simply a chatbot with extra convenience features. It is a different class of system with a different authority model.

This distinction is worth keeping in mind because it clarifies a lot of later security work. Retrieval changes what the model can see. Agents change what the model can do.

## Context paths and action paths

One of the most useful ways to think about these systems is to separate two paths: the path that shapes the model’s context, and the path that turns model output into system effects.

<figure class="my-8">
  <img src="/diagrams/diagram-security-relevant-anatomy.png" alt="Security-Relevant Anatomy of a GenAI System" />
  <figcaption class="mt-3 text-xs leading-5 text-zinc-500">
    <strong>Diagram 1 — Security-Relevant Anatomy of a GenAI System.</strong>
    A GenAI system has two security-relevant paths: the context path, which shapes what the model sees, and the action path, which determines what model output can influence.
  </figcaption>
</figure>

The **context path** determines what reaches the model. That includes user input, uploaded files, retrieved documents, conversation history, memory, hidden system instructions, and in some cases tool outputs that get fed back into the loop. This path matters because the model reasons over whatever reaches it, whether that information deserves trust or not.

The **action path** determines what the model can influence once it has produced output. That may include tool calls, parameter selection, workflow triggering, downstream system actions, or changes to persistent state. Once that path exists, the system is no longer just a language interface. It becomes an authority-shaping interface.

These paths are related, but they are not the same. And that distinction makes security reviews much more effective. If the context path is weak, the model may reason from untrusted or misleading material. If the action path is weak, even an ordinary model mistake can become a meaningful system effect. That is the point where content risk turns into systems risk.

## The review questions that matter

When a team is building or reviewing a GenAI system, a few questions can clarify the architecture very quickly.

Where does untrusted input enter the system? What context is treated as trusted, and why? What can the model influence directly, and what can it influence indirectly through another service, workflow, or human decision? Where is authorization actually enforced? And what still prevents damage when the model is wrong in a completely ordinary way?

These are useful questions because they anchor the conversation in the system rather than in the marketing category of “AI.” If the answers are fuzzy, the architecture understanding is probably fuzzy too. And if the architecture understanding is fuzzy, the security claims around the system are usually weaker than they sound.

## Why this changes security reviews

Once you adopt the architecture lens, several things become easier to see.

Prompts stop looking like hard security boundaries. They are still important, but they are instructions, not deterministic enforcement points. Retrieval starts to look less like a generic “AI capability” and more like a new data path with trust and scoping consequences. Tool use stops looking like a product feature and starts looking like delegated influence over systems and actions.

That shift also makes control selection more realistic. It becomes easier to see why prompt wording alone cannot carry the full burden of policy, why internal data is not automatically trustworthy, and why logging is not the same thing as containment. The architecture does not solve every problem, but it makes the actual problem visible.

For security practitioners, that is the practical value of this model. It gives you a cleaner way to apply instincts you already have — around trust boundaries, control placement, data flow, authorization, and blast radius — to a class of systems that often feels unfamiliar at first.

## What to do in practice

Before threat-modeling any AI feature, ask the team to draw the system on one page.

Not a vague box labeled “AI.” An actual architecture view.

At minimum, the diagram should show what enters the model, what extra context can be added, whether retrieval exists, whether memory persists, whether tools exist, which downstream systems can be influenced, and where deterministic controls live outside the model.

Then push the conversation one step further. Which inputs are untrusted? Which are semi-trusted? Which are treated as policy? What can the model only suggest, and what can it actually trigger?

A team that cannot draw this clearly probably does not understand its system clearly enough yet. That is not a failure. It is a useful signal. The right move is to slow the review down, map the architecture honestly, and only then start talking about threats and controls.

Once the system is visible, the later security work becomes much easier. Trust boundaries are easier to identify. Control placement becomes more obvious. Retrieval can be reviewed as a data-path problem. Tool use can be reviewed as an authority problem. “AI risk” becomes something much more concrete and much more familiar.

## Closing takeaway

The most useful thing to understand about GenAI security is that the model is rarely the whole story.

The real story is the architecture around it:
- what reaches the model
- what the model can influence
- what gets treated as trusted
- where hard controls live
- and what happens next when the model is wrong

The model generates text.

**The architecture decides whether that text matters.**
