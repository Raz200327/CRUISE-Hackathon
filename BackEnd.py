from flask import Flask, jsonify
import json
import random

with open('collection.json', 'r') as file:
	data = json.load(file) 

words = data['words']
num_questions = 5
word_list = [word["word"] for category_words in words.values() for word in category_words]
selected_words = random.sample(word_list, num_questions)
current_question_index = 0
score = 0

app = Flask(__name__)

@app.route('/word', methods=['GET'])
def get_current_question():
    global current_question_index
    if current_question_index < num_questions:
        question = selected_words[current_question_index]["word"]
        current_question_index += 1
        return jsonify({"question": question})
    else:
        return jsonify({"message": "Quiz has ended"})

@app.route('/check', methods=['POST'])
def check_letter():
	data = request.json
	letter = data.get('letter','').lower()
	word = data.get('word','').lower()

	if not letter or not word:
		return jsonify({"correct":False, "message":"Invalid request"})

	correct = word.startswith(letter)
	return jsonify({"correct": correct})

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    word = data.get('word', '').lower()
    answer = data.get('answer', '').lower()

    if not word or not answer:
        return jsonify({"message": "Invalid request"})

    is_correct = (word == answer)
    if is_correct:
    	score +=1
    return jsonify({"word": word, "answer": answer, "correct": is_correct})


if __name__ =='__main__':
	app.run(debug=True)