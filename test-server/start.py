"""One-click launcher for the Gantt test API server.

Run:  python test-server/start.py
Or just double-click the file in Explorer.
"""

import subprocess
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SERVER = Path(__file__).resolve().parent / "server.mjs"
PORT = 3456
URL = f"http://localhost:{PORT}"


def main():
    print("Starting Gantt test API server...")
    print(f"Root: {ROOT}")
    print(f"Server: {SERVER}")
    print()

    try:
        proc = subprocess.Popen(
            ["node", str(SERVER)],
            cwd=str(ROOT),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
    except FileNotFoundError:
        print("ERROR: Node.js not found. Install Node.js or add it to PATH.")
        input("Press Enter to exit...")
        sys.exit(1)

    print(f"Server starting on {URL}")
    print("Opening browser...")
    webbrowser.open(URL)

    print()
    print("Press Ctrl+C to stop the server.\n")

    try:
        for line in proc.stdout:
            print(line, end="")
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        proc.terminate()
        proc.wait()
        print("Server stopped.")


if __name__ == "__main__":
    main()
