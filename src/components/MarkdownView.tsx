import React from 'react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // Parse paragraphs, headings, bullet lists, bold text, links, and tables
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc pl-5 my-2 space-y-1 text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Replace markdown links [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;
    const codeRegex = /`([^`]+)`/g;

    // Process bold segments first
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    // Tokenize text with regex matching
    const combinedRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*[^*]+\*)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchStr = match[0];
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-slate-900">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('[') && matchStr.includes('](')) {
        const linkMatch = matchStr.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={match.index}
              href={linkMatch[2]}
              target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="text-blue-700 underline font-medium hover:text-blue-900 decoration-blue-300 transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        }
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 text-blue-900 border border-slate-200"
          >
            {matchStr.slice(1, -1)}
          </code>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-slate-600">
            {matchStr.slice(1, -1)}
          </em>
        );
      }
      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    // Heading 3: ###
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-base font-bold text-slate-900 mt-3 mb-1.5 font-crest tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
          {formatInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // Heading 2: ##
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2 font-crest tracking-wide border-b border-slate-200 pb-1">
          {formatInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    // Heading 1: #
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-xl font-bold text-slate-900 mt-4 mb-2 font-crest">
          {formatInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Bullet point: - or *
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      listItems.push(line.slice(2));
      continue;
    }

    // Numbered item: 1. 2.
    if (/^\d+\.\s/.test(line)) {
      flushList();
      const dotIndex = line.indexOf('. ');
      elements.push(
        <div key={i} className="flex gap-2 my-1 text-sm text-slate-700">
          <span className="font-semibold text-blue-900 shrink-0">{line.slice(0, dotIndex + 1)}</span>
          <div className="leading-relaxed">{formatInline(line.slice(dotIndex + 2))}</div>
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-4 border-amber-600 bg-amber-50/50 pl-3 py-1 my-2 text-sm italic text-slate-700 rounded-r">
          {formatInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="my-1.5 text-sm leading-relaxed text-slate-700">
        {formatInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="markdown-body space-y-1">{elements}</div>;
};
