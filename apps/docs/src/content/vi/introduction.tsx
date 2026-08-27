import { CodeBlock } from '../../components/code-block';
import { A, C, P, Section, Table } from '../../components/guide';
import { useT } from '../../lib/i18n';
import type { GuideMeta } from '../../lib/types';
import { GROUPS, REGISTRY } from '../../registry';

export const meta: GuideMeta = {
  title: 'Giới thiệu',
  description: `Bộ component React với props khai báo, dựng trên Radix primitives và token Tailwind v4. ${REGISTRY.length} component, ship thẳng source, tree-shake thật.`,
  toc: [
    { id: 'what-it-is', title: 'antkit là gì' },
    { id: 'familiar-api', title: 'API quen tay' },
    { id: 'what-you-dont-get', title: 'Những thứ không có' },
    { id: 'how-it-ships', title: 'Cách thư viện được ship' },
    { id: 'weight', title: 'Nặng bao nhiêu' },
    { id: 'components', title: 'Danh sách component' },
    { id: 'near-neighbours', title: 'Những cặp dễ nhầm' },
    { id: 'agents', title: 'Làm việc cùng AI agent' },
    { id: 'packages', title: 'Các package' },
  ],
};

const FORM = `import { Button, Form, Input, Select, message } from '@antkit/react';

<Form form={form} onFinish={(values) => save(values)}>
  <Form.Item
    name="email"
    label="Email"
    rules={[{ required: true, type: 'email' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item name="roles" label="Vai trò">
    <Select options={roles} mode="multiple" showSearch />
  </Form.Item>

  <Button type="submit">Lưu</Button>
</Form>;`;

const SLOTS = `/* Mọi phần tử người dùng có thể cần chạm tới đều mang một data-slot. */
[data-slot='card-header'] {
  padding-block: --spacing(5);
}`;

const WEIGHT: { key: string; cells: [string, string] }[] = [
  { key: 'floor', cells: ['không import gì — chỉ `cn`', '10.3 KB'] },
  { key: 'basics', cells: ['Button, Card, Badge, Skeleton', '26.5 KB'] },
  {
    key: 'form',
    cells: ['Button, Input, Form, Checkbox, Alert, message', '47.7 KB'],
  },
  {
    key: 'crud',
    cells: [
      'một trang CRUD đầy đủ (+ Select, Table, Modal, Tooltip, DropdownMenu)',
      '88.6 KB',
    ],
  },
  { key: 'all', cells: ['toàn bộ component trong barrel', '180.9 KB'] },
  { key: 'editor', cells: ['RichTextEditor, nằm ở chunk riêng', '+211 KB'] },
];

const NEIGHBOURS: { key: string; want: string; use: string; not: string }[] = [
  {
    key: 'message',
    want: 'Báo “xong rồi” ở đỉnh màn hình',
    use: 'message.success()',
    not: 'Toaster',
  },
  {
    key: 'toast',
    want: 'Thông báo có nút hành động hoặc hoàn tác',
    use: 'toast()',
    not: 'message',
  },
  {
    key: 'alert',
    want: 'Thông báo nằm ngay trong trang',
    use: 'Alert',
    not: 'message',
  },
  { key: 'switch', want: 'Bấm là ăn ngay', use: 'Switch', not: 'Checkbox' },
  {
    key: 'empty',
    want: 'Danh sách hoặc bảng rỗng',
    use: 'Empty',
    not: 'Result',
  },
  {
    key: 'result',
    want: 'Kết quả của cả trang (404, hoàn tất)',
    use: 'Result',
    not: 'Empty',
  },
  {
    key: 'tree-select',
    want: 'Chọn trong một cây',
    use: 'TreeSelect',
    not: 'Cascader',
  },
  {
    key: 'cascader',
    want: 'Đi lần lượt từng cấp',
    use: 'Cascader',
    not: 'TreeSelect',
  },
  {
    key: 'gantt',
    want: 'Thanh việc trên trục ngày',
    use: 'Gantt',
    not: 'Timeline',
  },
];

export const Content = () => {
  const t = useT();

  return (
    <>
      <Section id="what-it-is" title="antkit là gì">
        <P>
          Hai package. <C>@antkit/react</C> là {REGISTRY.length} component có
          props mô tả kết quả bạn muốn chứ không phải cách nối dây;{' '}
          <C>@antkit/styles</C> là đúng một tệp CSS chứa token màu, bo góc, font
          và biến thể <C>dark</C>. Bên dưới,{' '}
          <A href="https://www.radix-ui.com">Radix</A> lo role, mô hình bàn phím
          và quản lý focus, còn Tailwind v4 lo phần nhìn.
        </P>
        <P>
          Thư viện dành cho đội dựng màn hình quản trị bằng Tailwind — props nói
          thẳng màn hình làm gì, đặt trên primitives mà bạn style bằng đúng bộ
          utility như phần còn lại của app.
        </P>
      </Section>

      <Section id="familiar-api" title="API quen tay">
        <P>
          <C>Form</C> nhận <C>rules</C>, <C>Select</C> nhận <C>options</C> và{' '}
          <C>mode</C>, <C>Table</C> nhận <C>columns</C> và <C>dataSource</C>,
          còn <C>message.success()</C> gọi được từ bất cứ đâu — nó render ngoài
          cây React nên một module service không cần component nào trong scope
          vẫn gọi được. Control nào nói chuyện bằng <C>value</C> /{' '}
          <C>onChange</C> thì đặt thẳng vào <C>Form.Item</C>, không cần adapter.
        </P>
        <CodeBlock code={FORM} collapsible={false} />
      </Section>

      <Section id="what-you-dont-get" title="Những thứ không có">
        <P>
          Không tiền xử lý CSS, không bắt buộc <C>dayjs</C>, không có cascade
          class sinh sẵn để phải đánh nhau, và không có gì để chỉnh theme bằng
          JavaScript — <C>ConfigProvider</C> vẫn có, nhưng nó chỉ mang mấy chuỗi
          dựng sẵn chứ không mang theme. Đổi theme là khai báo lại một biến CSS;
          dark mode là class <C>dark</C> trên <C>&lt;html&gt;</C>. Mọi phần tử
          người dùng có thể cần chạm tới đều mang một <C>data-slot</C> — đó là
          cách style thư viện từ bên ngoài mà không phải xuất tên class.
        </P>
        <CodeBlock code={SLOTS} collapsible={false} />
        <P>
          Chuỗi hiển thị cho người dùng cũng không được hard-code. Component
          nhận chữ qua props, hoặc qua <C>ConfigProvider</C> với vài nhãn dựng
          sẵn — xem{' '}
          <A href="/installation/labels">Nhãn dựng sẵn trong component</A>.
        </P>
      </Section>

      <Section id="how-it-ships" title="Cách thư viện được ship">
        <P>
          <C>@antkit/react</C> publish source TypeScript và không gì khác:{' '}
          <C>exports</C> trỏ vào <C>./src/index.ts</C>, không có bước build,
          không có <C>dist</C>. Bundler của bạn biên dịch nó cùng code của bạn —
          nhờ vậy tree-shaking là thật, khối JSDoc trên mỗi component đọc được
          ngay tại chỗ gọi, và stack trace chỉ vào dòng code đọc được.
        </P>
        <P>
          Giá phải trả là hai chi tiết khi cài: phải bảo Tailwind quét package (
          <C>@source</C>), và bundler nào bỏ qua TypeScript trong{' '}
          <C>node_modules</C> thì phải bảo nó đừng bỏ qua —{' '}
          <C>transpilePackages</C> với Next.js, còn Vite thì không cần gì.{' '}
          <A href="/installation">Trang Cài đặt</A> nói kỹ cả hai.
        </P>
      </Section>

      <Section id="weight" title="Nặng bao nhiêu">
        <P>Đo thật, đã gzip, tính thêm trên React:</P>
        <Table
          head={['Bạn import', 'gzip']}
          rows={WEIGHT.map((row) => ({
            key: row.key,
            cells: [
              <span key="what">{row.cells[0]}</span>,
              <span key="size" className="font-mono text-[13px]">
                {row.cells[1]}
              </span>,
            ],
          }))}
        />
        <P>
          Mức sàn 10.3 KB là <C>tailwind-merge</C>, trả một lần cho cả app, và
          nó chính là thứ khiến <C>className</C> của bạn thắng class của
          component. Mấy component nặng — <C>Sidebar</C>, <C>DatePicker</C>,{' '}
          <C>TimePicker</C>, <C>DropdownMenu</C> — nặng vì tầng floating và
          dismissable-layer của Radix, mà tầng này dùng chung, nên import hai
          cái tốn ít hơn nhiều so với cộng dồn.
        </P>
        <P>
          <C>RichTextEditor</C> là component duy nhất cố tình để ngoài barrel
          gốc: 211 KB gzip của TipTap, gấp mười hai lần component nặng thứ nhì.
          Nó nằm ở <C>@antkit/react/rich-text-editor</C> với TipTap là optional
          peer, nên cài bình thường sẽ không bao giờ tải nó về.
        </P>
      </Section>

      <Section id="components" title="Danh sách component">
        <P>
          {REGISTRY.length} trang, nhóm đúng như sidebar. Mỗi trang là component
          đang chạy, đoạn code sinh ra nó, và bảng props.
        </P>
        <div className="grid gap-4">
          {GROUPS.map((group) => {
            const entries = REGISTRY.filter((entry) => entry.group === group);
            if (entries.length === 0) return null;

            return (
              <div key={group} className="grid gap-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {t.groups[group]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {entries.map((entry) => (
                    <a
                      key={entry.slug}
                      href={`/components/${entry.slug}`}
                      className="rounded-xl border border-border p-3 transition-colors hover:border-primary hover:bg-accent/40"
                    >
                      <p className="font-medium">{entry.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {t.components[entry.slug]}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="near-neighbours" title="Những cặp dễ nhầm">
        <P>
          Đây là những cặp hay bị chọn nhầm. JSDoc trên từng component cũng nói
          đúng điều này, ngay tại chỗ gọi.
        </P>
        <Table
          head={['Bạn muốn', 'Hãy dùng']}
          rows={NEIGHBOURS.map((row) => ({
            key: row.key,
            cells: [
              <span key="want">{row.want}</span>,
              <span key="use">
                <C>{row.use}</C>, không phải <C>{row.not}</C>
              </span>,
            ],
          }))}
        />
      </Section>

      <Section id="agents" title="Làm việc cùng AI agent">
        <P>
          Khối JSDoc trên mỗi component — một dòng nói nó là gì, một ví dụ chạy
          được, và một câu nói khi nào nên dùng component khác — được viết để
          agent đọc, không chỉ để người rê chuột lên props. Vì package ship
          source, khối đó nằm sẵn trong <C>node_modules</C> nơi agent grep được.
        </P>
        <P>
          Ngoài ra package còn ship sẵn một agent skill. Chạy{' '}
          <C>npx antkit-skills</C> là nó được link vào{' '}
          <C>.claude/skills/antkit-react</C> — một symlink trỏ vào{' '}
          <C>node_modules</C>, nên hướng dẫn luôn khớp đúng version bạn đang
          cài. Trong đó có API, các cặp dễ nhầm, những cái bẫy, và danh mục toàn
          bộ component được sinh tự động, để agent kiểm tra một cái tên có thật
          hay không trước khi import.
        </P>
        <P>
          Nếu agent của bạn nói <C>MCP</C>, <C>@antkit/mcp</C> phục vụ đúng nội
          dung đó dưới dạng tool để gọi thay vì tài liệu để đọc —{' '}
          <C>list_components</C>, <C>get_component</C>, <C>search_components</C>
          , <C>get_guide</C>. Nó trả lời theo đúng version đang cài trong dự án,
          nên cái tên nó đưa ra là cái tên có thật.{' '}
          <A href="/installation/mcp">Trang Cài đặt</A> có phần thiết lập.
        </P>
      </Section>

      <Section id="packages" title="Các package">
        <Table
          head={['Package', 'Là gì']}
          rows={[
            {
              key: 'react',
              cells: [
                <C key="name">@antkit/react</C>,
                'Phần component. Peer là React 19, ship source, không side effect.',
              ],
            },
            {
              key: 'styles',
              cells: [
                <C key="name">@antkit/styles</C>,
                'Một tệp CSS: token màu, bo góc, font, kèm biến thể dark.',
              ],
            },
            {
              key: 'editor',
              cells: [
                <C key="name">@antkit/react/rich-text-editor</C>,
                'Trình soạn thảo TipTap, nằm sau subpath và optional peer.',
              ],
            },
          ]}
        />
        <P>
          Giấy phép MIT, phát triển tại{' '}
          <A href="https://github.com/zocheck/antkit">
            github.com/zocheck/antkit
          </A>
          . Cài luôn chứ? <A href="/installation">Trang Cài đặt</A> chỉ có hai
          lệnh và một tệp CSS.
        </P>
      </Section>
    </>
  );
};
