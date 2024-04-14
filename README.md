Flask instructions:
pip install flask

Set the FLASK_APP environment variable to tell Flask where your application is:

On Windows CMD:
set FLASK_APP=objfinder.py

On Windows PowerShell:
$env:FLASK_APP="objfinder.py"

On macOS and Linux:
export FLASK_APP=objfinder.py


Run the Flask application by using the following command:
flask run


This will start a development server, and you'll see output similar to the following:

* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
The server will default to localhost on port 5000.