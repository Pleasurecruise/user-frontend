import { QQ_GROUP } from "@/lib/utils/constant";

export interface QQGroupProps {
  text: string;
}

export default function QQGroupLink({ text }: QQGroupProps) {
  return (
    <a href={QQ_GROUP} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
      {text}
    </a>
  );
}