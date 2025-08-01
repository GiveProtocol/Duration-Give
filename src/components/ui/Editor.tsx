import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

interface EditorProps {
  content: string;
  onChange: (_content: string) => void;
  className?: string;
  placeholder?: string;
}

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  onClick,
  active,
  icon: Icon,
  title,
}) => (
  <Button
    type="button"
    variant="secondary"
    onClick={onClick}
    className={cn("p-2", active && "bg-indigo-100 text-indigo-900")}
    title={title}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export const Editor: React.FC<EditorProps> = ({
  content: _content,
  onChange,
  className,
  placeholder = "Start writing...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 hover:text-indigo-800 underline",
        },
      }),
    ],
    content: _content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none",
        placeholder,
      },
    },
  });

  const handleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const handleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleHeading1 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }, [editor]);

  const handleHeading2 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const handleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const handleLink = useCallback(() => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border border-gray-200 rounded-lg", className)}>
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <MenuButton
          onClick={handleBold}
          active={editor.isActive("bold")}
          icon={Bold}
          title="Bold"
        />
        <MenuButton
          onClick={handleItalic}
          active={editor.isActive("italic")}
          icon={Italic}
          title="Italic"
        />
        <MenuButton
          onClick={handleHeading1}
          active={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <MenuButton
          onClick={handleHeading2}
          active={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <MenuButton
          onClick={handleBulletList}
          active={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <MenuButton
          onClick={handleOrderedList}
          active={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Numbered List"
        />
        <MenuButton
          onClick={handleLink}
          active={editor.isActive("link")}
          icon={LinkIcon}
          title="Add Link"
        />
        <div className="ml-auto flex gap-1">
          <MenuButton onClick={handleUndo} icon={Undo} title="Undo" />
          <MenuButton onClick={handleRedo} icon={Redo} title="Redo" />
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] max-h-[600px] overflow-y-auto bg-indigo-50"
      />
    </div>
  );
};
