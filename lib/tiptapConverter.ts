// utils/tiptapConverter.ts
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
// ... import all your extensions

const extensions = [
  StarterKit,
  Image,
  // ... all your extensions
];

export function jsonToHtml(json: string) {
  try {
    const parsed = JSON.parse(json);
    return generateHTML(parsed, extensions);
  } catch (error) {
    console.error('Error converting JSON to HTML:', error);
    return '<p>Error displaying content</p>';
  }
}