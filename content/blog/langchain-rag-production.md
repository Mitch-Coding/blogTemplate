---
slug: langchain-rag-production
title: LangChain RAG 从 Demo 到生产化：我踩过的 6 个坑
excerpt: 把 LangChain RAG 从 notebook demo 搬上生产环境时遇到的真实问题：分块策略、向量库选型、检索质量、幻觉控制。
description: 把 LangChain RAG 从 notebook demo 搬上生产环境时遇到的真实问题：分块策略、向量库选型、检索质量、幻觉控制。
category: AI
tags:
  - LangChain
  - RAG
  - LLM
  - 生产化
date: 2026-04-19
readingTime: 12
pinned: true
---

## 问题背景

RAG（Retrieval-Augmented Generation）是目前最实用的 LLM 应用范式：先从知识库检索相关文档，再让 LLM 基于检索结果生成回答。LangChain 提供了开箱即用的 RAG 组件，5 分钟就能跑通一个 demo。

但从 demo 到生产，中间隔着一道鸿沟。这篇文章记录我在实际项目中把 RAG 搬上生产环境时遇到的问题和解决方案。

## 坑 1：分块策略决定了检索上限

LangChain 默认的 `RecursiveCharacterTextSplitter` 按固定字符数切分，简单粗暴。但实际使用中你会发现：

- **切太碎**：每个 chunk 只有几十个字，缺乏上下文，LLM 拿到后也回答不了问题
- **切太大**：检索命中了大段文本，但真正有用的信息只有一两句，浪费 token
- **切在错误位置**：把一个完整的表格或代码块从中间切开，语义断裂

我们最终的方案是**按语义边界切分**：

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n## ", "\n### ", "\n\n", "\n", " "],
    length_function=len,
)
```

关键是 `separators` 参数：优先按标题切分，其次按段落，最后才按句子。这保证了每个 chunk 都有相对完整的语义单元。

对于 Markdown 文档，还可以用 `MarkdownHeaderTextSplitter` 先按标题层级拆分，再对过长的段落做二次切分。

## 坑 2：向量库选型比你想象的重要

demo 阶段用 FAISS 就够了，但生产环境要考虑：

- **持久化**：FAISS 是内存索引，进程重启就没了
- **并发**：多用户同时查询时的性能
- **过滤**：按元数据（日期、类别、权限）过滤检索结果

我们从 FAISS 迁移到了 **Chroma**，原因很简单：

```python
from langchain_chroma import Chroma

vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_metadata={"hnsw:space": "cosine"},
)
```

Chroma 支持持久化、元数据过滤，部署简单（嵌入式，不需要额外服务）。如果数据量到百万级，再考虑 Milvus 或 Weaviate。

## 坑 3：检索质量比检索数量重要

默认检索 top-5，但实际测试中发现：

- top-5 里有 2 条不相关的文档，LLM 会被干扰，产生幻觉
- 有些问题需要结合多条文档才能回答，top-3 不够

解决方案是**混合检索 + 重排序**：

```python
from langchain.retrievers import EnsembleRetriever
from langchain.retrievers import ContextualCompressionRetriever
from langchain_cohere import CohereRerank

# 混合检索：向量 + 关键词
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})
bm25_retriever = BM25Retriever.from_texts(docs, k=10)

ensemble = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.6, 0.4],
)

# 重排序：用 Cohere Rerank 压缩到 top-3
reranker = CohereRerank(model="rerank-v3.5", top_n=3)
compression = ContextualCompressionRetriever(
    base_compressor=reranker,
    base_retriever=ensemble,
)
```

先用混合检索召回 10 条候选，再用重排序模型精选 3 条。重排序模型对语义相关性的判断远强于简单的向量余弦相似度。

## 坑 4：Prompt 工程被严重低估

很多 RAG demo 的 prompt 就一句话："根据以下内容回答问题"。生产环境中这远远不够。

```python
RAG_PROMPT = """你是一个技术文档助手。请根据以下检索到的文档片段回答用户问题。

规则：
1. 只根据提供的文档内容回答，不要编造信息
2. 如果文档中没有相关信息，直接回答"根据现有文档，我无法回答这个问题"
3. 引用文档时标注来源（如 [文档1]）
4. 回答要简洁准确，不要展开无关内容

检索到的文档：
{context}

用户问题：{question}

回答："""
```

关键是**明确告诉 LLM 不要编造**。没有这条约束，LLM 会"自信地胡说八道"，特别是当检索到的文档和问题相关但不完全匹配时。

## 坑 5：Embedding 模型的选择

我们测试了三个 embedding 模型在中文技术文档上的表现：

| 模型 | 维度 | 中文效果 | 速度 |
|---|---|---|---|
| OpenAI text-embedding-3-small | 1536 | 好 | 快 |
| BGE-M3 | 1024 | 很好 | 中等 |
| M3E-base | 768 | 一般 | 快 |

最终选了 **BGE-M3**，中文效果最好，而且是开源模型，不依赖外部 API。如果对延迟敏感，可以用 `text-embedding-3-small`，效果也够用。

## 坑 6：没有监控就没有优化

上线后第一周，我们发现 30% 的用户问题检索到了不相关的文档。原因是用户提问方式和文档表述差异大（用户问"怎么部署"，文档写的是"安装指南"）。

加了监控后才知道要优化什么：

```python
# 记录每次检索的详情
logger.info(json.dumps({
    "question": question,
    "retrieved_docs": [doc.metadata["source"] for doc in docs],
    "relevance_scores": [doc.metadata["score"] for doc in docs],
    "answer_length": len(answer),
}))
```

每周分析检索日志，找出检索失败的 case，补充同义词或调整文档。

## 总结

RAG 的核心瓶颈不在 LLM，而在**检索质量**。分块策略、向量库选型、混合检索、重排序，这四步做好了，LLM 的回答质量自然上去。prompt 约束是最后一道防线，确保 LLM 不会越界。

从 demo 到生产，最关键的转变是：从"能跑通"到"能量化"。加监控、做评估、持续优化，这才是生产化的核心。
