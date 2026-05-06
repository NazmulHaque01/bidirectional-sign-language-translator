"""
Local development server for Bangla Sign Language Translator.

The Web Speech API (voice input) requires either:
  - HTTPS, or
  - localhost (Chrome treats it as a secure origin)

This script serves the app on http://localhost:8000 which satisfies
Chrome's security requirements for the Speech Recognition API.

Usage:
    python serve.py

Then open:  http://localhost:8000
"""

import http.server
import os
import sys
import webbrowser
import threading

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serve files from the project directory."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Quieter logging — only show errors and the initial requests
        status = str(args[1]) if len(args) > 1 else ''
        if status.startswith('4') or status.startswith('5'):
            super().log_message(format, *args)

    def end_headers(self):
        # Add CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def open_browser():
    """Open browser after a short delay."""
    import time
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')


def main():
    server = http.server.HTTPServer(('localhost', PORT), Handler)

    print(flush=True)
    print('=' * 60, flush=True)
    print('  Bangla Sign Language Translator', flush=True)
    print(f'  Server running at: http://localhost:{PORT}', flush=True)
    print('=' * 60, flush=True)
    print('  Voice input will work on localhost (secure context)', flush=True)
    print('  Press Ctrl+C to stop', flush=True)
    print(flush=True)

    # Auto-open browser
    threading.Thread(target=open_browser, daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.', flush=True)
        server.server_close()


if __name__ == '__main__':
    main()
