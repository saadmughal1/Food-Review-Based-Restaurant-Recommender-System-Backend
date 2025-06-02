from flask import Flask, jsonify
from app.exception import Error

from app.routes.sentiment_routes import sentiment_bp



def create_app():
    app = Flask(__name__)
    
    @app.errorhandler(Error)
    def handle_bad_request(error):
        return jsonify({'error': error.message}),error.status


    app.register_blueprint(sentiment_bp, url_prefix='/api/sentiment')

    return app