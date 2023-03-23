from flask import Flask, request
import json

app = Flask(__name__)
last_data = ''

@app.route('/post', methods=['POST'])
def process_data():
    try:
        global last_data
        last_data = request.data
        print(last_data)
        return 'Request received successfully!', 200
    except Exception as e:
        return f'An error occurred: {str(e)}', 500
    
@app.route('/', methods=['GET'])
def show_post_request():
    try:
        global last_data
        formatted_data = json.dumps(json.loads(last_data), indent=4)
        return f'Health Status:\n{formatted_data}', 200
    except Exception as e:
        return f'An error occurred: {str(e)}', 500
if __name__ == '__main__':
    app.run(debug=True)
