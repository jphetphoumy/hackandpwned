---
draft: false
date: 06-05-2024
---

# Creating a simple chatbot with Langchain and Ollama 
___

::ArticleHeader

::
---

## What is Retrieval-Augmented Generation (RAG) ?

Retrieval-Augmented Generation, or RAG, is this super cool tech that supercharges large language models (LLMs) like the ones we use in AI chatbots and search engines. Basically, it makes AI responses smarter by pulling in fresh, relevant info from external sources right when you need it.

### Why RAG Rocks for LLMS !

Here's why you might want to consider using RAG if you're messing around with AI models:

1. **Keeps Things Fresh:** RAG enables LLMs to pull in the latest data beyond their training datasets, diminishing the likelihood of delivering outdated or inaccurate responses.
2. **Keeps it Real:** Instead of making up answers (yeah, AI does that sometimes), RAG helps keep the AI’s responses grounded in actual, factual data. 
3. **Easy to Implement:** You don't need to be a coding wizard to get RAG rolling, and it doesn't cost an arm and a leg to update your AI model. 

In short, RAG is like giving your AI a mini-upgrade with each query, ensuring it's always on its A-game when answering questions or helping out users. It's a game-changer for making AI interactions a lot more reliable and useful.

## Installation of the tools: Ollama, Langchain and Gradio

### Creating the python project

First, we will use `poetry` to create our python project.

Use the following command to initialize your project:

```bash
poetry new ai-chatbot-rag
```

Next, let's understand the tools we will use for our application. Let's start by Ollama !

### Ollama

Ollama is the easiest solution to run LLM locally. It's as simple as running `docker pull`. To get started with Ollama, you can download it on the [official website](https://ollama.com/download)

To use a local LLM with ollama, simply use `ollama pull <model-name>`. If we want to use the new **LLAMA 3** model, we can run the following command :

```bash
ollama pull llama3
```

When the model download is complete, you can use the model with the following command: 

```bash
ollama run llama3
```

You can also serve an api endpoint and this is what we will use for our chatbot !.

To do this, run the following command: 

```bash
ollama serve
```

### Langchain

To supercharge our AI app and make things easier, we will use the **Langchain** framework. 

This framework have some nice abstraction that will make it easier to create our RAG application.

#### Getting Started with Langchain

Here's the quick guide on how to getting Langchain up and running.

1. **Installation:** Since we already have our project initialized, let's add the Langchain Library ! In your python project, use the following command: 

```bash
poetry add langchain
```

This command will add the Langchain library inside your project.

#### Simple Chatbot using Langchain & Ollama

Let's create a simple Chatbot

First, we need to import the what we need from Langchain

```python
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
```

We will use environment variable to make our application more flexible. Let's install python-dotenv

```bash
poetry add python-dotenv
```

Create a .env and add your local ip

```bash [.env]
OLLAMA_BASE_URL="http://<local-ip>:11434"
```

We can use the environment variable with the following code : 

```python
import os
from dotenv import load_dotenv
load_dotenv()

# Define the base url for ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")
```

Now let's create the LLM.

```python

llm = Ollama(model="phi3", base_url=OLLAMA_BASE_URL)

# Create the prompt template
prompt_template = """<|system|You are an helpful Assistant. Your goal is to answer the user as best as you can<|end|>
<|user|>What is the capital of france?<|end|><|assistant|>
The capital of France is Paris<|end|>
<|user|>{question}<|end|><|assistant|>
"""

prompt = PromptTemplate.from_template(prompt_template)
chain = prompt | llm


chunks = []
for chunk in chain.stream({question: "What is the color of the sky"}):
    print(chunk, end="")
    chunks.append(chunk)
```
