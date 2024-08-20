'use client'
import React, { useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const theme = {
  // Theme config here
  // ...
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some markdown...</div>;
}

export default function Editor() {
  const [html, setHtml] = useState('');

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError(error) {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };

  return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Markdown Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
              <RichTextPlugin
                  contentEditable={<ContentEditable className="editor-input" />}
                  placeholder={<Placeholder />}
                  ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            </div>
          </LexicalComposer>
          <div className="preview-container mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div dangerouslySetInnerHTML={{ __html: html }} className="prose" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {/* Export logic here */}}>Export Markdown</Button>
        </CardFooter>
      </Card>
  );
}