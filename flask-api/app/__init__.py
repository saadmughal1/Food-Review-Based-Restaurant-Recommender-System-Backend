from flask import Flask
from flask_cors import CORS 
from app.routes.sentiment_routes import sentiment_bp
from app.routes.prompt_routes import prompt_bp
from app.routes.recomendation_routes import recomendation_bp
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})
    
    app.register_blueprint(sentiment_bp, url_prefix='/api/sentiment')
    app.register_blueprint(prompt_bp, url_prefix='/api/prompt')
    app.register_blueprint(recomendation_bp,url_prefix='/api/recomendation')
    return app