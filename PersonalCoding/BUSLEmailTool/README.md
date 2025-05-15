# Sponsor Outreach Automation Tool

A simple Python-based automation tool to streamline sponsor outreach emails — designed to save time and ensure a personal touch when contacting multiple companies.

Built for my role as Sponsorship Manager at the **British University Swimming League (BUSL)**, where I contacted hundreds of sponsors each season. This tool reads a list of contacts from a CSV file and sends **personalized email messages** using the Gmail SMTP server.

Designed to be used and passed on to whoever is in the role next to make their lives easier too

## Features

- Reads contact info (email, company name, and disabled flag) from a CSV file
- Uses an email template with dynamic placeholders (e.g. `{{company}}`)
- Sends customized emails via Gmail using secure login
- Skips disabled contacts automatically
- Easy to configure and reuse for future outreach
