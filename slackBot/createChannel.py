import os
from pathlib import Path
from dotenv import load_dotenv
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
import sys 

# Get the base directory
basepath = Path()
basedir = str(basepath.cwd())
# Load the environment variables
envars = basepath.cwd() / '.env'
load_dotenv(envars)

key = os.environ.get('SLACK_API_TOKEN')
client = WebClient(token=key)

try:
    # Call the conversations.create method using the WebClient
    # conversations_create requires the channels:manage bot scope
    result = client.conversations_create( name = sys.argv[1])
    channelId="".join(result["channel"]["id"].split())
    client.conversations_members(channel=channelId,limit=2)
    print(channelId)
except SlackApiError as e:
    print(f"Got an error: {e.response['error']}")