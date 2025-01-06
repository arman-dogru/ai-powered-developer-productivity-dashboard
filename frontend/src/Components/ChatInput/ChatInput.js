// src/Pages/AI/Components/ChatInput.js

import React, { useState } from 'react';

function ChatInput({ sendMessage }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <textarea
        style={styles.textarea}
        rows={3}
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button style={styles.button} onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    borderTop: '1px solid #ccc',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    width: '80px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default ChatInput;
