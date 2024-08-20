'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useCombobox } from 'downshift';
import Fuse from 'fuse.js';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const MarkdownEditor = ({ initialValue = '', documents = [] }) => {
  const [markdown, setMarkdown] = useState(initialValue);
  const [editMode, setEditMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const editorRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const fuse = new Fuse(documents, {
    keys: ['title'],
    threshold: 0.3,
  });

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: searchTerm ? fuse.search(searchTerm).map(result => result.item) : [],
    onInputValueChange: ({ inputValue }) => {
      setSearchTerm(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        insertBacklink(selectedItem.title);
      }
    },
  });

  const handleChange = (event) => {
    const newValue = event.target.value;
    setMarkdown(newValue);

    // Check for image paste
    if (event.clipboardData && event.clipboardData.files.length > 0) {
      const file = event.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    }

    // Check for backlink trigger
    if (newValue.endsWith('[[')) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleImageUpload = (file) => {
    // Implement your file upload logic here
    console.log('Uploading file:', file);
    // After upload, you would typically get a URL and insert it into the markdown
    // For this example, we'll just insert a placeholder
    const imageMarkdown = `![${file.name}](uploaded-image-url)`;
    insertTextAtCursor(imageMarkdown);
  };

  const insertBacklink = (documentTitle) => {
    const backlinkMarkdown = `[[${documentTitle}]]`;
    insertTextAtCursor(backlinkMarkdown);
    setShowDropdown(false);
  };

  const insertTextAtCursor = (text) => {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = markdown.substring(0, start) + text + markdown.substring(end);
    setMarkdown(newValue);
    setCursorPosition(start + text.length);
  };

  useEffect(() => {
    if (cursorPosition !== null && editorRef.current) {
      editorRef.current.selectionStart = cursorPosition;
      editorRef.current.selectionEnd = cursorPosition;
      setCursorPosition(null);
    }
  }, [cursorPosition]);

  const toggleEditMode = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  return (
      <div className="flex flex-col space-y-4">
        <Button onClick={toggleEditMode}>
          {editMode ? 'Preview' : 'Edit'}
        </Button>
        {editMode ? (
            <div>
              <Input
                  ref={editorRef}
                  value={markdown}
                  onChange={handleChange}
                  className="w-full h-64 p-2"
              />
              {showDropdown && (
                  <div {...getComboboxProps()}>
                    <Input {...getInputProps()} />
                    <ul {...getMenuProps()}>
                      {isOpen &&
                          fuse.search(searchTerm).map((item, index) => (
                              <li
                                  key={`${item.item.title}-${index}`}
                                  {...getItemProps({ item: item.item, index })}
                              >
                                {item.item.title}
                              </li>
                          ))}
                    </ul>
                  </div>
              )}
            </div>
        ) : (
            <Card className="p-4">
              <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                          <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                      ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                      )
                    }
                  }}
              >
                {markdown}
              </ReactMarkdown>
            </Card>
        )}
      </div>
  );
};

export default MarkdownEditor;