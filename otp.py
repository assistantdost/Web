import random
import smtplib
import os


def send_otp(emailid, name, type):

    digits = "0123456789"
    OTP = "".join(random.choice(digits) for _ in range(6))

    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()

    mail = os.environ.get("email")
    pwd = os.environ.get("pwd")

    s.login(mail, pwd)

    subject, body = form_email(type, name, OTP)

    otp_email = f"Subject: {subject}\nTo: {emailid}\n" \
        "Reply-To: no-reply@example.com\n\n{body}"

    s.sendmail('&&&&&&&&&&&', emailid, otp_email)

    return OTP


def form_email(type, name, OTP):

    if type == "register":
        subject = "Email Verification OTP for Your Account"
        body = f"""Dear {name.split()[0]},

Thank you for signing up with DOST! We're excited to have you as part of our community.

To complete the registration process and verify your email address, please enter the following One-Time Password (OTP) on the verification page:

OTP: {OTP}

Please ensure that you do not share this OTP with anyone, as it is used for verification purposes only. If you did not initiate this registration, please disregard this email.

If you have any questions or need assistance, feel free to reach out to our support team at [Support Email Address].

Thank you for choosing DOST!

Best regards,
Team DOST"""

    else:
        subject = "Password Reset OTP"
        body = f"""Dear {name.split()[0]},

We have received a request to reset your password. To complete the password reset process, please enter the following One-Time Password (OTP) in the provided field on our website:

OTP: {OTP}

If you did not request this password reset, please disregard this message and ensure the security of your account.

Thank you for choosing DOST!

If you have any questions or require assistance, please contact our support team at [Support Email].

Best regards,
Team DOST"""

    return subject, body
