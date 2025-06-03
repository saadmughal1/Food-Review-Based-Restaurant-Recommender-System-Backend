import google.generativeai as genai
from app.prompts import FOOD_CLASSIFICATION_PROMPT
import os

api_key = os.getenv("GEMINI_API_KEY")
gemini_model = os.getenv("GEMINI_MODEL")

genai.configure(api_key=api_key)
if gemini_model:
    model = genai.GenerativeModel(gemini_model)





def classify_search(text):
    if not text:
        return {"error": "No text provided"}, 400
    prompt = FOOD_CLASSIFICATION_PROMPT.format(text=text)
    response = model.generate_content(prompt)
    return {"response":response.text.strip().lower()}, 200





