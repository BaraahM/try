'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { useEditorRef } from '@udecode/plate/react';
import { FileIcon, ImageIcon, LinkIcon, VideoIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolbarButton } from './toolbar';

interface MediaToolbarButtonProps extends DropdownMenuProps {
  nodeType?: string;
}

export function MediaToolbarButton({
  nodeType,
  ...props
}: MediaToolbarButtonProps) {
  const editor = useEditorRef();

  const handleMediaInsert = (type: string) => {
    switch (type) {
      case 'image':
        // Handle image insertion
        console.log('Image insertion not implemented yet');
        break;
      case 'video':
        // Handle video insertion
        console.log('Video insertion not implemented yet');
        break;
      case 'file':
        // Handle file insertion
        console.log('File insertion not implemented yet');
        break;
      case 'link':
        // Handle link insertion
        console.log('Link insertion not implemented yet');
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton tooltip="Insert media" isDropdown>
          <ImageIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => handleMediaInsert('image')}>
            <ImageIcon />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMediaInsert('video')}>
            <VideoIcon />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMediaInsert('file')}>
            <FileIcon />
            File
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMediaInsert('link')}>
            <LinkIcon />
            Link
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
