# Prompt Engineering Techniques & Best Practices

This reference serves as a built-in knowledge base for the `prompt-engineering` skill.

---

## 1. Zero-Shot Prompting
*Giving a task without examples.*

- **Good Practice**: Be extremely explicit about the role and the exact format.
- **Bad Practice**: "Resuma isso." (Too vague).
- **Benefits**: Fastest, zero token overhead for examples.
- **Drawbacks**: High risk of hallucination or format deviation in complex tasks.

## 2. Few-Shot Prompting
*Providing a few examples (Input -> Output).*

- **Good Practice**: Use diverse examples that cover edge cases. Maintain consistent formatting.
- **Bad Practice**: Providing examples that are all similar, biasing the model.
- **Benefits**: Drastically improves format compliance and reasoning style.
- **Drawbacks**: Increases token cost. Can "trap" the model into only following the examples' patterns.

## 3. Chain-of-Thought (CoT)
*Asking the model to "think step-by-step".*

- **Good Practice**: Use CoT for logic, math, or complex reasoning. Explicitly ask for a `<thinking>` block.
- **Bad Practice**: Using CoT for simple factual retrieval or creative writing (wastes tokens).
- **Benefits**: Reduces reasoning errors; allows the user to audit the "why" behind an answer.
- **Drawbacks**: Increases latency and token usage.

## 4. Zero-Shot CoT
*Adding "Let's think step by step" to a zero-shot prompt.*

- **Good Practice**: Best for quick logic checks without writing examples.
- **Bad Practice**: Expecting it to solve high-complexity architectural problems alone.
- **Benefits**: Significant performance boost for almost zero effort.
- **Drawbacks**: Less reliable than Few-Shot CoT.

## 5. Least-to-Most Prompting
*Breaking a complex problem into sub-problems and solving them sequentially.*

- **Good Practice**: Define a "Planner" step that lists sub-tasks first.
- **Bad Practice**: Trying to solve all sub-tasks in a single output without clear separation.
- **Benefits**: Handles tasks that are too large for the context window or too complex for one-pass reasoning.
- **Drawbacks**: High latency (multi-turn/multi-step).

## 6. Self-Consistency
*Generating multiple paths of reasoning and taking the majority vote.*

- **Good Practice**: Use for deterministic tasks (math, code logic) where multiple "wrong" paths exist but only one "right" one.
- **Bad Practice**: Using for creative tasks where there is no single "correct" answer.
- **Benefits**: Dramatically increases accuracy in reasoning.
- **Drawbacks**: Very high token cost (requires multiple generations).

## 7. Role / Persona Prompting
*Assigning a specific identity to the AI.*

- **Good Practice**: Give a seniority level and a specific context (e.g., "Senior DevOps Engineer with 10 years of AWS experience").
- **Bad Practice**: "Aja como um gênio." (Too abstract).
- **Benefits**: Sets the appropriate tone, vocabulary, and depth of the response.
- **Drawbacks**: Can lead to "role-playing" prose that adds noise to the output.

## 8. Step-Back Prompting
*Asking the model to first identify the high-level principles or concepts involved before answering.*

- **Good Practice**: Ask "What are the core physics principles here?" before solving a problem.
- **Bad Practice**: Using it for tasks that are purely procedural or data-entry.
- **Benefits**: Prevents the model from getting lost in details and missing the "big picture".
- **Drawbacks**: Adds a mandatory extra step to the reasoning chain.

## 9. Tree of Thoughts (ToT)
*Exploring multiple branches of reasoning simultaneously and evaluating them.*

- **Good Practice**: Use a "Judge" agent to prune weak branches.
- **Bad Practice**: Implementing manually for simple tasks.
- **Benefits**: Solving the most difficult reasoning puzzles (Crosswords, complex planning).
- **Drawbacks**: Extremely high complexity and token cost.

## 10. RAG Prompting (Context Injection)
*Providing external data within the prompt.*

- **Good Practice**: Use clear delimiters (e.g., `[CONTEXT START] ... [CONTEXT END]`) and tell the model to "Refuse if not found in context".
- **Bad Practice**: Dumping thousands of lines of raw text without cleaning or relevance ranking.
- **Benefits**: Eliminates hallucinations about facts; keeps the model up-to-date.
- **Drawbacks**: Requires efficient retrieval (vector DB) to be effective.

---

## Comparative Matrix

| Technique | Cost | Latency | Accuracy | Use Case |
|---|---|---|---|---|
| Zero-Shot | Low | Low | Medium | Simple Tasks |
| Few-Shot | Medium | Low | High | Formats / Style |
| CoT | Medium | Medium | High | Logic / Math |
| ToT | High | High | Very High | Strategy / Planning |
| RAG | High | Medium | High | Fact-based |
