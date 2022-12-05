from cgitb import text
from sentence_transformers import SentenceTransformer,util
import torch
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS


app = Flask(__name__)

CORS(app)
# ez egy többnyelvű senetence bert modell, ami parafrázis adatkészleten is tanult
embedder = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

# egy sima txt file tartalmazza a kismama blogról összegyűjtött szöveget úgy, hogy az értelmes válaszegységek soronként jelennek meg
texts = []
corpus = []
corpIncluded = {}
corpExtras = {}

cid = 0
i = 0
with open('corpus/NIKFAQ.txt',encoding="utf-8") as f:
    for line in f:
        texts.append(line)

        if line[0] == 'ß':
            if cid in corpIncluded :
                corpIncluded[cid] += line
            else:
                corpIncluded[cid] = line
        elif line[0] == '$':
            if cid in corpExtras :
                corpExtras[cid] += line
            else:
                corpExtras[cid] = line
        else:
            corpus.append(line)
            cid = i
        
        i += 1

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
    included = []
    extras = []
    for score, idx in zip(top_results[0], top_results[1]):
        ans = str(corpus[idx])
        ansId = [i for i,x in enumerate(texts) if x == ans]

        if score < 0.6:
            ans += "<br />(Nem biztos a válasz, kérlek fogalmazz pontosabban)"
        results.append({ans.rstrip(): float(score)})
        
        if ansId != []:
            if ansId[0] in corpExtras:
                extras.append(corpExtras[ansId[0]])
            if ansId[0] in corpIncluded:
                included.append(corpIncluded[ansId[0]])

    return jsonify(results, included, extras)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
