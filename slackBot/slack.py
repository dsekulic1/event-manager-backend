import os
from pathlib import Path
from dotenv import load_dotenv
import sys
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# Get the base directory
basepath = Path()
basedir = str(basepath.cwd())
# Load the environment variables
envars = basepath.cwd() / '.env'
load_dotenv(envars)

key = os.environ.get('SLACK_API_TOKEN')
client = WebClient(token=key)

try:
    response = client.chat_postMessage(channel = "#new", text = ":100: "+ sys.argv[1] + " :tada:")
    #response = client.chat_postMessage(channel = "#emoji-enthusiasts", text = ":100: "+ sys.argv[1] + " :tada:")
except SlackApiError as e:
    # You will get a SlackApiError if "ok" is False
    assert e.response["ok"] is False
    assert e.response["error"]  # str like 'invalid_auth', 'channel_not_found'
    print(f"Got an error: {e.response['error']}")