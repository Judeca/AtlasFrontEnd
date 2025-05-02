
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';


const extensions = [
  StarterKit,
  Image,
 
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