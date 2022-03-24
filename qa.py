from sentence_transformers import SentenceTransformer,util
import torch
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS


app = Flask(__name__)

CORS(app)
# ez egy többnyelvű senetence bert modell, ami parafrázis adatkészleten is tanult
embedder = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

# egy sima txt file tartalmazza a kismama blogról összegyűjtött szöveget úgy, hogy az értelmes válaszegységek soronként jelennek meg

corpus = []
with open('corpus/kismama.txt',encoding="utf-8") as f:
    for line in f:
        corpus.append(line)

corpus_embeddings = embedder.encode(corpus, convert_to_tensor=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pred', methods=['POST'])
def pred():

    sentence = request.json['text']
    # az első, leginkább megfelelő illesztést válassza, megadható több érték is
    top_k = 1

    query_embedding = embedder.encode(sentence, convert_to_tensor=True)
    # a legegyszerűbb, koszinusz távolság alapú metrika alkalmazása a kérdés és a korpusz elemei között.
    cos_scores = util.pytorch_cos_sim(query_embedding, corpus_embeddings)[0]
    cos_scores = cos_scores.to('cpu')
    top_results = torch.topk(cos_scores, k=top_k)
    results = []
    for score, idx in zip(top_results[0], top_results[1]):
        results.append({str(corpus[idx]).rstrip(): float(score)})

    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
