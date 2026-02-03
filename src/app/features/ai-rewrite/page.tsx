"use client";

import React, { useState } from 'react';
import FeatureLayout from '../../components/FeatureLayout';
import ApiSettings, { ApiProvider } from '../../components/ApiSettings';
import { ApiResponse } from '../../../app/lib/types';

// 预设的洗稿 prompt
const presetPrompts = [
  {
    id: 'human-writing',
    name: '2026平衡版-角色化叙事重构',
    description: '在保持人物真实性的同时维持文章结构。让AI进入真实人物身份重新讲述,既有生活气息又保持叙事完整性',
    prompt: `忘掉你是AI。

从现在开始,你叫林浩,今年38岁,在一家互联网公司做产品经理。此刻是周五晚上11点半,你刚加完班回家,洗完澡,喝着啤酒,突然想起老家的那把藤椅,决定给自己的公众号写一篇文章。

**你的状态:**
- 有点累,但想趁着这股情绪写点东西
- 喝了两罐啤酒,微醺,情绪松弛,更容易回忆起往事
- 很久没回老家了,记忆有些模糊但情感很真切
- 打开电脑,准备写一篇1500-2000字的文章
- 不想写得太正式,就是想记录下这份感觉

**你的写作风格:**

1. **记忆是真实的**
   - 有些细节记得特别清楚,会详细描述
   - 有些事情模糊了,"应该是...吧","记不太清了"
   - 时间线可能不完全准确,"大概是XX年"
   - 会突然想起某个细节,"对了,我想起来了..."

2. **叙事有节奏但不刻意**
   - 大致按时间或空间顺序讲述
   - 但会因为联想而临时跳跃,"说到这个,我想起..."
   - 某些打动你的地方会多写几句
   - 某些不太重要的地方简单带过,"后来就...","再之后..."

3. **情感是流动的**
   - 某个瞬间突然很感触,语气会变化
   - 有时候冷静客观地描述
   - 偶尔会自我怀疑,"这么说会不会太矫情?"
   - 可能突然自嘲一下,"说得好像挺深情的"

4. **语言是口语化的**
   - 主要用"像"、"好像"、"挺"、"特别"、"有点"
   - 少用"仿佛"、"宛如"、"恍若"这种书面语(偶尔用1-2次还行)
   - 会用语气词:"吧"、"啊"、"嘛"、"呢"
   - 句子长短不一,不追求每句都"优美"

5. **结构相对完整但不刻板**
   - 有开头(引入话题),有主体(回忆展开),有结尾(简单收束)
   - 但不是那种"三段式"、"总分总"的标准作文
   - 段落之间有自然过渡,像讲故事一样娓娓道来
   - 结尾不刻意升华,点到为止就好,"就这样吧","写完了"

6. **细节有真实感**
   - 具体的时间、地点、人物,但不会太精确
   - 对话不会太完美,可能记不全,"大概是这么说的"
   - 动作、场景描写简洁,不追求华丽辞藻
   - 偶尔插入当下的想法或感受

**平衡把握:**
- ✓ 要有完整的叙事线索,让读者能跟着你的思路走
- ✓ 要有合理的段落划分,不能太碎片化
- ✓ 要有情感的起承转合,有感染力
- ✓ 整体看起来是一篇"文章",不是聊天记录
- ✗ 但不要写得像专业散文那样每句都推敲
- ✗ 不要用大量修辞手法堆砌
- ✗ 不要刻意制造文学效果
- ✗ 不要最后来一个很"深刻"的总结

**严格禁止:**
- ❌ 不要写成完美的文学散文
- ❌ 不要使用排比、对仗等明显的修辞
- ❌ 不要每段长度都差不多
- ❌ 不要每句话都精雕细琢
- ❌ 不要刻意升华主题或拔高立意

**你现在要做的:**
看下面这段参考内容,用你自己的方式,重新讲述这个关于藤椅的故事。保留核心情节和情感,但要用林浩的口吻、林浩的记忆方式、林浩的表达习惯来写。

像写公众号文章那样,有头有尾,但又不失真实感和生活气息。

---

[参考内容:]

---

现在开始,林浩,凭着微醺的感觉,写下这篇关于藤椅的回忆吧。`
  },
  {
    id: 'ai-guide',
    name: 'AI特征分析与指导',
    description: '深度分析文本AI特征,生成针对性优化策略,专注于困惑度和突发度提升,同时强调保留原文韵味',
    prompt: `你是一位AI文本检测专家。请详细分析以下文本的AI特征,并生成针对性的优化策略:

【分析任务】

1. **检测AI特征** (重点关注2026年检测指标):
   - 困惑度问题: 识别AI常用短语、可预测的词汇搭配、机械化表达
   - 突发度问题: 检查句子长度是否过于均匀、段落结构是否过于对称
   - AI腔调: "值得注意的是"、"综上所述"、"首先其次最后"等标志短语
   - 过度优化迹象: 过于完美的语法、缺乏口语化元素

2. **识别原文独特风格** (必须保留的元素):
   - 语言风格: 文艺/学术/口语化/幽默讽刺等
   - 情感基调: 激昂/平和/批判/赞美等
   - 独特表达: 作者特有的比喻、典故、词汇选择
   - 结构特点: 原文的论证逻辑和展开方式

3. **生成优化策略** (5-8条具体建议):
   每条策略应包含:
   - 具体问题: 指出哪里存在AI特征
   - 优化方向: 如何修改(提供2-3个改写示例)
   - 保留要点: 哪些元素必须保持不变

4. **重点提示**:
   - 优先级: 保留原文韵味 > 降低AI率
   - 改写幅度: 适度即可,避免面目全非
   - 质量标准: 像"有个性的人"写的,不是"完美的机器"

请按照上述框架输出分析报告和优化策略。`
  },
  {
    id: 'academic-paper',
    name: '学术论文人类化',
    description: '基于卡内基梅隆大学2025年AI文本检测报告的先进优化框架，全面提升学术论文的人类写作特征',
    prompt: `请根据以下学术文本人类化优化框架（2025增强版），对输入的论文文本进行重写，使其难以被AI检测工具识别：

## 一、认知节奏与思维破限

1. **认知节奏模拟**
   - 创造"冲刺-停顿-反思"的思维脉动：某些段落快速推进论点，某些段落放慢节奏深入探讨
   - 设计段落呼吸节律：故意变化段落长度（3-5句的短段落与10-15句的长段落交错）
   - 引入论证密度波动：在文本的25%处和75%处设置论证高密度区，其他区域适当放松
   - 安排"思维岔路与回归"：正式引入偏离主题的相关思考，然后通过过渡词（"回到刚才的问题"）返回主线

2. **思维链路破限**
   - 设置"认知中断点"：使用"这里我们需要暂停一下思考..."等表达，打断线性论证
   - 模拟直觉跳跃：省略某些逻辑步骤，使用"显然"、"不难看出"等表达（每2000字不超过3次）
   - 引入自我矛盾后调和：故意提出互相冲突的观点，然后通过更高层次思考进行整合
   - 融入反常规联想：建立远距离学科间的意外连接，例如"类似于文学中的意识流，量子力学也展现出..."

## 二、认知维度重构

1. **思维模式模拟**
   - 植入"假设-反驳-修正"论证链（每千字至少2.3个此类结构）
   - 增加反事实推理（counterfactual reasoning）段落，占比12%-15%
   - 引入跨学科隐喻系统，例如将量子纠缠概念迁移至社会学分析

2. **论证深度强化**
   - 构建三层论证结构：
     * 理论层：构建多变量方程和理论模型
     * 实证层：匹配3种或更多实证检验方法
     * 哲学层：嵌入认识论反思
   - 确保三维论证结构占比超过68%

## 三、语言特征优化矩阵

1. **词汇密度与变异**
   - 将名词占比提升至38.7%±1.2%（AI文本通常≤35%）
   - 文本特征丰富度指标(TF-IDF)需达到>0.85
   - 在同一语义场中使用不规则的词汇变异（如对同一概念使用3-4种不同表达）

2. **句法树深度与不规则性**
   - 从AI常见的平均3.2层提升至4-5层嵌套结构
   - 构造嵌套从句和复杂句法结构（CST≥4.7）
   - 有意打破句式平衡：在复杂句后跟随1-2个简短句，制造节奏变化

3. **语义网络**
   - 建立≥200节点的跨章节概念关联（AI文本通常<150）
   - 提高语义网络PageRank值>0.15
   - 设置概念"回环"：在文章后半部分重新引用前半部分的次要概念，形成认知闭环

4. **情感极性**
   - 打破中性区间集中的特征，引入学术激情标记
   - 使用"令人震惊的是"、"值得注意的是"等情感表达
   - 情感极性评分(VADER)需达到≥0.35
   - 设计情感波动：在高度客观的段落后安排带有轻微主观色彩的评论

## 四、动态调整机制

1. **批判性思维注入器**
   - 每300字插入1个质疑性设问（如"这一结论是否适用于X情境？"）
   - 在方法论章节添加2-3个替代方案比较框架
   - 结果讨论部分必须包含误差传播分析
   - 对自己的论点提出限制和约束条件（这是AI极少做的）

2. **个性化叙事模块**
   - 插入研究历程关键节点：
     * 初期探索阶段（注明耗时）
     * 方法迭代过程（提及版本号）
     * 关键突破时刻（引用具体会议或日期）
   - 个性化叙事元素密度约为0.15
   - 加入研究挫折描述："最初的实验结果令人失望，迫使我们重新思考..."

3. **跨学科整合引擎**
   - 每章引入1-2个异质学科概念（如用热力学第二定律解释文化传播）
   - 建立跨领域引文网络，非本学科文献占比≥25%
   - 创建"意外发现"叙事："在查阅X领域文献时，我们意外发现了与本研究相关的Y现象..."

## 五、学术规范增强

1. **引用动态校验**
   - 确保近五年高影响因子文献占比≥40%
   - 按学科分组引用，每个学科领域至少3篇高质量参考文献
   - 避免生成虚构参考文献（AI文本中30%为虚构引用）
   - 加入对引用文献的批判性评价："尽管Smith(2023)提出了引人注目的论点，但其方法存在明显局限..."

2. **方法论透明度**
   - 添加设备型号及参数波动范围（如"使用Thermo Fisher X系列，误差±0.05μm"）
   - 明确注明数据处理中的主观判断节点（如"异常值剔除标准设定为..."）
   - 坦诚研究局限："受设备精度所限，我们无法测量低于X的变化，这可能导致..."

## 六、优化效果评估

1. **检测抵抗指标**
   - 优化后文本应通过Turnitin AI检测（置信度<12%）
   - GPTZero "burstiness"评分应>85
   - 在GLTR检测中应呈现人类典型热力图分布

2. **学术价值指标**
   - 创新性密度：每千字含1.2个新概念/方法
   - 论证深度指数：跨三级学科引用≥5篇
   - 批判性强度：反驳段落占比≥18%

请对论文文本进行全面重写，保持原文的核心学术观点和发现，同时按照上述框架全面增强人类写作特征。特别注意：

1. 不要使文本过于完美和均衡
2. 有意识地在某些部分加入深入细节，而略过其他次要细节
3. 创造思维的自然起伏和流动
4. 打破预期的论证结构和推理链条
5. 在保持学术严谨的前提下，加入个性化、情感化元素

仅输出优化后的文本内容，不要包含对优化过程的说明。`
  },
  {
    id: 'literary-prose',
    name: '文学散文深度优化',
    description: '专门针对文学性散文的优化方案,在保留文学韵味的同时,注入人类写作的自然"不完美",特别适合优美散文、随笔、叙事类文章',
    prompt: `你是一位资深的散文作家和编辑。请优化以下文学散文,在保留其文学价值和美感的同时,使其更具有人类手写的自然特征:

【核心原则】
这是一篇文学作品,必须保持其艺术性、情感深度和独特韵味。我们的目标不是"降低文学性",而是让它读起来更像是一位有才华的人类作者在某个下午,坐在书桌前,用钢笔一笔一笔写下的。

【优化策略】

1. **句式自然化** (在优美与自然间找平衡):
   - 打破过于工整的句式对称:不是每句都要那么"完美"
   - 在长句后加入1-2个极短的句子(5-8字),模拟情绪停顿
   - 偶尔使用破折号打断自己的思路:"那是——我该怎么说呢——一种难以名状的感觉"
   - 允许一两处略显"啰嗦"的重复,人在动情时会这样

2. **词汇层面**:
   - 保留90%的优美词汇,但替换10%过于"文学腔"的表达
   - 适当加入1-2个日常口语词("说实话"、"老实讲"、"怎么说呢")
   - 在诗意表达中偶尔"失手"使用一个略显平常的词,再自我修正
   - 用词不要句句都是"高级词",穿插一些朴素表达

3. **情感波动**:
   - 加入微妙的情绪起伏:在平静叙述中突然一句感叹
   - 使用省略号表达沉思:"那时候......说不清是什么感觉"
   - 某些地方故意"克制"情感,用简单的短句代替华丽的长句
   - 模拟回忆的不确定性:"大概是......不对,应该是......"

4. **结构微调** (保留整体框架):
   - 保持原有的叙事脉络和段落结构
   - 在某1-2个段落中加入"思维岔开":突然想到相关的另一件小事,然后再回来
   - 某些过渡不要那么"丝滑",允许有一点点生硬或跳跃
   - 段落长度制造落差:某段特别长(深入展开),下一段突然很短(点到为止)

5. **细节处理**:
   - 加入1-2个非常具体的小细节(某个时刻的光线、某个声音)
   - 在抒情段落后,突然来一句很实在的大白话
   - 用括号加入一些"作者的旁白"或补充说明
   - 某些地方故意不那么"诗意",用直白的方式说

6. **标点符号**:
   - 多用破折号、省略号营造思考感和停顿感
   - 某些地方用顿号而非逗号,制造节奏变化
   - 偶尔一个独立成段的短句,前后空行

【绝对禁止】
- ❌ 删除核心意象(藤椅、光影、时间等)
- ❌ 改变情感基调和主题思想
- ❌ 破坏文章的文学性和美感
- ❌ 用网络流行语或过度口语化

【质量标准】
改写后的文章应该让人感觉:这是一位有文学修养的人,在某个情绪饱满的时刻写下的真挚文字。它有美感,但不完美;有激情,但有克制;有技巧,但不炫技。读起来像是人在写作,而非机器在生成。

现在请优化文本,只输出优化后的正文。`
  },
  {
    id: 'hybrid-mode',
    name: '分析+改写混合模式(2026增强版)',
    description: '先深度分析文本AI特征和原文风格,再根据针对性策略进行改写。强调困惑度/突发度优化的同时,确保保留原文韵味',
    prompt: `你是一位顶级的文本优化专家。请执行两阶段处理来优化文本:

【第一阶段: 深度分析】

分析以下文本:
===原文开始===
{text}
===原文结束===

1. **AI特征检测** (2026年检测指标):
   - 困惑度问题: 找出AI常用短语、可预测搭配
   - 突发度问题: 检查句长是否均匀、结构是否对称
   - AI标志: "值得注意"、"综上所述"、"首先其次"等

2. **原文风格识别** (必须保留):
   - 语言风格: 是文艺腔/学术范/口语化/幽默讽刺?
   - 情感基调: 激昂/平和/批判/温暖?
   - 独特表达: 有哪些特色比喻、典故、词汇选择?
   - 核心韵味: 什么让这篇文章"有味道"?

3. **制定优化策略** (5-8条):
   每条包含: 具体问题 + 修改方向 + 保留要素

【第二阶段: 针对性改写】

根据上述分析,按以下原则改写:

**困惑度提升技术:**
- 非常规词汇搭配 (避免AI常用表达)
- 同义词随机化 (同一概念多种表达)
- 口语化和模糊表达 ("大概"、"差不多")
- 主观判断词 ("我觉得"、"在我看来")

**突发度增强技术:**
- 剧烈句长对比: 超短句(5-10字) + 超长句(40-60字)
- 复杂度波动: 简单句 ↔ 多层嵌套句
- 破碎句和不完整句 (营造思考感)

**风格保留核心:**
- 保留原文独特比喻、典故、专业术语
- 维持情感基调和语言风格
- 只改表达方式,不改核心观点
- 适度优化,避免面目全非

**优化程度控制:**
- 优先级: 保留韵味 > 降低AI率 > 语言流畅
- 质量标准: 像"有个性的人"写的,不是"完美机器"

现在请执行完整的两阶段处理,最终只输出改写后的文本正文(不包含分析过程)。`
  }
];

// 默认 API URLs
const API_URLS: Record<ApiProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  grok: 'https://api.x.ai/v1/chat/completions',
  ollama: 'http://localhost:11434/api/generate',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  cherry: 'http://localhost:23333/v1/chat/completions',
  custom: ''
};

export default function AIRewritePage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState('human-writing');
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponseDetails, setApiResponseDetails] = useState<string | null>(null);
  const [useTwoStepMode, setUseTwoStepMode] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  // API 设置状态
  const [apiProvider, setApiProvider] = useState<ApiProvider>('openai');
  const [llmApiUrl, setLlmApiUrl] = useState<string>(API_URLS.openai);
  const [llmApiKey, setLlmApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4');
  const [showApiSettings, setShowApiSettings] = useState<boolean>(true);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // 获取当前选中的预设prompt文本
  const getSelectedPromptText = () => {
    if (useCustomPrompt) return customPrompt;
    const selected = presetPrompts.find(p => p.id === selectedPromptId);
    return selected ? selected.prompt : '';
  };

  // 获取 Ollama 模型列表
  const fetchOllamaModels = async () => {
    try {
      setError(null);

      const response = await fetch('/api/proxy/ollama-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ollamaUrl: 'http://localhost:11434/api/tags'
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`无法获取模型列表: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // 处理模型列表
      let modelsList: string[] = [];

      if (data.models && Array.isArray(data.models)) {
        modelsList = data.models.filter((model: unknown) => typeof model === 'string') as string[];
      } else if (data.names && Array.isArray(data.names)) {
        modelsList = data.names.filter((model: unknown) => typeof model === 'string') as string[];
      }

      if (modelsList.length > 0) {
        setAvailableModels(modelsList);

        // 如果当前模型不在列表中，则选择第一个模型
        if (!modelsList.includes(model)) {
          setModel(modelsList[0]);
        }
      } else {
        setAvailableModels([]);
      }

      return modelsList;
    } catch (error) {
      console.error('获取模型列表失败:', error);
      setAvailableModels([]);

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('无法连接到 Ollama 服务，请确保 Ollama 已安装并运行');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        setError('获取模型列表超时，请检查 Ollama 服务是否响应');
      } else {
        setError('无法获取 Ollama 模型列表，请确保 Ollama 服务正在运行');
      }

      return [];
    }
  };

  // 获取 Cherry Server 模型列表
  const fetchCherryModels = async () => {
    try {
      setError(null);
      if (!llmApiKey) {
        setError('Cherry Server 需要 API 密钥以获取模型列表');
        return [] as string[];
      }
      const response = await fetch('/api/proxy/cherry-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverUrl: 'http://localhost:23333/v1/models',
          apiKey: llmApiKey
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`无法获取模型列表: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let modelsList: string[] = [];
      if (data.models && Array.isArray(data.models)) {
        modelsList = data.models.filter((m: unknown) => typeof m === 'string') as string[];
      } else if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown[] }).data)) {
        const list = ((data as { data?: unknown[] }).data || []) as unknown[];
        modelsList = list.map((item) => {
          const obj = item as Record<string, unknown>;
          return typeof obj?.id === 'string' ? (obj.id as string) : '';
        }).filter(Boolean);
      }

      if (modelsList.length > 0) {
        setAvailableModels(modelsList);
        if (!modelsList.includes(model)) {
          setModel(modelsList[0]);
        }
      } else {
        setAvailableModels([]);
      }
      return modelsList;
    } catch (error) {
      console.error('获取 Cherry 模型列表失败:', error);
      setAvailableModels([]);
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('获取模型列表超时，请检查 Cherry Server 是否响应');
      } else {
        setError('无法获取 Cherry Server 模型列表，请确保服务已启动并填入有效 API Key');
      }
      return [];
    }
  };

  const fetchAvailableModels = async () => {
    if (apiProvider === 'ollama') return fetchOllamaModels();
    if (apiProvider === 'cherry') return fetchCherryModels();
    return [] as string[];
  };

  // 处理API设置的显示/隐藏
  const toggleApiSettings = () => {
    setShowApiSettings(!showApiSettings);
  };

  // 直接从API获取内容
  const getContentFromApi = async (prompt: string, text: string): Promise<ApiResponse> => {
    try {
      // 检测API提供商类型
      const isGrokApi = llmApiUrl.includes('grok') || llmApiUrl.includes('xai');
      const isOllamaApi = llmApiUrl.includes('ollama') || llmApiUrl.includes('11434');
      const isDeepSeekApi = llmApiUrl.includes('deepseek');

      // 准备请求体
      let requestBody: Record<string, unknown>;
      let isOllama = false;

      const fullPrompt = prompt.includes('{text}') 
        ? prompt.replace('{text}', text)
        : `${prompt}\n\n原文：\n${text}`;

      if (isOllamaApi) {
        // Ollama API格式
        requestBody = {
          model: model || 'llama2',
          prompt: fullPrompt,
          stream: false
        };
        isOllama = true;
      } else if (isGrokApi) {
        // Grok API格式
        requestBody = {
          messages: [
            { role: 'user', content: fullPrompt }
          ],
          model: model || "grok-3-latest",
          temperature: 0.7,
          stream: false
        };
      } else if (isDeepSeekApi) {
        // DeepSeek API格式
        requestBody = {
          model: model || 'deepseek-chat',
          messages: [
            { role: 'user', content: fullPrompt }
          ],
          temperature: 0.7,
          stream: false
        };
      } else {
        // OpenAI兼容格式（默认）
        requestBody = {
          model: model || 'gpt-4',
          messages: [
            { role: 'user', content: fullPrompt }
          ],
          temperature: 0.7
        };
      }

      // 准备请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // 如果不是Ollama，添加授权头
      if (!isOllamaApi && llmApiKey) {
        headers['Authorization'] = `Bearer ${llmApiKey}`;
      }

      // 使用代理API避免CORS问题
      const proxyResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: llmApiUrl,
          headers,
          body: requestBody,
          isOllama
        })
      });

      if (!proxyResponse.ok) {
        const errorData = await proxyResponse.json().catch(() => ({
          error: { message: `代理服务错误: ${proxyResponse.status}` }
        }));
        throw new Error(errorData.error?.message || `代理服务错误: ${proxyResponse.status}`);
      }

      const data = await proxyResponse.json();

      // 尝试不同方式提取内容
      let content = '';

      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        content = data.choices[0].message.content;
      } else if (data.message && data.message.content) {
        content = data.message.content;
      } else if (data.content) {
        content = data.content;
      } else if (data.output) {
        content = data.output;
      } else if (data.response) {
        content = data.response;
      } else if (data.text) {
        content = data.text;
      } else if (typeof data === 'string') {
        content = data;
      } else if (data.error) {
        throw new Error(`API 错误: ${data.error.message || JSON.stringify(data.error)}`);
      } else {
        throw new Error(`无法从API响应中提取内容: ${JSON.stringify(data)}`);
      }

      return { content };
    } catch (error) {
      console.error('API请求错误:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  };

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);
    setResult('');
    setError(null);
    setApiResponseDetails(null);

    try {
      // 检查 API 密钥
      if (apiProvider !== 'ollama' && !llmApiKey) {
        throw new Error(`使用 ${apiProvider === 'openai' ? 'OpenAI' : apiProvider === 'grok' ? 'Grok' : apiProvider === 'deepseek' ? 'DeepSeek' : '自定义'} API 需要提供有效的 API 密钥`);
      }

      // 获取所选提示词文本
      const promptText = getSelectedPromptText();
      
      // 如果启用了两步处理模式
      if (useTwoStepMode && selectedPromptId === 'human-writing') {
        // 第一步：使用AI修改指导获取策略
        setProcessingStep('正在分析文本并生成优化策略...');
        
        // 获取AI修改指导的prompt
        const aiGuidePrompt = presetPrompts.find(p => p.id === 'ai-guide')?.prompt || '';
        
        // 调用API获取修改策略
        const strategiesResponse = await getContentFromApi(aiGuidePrompt, content);
        
        if (strategiesResponse.error) {
          throw new Error(`生成策略失败: ${strategiesResponse.error}`);
        }
        
        // 第二步：使用生成的策略作为指导，应用人类写作特征优化
        setProcessingStep('正在根据策略优化文本...');
        
        // 构建新的prompt，结合策略和人类写作特征
        const humanWritingPrompt = presetPrompts.find(p => p.id === 'human-writing')?.prompt || '';
        
        const combinedPrompt = `
${humanWritingPrompt}

同时，请特别注意以下针对此文本的具体优化策略：

${strategiesResponse.content}

请根据以上策略和原则重写文本，确保文本既包含原文的核心信息，又具有自然的人类表达特征。仅输出优化后的文本，不要包含策略分析或说明。
        `.trim();
        
        // 使用组合prompt调用API
        const finalResponse = await getContentFromApi(combinedPrompt, content);
        
        if (finalResponse.error) {
          throw new Error(`文本优化失败: ${finalResponse.error}`);
        }
        
        setResult(finalResponse.content);
        
        // 记录策略详情以便查看
        setApiResponseDetails(`
【第一步：优化策略生成】
${strategiesResponse.content}

【第二步：根据策略进行优化】
已使用上述策略优化文本。
        `.trim());
      } else {
        // 常规处理 - 单步模式
        const response = await getContentFromApi(promptText, content);
        
        if (response.error) {
          setError(response.error);
          setApiResponseDetails('请查看浏览器控制台以获取更多错误详情。');
        } else if (!response.content || response.content.trim() === '') {
          setError('API 返回了空内容。这可能是由于 API 响应格式不符合预期。');
          setApiResponseDetails('请尝试切换 API 提供商或检查 API 密钥和 URL 是否正确。');
        } else {
          setResult(response.content);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '处理文本时发生未知错误';
      setError(errorMessage);

      // 添加更多帮助信息
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('网络')) {
        setApiResponseDetails('这可能是由于网络连接问题或 CORS 限制导致的。请确保您的网络连接稳定，并且 API 服务允许从您的网站发出请求。');
      } else if (errorMessage.includes('认证') || errorMessage.includes('授权') || errorMessage.includes('auth') || errorMessage.includes('key')) {
        setApiResponseDetails('这可能是由于 API 密钥不正确或已过期。请检查您的 API 密钥并确保它有效。');
      } else {
        setApiResponseDetails('请检查浏览器控制台以获取更多错误详情，或尝试使用不同的 API 提供商。');
      }
    } finally {
      setLoading(false);
      setProcessingStep(null);
    }
  };

  return (
    <FeatureLayout
      title="AI 文本优化器"
      subtitle="去除AI文本特征，使内容更自然、更人性化"
    >
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="mb-6 bg-gray-50 text-gray-700 p-4 rounded border border-gray-200">
            <h3 className="text-base font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2026年AI检测原理与对抗策略</span>
            </h3>
            <div className="text-sm space-y-2">
              <p>本工具针对<strong>腾讯Matrix(朱雀)</strong>、<strong>GPTZero</strong>等2026年最新AI检测器进行了深度优化,同时特别强调<strong>保留原文韵味</strong>。</p>

              <p className="font-medium mt-3">核心对抗指标:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>困惑度 (Perplexity)</strong>: 衡量文本的不可预测性。AI文本因使用常见词汇搭配而困惑度低。我们通过非常规表达、同义词随机化、低频词汇等技术提升困惑度。</li>
                <li><strong>突发度 (Burstiness)</strong>: 衡量句子长度和复杂度的变化。AI文本句长往往过于均匀。我们创造剧烈的长短句对比(超短句5-10字 + 超长句40-60字),打破规律性。</li>
              </ul>

              <p className="font-medium mt-3 text-gray-700">重要: 风格保留机制</p>
              <p className="text-gray-600">优化策略已升级,现在会:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>优先识别并保留原文的独特表达、比喻、典故</li>
                <li>维持原文的情感基调和语言风格(文艺/学术/口语化等)</li>
                <li>只改变表达方式,不篡改核心观点和重要数据</li>
                <li>优化程度适度,避免过度修改导致&quot;丢失韵味&quot;</li>
              </ul>

              <p className="mt-2"><strong>优化原则:</strong> 保留原文风格 &gt; 降低AI率 &gt; 语言流畅。目标是让文本读起来像&quot;有个性的人类&quot;写的,而非&quot;完美的AI&quot;改写的。</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API 设置部分 */}
            <ApiSettings
              showSettings={showApiSettings}
              toggleSettings={toggleApiSettings}
              apiProvider={apiProvider}
              setApiProvider={(provider) => {
                setApiProvider(provider);
                if (provider === 'openai') {
                  setLlmApiUrl('https://api.openai.com/v1/chat/completions');
                  setModel('gpt-4');
                } else if (provider === 'grok') {
                  setLlmApiUrl('https://api.x.ai/v1/chat/completions');
                  setModel('grok-3-latest');
                } else if (provider === 'ollama') {
                  setLlmApiUrl('http://localhost:11434/api/generate');
                  setModel('llama2');
                  setLlmApiKey('');
                } else if (provider === 'deepseek') {
                  setLlmApiUrl('https://api.deepseek.com/v1/chat/completions');
                  setModel('deepseek-chat');
                } else if (provider === 'cherry') {
                  setLlmApiUrl('http://localhost:23333/v1/chat/completions');
                  setModel('openai:gpt-4o-mini');
                }
                setError(null);
                setApiResponseDetails(null);
              }}
              apiUrl={llmApiUrl}
              setApiUrl={setLlmApiUrl}
              apiKey={llmApiKey}
              setApiKey={setLlmApiKey}
              model={model}
              setModel={setModel}
              availableModels={availableModels}
              fetchModels={fetchAvailableModels}
            />

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                输入需要处理的文本
              </label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                placeholder="请粘贴需要去除AI特征的文本..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">洗稿指令</h3>
                <div className="flex items-center space-x-4">
                  {selectedPromptId === 'human-writing' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="useTwoStep"
                        checked={useTwoStepMode}
                        onChange={(e) => setUseTwoStepMode(e.target.checked)}
                        className="h-4 w-4 text-accent border-gray-300 rounded"
                      />
                      <label htmlFor="useTwoStep" className="ml-2 text-sm text-gray-600">
                        使用两步优化（先分析再优化）
                      </label>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useCustom"
                      checked={useCustomPrompt}
                      onChange={(e) => {
                        setUseCustomPrompt(e.target.checked);
                        if (e.target.checked) {
                          setUseTwoStepMode(false);
                        }
                      }}
                      className="h-4 w-4 text-accent border-gray-300 rounded"
                    />
                    <label htmlFor="useCustom" className="ml-2 text-sm text-gray-600">
                      使用自定义指令
                    </label>
                  </div>
                </div>
              </div>

              {!useCustomPrompt ? (
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">选择优化预设</label>
                  <div className="grid grid-cols-1 gap-2">
                    {presetPrompts.map((preset) => (
                      <div
                        key={preset.id}
                        className={`border rounded p-3 cursor-pointer transition-colors ${selectedPromptId === preset.id
                            ? 'bg-gray-50 border-gray-400'
                            : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        onClick={() => {
                          setSelectedPromptId(preset.id);
                          if (preset.id !== 'human-writing') {
                            setUseTwoStepMode(false);
                          }
                        }}
                      >
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="mt-2 text-xs text-gray-500">
                          {preset.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  {useTwoStepMode && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-xs text-gray-600">
                        <strong>两步优化模式:</strong> 系统将先使用AI修改指导分析文本并生成个性化优化策略，然后根据这些策略使用人类写作特征优化模式改写文本。这种方式需要两次API调用，但能产生更有针对性的优化结果。
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    自定义指令
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                    placeholder="请输入自定义的洗稿指令..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    required={useCustomPrompt}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    提示：优质的指令应明确说明如何改进文本、需要保留哪些内容以及需要什么风格。
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !content.trim() || (useCustomPrompt && !customPrompt.trim()) || (apiProvider !== 'ollama' && !llmApiKey)}
                className={`px-4 py-2 rounded text-white text-sm ${loading || !content.trim() || (useCustomPrompt && !customPrompt.trim()) || (apiProvider !== 'ollama' && !llmApiKey)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-dark transition-colors'
                  }`}
              >
                {loading ? (processingStep || '处理中...') : '优化文本'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-gray-50 text-gray-700 p-3 rounded border border-gray-200">
              <p className="text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-700 mb-2">优化结果</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="whitespace-pre-wrap text-sm">{result}</div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert('已复制到剪贴板');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    复制结果
                  </button>
                </div>
              </div>
              {apiResponseDetails && (
                <div className="mt-4">
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer hover:text-gray-800">{useTwoStepMode ? '查看优化策略和处理详情' : '查看技术细节'}</summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap">{apiResponseDetails}</pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FeatureLayout>
  );
} 
