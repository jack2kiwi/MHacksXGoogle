# import google.generativeai as genai
import os
import PIL.Image
import flask
import utils
import tempfile
from flask import Flask, request, jsonify

# text only
# model = genai.GenerativeModel('gemini-1.0-pro-latest')
# response = model.generate_content("The opposite of hot is")
# print(response.text)

app = Flask(__name__)

@app.route('/')
def index():
    """index_page"""
    context={}
    # return flask.render_template("index.html",**context)
    return flask.render_template("SearchAssistant_style.html",**context)

@app.route('/SearchAssistant')
def searchAssistant():
    """index_page"""
    context={}
    # return flask.render_template("index.html",**context)
    # return flask.render_template("SearchAssistant.html",**context)
    return flask.render_template("SearchAssistant_style.html",**context)

@app.route('/WalkingAssistant')
def walkingAssistant():
    """index_page"""
    context={}
    # return flask.render_template("index.html",**context)
    # return flask.render_template("WalkingAssistant.html",**context)
    return flask.render_template("WalkingAssistant_style.html",**context)

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    input_text = request.form['description']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        #DO REQUESTS WITH FILE
        # Response with additional data
        # msg=utils.blind_helper(PIL.Image.open(file.filename))
        # file.seek(0)  # Move to the beginning of the file
        # image_data = file.read()
        # image_format = PIL.Image.open(file).format.lower()
        # print(image_format)
        # img = PIL.Image.open(file)
        # Ensure the 'uploads' directory exists
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        # Save the file with a unique name
        filename = os.path.join(upload_dir, file.filename)
        file.save(filename)
        img=PIL.Image.open(filename)
        msg=utils.object_finder(img, input_text)
        response_data = {
            # 'message': 'Image successfully uploaded'
            'message': msg
            # ADD ALL RESPONSE DATA
        }
        response = jsonify(response_data);
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        # context={'message': msg}
        # return flask.render_template("result.html",**context)

@app.route('/upload-walking-image', methods=['POST'])
def upload_walking_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        #DO REQUESTS WITH FILE
        # Response with additional data
        # msg=utils.blind_helper(PIL.Image.open(file.filename))
        # file.seek(0)  # Move to the beginning of the file
        # image_data = file.read()
        # image_format = PIL.Image.open(file).format.lower()
        # print(image_format)
        # img = PIL.Image.open(file)
        # Ensure the 'uploads' directory exists
        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        # Save the file with a unique name
        filename = os.path.join(upload_dir, file.filename)
        file.save(filename)
        img=PIL.Image.open(filename)
        msg=utils.blind_helper(img)
        print(msg)
        response_data = {
            # 'message': 'Image successfully uploaded'
            'message': msg
            # ADD ALL RESPONSE DATA
        }
        response = jsonify(response_data);
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        # context={'message': msg}
        # return flask.render_template("result.html",**context)

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio part in the request'}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        #DO REQUESTS WITH FILE
        # Response with additional data
        response_data = {
            'message': 'Audio successfully uploaded'
            # ADD ALL RESPONSE DATA
        }
        response = jsonify(response_data);
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

if __name__ == '__main__':
    app.run(debug=True)

# def object_finder(image_file):
#     img = PIL.Image.open(image_file)
#     prompt = """I'm a blind person, 
#     I've taken this picture and I want to you to tell me what is inside the picture. 
#     Describe their specific locations."""
#     model = genai.GenerativeModel('gemini-pro-vision')
#     response = model.generate_content([prompt, img])
#     print(response.text)
    
# def blind_helper(image_file):
#     img = PIL.Image.open(image_file)
#     prompt = """I'm a blind person, I'm walking on a street. This picture shows what is in front of me. 
#     Tell me what is in front of me specifically. 
#     Please also tell me what if there is anything that I should pay attention to (something that may be dangerous for me) and which way I should walk."""
#     model = genai.GenerativeModel('gemini-pro-vision')
#     response = model.generate_content([prompt, img])
#     print(response.text)
    
# # text+image
# img='messyroom.jpg'
# # img='street.jpg'

# object_finder(img)
# blind_helper(img)