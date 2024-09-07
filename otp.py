import base64
import os
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def send_otp(emailid, name, type):
    """Generate and send OTP to the provided email address."""
    digits = "0123456789"
    OTP = "".join(random.choice(digits) for _ in range(6))

    creds = None
    # The file token.json stores the user's access and refresh tokens and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("gmail", "v1", credentials=creds)

        # Create the email content
        subject, body = form_email(type, name, OTP)

        # Create MIME object
        msg = MIMEMultipart()
        msg['From'] = 'me'
        msg['To'] = emailid
        msg['Subject'] = subject

        # Attach the email body
        msg.attach(MIMEText(body, 'html'))

        # Encode the message
        raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode()

        # Send the email
        message = service.users().messages().send(userId="me", body={'raw': raw_message}).execute()
        print(f"Message Id: {message['id']}")

    except HttpError as error:
        print(f"An error occurred: {error}")

    return OTP


def form_email(type, name, OTP):
    """Format the email subject and body based on the type of request using HTML."""
    if type == "register":
        subject = "Email Verification OTP for Your Account"
        body = f"""\
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f8f8f8; padding: 10px; text-align: center; }}
        .content {{ margin-top: 20px; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #888; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to DOST!</h2>
        </div>
        <div class="content">
            <p>Dear {name.split()[0]},</p>
            <p>Thank you for signing up with DOST! We're excited to have you as part of our community.</p>
            <p>To complete the registration process and verify your email address, please enter the following One-Time Password (OTP) on the verification page:</p>
            <h3 style="color: #007bff;">OTP: {OTP}</h3>
            <p>Please ensure that you do not share this OTP with anyone, as it is used for verification purposes only. If you did not initiate this registration, please disregard this email.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team at [Support Email Address].</p>
            <p>Thank you for choosing DOST!</p>
            <p>Best regards,<br>Team DOST</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DOST. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"""

    else:
        subject = "Password Reset OTP"
        body = f"""\
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #f8f8f8; padding: 10px; text-align: center; }}
        .content {{ margin-top: 20px; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #888; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Dear {name.split()[0]},</p>
            <p>We have received a request to reset your password. To complete the password reset process, please enter the following One-Time Password (OTP) in the provided field on our website:</p>
            <h3 style="color: #007bff;">OTP: {OTP}</h3>
            <p>If you did not request this password reset, please disregard this message and ensure the security of your account.</p>
            <p>Thank you for choosing DOST!</p>
            <p>If you have any questions or require assistance, please contact our support team at [Support Email].</p>
            <p>Best regards,<br>Team DOST</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DOST. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"""

    return subject, body


if __name__ == "__main__":
    # Example usage:
    mail = input("Enter your email address: ")
    name = input("Enter your name: ")
    send_otp(mail, name, "register")
