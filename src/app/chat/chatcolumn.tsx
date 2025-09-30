import { ReactNode } from "react";
import { Message } from "./page";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  model: string;
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement>;
};

export function ChatColumn(props: Props): ReactNode {
  const { model, messages, containerRef } = props;
  return (
    <>
      <div className="flex-1 overflow-auto p-4 bg-gray-50" ref={containerRef}>
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 mb-2 text-center">
            {model} responses
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`max-w-[75%] px-3 py-2 rounded-lg break-words ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}>
                  <Markdown remarkPlugins={[[remarkGfm]]}>
                {msg.text}
              </Markdown>
                </div>
              
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
