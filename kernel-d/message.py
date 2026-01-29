from collections import deque
import json

class Message:
    def __init__(self, key, payload):
        self.key = key
        self.payload = payload
    
    def __eq__(self, other):
        if not isinstance(other, Message):
            return NotImplemented
        key_equal = self.key == other.key
        payload_equal = self.payload == other.payload
        return key_equal and payload_equal
    
    def __repr__(self):
        return '{"' + self.key + '": "' + self.payload + '"}'

def deque_to_json(d):
    """
    Convert a deque of Message objects to a JSON string, preserving order.
    Each Message object is converted to a dict with a single key (from Message.key)
    containing the payload as its value.
    
    Args:
        d: The deque of Message objects to convert
        
    Returns:
        A JSON string representation of the deque
    """
    # Convert deque to list of objects where each message's key contains its payload
    ordered_list = [{msg.key: msg.payload} for msg in d]
    
    # Convert to JSON with indentation for readability
    return json.dumps(ordered_list, indent=2)

# Example usage:
if __name__ == "__main__":
    # Create a sample deque of messages
    messages = deque([
        Message("status", "starting"),
        Message("command", "process_data"),
        Message("status", "processing"),
        Message("result", "success")
    ])
    
    # Show individual message representation
    print("Single message representation:")
    print(messages[0])
    
    # Convert deque to JSON and print
    json_str = deque_to_json(messages)
    print("\nJSON representation of message deque:")
    print(json_str)
    
    # Demonstrate reconstruction if needed
    json_list = json.loads(json_str)
    reconstructed_messages = deque(
        Message(key=list(item.keys())[0], payload=list(item.values())[0])
        for item in json_list
    )
    print("\nReconstructed message deque:")
    for msg in reconstructed_messages:
        print(msg)
