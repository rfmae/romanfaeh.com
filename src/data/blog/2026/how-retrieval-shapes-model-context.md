---
title: "How Retrieval Shapes Model Context"
description: "Embeddings, vector search, and the mechanics behind RAG."
pubDatetime: 2026-04-07T20:57:00Z
draft: false
tags:
  - llm
  - security
  - rag
  - retrieval
---

> **tl;dr:** Retrieval changes what reaches the model. Documents are chunked, embedded, retrieved, and inserted into context at runtime. That makes retrieval a context system, not just a search feature.

After the first two foundation posts, the next useful layer is retrieval.

[RAG (Retrieval-Augmented Generation)](https://www.pinecone.io/learn/retrieval-augmented-generation/) becomes much easier to reason about once you see it as a retrieval system feeding context into the model. The model does not change each time you add a document to a corpus. What changes is the text the application selects and places in front of it.

That is the central idea for this post. **Retrieval shapes what the model can see.** Once that is clear, embeddings, vector search, and RAG architecture stop feeling mysterious and start looking like normal systems you can inspect.

## Retrieval is a context system

Retrieval gives the application a way to bring external text into the model context at runtime.

Instead of relying only on system instructions, user input, and prior turns, the application can search a corpus, select relevant chunks, and append them to the model input. The model then answers with that additional text in view.

That is much easier to reason about than the vague idea that the model somehow “knows” the documents.

The practical flow is straightforward. Documents are split into smaller pieces before being embedded. Those embeddings are stored in a vector database so they can be searched later. At query time, the system compares a query representation against the stored corpus, retrieves relevant chunks, and inserts the retrieved text into the model context.

![RAG retrieval pipeline](@/assets/images/2026/how-retrieval-shapes-model-context/rag-retrieval-pipeline.png)

**Retrieval is not model memory in the human sense. It is context selection.**

## What embeddings make possible

[Embeddings](https://platform.openai.com/docs/guides/embeddings) give the system a way to represent text so similarity comparisons become possible.

An embedding model maps text into a high-dimensional vector space. You can think of that as placing pieces of text in a space where nearby items are more similar, in some learned sense, than distant ones.

That gives the application a way to compare texts without relying only on exact keyword matches. A query does not need to match a document word for word for the system to retrieve something relevant.

> The important point is that embeddings help the system compare texts. They do not certify truth, guarantee relevance, or replace judgment about what should be trusted.

## Vector search ranks nearby neighbors

Once text has been embedded, the system can search for nearby vectors. A query gets embedded, the system compares that query vector to stored chunk vectors, and then returns the nearest neighbors.

At scale, this usually relies on [approximate nearest-neighbor techniques](https://www.pinecone.io/learn/series/faiss/vector-indexes/) rather than exact search. That trades some recall for a large gain in speed.

**Vector search is best understood as a ranking system.**

It helps the application retrieve plausible neighbors under the representation and search method it is using. That is useful, but it is still a selection process, not a verification process.

That is why retrieved results can feel more authoritative than they deserve. A chunk can be similar enough to get retrieved and still be stale, incomplete, misleading, or risky in context.

## Why retrieval deserves security review

Once an application adds retrieval, it creates a new path into the model context. The quality of the answer now depends not only on model behavior, but also on what content was indexed, how it was chunked, what metadata survived ingestion, how the query was formed, how retrieval was filtered and ranked, and what got inserted into context.

**Retrieval is not only a relevance feature. It is a system component that fundamentally changes what reaches the model.**

That also means retrieval quality becomes a security concern.

If the corpus contains poisoned content, retrieval can surface it directly into context. If it contains stale instructions, retrieval can surface those. If tenant boundaries are weak, retrieval can expose the wrong tenant’s content. If metadata filters are weak, retrieval can broaden exposure without looking dramatic.

Because retrieved text often arrives looking useful and relevant, it is easy to trust it more than it deserves. The model does not need a dramatic jailbreak-style failure to produce a bad outcome. It may simply receive the wrong text, treat it as useful context, and produce an answer shaped by that mistake.

This is why RAG security begins before runtime. The retrieval path inherits whatever problems were introduced during ingestion, chunking, metadata assignment, access-control design, and corpus maintenance.

## What to review in a retrieval pipeline

If you are reviewing a retrieval system, follow the path end to end and ask:

- What content gets embedded, and is anything included that should not be?
- How is content chunked, and what meaning is lost or distorted when it is split?
- What metadata is attached, preserved, or dropped during ingestion?
- What filters constrain retrieval at query time?
- What tenant or corpus boundaries exist, and how are they enforced?
- What similarity threshold or ranking logic decides what gets returned?
- How is retrieved text inserted into the final model context?

Those questions tell you more than any promise that the system is “grounded in company data.”

## Closing

Retrieval gives the application a way to select useful external text and place it into model context. That is what makes RAG practical, and it is what makes the retrieval path worth reviewing carefully.

> Vector search returns likely neighbors, not verified facts. Retrieval shapes context, and context shapes output.
