import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-4 flex items-center space-x-2 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <Italic className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 hover:bg-gray-200 transition ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 hover:bg-gray-200 transition ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 hover:bg-gray-200 transition ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        title="Quote"
      >
        <Quote className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 hover:bg-gray-200 transition disabled:opacity-50"
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 hover:bg-gray-200 transition disabled:opacity-50"
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export const BlogEditor: React.FC<BlogEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-300 rounded-none overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
};