import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, posToDOMRect } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize, FontFamily, LineHeight, Color } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

/**
 * Kendi “balon” toolbar’ımız:
 * - Metin seçildiğinde görünür, seçim hareket edince konumu güncellenir
 * - BubbleMenu gerektirmez, tüm Tiptap sürümleriyle uyumludur
 */
function SelectionBubble({ editor }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  // Konumu güncelle
  const update = () => {
    if (!editor) return;
    const { state, view } = editor;
    const { from, to, empty } = state.selection;

    if (empty || !view.hasFocus()) {
      setVisible(false);
      return;
    }

    // Seçim rect’ini hesapla
    const rect = posToDOMRect(view, from, to);
    const padding = 8;
    const bubble = containerRef.current;

    const top = window.scrollY + rect.top - (bubble?.offsetHeight || 40) - padding;
    const left = window.scrollX + rect.left + rect.width / 2 - (bubble?.offsetWidth || 220) / 2;

    setCoords({ top: Math.max(top, 8), left: Math.max(left, 8) });
    setVisible(true);
  };

  useEffect(() => {
    if (!editor) return;

    const events = [
      editor.on('selectionUpdate', update),
      editor.on('transaction', update),
      editor.on('focus', update),
      editor.on('blur', () => setVisible(false)),
    ];

    // Scroll/resize’larda da konumu tazele
    const onScroll = () => visible && update();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);

    return () => {
      events.forEach((off) => off?.());
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: 8,
        boxShadow: '0 10px 30px rgba(0,0,0,.12)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
      onMouseDown={(e) => e.preventDefault()} // fokus kaybını engelle
    >
      <button
        className={editor.isActive('bold') ? 'btn btn-dark btn-sm' : 'btn btn-light btn-sm'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        B
      </button>
      <button
        className={editor.isActive('italic') ? 'btn btn-dark btn-sm' : 'btn btn-light btn-sm'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        I
      </button>

      <select
        className="form-select form-select-sm"
        defaultValue=""
        onChange={(e) => editor.chain().focus().setMark('textStyle', { fontFamily: e.target.value }).run()}
        title="Yazı tipi"
      >
        <option value="" disabled>Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value='"Times New Roman", Times, serif'>Times</option>
        <option value='"Courier New", Courier, monospace'>Courier</option>
      </select>

      <select
        className="form-select form-select-sm"
        defaultValue=""
        onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()}
        title="Boyut"
      >
        <option value="" disabled>Boyut</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
      </select>

      <input
        type="color"
        className="form-control form-control-color"
        title="Yazı rengi"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />

      <button
        className={editor.isActive('bulletList') ? 'btn btn-dark btn-sm' : 'btn btn-light btn-sm'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Madde listesi"
      >
        • List
      </button>
      <button
        className={editor.isActive('orderedList') ? 'btn btn-dark btn-sm' : 'btn btn-light btn-sm'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numaralı liste"
      >
        1. List
      </button>

      <button className="btn btn-light btn-sm" onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Sola">
        ⬅︎
      </button>
      <button className="btn btn-light btn-sm" onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Ortala">
        ⬌
      </button>
      <button className="btn btn-light btn-sm" onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Sağa">
        ➡︎
      </button>
      <button className="btn btn-light btn-sm" onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="İki yana yasla">
        ☰
      </button>
    </div>
  );
}

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      // Text style tabanlı özellikler
      TextStyle,
      FontSize,     // İstersen sadece inline stil ile de çözebilirsin; burada extension’u ekliyoruz
      LineHeight,   // İleride gerekirse kullanırsın
      Color,
      FontFamily,
      BulletList,
      OrderedList,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-editor border rounded p-3 min-h-[160px] focus:outline-none',
      },
    },
  });

  // Dışarıdan gelen value değişirse senkronize et
  useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>', false);
    }
  }, [value, editor]);

  // Mutlak konumlu balon için bir sarmalayıcı
  return (
    <div style={{ position: 'relative' }}>
      {editor ? <SelectionBubble editor={editor} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
