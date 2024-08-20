'use client'
import React, { useState, useEffect } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { indentWithTab } from '@codemirror/commands';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MarkdownEditor = () => {
  const [editorView, setEditorView] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  const initializeEditor = (element) => {
    if (element && !editorView) {
      const startState = EditorState.create({
        doc: '# Welcome to Markdown Editor\n\nStart typing your markdown here...',
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          markdown(),
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              const content = v.state.doc.toString();
              setPreview(marked(content));
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: element,
      });

      setEditorView(view);
      setPreview(marked(startState.doc.toString()));
    }
  };

  const handleExport = () => {
    if (editorView) {
      const content = editorView.state.doc.toString();
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'markdown-content.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Markdown Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Editor</h2>
                <div ref={initializeEditor} className="border rounded-md p-2 h-96 overflow-auto" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Preview</h2>
                <div
                    className="border rounded-md p-2 h-96 overflow-auto prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: preview }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport}>Export Markdown</Button>
          </CardFooter>
        </Card>
      </div>
  );
};

export default MarkdownEditor;