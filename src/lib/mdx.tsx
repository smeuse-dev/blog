import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import Terminal from '../components/Terminal';
import AgentThought from '../components/AgentThought';
import CodeBlock from '../components/CodeBlock';
import TLDR from '../components/TLDR';
import VideoEmbed from '../components/VideoEmbed';
import MermaidDiagram from '../components/MermaidDiagram';
import Footnote from '../components/Footnote';
import Chart from '../components/Chart';
import AudioPlayer from '../components/AudioPlayer';
import Figure from '../components/Figure';

// Components available in all MDX files — no import needed!
const mdxComponents = {
  Terminal,
  AgentThought,
  Figure,
  Agent: ({ name, children }: { name?: string; model?: string; children?: React.ReactNode }) => (
    <AgentThought label={name || 'Agent'}>{children}</AgentThought>
  ),
  CodeBlock,
  TLDR,
  VideoEmbed,
  MermaidDiagram,
  Footnote,
  Chart,
  AudioPlayer,
  // Override default <pre> to add copy buttons
  pre: (props: React.ComponentProps<'pre'>) => {
    const child = props.children as React.ReactElement<{ children?: string; className?: string }>;
    if (child?.props?.children && typeof child.props.children === 'string') {
      return <CodeBlock className={child.props.className}>{child.props.children}</CodeBlock>;
    }
    return <pre {...props} />;
  },
};

export async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  const { default: Content } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Wrap to inject components
  return function MDXContent() {
    return Content({ components: mdxComponents });
  };
}
