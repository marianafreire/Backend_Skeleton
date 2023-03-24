from flask import Flask, request
import json

app = Flask(__name__)
last_data = ''

@app.route('https://garmin-health-test.vercel.app/post', methods=['POST'])
def process_data():
    try:
        global last_data
        last_data = request.data
        print(last_data)
        return 'Request received successfully!', 200
    except Exception as e:
        return f'An error occurred: {str(e)}', 500
    
@app.route('https://garmin-health-test.vercel.app/', methods=['GET'])
def show_post_request():
    try:
        return f'Health Status:', 200
        '''
        global last_data
        formatted_data = json.dumps(json.loads(last_data), indent=4)
        return f'Health Status:\n{formatted_data}', 200
        '''
    except Exception as e:
        return f'An error occurred: {str(e)}', 500
        
if __name__ == '__main__':
    app.run(debug=True)
