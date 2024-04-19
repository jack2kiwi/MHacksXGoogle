# ThirdEye: Google x MHacks AI Hackathon

## Life quality booster for vision impaired people.

By Jack Holland, Zheng Li, Jin Huang and Arnold-Waigwa, April 2024.

Check out our demo on [YouTube](https://youtu.be/TW_VKBWRJzg) and [Devpost link](https://devpost.com/software/thirdeye-56zait)!

## How to run

Flask instructions:```pip install flask```

Set the FLASK_APP environment variable to tell Flask where your application is:

- On Windows CMD:```set FLASK_APP=objfinder.py```

- On Windows PowerShell:```$env:FLASK_APP="objfinder.py"```

- On macOS and Linux:```export FLASK_APP=objfinder.py```

Run the Flask application by using the following command: `flask run`


This will start a development server, and you'll see output similar to the following:

* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
  The server will default to localhost on port 5000.

## Inspiration

Over 2.2 billion people globally have vision impairments, spanning various ages and socio-economic groups. This creates a substantial market for assistive technologies and services, enhanced by rapid AI advancements. Addressing their needs not only taps into this market but also promotes social inclusion and improves quality of life. Inspired by this need, ThirdEye is developing an app using the multimodal Gemini API to help visually impaired individuals navigate safely and effectively, leveraging both visual and verbal AI capabilities.

## What it does
ThirdEye is an app designed to help visually impaired users and others needing object recognition support. It uses image processing and text-to-speech for real-time assistance across two main modes: Walking Assistant and Searching Assistant. The Walking Assistant mode uses a camera to detect and verbally warn users of potential hazards. The Searching Assistant mode processes images and voice commands to help users locate specific items, such as objects of a certain color for those with color blindness, or small items in cluttered spaces.

## How we built it
ThirdEye was developed using frontend technologies like JavaScript, HTML, and React, with a Python and Flask backend leveraging the Gemini API for its multimodal capabilities in processing verbal and visual information. We faced challenges integrating the API, optimizing real-time image and text processing, and ensuring smooth app functionality. Despite these, we're proud of creating a user-friendly app that enhances accessibility for visually impaired users and those needing object recognition support. Through this project, we learned to effectively employ image processing and text-to-speech technologies to address real-world challenges.