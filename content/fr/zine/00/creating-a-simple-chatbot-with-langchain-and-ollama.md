---
published: true
chapter: 2
date: 06-05-2024
tag: LLM
---

# Créer un chatbot simple avec Langchain et Ollama

---
::ArticleHeader

::
---

## C’est quoi le Retrieval-Augmented Generation (RAG) ?

Le **Retrieval-Augmented Generation**, ou RAG, c’est une technique super intéressante qui permet de rendre les modèles de langage (LLM) beaucoup plus intelligents. En gros, ça permet à l’IA d’aller chercher des infos fraîches et pertinentes depuis des sources externes **au moment de la requête**.

### Pourquoi le RAG est génial pour les LLMs ?

Voici pourquoi tu devrais t’y intéresser si tu joues un peu avec les IA :

1. **Des réponses toujours à jour :**\
   Le RAG permet au modèle d’aller au-delà de sa base d’apprentissage pour récupérer des données plus récentes et éviter les infos périmées.

2. **Des réponses plus fiables :**\
   Plutôt que d’inventer des trucs (oui, l’IA fait ça parfois), le RAG permet de baser les réponses sur des données réelles et vérifiables.

3. **Facile à mettre en place :**\
   Pas besoin d’être un gourou du code pour démarrer, et tu n’as pas besoin de réentraîner un modèle entier à chaque mise à jour.

En résumé, le RAG, c’est comme offrir une mise à jour dynamique à ton IA, pour qu’elle soit toujours au top quand il s’agit de répondre.

## Installation des outils : Ollama, Langchain

On va jouer un peu avec Python et des LLM locaux. Le but est de créer une petite appli en Python qui utilise **Ollama** et **Langchain** pour faire ton propre chatbot.

### Création du projet Python

On commence par créer un projet Python avec `poetry`.

```bash
poetry new ai-chatbot-rag
```

Ensuite, voyons les outils qu’on va utiliser. On commence par **Ollama**.

### Ollama

Ollama est la manière la plus simple de faire tourner un LLM localement. C’est aussi simple qu’un `docker pull`.\
Tu peux le télécharger depuis le [site officiel](https://ollama.com/download).

Pour utiliser un modèle local, par exemple **LLAMA 3**, tu peux exécuter :

```bash
ollama pull llama3
```

Une fois le modèle téléchargé, tu peux le lancer avec :

```bash
ollama run llama3
```

Mais nous, on va le hoster via une API (et c’est ce que notre chatbot utilisera) :

```bash
ollama serve
```

### Langchain

Pour structurer notre appli et simplifier la création du chatbot, on va utiliser **Langchain**, un framework très pratique avec plein d’abstractions utiles, notamment pour le RAG.

#### Installation de Langchain

Dans notre projet Python, on ajoute Langchain :

```bash
poetry add langchain
```


## Chatbot simple avec Langchain & Ollama

Commençons la création du chatbot.

### Importation des modules nécessaires

```python
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
```

### Utilisation des variables d’environnement

Pour plus de flexibilité, on va utiliser des variables d’environnement avec `python-dotenv` :

```bash
poetry add python-dotenv
```

Crée un fichier `.env` et ajoute ton IP locale :

```env
OLLAMA_BASE_URL="http://<ip-locale>:11434"
```

Et dans ton code :

```python
import os
from dotenv import load_dotenv
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")
```

### Création du LLM et du prompt

Maintenant on peut créer une instance de modèle et un prompt personnalisé :

```python
llm = Ollama(model="llama3", base_url=OLLAMA_BASE_URL)

prompt_template = """<|system|Tu es un assistant intelligent. Ton but est d’aider l’utilisateur du mieux que tu peux<|end|>
<|user|>Quelle est la capitale de la France ?<|end|><|assistant|>
La capitale de la France est Paris<|end|>
<|user|>{question}<|end|><|assistant|>
"""

prompt = PromptTemplate.from_template(prompt_template)
chain = prompt | llm
```

### Boucle de dialogue

Et voici la boucle principale de notre chatbot :

```python
while True:
    question = input("Pose-moi une question : ")
    chunks = []
    for chunk in chain.stream({question: question}):
        print(chunk, end="")
        chunks.append(chunk)
```

### Code complet

```python
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL")

llm = Ollama(model="phi3", base_url=OLLAMA_BASE_URL)

prompt_template = """<|system|Tu es un assistant intelligent. Ton but est d’aider l’utilisateur du mieux que tu peux<|end|>
<|user|>Quelle est la capitale de la France ?<|end|><|assistant|>
La capitale de la France est Paris<|end|>
<|user|>{question}<|end|><|assistant|>
"""

prompt = PromptTemplate.from_template(prompt_template)
chain = prompt | llm

while True:
    question = input("Pose-moi une question : ")
    chunks = []
    for chunk in chain.stream({question: question}):
        print(chunk, end="")
        chunks.append(chunk)
```
