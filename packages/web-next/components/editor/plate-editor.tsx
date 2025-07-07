'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Plate } from '@udecode/plate/react';
import { useEditorRef, useEditorString } from '@udecode/plate/react';
import { ArrowLeft, User } from 'lucide-react';

import {
  AISidebarProvider,
  useAISidebar,
} from '@/components/editor/ai-sidebar-context';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { VersionHistoryProvider } from '@/components/editor/version-history-context';
import { AISidebar } from '@/components/ui/ai-sidebar';
import { Button } from '@/components/ui/button';
import { DocumentOutline } from '@/components/ui/document-outline';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/ui/floating-toolbar-buttons';
import { MagicWandButton } from '@/components/ui/magic-wand-button';
import { VersionHistoryButton } from '@/components/ui/version-history-button';

// Import types only
import type { DndProvider as DndProviderType } from 'react-dnd';
import type { HTML5Backend as HTML5BackendType } from 'react-dnd-html5-backend';

interface PlateEditorProps {
  initialTemplate?: {
    content: string | null;
    name: string | null;
  } | null;
}

// Define interface for dynamically loaded components
interface DndComponentsType {
  DndProvider: React.ComponentType<{
    backend: any;
    children: React.ReactNode;
  }>;
  HTML5Backend: any;
}

function AISidebarComponent() {
  const { closeSidebar, isOpen } = useAISidebar();
  const editor = useEditorRef();

  // Get current editor content using the hook
  const editorString = useEditorString();

  const getEditorContent = () => {
    if (!editor) return '';
    try {
      // Get the editor content as plain text using the correct Plate v48 API
      return editorString || '';
    } catch (error) {
      console.error('Failed to get editor content:', error);
      return '';
    }
  };

  // Update editor content
  const handleUpdateEditorContent = (newContent: string) => {
    if (!editor) return;
    try {
      // Parse the new content and set it
      const lines = newContent.split('\n');
      const nodes = lines.map((line) => ({
        children: [{ text: line }],
        type: 'p',
      }));

      editor.tf.setValue(
        nodes.length > 0 ? nodes : [{ children: [{ text: '' }], type: 'p' }],
      );
    } catch (error) {
      console.error('Failed to update editor content:', error);
    }
  };

  return (
    <AISidebar
      onClose={closeSidebar}
      onUpdateEditorContent={handleUpdateEditorContent}
      editorContent={getEditorContent()}
      isOpen={isOpen}
    />
  );
}

function MagicWandButtonComponent() {
  const { openSidebar } = useAISidebar();

  return <MagicWandButton onClick={openSidebar} />;
}

export function PlateEditor({ initialTemplate }: PlateEditorProps) {
  const router = useRouter();
  const [DndComponents, setDndComponents] = useState<DndComponentsType | null>(
    null,
  );

  // Dynamically import DnD components on the client side only
  useEffect(() => {
    const loadDndComponents = async () => {
      const [dndModule, backendModule] = await Promise.all([
        import('react-dnd'),
        import('react-dnd-html5-backend'),
      ]);

      setDndComponents({
        DndProvider: dndModule.DndProvider,
        HTML5Backend: backendModule.HTML5Backend,
      });
    };
    loadDndComponents();
  }, []);

  // Create initial value based on template to prevent flicker
  const templateValue = React.useMemo(() => {
    if (initialTemplate?.content) {
      return [
        {
          children: [{ text: initialTemplate.name || 'Document' }],
          type: 'h1',
        },
        {
          children: [{ text: '' }],
          type: 'p',
        },
        ...initialTemplate.content.split('\n\n').map((paragraph) => ({
          children: [{ text: paragraph }],
          type: 'p',
        })),
      ];
    }
    return undefined;
  }, [initialTemplate]);

  const editor = useCreateEditor({
    value: templateValue,
  });

  const handleBackClick = () => {
    // Use window.location for direct navigation
    window.location.href = '/home/templates';
  };

  // Render a loading state until DnD components are loaded
  if (!DndComponents) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading editor...</div>
      </div>
    );
  }

  const { DndProvider, HTML5Backend } = DndComponents;

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <AISidebarProvider>
          <VersionHistoryProvider>
            <div className="flex h-screen flex-col">
              {/* Global Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-background sticky top-0 z-50">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1"
                    onClick={handleBackClick}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <VersionHistoryButton />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Fixed Toolbar - Positioned to span the full width */}
              <div className="w-full border-b border-border bg-background z-40 sticky top-[57px]">
                <FixedToolbar>
                  <FixedToolbarButtons />
                </FixedToolbar>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 relative">
                {/* Left Sidebar */}
                <div className="w-64 border-r border-border bg-background p-4 overflow-y-auto flex-shrink-0 z-10">
                  <DocumentOutline editor={editor} />
                </div>

                {/* Main Content Area */}
                <div
                  className="flex-1 flex flex-col relative min-w-0"
                  style={{
                    overflow: 'visible',
                    isolation: 'auto',
                    position: 'static',
                  }}
                >
                  {/* Editor Container */}
                  <EditorContainer
                    id="scroll_container"
                    variant="demo"
                    className="max-w-none flex-1 relative"
                  >
                    <Editor
                      variant="demo"
                      className="text-left min-h-[800px] w-full"
                      autoFocus
                    />

                    <FloatingToolbar>
                      <FloatingToolbarButtons />
                    </FloatingToolbar>

                    {/* Magic Wand Button - positioned within editor container */}
                    <MagicWandButtonComponent />
                  </EditorContainer>
                </div>

                {/* AI Sidebar - positioned at the same level as left sidebar for stability */}
                <AISidebarComponent />
              </div>
            </div>
          </VersionHistoryProvider>
        </AISidebarProvider>
      </Plate>
    </DndProvider>
  );
}
