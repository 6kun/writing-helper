import WritingAssistant from './components/WritingAssistant';
import FeatureLayout from './components/FeatureLayout';

export default function Home() {
  return (
    <FeatureLayout
      title="AI 写作助手"
      subtitle="简洁、优雅、专注于内容的智能写作工具"
    >
      <WritingAssistant />
    </FeatureLayout>
  );
}
