import React from "react";
import { Sparkles, Bot, Loader2, Lightbulb, Code2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const AIInsightsPanel = ({ isAnalyzing, feedback, onAnalyze }) => {
  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#09111d] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
          <Bot size={16} />
          AI Insights
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {isAnalyzing ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 text-sm leading-7 text-slate-300">
        {isAnalyzing ? (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <div className="relative mb-4">
              <Bot size={32} className="text-violet-400/50" />
              <Loader2 size={48} className="absolute -inset-2 animate-spin text-violet-500/30" />
            </div>
            <p className="font-medium text-slate-300">AI is reviewing your code...</p>
            <p className="text-xs">Checking Time/Space complexity and edge cases</p>
          </div>
        ) : feedback ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-[18px] border border-violet-400/20 bg-violet-400/5 p-3 text-violet-200">
              <Lightbulb size={16} className="text-violet-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                Analysis Complete
              </span>
            </div>
          <div className="rounded-[18px] border border-white/5 bg-white/[0.02] p-4 text-slate-300">
            <ReactMarkdown
              components={{
                h3: ({ node, ...props }) => <h3 className="mt-4 mb-2 text-lg font-bold text-violet-300" {...props} />,
                h4: ({ node, ...props }) => <h4 className="mt-3 mb-2 text-base font-bold text-violet-200" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="mb-3 list-inside list-disc space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-3 list-inside list-decimal space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                code: ({ node, inline, className, children, ...props }) =>
                  inline ? (
                    <code className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-xs text-cyan-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-sm text-slate-200">
                      <code {...props}>{children}</code>
                    </pre>
                  ),
              }}
            >
              {feedback}
            </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <Code2 size={48} className="mb-4 opacity-20" />
            <p>No insights yet.</p>
            <p className="text-xs text-center mt-1">Submit your code or click "Analyze Code" <br/> to get personalized hints and complexity breakdown.</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AIInsightsPanel;