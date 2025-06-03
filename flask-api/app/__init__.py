from flask import Flask
from app.routes.sentiment_routes import sentiment_bp
from app.routes.prompt_routes import prompt_bp
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(sentiment_bp, url_prefix='/api/sentiment')
    app.register_blueprint(prompt_bp, url_prefix='/api/prompt')
    
    return app