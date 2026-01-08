"""
xrisk - Email Service
Author: Manuel Schott

Handles sending emails for verification and password reset
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from typing import Optional

logger = logging.getLogger('application')

class EmailService:
    """Service for sending emails"""
    
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize with Flask app"""
        self.server = app.config.get('MAIL_SERVER')
        self.port = app.config.get('MAIL_PORT')
        self.use_tls = app.config.get('MAIL_USE_TLS')
        self.use_ssl = app.config.get('MAIL_USE_SSL')
        self.username = app.config.get('MAIL_USERNAME')
        self.password = app.config.get('MAIL_PASSWORD')
        self.sender = app.config.get('MAIL_DEFAULT_SENDER', self.username)
        self.app_url = app.config.get('APP_URL')
        self.api_url = app.config.get('API_DOMAIN')
        if self.api_url and not self.api_url.startswith('http'):
            # Add https:// if not present
            self.api_url = f'https://{self.api_url}'
        self.frontend_url = app.config.get('FRONTEND_URL', self.app_url)
        # Frontend route for workflow resume (default: /ai)
        self.frontend_resume_route = app.config.get('FRONTEND_RESUME_ROUTE', '/ai')
        
        # Log configuration status (without sensitive data)
        if self.username and self.password:
            logger.info(f"Email service initialized - Server: {self.server}, Port: {self.port}, "
                       f"Username: {self.username}, TLS: {self.use_tls}, SSL: {self.use_ssl}, "
                       f"Sender: {self.sender}, App URL: {self.app_url}")
        else:
            logger.warning(f"Email service initialized but MAIL_USERNAME or MAIL_PASSWORD not set. "
                          f"Email sending will fail. Server: {self.server}, Port: {self.port}")
    
    def send_email(
        self, 
        to_email: str, 
        subject: str, 
        html_body: str, 
        text_body: Optional[str] = None
    ) -> bool:
        """
        Send an email
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_body: HTML email body
            text_body: Plain text email body (optional)
        
        Returns:
            True if successful, False otherwise
        """
        if not self.username or not self.password:
            logger.error(f"Email configuration incomplete. Cannot send email to {to_email}. "
                        f"MAIL_USERNAME: {'set' if self.username else 'NOT SET'}, "
                        f"MAIL_PASSWORD: {'set' if self.password else 'NOT SET'}. "
                        f"Please configure MAIL_USERNAME and MAIL_PASSWORD in environment variables.")
            return False
        
        try:
            msg = MIMEMultipart('alternative')
            msg['From'] = formataddr(('xrisk', self.sender))
            msg['To'] = to_email
            msg['Subject'] = subject
            
            if text_body:
                msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            if self.use_ssl:
                server = smtplib.SMTP_SSL(self.server, self.port)
            else:
                server = smtplib.SMTP(self.server, self.port)
                if self.use_tls:
                    server.starttls()
            
            server.login(self.username, self.password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            import traceback
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            logger.error(f"Email error details - Server: {self.server}, Port: {self.port}, "
                        f"TLS: {self.use_tls}, SSL: {self.use_ssl}, Username: {self.username}")
            logger.debug(f"Email error traceback: {traceback.format_exc()}")
            return False
    
    def send_verification_email(self, user_email: str, user_name: str, token: str) -> bool:
        """
        Send email verification link
        
        Args:
            user_email: User's email address
            user_name: User's name
            token: Verification token
        
        Returns:
            True if successful, False otherwise
        """
        verification_url = f"{self.app_url}/verify-email?token={token}"
        
        subject = "xrisk - Bestätigen Sie Ihre E-Mail-Adresse"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #3498db; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; padding: 12px 30px; background-color: #3498db; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #777; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>xrisk</h1>
                </div>
                <div class="content">
                    <h2>Willkommen{', ' + user_name if user_name else ''}!</h2>
                    <p>Vielen Dank für Ihre Registrierung bei xrisk.</p>
                    <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Button klicken:</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">E-Mail bestätigen</a>
                    </p>
                    <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                    <p style="word-break: break-all; color: #777;">{verification_url}</p>
                    <p><strong>Dieser Link ist 24 Stunden gültig.</strong></p>
                    <p>Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 xrisk. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Willkommen{', ' + user_name if user_name else ''}!
        
        Vielen Dank für Ihre Registrierung bei xrisk.
        
        Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie den folgenden Link öffnen:
        {verification_url}
        
        Dieser Link ist 24 Stunden gültig.
        
        Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.
        
        xrisk Team
        """
        
        return self.send_email(user_email, subject, html_body, text_body)
    
    def send_password_reset_email(self, user_email: str, user_name: str, token: str) -> bool:
        """
        Send password reset link
        
        Args:
            user_email: User's email address
            user_name: User's name
            token: Password reset token
        
        Returns:
            True if successful, False otherwise
        """
        reset_url = f"{self.app_url}/reset-password?token={token}"
        
        subject = "xrisk - Passwort zurücksetzen"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #e74c3c; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; padding: 12px 30px; background-color: #e74c3c; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #777; }}
                .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>xrisk - Passwort zurücksetzen</h1>
                </div>
                <div class="content">
                    <h2>Hallo{', ' + user_name if user_name else ''}!</h2>
                    <p>Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.</p>
                    <p>Klicken Sie auf den folgenden Button, um ein neues Passwort zu setzen:</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Passwort zurücksetzen</a>
                    </p>
                    <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                    <p style="word-break: break-all; color: #777;">{reset_url}</p>
                    <div class="warning">
                        <strong>⏱ Wichtig:</strong> Dieser Link ist nur 1 Stunde gültig.
                    </div>
                    <p>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail. 
                       Ihr Passwort bleibt dann unverändert.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 xrisk. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Hallo{', ' + user_name if user_name else ''}!
        
        Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.
        
        Öffnen Sie den folgenden Link, um ein neues Passwort zu setzen:
        {reset_url}
        
        WICHTIG: Dieser Link ist nur 1 Stunde gültig.
        
        Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
        Ihr Passwort bleibt dann unverändert.
        
        xrisk Team
        """
        
        return self.send_email(user_email, subject, html_body, text_body)
    
    def send_password_changed_notification(self, user_email: str, user_name: str) -> bool:
        """
        Send notification that password was changed
        
        Args:
            user_email: User's email address
            user_name: User's name
        
        Returns:
            True if successful, False otherwise
        """
        subject = "xrisk - Passwort wurde geändert"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #27ae60; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #777; }}
                .warning {{ background-color: #ffebee; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✓ Passwort geändert</h1>
                </div>
                <div class="content">
                    <h2>Hallo{', ' + user_name if user_name else ''}!</h2>
                    <p>Ihr Passwort für xrisk wurde erfolgreich geändert.</p>
                    <p>Falls Sie diese Änderung nicht vorgenommen haben, kontaktieren Sie bitte 
                       umgehend unseren Support.</p>
                    <div class="warning">
                        <strong>⚠ Sicherheitshinweis:</strong> Wenn Sie diese Änderung nicht autorisiert haben,
                        könnte Ihr Konto kompromittiert sein.
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 xrisk. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Hallo{', ' + user_name if user_name else ''}!
        
        Ihr Passwort für xrisk wurde erfolgreich geändert.
        
        Falls Sie diese Änderung nicht vorgenommen haben, kontaktieren Sie bitte 
        umgehend unseren Support.
        
        xrisk Team
        """
        
        return self.send_email(user_email, subject, html_body, text_body)
    
    def send_inquiry_notification(self, user_email: str, user_name: str, risk_uuid: str, user_uuid: str) -> bool:
        """
        Send email notification when follow-up questions are generated
        
        Args:
            user_email: User's email address
            user_name: User's name
            risk_uuid: Risk assessment UUID
            user_uuid: User UUID
            
        Returns:
            True if successful, False otherwise
        """
        # Use frontend URL directly for email links (not API)
        # The frontend will handle the resume via query parameter
        resume_url = f"{self.frontend_url}{self.frontend_resume_route}?resume={risk_uuid}"
        
        subject = "xrisk - Rückfragen zu Ihrer Risikobewertung"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #3498db; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; padding: 12px 30px; background-color: #3498db; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #777; }}
                .info {{ background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>xrisk</h1>
                </div>
                <div class="content">
                    <h2>Hallo{', ' + user_name if user_name else ''}!</h2>
                    <p>Wir haben Rückfragen zu Ihrer Risikobeschreibung generiert, damit wir diese weiter analysieren können.</p>
                    <p>Bitte füllen Sie die zusätzlichen Fragen aus, damit der Risikobeschrieb weiter analysiert werden kann.</p>
                    <p style="text-align: center;">
                        <a href="{resume_url}" class="button">Risikobewertung fortsetzen</a>
                    </p>
                    <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                    <p style="word-break: break-all; color: #777;">{resume_url}</p>
                    <div class="info">
                        <strong>ℹ️ Hinweis:</strong> Nach dem Ausfüllen der Fragen wird die Analyse automatisch fortgesetzt.
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 xrisk. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Hallo{', ' + user_name if user_name else ''}!
        
        Wir haben Rückfragen zu Ihrer Risikobeschreibung generiert, damit wir diese weiter analysieren können.
        
        Bitte füllen Sie die zusätzlichen Fragen aus, damit der Risikobeschrieb weiter analysiert werden kann.
        
        Öffnen Sie den folgenden Link, um fortzufahren:
        {resume_url}
        
        Nach dem Ausfüllen der Fragen wird die Analyse automatisch fortgesetzt.
        
        xrisk Team
        """
        
        return self.send_email(user_email, subject, html_body, text_body)
    
    def send_analysis_complete_notification(self, user_email: str, user_name: str, risk_uuid: str, user_uuid: str) -> bool:
        """
        Send email notification when analysis is complete
        
        Args:
            user_email: User's email address
            user_name: User's name
            risk_uuid: Risk assessment UUID
            user_uuid: User UUID
            
        Returns:
            True if successful, False otherwise
        """
        # Use frontend URL directly for email links (not API)
        # The frontend will handle the resume via query parameter
        resume_url = f"{self.frontend_url}{self.frontend_resume_route}?resume={risk_uuid}"
        
        subject = "xrisk - Risikoanalyse abgeschlossen"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #27ae60; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; }}
                .button {{ display: inline-block; padding: 12px 30px; background-color: #27ae60; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #777; }}
                .success {{ background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✓ Analyse abgeschlossen</h1>
                </div>
                <div class="content">
                    <h2>Hallo{', ' + user_name if user_name else ''}!</h2>
                    <p>Die Analyse Ihrer Risikobewertung ist abgeschlossen.</p>
                    <p>Sie können nun den vollständigen Bericht einsehen.</p>
                    <p style="text-align: center;">
                        <a href="{resume_url}" class="button">Bericht anzeigen</a>
                    </p>
                    <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                    <p style="word-break: break-all; color: #777;">{resume_url}</p>
                    <div class="success">
                        <strong>✅ Fertig:</strong> Ihr Risikobewertungsbericht steht bereit.
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 xrisk. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Hallo{', ' + user_name if user_name else ''}!
        
        Die Analyse Ihrer Risikobewertung ist abgeschlossen.
        
        Sie können nun den vollständigen Bericht einsehen.
        
        Öffnen Sie den folgenden Link, um den Bericht anzuzeigen:
        {resume_url}
        
        xrisk Team
        """
        
        return self.send_email(user_email, subject, html_body, text_body)

email_service = EmailService()

