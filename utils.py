"""
This Python script is designed to interact with the Gemini API, specifically using image processing
to assist vision-impaired individuals. It utilizes the Google Generative AI model for object recognition
and guidance in images.
"""

import PIL.Image
import google.generativeai as genai
import os

# Configure the API key for Google Generative AI services
os.environ["GOOGLE_API_KEY"] = "GOOGLE_API_KEY_HERE"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

def object_finder(img, prompt=""):
    """
    Identifies and locates a computer within an image for vision-impaired users.

    Parameters:
    img (PIL.Image): An image in which the computer needs to be located.

    Returns:
    str: Description of the computer's location and access instructions.
    """
    prompt_find_sys = (
        "You are a helpful agent for vision impaired people. "
        "Your task is to locate the things in the room and provide details "
        "about how it can be fetched. Let's think step by step."
    )

    model = genai.GenerativeModel('models/gemini-1.5-pro-latest',
                                  system_instruction=prompt_find_sys)
    response = model.generate_content([prompt, img])
    return response.text
    
def blind_helper(img, prompt=""):
    """
    Provides descriptive guidance for a vision-impaired person based on an image of their surroundings.
    
    Parameters:
    img (PIL.Image): An image showing the view in front of the user.

    Returns:
    str: Specific details about the surroundings, potential hazards, and navigation advice.
    """
    prompt_blind_sys = (
        "You are a walking assistant, you give directions to follow based on pictures provided in order to not collide with anything."
        "You must give verbose responses in order for the user to react in time to any obstructions in front of them."
        "I am a vision impaired. This picture shows what is in front of me. "
        "Please tell me which way I can safely walk. Give me walking directions before you tell me any other information about my surroundings."
    )

    model = genai.GenerativeModel('models/gemini-1.5-pro-latest',
                                  system_instruction=prompt_blind_sys)
    response = model.generate_content([prompt, img])
    return response.text
