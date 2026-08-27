import { CodeBlock } from '../../components/code-block';
import { A, C, P, Section, Table } from '../../components/guide';
import { REGISTRY } from '../../registry';
import type { GuideMeta } from '../../lib/types';
import { link } from '../../lib/router';

export const meta: GuideMeta = {
  title: 'Cài đặt',
  description:
    'Một package, một dòng CSS, bốn provider. Tất cả nằm gọn ở đây — không có tệp config, không có object theme.',
  toc: [
    { id: 'install', title: 'Cài package' },
    { id: 'stylesheet', title: 'Stylesheet' },
    { id: 'providers', title: 'Provider ở gốc app' },
    { id: 'dark-mode', title: 'Dark mode' },
    { id: 'labels', title: 'Nhãn dựng sẵn' },
    { id: 'rich-text-editor', title: 'RichTextEditor' },
    { id: 'mcp', title: 'MCP và AI agent' },
    { id: 'gotchas', title: 'Những chỗ dễ vấp' },
  ],
};

const INSTALL = `pnpm add @antkit/react`;

const STYLESHEET = `/* app.css */
@import 'tailwindcss';
@import '@antkit/react/styles.css';`;

const STYLESHEET_SUBSET = `/* app.css — chỉ trả tiền cho component bạn dùng */
@import 'tailwindcss';
@import '@antkit/react/styles/base.css';

@import '@antkit/react/styles/button.css';
@import '@antkit/react/styles/input.css';
@import '@antkit/react/styles/card.css';
@import '@antkit/react/styles/select.css';`;

const PROVIDERS = `import {
  MessageProvider,
  Toaster,
  TooltipProvider,
  ConfigProvider,
} from '@antkit/react';

import './app.css';

export const App = ({ children }) => (
  <ConfigProvider translate={(key) => LABELS[key] ?? key}>
    <TooltipProvider>{children}</TooltipProvider>

    {/* Cả hai đều portal ra body, đặt ở đâu trong cây cũng được. */}
    <Toaster />
    <MessageProvider />
  </ConfigProvider>
);`;

const DARK = `const toggle = (dark: boolean) =>
  document.documentElement.classList.toggle('dark', dark);`;

const LABELS = `const LABELS: Record<string, string> = {
  ok: 'Đồng ý',
  cancel: 'Huỷ',
  noData: 'Không có dữ liệu',
  rowsPerPage: 'Số dòng mỗi trang',
  // … thiếu khoá nào thì chính khoá đó được render ra.
};

<ConfigProvider translate={(key) => LABELS[key] ?? key}>`;

const RULE = `<Form.Item
  name="email"
  rules={[{ required: true, message: 'validation.required' }]}
>
  <Input />
</Form.Item>;`;

const SKILLS = `npx antkit-skills`;

const MCP = `pnpm add -D @antkit/mcp

# Claude Code
claude mcp add antkit -- npx -y @antkit/mcp

# hoặc với client nào đọc cấu hình mcpServers:
# { "mcpServers": { "antkit": { "command": "npx", "args": ["-y", "@antkit/mcp"] } } }`;

const EDITOR = `const RichTextEditor = lazy(() =>
  import('@antkit/react/rich-text-editor').then((m) => ({
    default: m.RichTextEditor,
  })),
);`;

const KEYS: { key: string; group: string; keys: string }[] = [
  {
    key: 'common',
    group: 'Khắp nơi',
    keys: 'ok, cancel, close, clear, remove, search, noData, selectPlaceholder, processing, dialog, dialogDescription',
  },
  { key: 'time', group: 'TimePicker', keys: 'now, startTime, endTime' },
  {
    key: 'table',
    group: 'Table',
    keys: 'rowsPerPage, perPage, previousPage, nextPage, jumpToPage, go, selectAll, selectRow, expandRow, collapseRow, resizeColumn',
  },
  {
    key: 'transfer',
    group: 'Transfer',
    keys: 'transferSource, transferTarget, transferToSource, transferToTarget',
  },
  {
    key: 'typography',
    group: 'Typography',
    keys: 'expand, collapse, copy, copied',
  },
  {
    key: 'validation',
    group: 'Form',
    keys: 'validation.required, validation.email, validation.url, validation.number, validation.integer, validation.min, validation.max, validation.len, validation.pattern, validation.invalid',
  },
];

export const Content = () => (
  <>
    <Section id="install" title="Cài package">
      <P>
        Peer bắt buộc duy nhất là React 19. Những thứ còn lại mà component cần —
        Radix, lucide, tailwind-merge, và token <C>@antkit/styles</C> — đi kèm
        sẵn dưới dạng dependency.
      </P>
      <CodeBlock code={INSTALL} collapsible={false} />
    </Section>

    <Section id="stylesheet" title="Stylesheet">
      <P>
        Đúng một dòng, đặt sau Tailwind. <C>@antkit/react/styles.css</C> mang
        theo token — màu, bo góc, font, kèm biến thể <C>dark</C> — đồng thời trỏ
        Tailwind vào source của component, thứ mà nó vốn bỏ qua cùng với toàn bộ{' '}
        <C>node_modules</C>.
      </P>
      <CodeBlock code={STYLESHEET} collapsible={false} />
      <P>
        Dòng <C>@source</C> nằm bên trong tệp đó, và được tính từ chính nó chứ
        không phải từ tệp CSS của bạn — nên nó luôn đúng dù CSS của bạn nằm ở
        đâu và trình quản lý gói bày <C>node_modules</C> kiểu gì. Nếu gõ sai
        đường dẫn import, bạn nhận một lỗi build gọi đúng tên, thay vì cả trang
        component trần trụi.
      </P>
      <P>
        Không phải import gì thêm nữa. Tailwind quét cả {REGISTRY.length}{' '}
        component để tìm tên class, nên CSS luôn là 19.3 KB gzip dù bạn dùng bao
        nhiêu — không có tệp CSS riêng nào phải thêm mỗi lần đụng tới một
        component mới, và cũng không có gì để lệch pha với danh sách import.
      </P>
      <P>
        App chỉ dùng vài component thì có thể chỉ trả tiền cho vài component.
        Thay <C>styles.css</C> bằng một entry cho mỗi component: app bốn
        component đo được <strong className="text-foreground">7.8 KB</strong>{' '}
        thay vì 19.3 KB.
      </P>
      <CodeBlock code={STYLESHEET_SUBSET} collapsible={false} />
      <P>
        Mỗi entry đã kéo sẵn những component mà component của nó render bên
        trong — <C>select.css</C> kéo theo <C>popover</C>, vì <C>Select</C> mở
        một cái. Danh sách đó được sinh tự động chứ không chép tay, bởi ghi
        thiếu thì không báo lỗi: dropdown chỉ rơi sai chỗ. Cũng vì thế, đừng tự
        viết <C>@source</C> trỏ vào <C>node_modules</C> — đường dẫn đó là phỏng
        đoán về cách máy bạn bày thư mục, mà đoán sai thì hỏng trong im lặng.
      </P>
      <P>
        Muốn đổi token nào thì khai báo lại nó sau dòng import. Không có object
        theme ở bất cứ đâu — màu thương hiệu là một biến CSS.
      </P>
    </Section>

    <Section id="providers" title="Provider ở gốc app">
      <P>
        Bốn cái, và chỉ cái đầu là thật sự bắt buộc. <C>ConfigProvider</C> cấp
        các chuỗi dựng sẵn; <C>TooltipProvider</C> là thứ Radix cần cho mọi{' '}
        <C>Tooltip</C> — trừ <C>Sidebar</C> và <C>Gantt</C>, chúng tự mount một
        cái; còn <C>Toaster</C> và <C>MessageProvider</C> là chỗ gắn của hai API
        thông báo gọi bằng lệnh — thiếu cái nào thì lời gọi tương ứng im lặng.
      </P>
      <CodeBlock code={PROVIDERS} collapsible={false} />
    </Section>

    <Section id="dark-mode" title="Dark mode">
      <P>
        Class <C>dark</C> trên <C>&lt;html&gt;</C>, hết. Biến thể trong{' '}
        <C>@antkit/styles</C> là <C>@custom-variant dark (&amp;:is(.dark *))</C>
        , nên mọi token lật theo class và không component nào cần biết đang ở
        theme nào.
      </P>
      <CodeBlock code={DARK} collapsible={false} />
    </Section>

    <Section id="labels" title="Nhãn dựng sẵn">
      <P>
        Không component nào hard-code chuỗi hiển thị cho người dùng. Phần lớn
        chữ đi vào qua prop; những chuỗi component buộc phải tự sinh ra — nhãn
        phân trang, tên đọc được của nút đóng — đi qua{' '}
        <C>useConfig().translate(key)</C>, chính là hàm bạn truyền cho{' '}
        <C>ConfigProvider</C>. Thiếu khoá nào thì khoá đó được render ra, nên
        không bao giờ có ô trống, và thiếu sót lộ ngay trên giao diện.
      </P>
      <CodeBlock code={LABELS} collapsible={false} />
      <P>Toàn bộ khoá đang dùng:</P>
      <Table
        head={['Dùng ở', 'Khoá']}
        rows={KEYS.map((row) => ({
          key: row.key,
          cells: [
            <span key="group" className="whitespace-nowrap">
              {row.group}
            </span>,
            <span key="keys" className="font-mono text-[13px]">
              {row.keys}
            </span>,
          ],
        }))}
      />
      <P>
        <C>Form</C> cho thông báo lỗi đi qua đúng hàm đó, nên một rule có thể
        mang khoá thay vì mang câu chữ — và các rule dựng sẵn đã dùng chính
        những khoá <C>validation.*</C> ở trên:
      </P>
      <CodeBlock code={RULE} collapsible={false} />
    </Section>

    <Section id="rich-text-editor" title="RichTextEditor">
      <P>
        Trình soạn thảo nặng 211 KB gzip của TipTap và ProseMirror — gấp mười
        hai lần component nặng thứ nhì — nên nó không nằm trong barrel gốc và
        TipTap là optional peer. Cài bình thường sẽ không tải nó về.
      </P>
      <CodeBlock
        code="pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm"
        collapsible={false}
      />
      <P>Import từ subpath, và nạp lazy để nó rơi vào chunk riêng:</P>
      <CodeBlock code={EDITOR} collapsible={false} />
      <P>
        Các preset thanh công cụ chỉ là dữ liệu thuần, import thẳng từ{' '}
        <C>@antkit/react/rich-text-editor/tools</C> vô tư.
      </P>
    </Section>

    <Section id="mcp" title="MCP và AI agent">
      <P>
        Hai cách đưa thư viện cho một coding agent, cả hai đều đọc cùng một
        nguồn sự thật — khối doc trên từng component.
      </P>
      <P>
        <C>npx antkit-skills</C> link hướng dẫn vào{' '}
        <C>.claude/skills/antkit-react</C> dưới dạng một tệp để agent đọc. Không
        phải chạy gì, không phải cấu hình gì.
      </P>
      <CodeBlock code={SKILLS} collapsible={false} />
      <P>
        <C>@antkit/mcp</C> là một MCP server, biến đúng nội dung đó thành các
        tool mà agent gọi được: <C>list_components</C>, <C>get_component</C>,{' '}
        <C>search_components</C> và <C>get_guide</C>. Đăng ký một lần cho mỗi dự
        án.
      </P>
      <CodeBlock code={MCP} collapsible={false} />
      <P>
        Nó resolve <C>@antkit/react</C> từ chính dự án mà client khởi chạy nó,
        nên câu trả lời luôn bám đúng version bạn đang cài — cái tên component
        nó đưa ra là cái tên barrel thực sự export. Muốn trỏ chỗ khác thì dùng{' '}
        <C>ANTKIT_REACT_PATH</C>.
      </P>
    </Section>

    <Section id="gotchas" title="Những chỗ dễ vấp">
      <Table
        head={['Triệu chứng', 'Nguyên nhân']}
        rows={[
          {
            key: 'source',
            cells: [
              'Component hiện ra không có style',
              <span key="c">
                Chưa import <C>@antkit/react/styles.css</C>, hoặc còn sót cách
                cũ với dòng <C>@source</C> tự viết mà đường dẫn tương đối không
                còn trỏ đúng vào package.
              </span>,
            ],
          },
          {
            key: 'transpile',
            cells: [
              'Bundler báo lỗi vì TypeScript trong node_modules',
              <span key="c">
                Package ship source là cố ý. Thêm nó vào{' '}
                <C>transpilePackages</C> với Next.js; Vite không cần gì.
              </span>,
            ],
          },
          {
            key: 'message',
            cells: [
              <span key="s">
                <C>message.*</C> hiện chuỗi chưa dịch
              </span>,
              <span key="c">
                Nó render ngoài cây React đã gọi nó, nên không đọc được context.
                Dịch trước rồi mới gọi.
              </span>,
            ],
          },
          {
            key: 'input-number',
            cells: [
              <span key="s">
                <C>InputNumber</C> bắn <C>onChange</C> vượt ngoài min/max
              </span>,
              'Việc kẹp giá trị xảy ra lúc blur, có chủ ý — để gõ 5 trên đường tới 50 không bị chặn. Hãy validate lúc submit.',
            ],
          },
          {
            key: 'range',
            cells: [
              <span key="s">
                <C>DateRangePicker</C> bắn ra <C>to: null</C>
              </span>,
              'Đó là cú bấm đầu tiên của một khoảng. Đợi đủ hai đầu rồi hãy query.',
            ],
          },
        ]}
      />
      <P>
        Còn lại nằm hết ở trang từng component, hoặc trong khối JSDoc ngay tại
        chỗ gọi. Bắt đầu từ <A href={link('/components/button')}>Button</A>.
      </P>
    </Section>
  </>
);
