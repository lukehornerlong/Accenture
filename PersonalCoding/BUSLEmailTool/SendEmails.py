import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# your Gmail and App Password DONT UPLOAD YOUR PASSWORD TO GIT OR ANYWHERE!!!!
EMAIL_ADDRESS = ''
EMAIL_PASSWORD = '' 

# Load contacts and template
df = pd.read_csv('contacts.csv')
with open('template.txt', 'r') as f:
    template = f.read()

def send_email(to_email, company_name):
    personalized_body = template.replace('{{company}}', company_name)

    subject_line = personalized_body.split('\n')[0].replace('Subject: ', '')
    body_text = '\n'.join(personalized_body.split('\n')[1:])

    # Email structure
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    msg['Subject'] = subject_line
    msg.attach(MIMEText(body_text, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
            print(f"Sent to {company_name} ({to_email})")
    except Exception as e:
        print(f"Failed to send to {to_email}: {e}")

# Loop through contacts
for index, row in df.iterrows():
    if str(row['disabled']).lower() != 'true':
        send_email(row['email'], row['company'])
