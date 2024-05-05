---
draft: true
---
# Mettre en place une application RAG avec Ollama, Langchain et Gradio
___

[Lire l'article en anglais](/articles/setting-up-a-simple-rag-application-with-ollama-langchain-and-gradio)

## Installation des outils: Ollama, Langchain and Gradio

### Ollama

Ollama est la solution la plus simple pour faire tourner un LLM en locale. C'est aussi simple que de lancer `docker pull`. Pour commencer avec Ollama, On peut le télécharger
 sur le [site officiel](https://ollama.com/download)

Pour utiliser le LLM en locale avec Ollama, il suffit de simplement lancer la command `ollama pull <nom du modèle>`. Si on veut utiliser le nouveau modèle **LLAMA 3**, on peut lancer la commande suivante :  

```bash
ollama pull llama3
```

Quand le téléchargement du modèle sera complété, on peut utiliser le modèle avec la commande suivante: 

```bash
ollama run llama3
```

### Langchain

### Gradio

## Creating a simple python application using Gradio and langchain
