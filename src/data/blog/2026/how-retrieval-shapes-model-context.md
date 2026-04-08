---
title: "How Retrieval Shapes Model Context"
description: "Embeddings, chunking, vector search, and the mechanics behind RAG."
pubDatetime: 2026-04-08T16:54:00Z
draft: false
tags:
  - llm
  - security
  - rag
  - retrieval
---

> **tl;dr:** Retrieval changes what reaches the model. Documents are split into chunks, turned into embeddings, retrieved at runtime, and inserted into the context window. That makes retrieval a context system, not just a search feature.

The next useful layer is retrieval.

[RAG (Retrieval-Augmented Generation)](https://www.pinecone.io/learn/retrieval-augmented-generation/) becomes much easier to reason about once you stop thinking of it as the model “knowing” external documents. The model does not change when you add files to a corpus. What changes is the text the application selects and places in front of it.

That is the central idea for this post: **retrieval shapes what the model can see.** Once that is clear, the mechanics of RAG look much less mysterious.

## Retrieval is a context system

Retrieval gives the application a way to bring external text into the model context at runtime.

The application searches a corpus, selects relevant text, and appends it to the model input. Retrieval does not update the model’s weights. It changes the context the model receives for this request.

The high-level flow is simple:

1. **Ingestion:** documents are prepared for retrieval
2. **Ingestion:** the system stores searchable representations of them
3. **Retrieval:** a user query arrives
4. **Retrieval:** relevant text is retrieved
5. **Generation:** that text is added to the model context
6. **Generation:** the model answers with that context in view

![RAG retrieval pipeline](@/assets/images/2026/how-retrieval-shapes-model-context/rag-retrieval-pipeline.png)

**Retrieval is not model memory in the human sense. It is context selection.**

## Why documents are split into chunks

Most documents are too large to retrieve as one unit, so retrieval systems usually split them into smaller pieces called **chunks**.

A chunk is a smaller section of a larger document that can be stored, compared, and retrieved on its own. It becomes the basic retrieval unit.

This matters because chunk quality affects retrieval quality. If chunks are too large, retrieval brings in extra noise. If they are too small, the system may retrieve fragments without enough context.

## What embeddings do

Once text has been chunked, the system needs a way to compare one chunk to another and compare a user query to those chunks.

Keyword matching only gets you so far. A user may ask about “getting locked out of an account,” while the document says “account recovery” or “credential reset.” The words differ, but the meaning may still be close.

That is where **embeddings** help.

An embedding is a numerical representation of text that helps the system compare meaning, not just exact wording. Similar pieces of text tend to end up closer together than unrelated ones.

Under the hood, this is usually described as a high-dimensional vector space. The practical point is simpler: embeddings make semantic similarity searchable, so the system can retrieve related text even when the query does not match the source word for word.

> Embeddings help the system compare texts. They do not certify truth, guarantee relevance, or decide what should be trusted.

## What vector search does

Once chunks have embeddings, the system can search for nearby vectors.

A query is embedded the same way. The system then compares that query representation to the stored chunk representations and returns the nearest matches.

At scale, this usually relies on [approximate nearest-neighbor techniques](https://www.pinecone.io/learn/series/faiss/vector-indexes/) rather than exact search. That is mostly a performance tradeoff: a little less precision in exchange for much faster retrieval.

**Vector search is best understood as a ranking system.**

It returns likely neighbors under the representation and search method the system is using. That is useful, but it is not the same as verification.

A retrieved chunk can be similar enough to rank highly and still be stale, incomplete, misleading, or risky in context.

## Why retrieval deserves security review

Once an application adds retrieval, it creates a new path into the model context.

Now the answer depends not only on model behavior, but also on:

- what content was indexed
- how it was chunked
- what metadata was attached or lost
- how the query was formed
- how retrieval was filtered and ranked
- what text was finally inserted into context

**Retrieval is not only a relevance feature. It is a system component that fundamentally changes what reaches the model.**

That also makes retrieval quality a security concern.

If the corpus contains poisoned content, retrieval can surface it directly into context. If it contains stale instructions, retrieval can surface those too. If tenant boundaries are weak, retrieval can expose the wrong tenant’s data. If metadata filters are weak, retrieval can quietly broaden exposure.

The model does not need a dramatic jailbreak-style failure to produce a bad result. It may simply receive the wrong text, treat it as useful context, and generate an answer shaped by that mistake.

This is why RAG security starts before runtime. The retrieval path inherits whatever problems were introduced during ingestion, chunking, metadata assignment, access-control design, and corpus maintenance.

## What to review in a retrieval pipeline

If you are reviewing a retrieval system, follow the path end to end and ask:

- What content gets embedded, and is anything included that should not be?
- How is content chunked, and what meaning is lost or distorted when it is split?
- What metadata is attached, preserved, or dropped during ingestion?
- What filters constrain retrieval at query time?
- What tenant or corpus boundaries exist, and how are they enforced?
- What similarity threshold or ranking logic decides what gets returned?
- How is retrieved text inserted into the final model context?

Those questions tell you more than any claim that the system is “grounded in company data.”

## Closing

RAG is useful because it lets the application bring external text into context at runtime. That is also why the retrieval path deserves careful review.

> Vector search returns likely neighbors, not verified facts. Retrieval shapes context, and context shapes output.
