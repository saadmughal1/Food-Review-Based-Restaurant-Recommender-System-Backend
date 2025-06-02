from flask import Flask
from app.routes.sentiment_routes import sentiment_bp

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(sentiment_bp, url_prefix='/api/sentiment')

    return app