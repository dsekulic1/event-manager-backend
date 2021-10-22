import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from pathlib import Path
from dotenv import load_dotenv
import sys

# Load the environment variables
basepath = Path()
basedir = str(basepath.cwd())
envars = basepath.cwd() / '.env'
load_dotenv(envars)

# Load email preference
SENDER_ADDRESS = os.environ.get('SENDER_ADDRESS')
SENDER_PASS = os.environ.get('SENDER_PASS')

# Load and set up message
mail_body=sys.argv[1]

mail_content = '''Pozdrav,\n
'''+mail_body+'''
\nLijep pozdrav,
Vaše obavijesti.
'''

# The mail addresses and password
sender_address = SENDER_ADDRESS
sender_pass = SENDER_PASS
receiver_address = sys.argv[2]

# Setup the MIME
message = MIMEMultipart()
message['From'] = sender_address
message['To'] = receiver_address
message['Subject'] = 'Obavijest'   

# The body and the attachments for the mail
message.attach(MIMEText(mail_content, 'plain'))

# Create SMTP session for sending the mail
session = smtplib.SMTP('smtp.gmail.com', 587) 

# Enable security
session.starttls() 

# Login with email and password
session.login(sender_address, sender_pass) 

text = message.as_string()
session.sendmail(sender_address, receiver_address, text)
session.quit()
