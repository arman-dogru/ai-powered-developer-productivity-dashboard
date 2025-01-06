// src/ChatHistory.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // To render raw HTML
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // For syntax highlighting
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Syntax highlighting theme

function ChatHistory({ messages }) {
  return (
    <div style={styles.chatHistory}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            ...styles.messageContainer,
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            style={{
              ...styles.messageBubble,
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#ECECEC',
            }}
          >
            {msg.sender === 'assistant' ? (
            <ReactMarkdown
                children={msg.text}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
            />
            ) : (
            msg.text
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const markdownComponents = {
  h1: ({ node, ...props }) => <h1 style={styles.h1} {...props} />,
  h2: ({ node, ...props }) => <h2 style={styles.h2} {...props} />,
  h3: ({ node, ...props }) => <h3 style={styles.h3} {...props} />,
  h4: ({ node, ...props }) => <h4 style={styles.h4} {...props} />,
  h5: ({ node, ...props }) => <h5 style={styles.h5} {...props} />,
  h6: ({ node, ...props }) => <h6 style={styles.h6} {...props} />,
  p: ({ node, ...props }) => <p style={styles.paragraph} {...props} />,
  strong: ({ node, ...props }) => <strong style={styles.bold} {...props} />,
  em: ({ node, ...props }) => <em style={styles.italic} {...props} />,
  del: ({ node, ...props }) => <del style={styles.strikethrough} {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote style={styles.blockquote} {...props} />
  ),
  ul: ({ node, ordered, ...props }) => (
    <ul style={styles.ul} {...props} />
  ),
  ol: ({ node, ordered, ...props }) => (
    <ol style={styles.ol} {...props} />
  ),
  li: ({ node, ...props }) => <li style={styles.li} {...props} />,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code style={inline ? styles.inlineCode : styles.code} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ node, ...props }) => (
    <pre style={styles.pre} {...props}>
      {props.children}
    </pre>
  ),
  a: ({ node, ...props }) => <a style={styles.link} {...props} />,
  img: ({ node, ...props }) => <img style={styles.image} {...props} />,
  hr: ({ node, ...props }) => <hr style={styles.horizontalRule} {...props} />,
  table: ({ node, ...props }) => <table style={styles.table} {...props} />,
  thead: ({ node, ...props }) => <thead style={styles.tableHead} {...props} />,
  tbody: ({ node, ...props }) => <tbody style={styles.tableBody} {...props} />,
  tr: ({ node, ...props }) => <tr style={styles.tableRow} {...props} />,
  th: ({ node, ...props }) => <th style={styles.tableHeaderCell} {...props} />,
  td: ({ node, ...props }) => <td style={styles.tableCell} {...props} />,
};

const styles = {
  chatHistory: {
    flexGrow: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  messageBubble: {
    maxWidth: '60%',
    padding: '10px',
    borderRadius: '10px',
    wordWrap: 'break-word',
  },
  // Markdown styles
  h1: { fontSize: '24px', margin: '10px 0', fontWeight: 'bold' },
  h2: { fontSize: '22px', margin: '9px 0', fontWeight: 'bold' },
  h3: { fontSize: '20px', margin: '8px 0', fontWeight: 'bold' },
  h4: { fontSize: '18px', margin: '7px 0', fontWeight: 'bold' },
  h5: { fontSize: '16px', margin: '6px 0', fontWeight: 'bold' },
  h6: { fontSize: '14px', margin: '5px 0', fontWeight: 'bold' },
  paragraph: { margin: '5px 0' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  strikethrough: { textDecoration: 'line-through' },
  blockquote: {
    borderLeft: '4px solid #ccc',
    paddingLeft: '10px',
    color: '#666',
    margin: '5px 0',
    fontStyle: 'italic',
  },
  ul: { paddingLeft: '20px', margin: '5px 0', listStyleType: 'disc' },
  ol: { paddingLeft: '20px', margin: '5px 0', listStyleType: 'decimal' },
  li: { margin: '3px 0' },
  code: {
    backgroundColor: '#f5f5f5',
    padding: '3px',
    borderRadius: '4px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
  inlineCode: {
    backgroundColor: '#f5f5f5',
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  pre: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    overflowX: 'auto',
  },
  link: {
    color: '#0645AD',
    textDecoration: 'underline',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    margin: '10px 0',
  },
  horizontalRule: {
    border: 'none',
    borderTop: '1px solid #ccc',
    margin: '20px 0',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '10px 0',
  },
  tableHead: {},
  tableBody: {},
  tableRow: {},
  tableHeaderCell: {
    border: '1px solid #ddd',
    padding: '8px',
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default ChatHistory;
