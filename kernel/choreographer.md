I'll create a Python program that implements the file watching and WebSocket communication system you described.



```python
import asyncio
import websockets
import json
import time
import subprocess
import os
import base64

class FileWatcher:
    def __init__(self):
        self.file_timestamps = {}
        self.watch_list = []
        self.send_pairs = []
        self.connected_clients = set()
        
    def load_watch_list(self):
        """Load list of files to watch from watch.txt"""
        try:
            with open('watch.txt', 'r') as f:
                self.watch_list = [line.strip() for line in f if line.strip()]
            # Initialize timestamps
            for file in self.watch_list:
                if os.path.exists(file):
                    self.file_timestamps[file] = os.path.getmtime(file)
        except FileNotFoundError:
            print("Error: watch.txt not found")
            return False
        return True

    def load_send_pairs(self):
        """Load key-file pairs from send.txt"""
        try:
            with open('send.txt', 'r') as f:
                lines = [line.strip() for line in f if line.strip()]
                # Process pairs of lines
                self.send_pairs = [(lines[i], lines[i+1]) 
                                 for i in range(0, len(lines), 2)]
        except FileNotFoundError:
            print("Error: send.txt not found")
            return False
        except IndexError:
            print("Error: send.txt must contain pairs of lines")
            return False
        return True

    def check_files_changed(self):
        """Check if any watched files have changed"""
        changed = False
        for file in self.watch_list:
            try:
                current_mtime = os.path.getmtime(file)
                if current_mtime != self.file_timestamps.get(file):
                    changed = True
                    self.file_timestamps[file] = current_mtime
            except OSError as e:
                print(f"Error checking file {file}: {e}")
        return changed

    async def run_rebuild(self):
        """Run rebuild.bash and return result"""
        try:
            process = await asyncio.create_subprocess_exec(
                './rebuild.bash',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            return process.returncode, stderr.decode()
        except Exception as e:
            return 1, str(e)

    def collect_file_contents(self):
        """Collect contents of files specified in send.txt"""
        result = {}
        for key, filename in self.send_pairs:
            try:
                with open(filename, 'r') as f:
                    # Encode file contents as base64 to handle special characters
                    content = f.read()
                    result[key] = content
            except Exception as e:
                print(f"Error reading file {filename}: {e}")
        return result

    async def broadcast_message(self, message):
        """Send message to all connected clients"""
        if not self.connected_clients:
            return
        
        json_message = json.dumps(message)
        disconnected_clients = set()
        
        for client in self.connected_clients:
            try:
                await client.send(json_message)
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.add(client)
            except Exception as e:
                print(f"Error sending to client: {e}")
                disconnected_clients.add(client)
        
        # Remove disconnected clients
        self.connected_clients -= disconnected_clients

    async def handle_client(self, websocket):
        """Handle individual WebSocket client"""
        self.connected_clients.add(websocket)
        try:
            await websocket.wait_closed()
        finally:
            self.connected_clients.remove(websocket)

    async def watch_and_rebuild(self):
        """Main loop to watch files and trigger rebuilds"""
        while True:
            if self.check_files_changed():
                # Run rebuild script
                return_code, stderr = await self.run_rebuild()
                
                if return_code != 0:
                    # Send error message
                    error_message = {
                        "Errors": f"Build failed with code {return_code}\n{stderr}"
                    }
                    await self.broadcast_message(error_message)
                else:
                    # Collect and send file contents
                    contents = self.collect_file_contents()
                    await self.broadcast_message(contents)
            
            await asyncio.sleep(0.02)  # 20ms delay

async def main():
    # Initialize file watcher
    watcher = FileWatcher()
    
    # Load configuration files
    if not watcher.load_watch_list() or not watcher.load_send_pairs():
        return
    
    # Start WebSocket server
    async with websockets.serve(watcher.handle_client, "localhost", 8765):
        print("WebSocket server started on ws://localhost:8765")
        
        # Start file watching loop
        try:
            await watcher.watch_and_rebuild()
        except asyncio.CancelledError:
            print("Server shutting down...")
        except Exception as e:
            print(f"Error in main loop: {e}")

if __name__ == "__main__":
    asyncio.run(main())

```

This program implements the specified functionality with the following features:

1. File Watching:
   - Reads watch list from 'watch.txt'
   - Monitors files every 20ms
   - Tracks file modification times to detect changes

2. WebSocket Server:
   - Serves on ws://localhost:8765
   - Handles multiple client connections
   - Broadcasts messages to all connected clients

3. Build Process:
   - Runs rebuild.bash when files change
   - Captures stderr and exit code
   - Sends error messages when build fails

4. File Content Collection:
   - Reads send.txt for key-file pairs
   - Collects file contents and builds JSON object
   - Handles file encoding for proper JavaScript parsing

5. Error Handling:
   - Robust error handling for file operations
   - Handles WebSocket connection issues
   - Graceful shutdown on errors

To use this program:

1. Install required package:
```bash
pip install websockets
```

2. Create required files:
   - watch.txt: List of files to watch
   - send.txt: Key-file pairs
   - rebuild.bash: Build script (make it executable)

3. Run the program:
```bash
python choreographer.py
```

The program will:
1. Watch the specified files
2. Run rebuild.bash when changes are detected
3. Send error messages or file contents via WebSocket
4. Handle multiple client connections

Would you like me to modify any part of the implementation or add additional features?

---
---
---

I'll modify the program to handle the specific format of send.txt where each line contains a key and filename separated by spaces.

```python
import asyncio
import websockets
import json
import time
import subprocess
import os

class FileWatcher:
    def __init__(self):
        self.file_timestamps = {}
        self.watch_list = []
        self.send_pairs = []
        self.connected_clients = set()
        
    def load_watch_list(self):
        """Load list of files to watch from watch.txt"""
        try:
            with open('watch.txt', 'r') as f:
                self.watch_list = [line.strip() for line in f if line.strip()]
            # Initialize timestamps
            for file in self.watch_list:
                if os.path.exists(file):
                    self.file_timestamps[file] = os.path.getmtime(file)
        except FileNotFoundError:
            print("Error: watch.txt not found")
            return False
        return True

    def load_send_pairs(self):
        """Load key-file pairs from send.txt where each line is 'key filename'"""
        try:
            with open('send.txt', 'r') as f:
                self.send_pairs = []
                for line in f:
                    # Split on whitespace and ensure we have exactly 2 parts
                    parts = line.strip().split()
                    if len(parts) >= 2:
                        # First part is key, rest is filename (in case filename has spaces)
                        key = parts[0]
                        filename = ' '.join(parts[1:])
                        self.send_pairs.append((key, filename))
        except FileNotFoundError:
            print("Error: send.txt not found")
            return False
        return True

    def check_files_changed(self):
        """Check if any watched files have changed"""
        changed = False
        for file in self.watch_list:
            try:
                current_mtime = os.path.getmtime(file)
                if current_mtime != self.file_timestamps.get(file):
                    changed = True
                    self.file_timestamps[file] = current_mtime
            except OSError as e:
                print(f"Error checking file {file}: {e}")
        return changed

    async def run_rebuild(self):
        """Run rebuild.bash and return result"""
        try:
            process = await asyncio.create_subprocess_exec(
                './rebuild.bash',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            return process.returncode, stderr.decode()
        except Exception as e:
            return 1, str(e)

    def collect_file_contents(self):
        """Collect contents of files specified in send.txt"""
        result = {}
        for key, filename in self.send_pairs:
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Escape special characters for JSON
                    result[key] = content
            except Exception as e:
                print(f"Error reading file {filename}: {e}")
                result[key] = f"Error reading file: {str(e)}"
        return result

    async def broadcast_message(self, message):
        """Send message to all connected clients"""
        if not self.connected_clients:
            return
        
        json_message = json.dumps(message)
        disconnected_clients = set()
        
        for client in self.connected_clients:
            try:
                await client.send(json_message)
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.add(client)
            except Exception as e:
                print(f"Error sending to client: {e}")
                disconnected_clients.add(client)
        
        # Remove disconnected clients
        self.connected_clients -= disconnected_clients

    async def handle_client(self, websocket):
        """Handle individual WebSocket client"""
        self.connected_clients.add(websocket)
        try:
            await websocket.wait_closed()
        finally:
            self.connected_clients.remove(websocket)

    async def watch_and_rebuild(self):
        """Main loop to watch files and trigger rebuilds"""
        while True:
            if self.check_files_changed():
                # Run rebuild script
                return_code, stderr = await self.run_rebuild()
                
                if return_code != 0:
                    # Send error message
                    error_message = {
                        "Errors": f"Build failed with code {return_code}\n{stderr}"
                    }
                    await self.broadcast_message(error_message)
                else:
                    # Collect and send file contents
                    contents = self.collect_file_contents()
                    await self.broadcast_message(contents)
            
            await asyncio.sleep(0.02)  # 20ms delay

async def main():
    # Initialize file watcher
    watcher = FileWatcher()
    
    # Load configuration files
    if not watcher.load_watch_list() or not watcher.load_send_pairs():
        return
    
    # Start WebSocket server
    async with websockets.serve(watcher.handle_client, "localhost", 8765):
        print("WebSocket server started on ws://localhost:8765")
        
        # Start file watching loop
        try:
            await watcher.watch_and_rebuild()
        except asyncio.CancelledError:
            print("Server shutting down...")
        except Exception as e:
            print(f"Error in main loop: {e}")

if __name__ == "__main__":
    asyncio.run(main())

```

The main changes from the previous version include:

1. Modified `load_send_pairs()` to handle space-separated key-filename pairs on each line:
   - Splits each line on whitespace
   - First part is the key
   - Remaining parts (joined) are the filename (in case filename contains spaces)

2. Simplified file content handling:
   - Uses UTF-8 encoding for reading files
   - JSON encoding automatically handles special characters
   - More robust error handling for file reading

Example format for configuration files:

watch.txt:
```
file1.txt
file2.txt
src/file3.txt
```

send.txt:
```
key1 file1.txt
key2 path/to/file2.txt
key3 file with spaces.txt
```

To use the program:

1. Install required package:
```bash
pip install websockets
```

2. Create the required files:
   - watch.txt: One filename per line
   - send.txt: One key-filename pair per line, separated by spaces
   - rebuild.bash: Build script (make it executable)

3. Run the program:
```bash
python choreographer.py
```

Would you like me to modify any part of the implementation or add additional features?
