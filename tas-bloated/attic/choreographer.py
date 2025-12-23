import asyncio
import websockets
import json
import time
import subprocess
import os
import sys
import traceback

def ansiclear ():
    print ('\x1B[1J')

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
            # Initialize timestamps for existing files only
            for file in self.watch_list:
                if os.path.exists(file):
                    self.file_timestamps[file] = os.path.getmtime(file)
        except FileNotFoundError:
            print("Error: watch.txt not found")
            return False
        return True

    def check_files_changed(self):
        """Check if any existing watched files have changed"""
        changed = False
        for file in self.watch_list:
            if not os.path.exists(file):
                # Skip non-existent files
                continue
                
            try:
                current_mtime = os.path.getmtime(file)
                last_mtime = self.file_timestamps.get(file)
                
                if last_mtime is None:
                    # First time seeing this file
                    self.file_timestamps[file] = current_mtime
                elif current_mtime != last_mtime:
                    # File has changed
                    print (f'File {file} has changed')
                    changed = True
                    self.file_timestamps[file] = current_mtime
            except OSError as e:
                print(f"Error checking file {file}: {e}")
        return changed

    async def run_rebuild(self):
        """Run rebuild.bash and return result"""
        try:
            ansiclear ()
            process = await asyncio.create_subprocess_exec(
                './rebuild.bash',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            return process.returncode, stdout.decode(), stderr.decode()
        except Exception as e:
            return 1, "", str(e)

    async def broadcast_message(self, message_array):
        """Send message to all connected clients"""
        if not self.connected_clients:
            return

        print (f'broadcast {message_array}')
        
        json_message = json.dumps(message_array)
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

    async def clear (self):
        """Send nothing message to all connected clients to clear their displays"""
        await self.broadcast_message ([{"Errors" : "begin..."}])

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
                # Run rebuild script only if changes detected in existing files
                await self.clear ()
                return_code, stdout, stderr = await self.run_rebuild()
                # if success, stdout is a string containing a list of mevents, stderr is a string
                # if fail, stdout is a string, stderr is a string
                # broadcast() needs an internal list of mevents
                
                a = []
                if return_code == 0:
                    # success case
                    if stdout is None:
                        stdout = '[{}]'
                    if stderr is None:
                        stderr = ''
                    a = json.loads (stdout)
                    a.append ({"Info":stderr})
                else:
                    # fail case
                    if stdout is None:
                        stdout = ''
                    if stderr is None:
                        stderr = ''
                    a = [{"Info":stdout}, { "Errors": f"Build failed with code {return_code}\n{stderr}" }]

                await self.broadcast_message(a)
            
            await asyncio.sleep(0.02)  # 20ms delay

async def main():
    watcher = FileWatcher()
    
    if not watcher.load_watch_list():
        return
    
    async with websockets.serve(watcher.handle_client, "localhost", 8965):
        print("WebSocket server started on ws://localhost:8965")
        
        try:
            await watcher.watch_and_rebuild()
        except asyncio.CancelledError:
            print("Server shutting down...")
        except Exception as e:
            print(f"Error in main loop of choreographer.py: {e}")
            traceback.print_exception(type(e), e, e.__traceback__)

if __name__ == "__main__":
    asyncio.run(main())
