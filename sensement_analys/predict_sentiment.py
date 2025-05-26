import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, 'tokenizer.json')) as f:
    tokenizer_json = f.read()
    tokenizer = tokenizer_from_json(tokenizer_json)

model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'sentiment_model.h5'))

with open(os.path.join(BASE_DIR, 'label_map.json')) as f:
    label_map = json.load(f)

reverse_label_map = {v: int(k) for k, v in label_map.items()}

def predict(text):
    seq = tokenizer.texts_to_sequences([text])
    pad = pad_sequences(seq, maxlen=20, padding='post')
    pred = model.predict(pad, verbose=0)  # verbose=0 ile sessiz çalıştır
    return reverse_label_map[pred.argmax()]

if __name__ == "__main__":
    input_text = sys.argv[1] if len(sys.argv) > 1 else input("Metin: ")
    result = predict(input_text)
    print(result)
