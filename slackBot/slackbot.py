import os
from pathlib import Path
from dotenv import load_dotenv
from slack_sdk.errors import SlackApiError
from flask import Flask
from flask import Flask, jsonify
import slack

env_path = Path('.')/'.env'
load_dotenv(dotenv_path=env_path)

app = Flask (__name__)

client = slack.WebClient(token='xoxb-2648982669424-2622437330277-4xyu33qKLsPcRIuCbZYzyEK3')

@app.route('/slack/<message>',methods = ['POST'])
def slackMessage(message):
    response=""
    try:
        client.chat_postMessage(
            channel = "#event",
            text = message + ":tada:")
        response = jsonify(success=True)
        response.status_code=200
    except SlackApiError as e:
        response.status_code=500
        response = jsonify(success=False)
    return response


if __name__=="__main__":
    app.run(debug=True)