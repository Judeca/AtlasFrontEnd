import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Dropdown } from './Dropdown'
import api from '@/app/utils/axiosInstance'
import { Save } from 'lucide-react'

interface EditorProps {
    initialContent?: string;
    lessonId: string;
    onSave?: (success: boolean) => void;
  }

export default function Editor({ initialContent = '<p>Welcome Enter your content </p>', lessonId, onSave }: EditorProps) {
    const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
    const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  const handleSave = useCallback(async () => {
    if (!editor) return;
  
    setIsSaving(true);
    try {
      const json = editor.getJSON();
      const html = editor.getHTML();
  
      const response = await api.put(`/lesson/${lessonId}/content`, {
        json,  // Already an object (will be stringified by axios)
        html   // Raw HTML string
      });
  
      setLastSaved(new Date().toISOString());
      if (onSave) onSave(true);
      return response.data;
    } catch (error) {
      console.error('Error saving content:', error);
      if (onSave) onSave(false);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [editor, lessonId, onSave]);

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

 

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-lg bg-gray-50 dark:bg-gray-800">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${editor.isActive('strike') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded ${editor.isActive('code') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Code"
        >
          &lt;&gt;
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          disabled={!editor.can().chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded ${editor.isActive('superscript') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Superscript"
        >
          x<sup>2</sup>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          disabled={!editor.can().chain().focus().toggleSubscript().run()}
          className={`p-2 rounded ${editor.isActive('subscript') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Subscript"
        >
          x<sub>2</sub>
        </button>

        {/* Headings */}
        <Dropdown
  options={[
    { label: 'Paragraph', value: 'paragraph' },
    { label: 'Heading 1', value: '1' },
    { label: 'Heading 2', value: '2' },
    { label: 'Heading 3', value: '3' },
    { label: 'Heading 4', value: '4' },
  ]}
  onSelect={(value) => {
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }}
  activeValue={
    editor.isActive('heading', { level: 1 }) ? '1' :
    editor.isActive('heading', { level: 2 }) ? '2' :
    editor.isActive('heading', { level: 3 }) ? '3' :
    editor.isActive('heading', { level: 4 }) ? '4' : 'paragraph'
  }
  title="Text Style"
  renderOption={(option) => (
    <span className={option.value === 'paragraph' ? '' : 'font-semibold'}>
      {option.label}
    </span>
  )}
/>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Align Left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Align Center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3zm4 4h10v2H7zm-4 4h18v2H3zm4 4h10v2H7z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Align Right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Justify"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/>
          </svg>
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Bullet List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 4h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Numbered List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2 11h3v2H2zm0-7h3v2H2zm0 14h3v2H2zm5-12h15v2H7zm0 7h15v2H7zm0 7h15v2H7z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded ${editor.isActive('taskList') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Task List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3h18v2H3zm0 7h18v2H3zm0 7h18v2H3z"/>
          </svg>
        </button>

        {/* Blocks */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Blockquote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Horizontal Rule"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 11h18v2H3z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Hard Break"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 6v5h5v2h-5v5h-2v-5H5v-2h5V6z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Undo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 18h6v-2H5v2zm-2-5h12v-2H3v2zm8-5h7V6h-7v2z"/>
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Redo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 18h-6v-2h6v2zm2-5H9v-2h12v2zm-8-5H5V6h8v2z"/>
          </svg>
        </button>

        {/* Colors */}
        <Dropdown
          options={[
            { label: 'Black', value: '#000000' },
            { label: 'Red', value: '#ef4444' },
            { label: 'Blue', value: '#3b82f6' },
            { label: 'Green', value: '#10b981' },
            { label: 'Yellow', value: '#f59e0b' },
            { label: 'Purple', value: '#8b5cf6' },
          ]}
          onSelect={(value) => editor.chain().focus().setColor(value).run()}
          activeValue={editor.getAttributes('textStyle').color || '#000000'}
          renderOption={(option) => (
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: option.value }} />
              {option.label}
            </div>
          )}
          title="Text Color"
        />

        <Dropdown
          options={[
            { label: 'None', value: 'transparent' },
            { label: 'Red', value: '#fee2e2' },
            { label: 'Blue', value: '#dbeafe' },
            { label: 'Green', value: '#d1fae5' },
            { label: 'Yellow', value: '#fef3c7' },
            { label: 'Purple', value: '#ede9fe' },
          ]}
          onSelect={(value) => {
            if (value === 'transparent') {
              editor.chain().focus().unsetHighlight().run()
            } else {
              editor.chain().focus().setHighlight({ color: value }).run()
            }
          }}
          activeValue={editor.getAttributes('highlight').color || 'transparent'}
          renderOption={(option) => (
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: option.value }} />
              {option.label}
            </div>
          )}
          title="Highlight"
        />

        {/* Links */}
        <button
          onClick={setLink}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path fill="currentColor" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        {/* Media */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Insert Image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm3-7l2.5-3.2L13 14l3.5-4.5L19 14z"/>
          </svg>
        </button>

        {/* Tables */}
        <button
          onClick={addTable}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Insert Table"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"/>
          </svg>
        </button>
      </div>

      {/* Bubble Menu (appears when selecting text) */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <em>I</em>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded ${editor.isActive('underline') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <u>U</u>
            </button>
            <button
              onClick={setLink}
              className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path fill="currentColor" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="border-x border-b rounded-b-lg bg-white dark:bg-gray-900" />

      {/* Status Bar */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
        <div>
          {editor.getCharacterCount()} characters
        </div>
        <div>
          {editor.isActive('heading', { level: 1 }) && 'Heading 1'}
          {editor.isActive('heading', { level: 2 }) && 'Heading 2'}
          {editor.isActive('heading', { level: 3 }) && 'Heading 3'}
          {editor.isActive('heading', { level: 4 }) && 'Heading 4'}
          {editor.isActive('paragraph') && !editor.isActive('heading') && 'Paragraph'}
        </div>
      </div>
      <button
        onClick={handleSave}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        title="Save"
      >
       <span className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        <span>Save Changes</span>
        </span>
      </button>
    </div>
  )
}