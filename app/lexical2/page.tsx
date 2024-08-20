'use client'
import React from 'react';
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
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { CodeHighlightPlugin } from './plugins/CodeHighlightPlugin';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import './Editor.css';

const theme = {
  // Theme configuration
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
  // Add more theme styles...
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function Editor() {
  const initialConfig = {
    namespace: 'MyRichTextEditor',
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
      LinkNode,
      HorizontalRuleNode,
      // Add more node types as needed
    ]
  };

  return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Rich Text Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
              <ToolbarPlugin />
              <RichTextPlugin
                  contentEditable={<ContentEditable className="editor-input" />}
                  placeholder={<Placeholder />}
                  ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <TabIndentationPlugin />
              <TablePlugin />
              <CheckListPlugin />
              <AutoLinkPlugin />
              <CodeHighlightPlugin />
              <HorizontalRulePlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            </div>
          </LexicalComposer>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {/* Export logic here */}}>Export Content</Button>
        </CardFooter>
      </Card>
  );
}

// ToolbarPlugin.js
import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import {
  Button,
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Code,
} from 'lucide-react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = useCallback(
      (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
      },
      [editor]
  );

  // Add more toolbar actions here...

  return (
      <div className="toolbar">
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => formatText('bold')}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => formatText('italic')}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => formatText('underline')}>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        {/* Add more toolbar items here */}
      </div>
  );
}

// CodeHighlightPlugin.js
import { registerCodeHighlighting } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}

// Editor.css
.editor-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  margin: 20px auto;
  max-width: 700px;
}

.editor-input {
  min-height: 150px;
  padding: 15px;
  resize: none;
}

.editor-placeholder {
  color: #999;
  overflow: hidden;
  position: absolute;
  top: 15px;
  left: 15px;
  user-select: none;
  pointer-events: none;
}

.editor-paragraph {
  margin: 0 0 15px 0;
  position: relative;
}

.editor-text-bold {
  font-weight: bold;
}

.editor-text-italic {
  font-style: italic;
}

.editor-text-underline {
  text-decoration: underline;
}

.toolbar {
  border-bottom: 1px solid #ddd;
  padding: 10px;
}