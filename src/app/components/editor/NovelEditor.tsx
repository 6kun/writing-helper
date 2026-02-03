'use client';

import { forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorBubble,
  StarterKit,
  Placeholder,
  Command,
  type JSONContent,
  handleCommandNavigation,
  renderItems,
  useEditor,
} from 'novel';
import {
  Sparkles,
  FileText,
  ArrowRight,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
} from 'lucide-react';
import { Editor } from '@tiptap/core';
import { useEditorAI } from '../../hooks/useEditorAI';
import { ApiSettings, ContentSettings, REWRITE_OPTIONS } from '../../lib/editor-types';
import { PromptStyle } from '../../lib/types';

interface NovelEditorProps {
  initialContent?: JSONContent;
  onUpdate?: (content: JSONContent) => void;
  apiSettings: ApiSettings;
  promptStyle: PromptStyle;
  contentSettings: ContentSettings;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export interface NovelEditorRef {
  getEditor: () => Editor | null;
  getContent: () => JSONContent | null;
  getText: () => string;
}

// 默认扩展
const extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: { class: 'list-disc list-outside leading-3 -mt-2' },
    },
    orderedList: {
      HTMLAttributes: { class: 'list-decimal list-outside leading-3 -mt-2' },
    },
    listItem: {
      HTMLAttributes: { class: 'leading-normal -mb-2' },
    },
    blockquote: {
      HTMLAttributes: { class: 'border-l-4 border-gray-300 pl-4' },
    },
    codeBlock: {
      HTMLAttributes: { class: 'rounded-md bg-gray-100 p-4 font-mono text-sm' },
    },
    code: {
      HTMLAttributes: { class: 'rounded-md bg-gray-100 px-1.5 py-1 font-mono text-sm' },
    },
    horizontalRule: false,
    dropcursor: { color: '#dbeafe', width: 4 },
    gapcursor: false,
  }),
  Placeholder.configure({
    placeholder: '输入 / 唤出命令菜单，或直接开始写作...',
  }),
  Command.configure({
    suggestion: {
      items: () => [],
      render: renderItems,
    },
  }),
];

// 斜杠命令菜单内容
function SlashCommandMenuContent({
  apiSettings,
  promptStyle,
  contentSettings,
}: {
  apiSettings: ApiSettings;
  promptStyle: PromptStyle;
  contentSettings: ContentSettings;
}) {
  const { editor } = useEditor();
  const { generateAtCursor, continueWriting, isGenerating } = useEditorAI({
    apiSettings,
    promptStyle,
    contentSettings,
  });

  const aiCommands = [
    {
      title: 'AI 生成段落',
      description: '根据主题和风格生成一段内容',
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      command: async () => {
        if (editor && !isGenerating) {
          const topic = contentSettings.topic || window.prompt('请输入主题：');
          if (topic) {
            await generateAtCursor(editor, `写一段关于"${topic}"的内容，约200-300字`);
          }
        }
      },
    },
    {
      title: 'AI 续写',
      description: '根据上文续写内容',
      icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
      command: async () => {
        if (editor && !isGenerating) {
          await continueWriting(editor);
        }
      },
    },
    {
      title: 'AI 生成文章',
      description: '生成完整的文章',
      icon: <FileText className="h-4 w-4 text-green-500" />,
      command: async () => {
        if (editor && !isGenerating) {
          await generateAtCursor(editor, `按照设定的风格和字数要求，生成完整的文章`);
        }
      },
    },
  ];

  const basicCommands = [
    {
      title: '标题 1',
      description: '大标题',
      icon: <Heading1 className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: '标题 2',
      description: '中标题',
      icon: <Heading2 className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: '标题 3',
      description: '小标题',
      icon: <Heading3 className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: '无序列表',
      description: '创建无序列表',
      icon: <List className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      title: '有序列表',
      description: '创建有序列表',
      icon: <ListOrdered className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      title: '引用',
      description: '创建引用块',
      icon: <Quote className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      title: '代码块',
      description: '创建代码块',
      icon: <Code className="h-4 w-4" />,
      command: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: '分割线',
      description: '插入分割线',
      icon: <Minus className="h-4 w-4" />,
      command: () => editor?.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <>
      <EditorCommandEmpty className="px-2 py-1.5 text-sm text-gray-500">
        没有找到命令
      </EditorCommandEmpty>

      <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-b">
        AI 助手
      </div>
      {aiCommands.map((cmd) => (
        <EditorCommandItem
          key={cmd.title}
          value={cmd.title}
          onCommand={cmd.command}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
        >
          {cmd.icon}
          <div className="flex-1">
            <div className="font-medium text-sm">{cmd.title}</div>
            <div className="text-xs text-gray-500">{cmd.description}</div>
          </div>
        </EditorCommandItem>
      ))}

      <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-t border-b mt-1">
        基础格式
      </div>
      {basicCommands.map((cmd) => (
        <EditorCommandItem
          key={cmd.title}
          value={cmd.title}
          onCommand={cmd.command}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
        >
          {cmd.icon}
          <div className="flex-1">
            <div className="font-medium text-sm">{cmd.title}</div>
            <div className="text-xs text-gray-500">{cmd.description}</div>
          </div>
        </EditorCommandItem>
      ))}
    </>
  );
}

// 浮动工具条内容
function BubbleMenuContent({
  apiSettings,
  promptStyle,
  contentSettings,
}: {
  apiSettings: ApiSettings;
  promptStyle: PromptStyle;
  contentSettings: ContentSettings;
}) {
  const { editor } = useEditor();
  const { rewriteSelection, continueWriting, isGenerating } = useEditorAI({
    apiSettings,
    promptStyle,
    contentSettings,
  });

  const handleRewrite = useCallback(
    async (instruction: string) => {
      if (editor && !isGenerating) {
        await rewriteSelection(editor, instruction);
      }
    },
    [editor, isGenerating, rewriteSelection]
  );

  const handleContinue = useCallback(async () => {
    if (editor && !isGenerating) {
      const { to } = editor.state.selection;
      editor.chain().focus().setTextSelection(to).run();
      await continueWriting(editor);
    }
  }, [editor, isGenerating, continueWriting]);

  return (
    <div className="flex items-center gap-1 p-1">
      {REWRITE_OPTIONS.map((option) => (
        <button
          key={option.label}
          className="px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          onClick={() => handleRewrite(option.instruction)}
          disabled={isGenerating}
          title={option.instruction}
        >
          {option.label}
        </button>
      ))}

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
        onClick={handleContinue}
        disabled={isGenerating}
      >
        <ArrowRight className="h-3 w-3" />
        续写
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1" />

      <button
        className="px-2 py-1 text-xs font-bold hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        B
      </button>
      <button
        className="px-2 py-1 text-xs italic hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        I
      </button>
      <button
        className="px-2 py-1 text-xs line-through hover:bg-gray-100 rounded transition-colors"
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      >
        S
      </button>
    </div>
  );
}

// 主编辑器组件
const NovelEditor = forwardRef<NovelEditorRef, NovelEditorProps>(
  (
    {
      initialContent,
      onUpdate,
      apiSettings,
      promptStyle,
      contentSettings,
    },
    ref
  ) => {
    const editorRef = useRef<Editor | null>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
      getContent: () => editorRef.current?.getJSON() || null,
      getText: () => editorRef.current?.getText() || '',
    }));

    // 默认初始内容
    const defaultContent: JSONContent = initialContent || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    };

    return (
      <EditorRoot>
        <EditorContent
          extensions={extensions}
          initialContent={defaultContent}
          immediatelyRender={false}
          onUpdate={({ editor }) => {
            onUpdate?.(editor.getJSON());
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor;
          }}
          className="relative min-h-[500px] w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
            },
          }}
        >
          {/* 斜杠命令菜单 */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-200 bg-white px-1 py-2 shadow-lg">
            <SlashCommandMenuContent
              apiSettings={apiSettings}
              promptStyle={promptStyle}
              contentSettings={contentSettings}
            />
          </EditorCommand>

          {/* 选中文字浮动工具条 */}
          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          >
            <BubbleMenuContent
              apiSettings={apiSettings}
              promptStyle={promptStyle}
              contentSettings={contentSettings}
            />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    );
  }
);

NovelEditor.displayName = 'NovelEditor';

export default NovelEditor;
