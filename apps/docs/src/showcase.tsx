import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  addDays,
  Alert,
  AutoComplete,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  Cascader,
  CardContent,
  Calendar,
  Checkbox,
  CheckboxGroup,
  CheckboxOption,
  Collapsible,
  CountBadge,
  CollapsibleContent,
  CollapsibleTrigger,
  Comparison,
  ComparisonHandle,
  ComparisonItem,
  CardDescription,
  CardHeader,
  CardTitle,
  DateField,
  DatePicker,
  DateRangePicker,
  Descriptions,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  Empty,
  Form,
  Gantt,
  Image,
  ImageZoom,
  Input,
  InputNumber,
  Label,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSider,
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
  Modal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Popconfirm,
  Radio,
  Rate,
  RadioGroup,
  Result,
  RichTextEditor,
  COMPACT_TOOLBAR,
  DEFAULT_TOOLBAR,
  Segmented,
  Select,
  Separator,
  Sheet,
  SheetContent,
  SheetTrigger,
  Skeleton,
  Slider,
  Spinner,
  Statistic,
  Status,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  CheckableTag,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  TimeField,
  TimePicker,
  TimeRangePicker,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  Tooltip,
  TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  message,
  notification,
  useIsMobile,
} from '@antkit/react';
import type {
  CascaderOption,
  ColumnType,
  DateRange,
  GanttRow,
  KanbanItem,
  StepItem,
  TooltipPlacement,
  TransferItem,
  TimeRange,
  TreeNode,
} from '@antkit/react';
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  FileTextIcon,
  HomeIcon,
  ListIcon,
  MailIcon,
  MoreVerticalIcon,
  PhoneIcon,
  StarIcon,
  UserRoundIcon,
  WalletIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * A 3-column compass, so each button sits roughly where its tooltip will
 * appear. `null` is an empty cell in the middle column.
 */
const TOOLTIP_PLACEMENTS: {
  key: string;
  placement: TooltipPlacement | null;
}[] = [
  'topLeft',
  'top',
  'topRight',
  'leftTop',
  null,
  'rightTop',
  'left',
  null,
  'right',
  'leftBottom',
  null,
  'rightBottom',
  'bottomLeft',
  'bottom',
  'bottomRight',
].map((placement, index) => ({
  key: placement ?? `empty-${index}`,
  placement: placement as TooltipPlacement | null,
}));

/** Every section is one of these, so the page reads as a consistent catalogue. */
const Section = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {!!hint && <CardDescription>{hint}</CardDescription>}
    </CardHeader>
    <CardContent className="flex min-w-0 flex-wrap items-start gap-4">
      {children}
    </CardContent>
  </Card>
);

type Row = {
  id: string;
  name: string;
  course: string;
  status: 'active' | 'paused' | 'done';
  email: string;
  phone: string;
  advisor: string;
  createdAt: string;
  note?: string;
  fee: number;
};

const ROWS: Row[] = [
  {
    id: '1',
    name: 'Nguyễn Thị Ánh Nguyệt',
    course: 'IELTS 6.5+',
    status: 'active',
    email: 'nguyet.nguyen@example.com',
    phone: '0901 234 567',
    advisor: 'Lê Minh Anh',
    createdAt: '15/08/2026',
    note: 'Ưu tiên gọi buổi tối',
    fee: 12_500_000,
  },
  {
    id: '2',
    name: 'Trần Đức Hưởng',
    course: 'TOEIC 750',
    status: 'paused',
    email: 'huong.tran@example.com',
    phone: '0902 345 678',
    advisor: 'Trần Bảo Ngọc',
    createdAt: '09/08/2026',
    fee: 8_900_000,
  },
  {
    id: '3',
    name: 'Lê Hoàng Phương Uyên',
    course: 'Giao tiếp cơ bản',
    status: 'done',
    email: 'phuonguyen@example.com',
    phone: '0903 456 789',
    advisor: 'Nguyễn Hoài Nam',
    createdAt: '28/07/2026',
    fee: 4_250_000,
  },
  {
    id: '4',
    name: 'Đặng Vũ Khánh Duyệt',
    course: 'Luyện thi THPT',
    status: 'active',
    email: 'duykhanh@example.com',
    phone: '0904 567 890',
    advisor: 'Lê Minh Anh',
    createdAt: '01/08/2026',
    fee: 15_750_000,
  },
  {
    id: '5',
    name: 'Phạm Nguyễn Tuệ Mẫn',
    course: 'IELTS 7.0+',
    status: 'active',
    email: 'tue.man@example.com',
    phone: '0905 678 901',
    advisor: 'Trần Bảo Ngọc',
    createdAt: '19/08/2026',
    fee: 19_000_000,
  },
  {
    id: '6',
    name: 'Vũ Thị Kiều Trinh',
    course: 'TOEIC 600',
    status: 'done',
    email: 'kieutrinh@example.com',
    phone: '0906 789 012',
    advisor: 'Nguyễn Hoài Nam',
    createdAt: '04/07/2026',
    fee: 6_400_000,
  },
];

const TAGS = ['IELTS', 'TOEIC', 'Giao tiếp'];

const STEPS: StepItem[] = [
  { title: 'Thông tin', description: 'Họ tên, liên hệ' },
  { title: 'Khoá học', description: 'Chọn lớp và ca' },
  { title: 'Thanh toán', description: 'Xuất hoá đơn' },
];

const SEARCHES = [
  { value: 'Nguyễn Thị Ánh Nguyệt' },
  { value: 'Nguyễn Hoàng Nam' },
  { value: 'Trần Đức Hưởng' },
  { value: 'Trần Bảo Ngọc' },
  { value: 'Lê Hoàng Phương Uyên' },
];

const REGIONS: CascaderOption[] = [
  {
    value: 'hcm',
    label: 'TP. Hồ Chí Minh',
    children: [
      {
        value: 'q1',
        label: 'Quận 1',
        children: [
          { value: 'ben-nghe', label: 'Phường Bến Nghé' },
          { value: 'ben-thanh', label: 'Phường Bến Thành' },
        ],
      },
      {
        value: 'q3',
        label: 'Quận 3',
        children: [
          { value: 'vo-thi-sau', label: 'Phường Võ Thị Sáu' },
          { value: 'p1', label: 'Phường 1' },
        ],
      },
    ],
  },
  {
    value: 'hn',
    label: 'Hà Nội',
    children: [
      {
        value: 'ba-dinh',
        label: 'Quận Ba Đình',
        children: [
          { value: 'phuc-xa', label: 'Phường Phúc Xá' },
          { value: 'truc-bach', label: 'Phường Trúc Bạch' },
        ],
      },
      {
        value: 'cau-giay',
        label: 'Quận Cầu Giấy',
        children: [{ value: 'dich-vong', label: 'Phường Dịch Vọng' }],
      },
    ],
  },
  { value: 'dn', label: 'Đà Nẵng' },
];

const PERMISSIONS: TransferItem[] = [
  { key: 'perm-1', title: 'Xem khoá học', description: 'course.read' },
  { key: 'perm-2', title: 'Sửa khoá học', description: 'course.write' },
  { key: 'perm-3', title: 'Xoá khoá học', description: 'course.delete' },
  { key: 'perm-4', title: 'Xem học viên', description: 'student.read' },
  { key: 'perm-5', title: 'Xuất báo cáo', description: 'report.export' },
  {
    key: 'perm-6',
    title: 'Quản trị hệ thống',
    description: 'system.admin',
    disabled: true,
  },
];

const OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Billing (disabled)', value: 'billing', disabled: true },
];

const GROUPED = [
  {
    label: 'Học vụ',
    options: [
      { label: 'Quản lý khoá học', value: 'course' },
      { label: 'Ngân hàng đề thi', value: 'exam' },
    ],
  },
  {
    label: 'Hệ thống',
    options: [
      { label: 'Người dùng', value: 'user' },
      { label: 'Phân quyền', value: 'role' },
    ],
  },
];

const TREE: TreeNode[] = [
  {
    key: 'academy',
    label: 'Học vụ',
    children: [
      { key: 'course', label: 'Quản lý khoá học' },
      { key: 'exam', label: 'Ngân hàng đề thi' },
      { key: 'grade', label: 'Bảng điểm', disabled: true },
    ],
  },
  {
    key: 'system',
    label: 'Hệ thống',
    children: [
      { key: 'user', label: 'Người dùng' },
      {
        key: 'role',
        label: 'Phân quyền',
        children: [
          { key: 'role-admin', label: 'Quản trị viên' },
          { key: 'role-staff', label: 'Nhân viên' },
        ],
      },
    ],
  },
];

const COLUMNS = [
  { id: 'todo', name: 'Chưa bắt đầu' },
  { id: 'doing', name: 'Đang thực hiện' },
  { id: 'done', name: 'Hoàn thành' },
];

const BOARD: KanbanItem[] = [
  { id: 'k1', name: 'Follow-up khách Vũ Thị Mai', column: 'todo' },
  { id: 'k2', name: 'Nhắc bảo dưỡng 1.000km', column: 'todo' },
  { id: 'k3', name: 'Tư vấn gói trả góp 12 tháng', column: 'doing' },
  { id: 'k4', name: 'Xác nhận ngày giao xe', column: 'done' },
];

const LIST_GROUPS = [
  { id: 'high', name: 'Ưu tiên cao', color: '#e20d2c' },
  { id: 'normal', name: 'Bình thường', color: '#6b7280' },
];

const LIST_ITEMS = [
  { id: 'l1', name: 'Chuẩn bị hồ sơ xuất hoá đơn', group: 'high' },
  { id: 'l2', name: 'Gọi lại khách Nguyễn Hoàng Nam', group: 'high' },
  { id: 'l3', name: 'Cập nhật lịch khai giảng', group: 'normal' },
];

const day = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

const OWNERS = [
  'Bảo Châu',
  'Trần Thu Hà',
  'Nguyễn Hoàng Nam',
  'Phạm Minh Đức',
  'Vũ Thị Mai',
  'Lê Hoàng Phương Uyên',
  'Đặng Vũ Khánh Duyệt',
  'Phạm Nguyễn Tuệ Mẫn',
  'Vũ Thị Kiều Trinh',
  'Hoàng Anh Tuấn',
  'Đỗ Thanh Bình',
  'Ngô Gia Hân',
];

const TASKS = [
  'Follow-up khách',
  'Nhắc bảo dưỡng',
  'Tư vấn trả góp',
  'Hồ sơ hoá đơn VAT',
  'Xác nhận ngày giao xe',
  'Chốt hợp đồng',
  'Khảo sát hài lòng',
  'Đối soát công nợ',
];

const TASK_COLORS = [
  undefined,
  '#17a2b8',
  '#f49000',
  '#28a745',
  '#e20d2c',
  '#7c3aed',
];

/**
 * Deterministic pseudo-random so the demo doesn't reshuffle on every render —
 * `Math.random()` here would also make the chart impossible to eyeball twice.
 */
const seeded = (seed: number) => {
  const value = Math.sin(seed) * 10_000;
  return value - Math.floor(value);
};

const GANTT_ROWS: GanttRow[] = OWNERS.map((owner, ownerIndex) => ({
  id: `owner-${ownerIndex}`,
  label: owner,
  items: Array.from({ length: 4 }, (_, taskIndex) => {
    const seed = ownerIndex * 10 + taskIndex;
    const startOffset = Math.round(seeded(seed) * 80) - 40;
    const length = 2 + Math.round(seeded(seed + 100) * 8);

    return {
      id: `g-${ownerIndex}-${taskIndex}`,
      name: `${TASKS[(ownerIndex + taskIndex) % TASKS.length]} #${ownerIndex + 1}`,
      startAt: day(startOffset),
      endAt: day(startOffset + length),
      color: TASK_COLORS[(seed + taskIndex) % TASK_COLORS.length],
    };
  }),
}));

type DemoValues = { email: string; role: string; tags: string[] };

export const Showcase = () => {
  const [single, setSingle] = useState<string>();
  const [openTags, setOpenTags] = useState<string[]>(TAGS);
  const [pickedTags, setPickedTags] = useState<string[]>(['IELTS']);
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(0);
  const [query, setQuery] = useState('');
  const [treeSingle, setTreeSingle] = useState<string>();
  const [granted, setGranted] = useState<string[]>(['course']);
  const [area, setArea] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<string[]>(['perm-2']);
  const [multi, setMulti] = useState<string[]>(['admin', 'editor']);
  const [tags, setTags] = useState<string[]>(['vip']);
  const [grouped, setGrouped] = useState<string>();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loadingTable, setLoadingTable] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [agree, setAgree] = useState<boolean | 'indeterminate'>(
    'indeterminate',
  );
  const [treeChecked, setTreeChecked] = useState<string[]>(['course']);
  const isMobile = useIsMobile();
  const [sheet, setSheet] = useState(false);
  const [split, setSplit] = useState(50);
  /** Stands in for a real upload endpoint: a short wait, then a local URL. */
  const uploadImage = (file: File) =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), 600);
    });
  const [body, setBody] = useState(
    '<h2>Chào mừng</h2><p>Khoá học <strong>IELTS 6.5+</strong> khai giảng ngày <em>12/09</em>.</p><ul><li>Lịch học: T2 – T4 – T6</li><li>Giáo viên: Trần Minh Khôi</li></ul>',
  );
  const [board, setBoard] = useState<KanbanItem[]>(BOARD);
  const [listItems, setListItems] = useState(LIST_ITEMS);
  const [ganttUnit, setGanttUnit] = useState<'day' | 'week' | 'month'>('day');
  const [ganttZoom, setGanttZoom] = useState(100);
  const [plan, setPlan] = useState('pro');
  const [channels, setChannels] = useState<string[]>(['email']);
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  const [upload, setUpload] = useState<File[]>([]);
  const [time, setTime] = useState<Date | null>(null);
  const [shift, setShift] = useState<TimeRange>({ from: null, to: null });
  const [seats, setSeats] = useState<number | null>(12);
  const [fee, setFee] = useState<number | null>(1500000);
  const [volume, setVolume] = useState(40);
  const [budget, setBudget] = useState<number[]>([20, 70]);
  const [notify, setNotify] = useState(true);
  const [period, setPeriod] = useState<string | number>('week');
  const [note, setNote] = useState('');
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  const form = Form.useForm<DemoValues>({
    defaultValues: { email: '', role: '', tags: [] },
  });

  const columns = useMemo<ColumnType<Row>[]>(
    () => [
      {
        title: 'Họ và tên',
        dataIndex: 'name',
        width: 260,
        icon: <FileTextIcon />,
        fixed: 'left',
        resizable: true,
        sorter: true,
      },
      {
        title: 'Khoá học',
        dataIndex: 'course',
        width: 220,
        icon: <CalendarIcon />,
        resizable: true,
        sorter: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: 240,
        icon: <MailIcon />,
        ellipsis: true,
      },
      {
        title: 'Điện thoại',
        dataIndex: 'phone',
        width: 150,
        icon: <PhoneIcon />,
      },
      {
        title: 'Tư vấn viên',
        dataIndex: 'advisor',
        width: 180,
        icon: <UserRoundIcon />,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        width: 150,
        icon: <CalendarIcon />,
        sorter: true,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 180,
        icon: <ListIcon />,
        render: (value) => (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
            {String(value)}
          </span>
        ),
      },
      { title: 'Ghi chú', dataIndex: 'note', width: 220 },
      {
        title: 'Học phí',
        dataIndex: 'fee',
        width: 180,
        align: 'right',
        icon: <WalletIcon />,
        sorter: (a, b) => a.fee - b.fee,
        render: (value) => `${Number(value).toLocaleString('vi-VN')} ₫`,
      },
    ],
    [],
  );

  const paged = ROWS.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="grid gap-6 pb-10">
      <div>
        <h1 className="text-lg font-medium">@antkit/react</h1>
        <p className="text-sm text-muted-foreground">
          Mọi component đều dùng token của @antkit/styles, nên đổi theme
          sáng/tối là thấy ngay tại đây.
        </p>
      </div>

      <Section title="Button">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="Input">
        <Input className="max-w-xs" placeholder="Nhập nội dung…" />
        <Input className="max-w-xs" type="password" defaultValue="secret123" />
        <Input className="max-w-xs" disabled placeholder="Disabled" />
        <Input className="max-w-xs" aria-invalid placeholder="Invalid" />
      </Section>

      <Section
        title="Select"
        hint="Một component phủ mọi biến thể: single, multiple, tags, có/không search, group, clear, loading."
      >
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">single</span>
            <Select
              options={OPTIONS}
              value={single}
              onChange={(value) => setSingle(value as string)}
              allowClear
              placeholder="Chọn vai trò"
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">
              single + showSearch
            </span>
            <Select
              options={OPTIONS}
              value={single}
              onChange={(value) => setSingle(value as string)}
              showSearch
              allowClear
              placeholder="Gõ để tìm"
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">
              multiple + maxTagCount=2
            </span>
            <Select
              mode="multiple"
              options={OPTIONS}
              value={multi}
              onChange={(value) => setMulti(value as string[])}
              maxTagCount={2}
              allowClear
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">
              tags (gõ rồi Enter để tạo mới)
            </span>
            <Select
              mode="tags"
              options={[{ label: 'vip', value: 'vip' }]}
              value={tags}
              onChange={(value) => setTags(value as string[])}
              allowClear
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">grouped</span>
            <Select
              options={GROUPED}
              value={grouped}
              onChange={(value) => setGrouped(value as string)}
              showSearch
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">
              loading / disabled
            </span>
            <Select options={OPTIONS} loading placeholder="Đang tải" />
          </div>
        </div>
      </Section>

      <Section
        title="Form"
        hint="rules kiểu Ant Design — không schema, không resolver."
      >
        <Form
          form={form}
          className="w-full max-w-md"
          onFinish={(values) => toast.success(JSON.stringify(values))}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input type="email" placeholder="you@company.com" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            description="Select cắm thẳng vào Form.Item, không cần adapter."
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select options={OPTIONS} allowClear />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Nhãn"
            rules={[
              {
                validator: (value) =>
                  (Array.isArray(value) && value.length >= 2) ||
                  'Chọn ít nhất 2 nhãn',
              },
            ]}
          >
            <Select mode="tags" options={OPTIONS} />
          </Form.Item>

          <div className="flex gap-3">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              Reset
            </Button>
          </div>
        </Form>
      </Section>

      <Section title="Table">
        <div className="w-full min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setLoadingTable(true);
                setTimeout(() => setLoadingTable(false), 1200);
              }}
            >
              Thử loading
            </Button>
            <span className="text-sm text-muted-foreground">
              Đã chọn {selectedKeys.length} dòng · kéo mép cột "Họ và tên" để
              resize · bấm tiêu đề để sort · bấm mũi tên để xem thêm thông tin
            </span>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={loadingTable ? [] : paged}
            loading={loadingTable}
            scroll={{ x: 1_100, y: 320 }}
            rowSelection={{
              selectedRowKeys: selectedKeys,
              onChange: setSelectedKeys,
              getCheckboxProps: (row) => ({ disabled: row.status === 'done' }),
            }}
            expandable={{
              fixed: true,
              expandedRowRender: (row) => (
                <div className="grid gap-1 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">Liên hệ: </span>
                    {row.email} · {row.phone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tư vấn viên: </span>
                    {row.advisor}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-muted-foreground">Ghi chú: </span>
                    {row.note ?? 'Chưa có ghi chú cho học viên này.'}
                  </p>
                </div>
              ),
              rowExpandable: (row) => row.status !== 'done',
            }}
            rowActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Hành động"
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => toast(row.name)}>
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Xoá
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            pagination={{
              page,
              pageSize,
              total: ROWS.length,
              pageSizeOptions: [3, 5, 10],
              showLessItems: true,
              onChange: (nextPage, nextSize) => {
                setPage(nextPage);
                setPageSize(nextSize);
              },
              showTotal: (total, [from, to]) => `${from}–${to} trên ${total}`,
            }}
          />
        </div>
      </Section>

      <Section
        title="Modal"
        hint="Khai báo bằng <Modal open>, hoặc gọi lệnh qua Modal.useModal(). Dưới 768px nó tự trượt lên từ cạnh dưới; mobileSheet={false} để giữ modal giữa màn hình."
      >
        <Button onClick={() => setOpen(true)}>
          Mở modal {isMobile ? '(đang ở mobile → sheet)' : ''}
        </Button>

        <Button variant="secondary" onClick={() => setSheet(true)}>
          mobileSheet={'{false}'}
        </Button>

        <Button
          variant="destructive"
          onClick={async () => {
            const ok = await modal.confirm({
              title: 'Xoá bản ghi?',
              content: 'Hành động này không thể hoàn tác.',
              okText: 'Xoá',
              okVariant: 'destructive',
              onOk: () => new Promise((resolve) => setTimeout(resolve, 1200)),
            });
            if (ok) toast.success('Đã xoá');
          }}
        >
          Confirm (async)
        </Button>

        <Modal
          open={open}
          title="Tiêu đề modal"
          description="Mô tả ngắn cho screen reader và người dùng."
          confirmLoading={saving}
          onCancel={() => setOpen(false)}
          onOk={() => {
            setSaving(true);
            setTimeout(() => {
              setSaving(false);
              setOpen(false);
              toast.success('Đã lưu');
            }, 1200);
          }}
        >
          Nội dung bất kỳ. Nhấn OK để xem trạng thái confirmLoading — lúc đó
          mask, Escape và nút đóng đều bị khoá.
        </Modal>

        <Modal
          mobileSheet={false}
          open={sheet}
          title="Giữ ở giữa màn hình"
          okText="Đã hiểu"
          hideCancel
          onCancel={() => setSheet(false)}
          onOk={() => setSheet(false)}
        >
          Hộp thoại này tắt mobileSheet nên dù ở mobile vẫn là modal giữa màn
          hình. Mặc định thì mọi Modal đều trượt lên từ cạnh dưới khi màn hình
          hẹp hơn 768px, có thanh nắm kéo xuống để đóng, và hai nút chia đôi một
          hàng.
        </Modal>
      </Section>

      <Section title="Overlay">
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button variant="secondary">Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>Nội dung tooltip</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Mục một</DropdownMenuItem>
            <DropdownMenuItem>Mục hai</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="p-4 text-sm">
            Nội dung popover.
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Sheet</Button>
          </SheetTrigger>
          <SheetContent className="p-6">
            <p className="text-sm">Panel trượt từ cạnh màn hình.</p>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Feedback">
        <Button variant="secondary" onClick={() => toast.success('Thành công')}>
          Toast success
        </Button>
        <Button variant="secondary" onClick={() => toast.error('Có lỗi')}>
          Toast error
        </Button>
        <Spinner className="size-6 text-primary" />
        <div className="grid w-52 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Avatar>
          <AvatarFallback>LU</AvatarFallback>
        </Avatar>
        <Separator className="my-2" />
      </Section>

      <Section
        title="Notification"
        hint="Thẻ 384px ở góc màn hình: tiêu đề, mô tả, nút hành động. Rê chuột thì dừng đếm giờ."
      >
        <Button
          onClick={() =>
            notification.success({
              message: 'Đã lưu chiến dịch',
              description: 'Lịch gửi bắt đầu từ 9:00 sáng mai.',
            })
          }
        >
          success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            notification.warning({
              message: 'Nhập liệu chưa xong',
              description: '3 dòng bị bỏ qua vì thiếu email.',
              showProgress: true,
            })
          }
        >
          warning + progress
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            notification.error({
              message: 'Không gửi được',
              description:
                'Máy chủ SMTP từ chối kết nối. Kiểm tra lại cấu hình.',
              duration: 0,
            })
          }
        >
          error (không tự tắt)
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            notification.info({
              message: 'Góc dưới trái',
              description: 'placement đổi được cho từng thẻ.',
              placement: 'bottomLeft',
            })
          }
        >
          bottomLeft
        </Button>
      </Section>

      <Section title="Badge">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Thành công</Badge>
        <Badge variant="warning">Cảnh báo</Badge>
        <Badge variant="info">Thông tin</Badge>
        <Badge variant="muted">Nháp</Badge>
      </Section>

      <Section
        title="Status"
        hint="Chấm + nhãn. tone dựng sẵn, hoặc color tuỳ ý khi trạng thái đến từ database."
      >
        <Status tone="online" pulse>
          Đang chạy
        </Status>
        <Status tone="offline">Ngoại tuyến</Status>
        <Status tone="degraded" pulse>
          Suy giảm
        </Status>
        <Status tone="maintenance">Bảo trì</Status>
        <Status color="#17a2b8">Đang thực hiện</Status>
        <Status color="#28a745">Thuận lợi</Status>
      </Section>

      <Section title="Checkbox" hint="Ba trạng thái, kể cả indeterminate.">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={agree} onCheckedChange={setAgree} />
          Trạng thái: {String(agree)}
        </label>
        <label className="flex items-center gap-2 text-sm opacity-50">
          <Checkbox disabled checked />
          Disabled
        </label>
      </Section>

      <Section
        title="Tree"
        hint="Tick cha là tick cả nhánh; cha thành indeterminate khi con chỉ chọn một phần."
      >
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <Tree
              checkable
              data={TREE}
              defaultExpandedKeys={['academy', 'system']}
              checkedKeys={treeChecked}
              onCheck={setTreeChecked}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Đã tick: {treeChecked.join(', ') || '—'}
            </p>
          </div>

          <div className="min-w-0">
            <Tree
              showLines
              showIcons
              data={TREE}
              defaultExpandedKeys={['academy', 'system', 'role']}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              showLines + showIcons
            </p>
          </div>
        </div>
      </Section>

      <Section title="Kanban" hint="Kéo thẻ trong cột và giữa các cột.">
        <div className="w-full min-w-0">
          <KanbanProvider
            columns={COLUMNS}
            data={board}
            onDataChange={setBoard}
            className="min-h-56"
          >
            {(column) => (
              <KanbanBoard key={column.id} id={column.id}>
                <KanbanHeader>{column.name}</KanbanHeader>
                <KanbanCards id={column.id}>
                  {(item) => (
                    <KanbanCard key={item.id} id={item.id} name={item.name} />
                  )}
                </KanbanCards>
              </KanbanBoard>
            )}
          </KanbanProvider>
        </div>
      </Section>

      <Section title="List" hint="Kéo dọc để chuyển item giữa các nhóm.">
        <div className="w-full max-w-lg">
          <ListProvider
            onDragEnd={(event) => {
              const target = event.over?.id;
              if (!target) return;
              setListItems((current) =>
                current.map((item) =>
                  item.id === event.active.id
                    ? { ...item, group: String(target) }
                    : item,
                ),
              );
            }}
          >
            {LIST_GROUPS.map((group) => {
              const items = listItems.filter((item) => item.group === group.id);
              return (
                <ListGroup key={group.id} id={group.id}>
                  <ListHeader
                    name={group.name}
                    color={group.color}
                    count={items.length}
                  />
                  <ListItems>
                    {items.map((item, index) => (
                      <ListItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        index={index}
                        parent={group.id}
                      />
                    ))}
                  </ListItems>
                </ListGroup>
              );
            })}
          </ListProvider>
        </div>
      </Section>

      <Section
        title="Gantt"
        hint={`${GANTT_ROWS.length} lane · ${GANTT_ROWS.length * 4} task trải ~120 ngày. Cuộn ngang: sidebar đứng yên. Cuộn dọc: ruler đứng yên.`}
      >
        <div className="w-full min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {(['day', 'week', 'month'] as const).map((unit) => (
              <Button
                key={unit}
                size="sm"
                variant={ganttUnit === unit ? 'default' : 'secondary'}
                onClick={() => setGanttUnit(unit)}
              >
                {unit}
              </Button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">zoom</span>
            {[70, 100, 140].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={ganttZoom === value ? 'default' : 'secondary'}
                onClick={() => setGanttZoom(value)}
              >
                {value}%
              </Button>
            ))}
          </div>
          <Gantt
            rows={GANTT_ROWS}
            unit={ganttUnit}
            zoom={ganttZoom}
            sidebarTitle="Người phụ trách"
            maxHeight={360}
            markers={[
              { id: 'ship', date: day(7), label: 'Bàn giao', color: '#7c3aed' },
            ]}
            onItemClick={(item) => toast(item.name)}
            onRowClick={(row) => toast(String(row.label))}
          />
        </div>
      </Section>

      <Section title="Tabs" hint="Hai variant: default và underline.">
        <div className="grid w-full gap-6">
          {(['default', 'underline'] as const).map((variant) => (
            <Tabs key={variant} defaultValue="a">
              <TabsList variant={variant}>
                <TabsTrigger value="a">Tổng quan</TabsTrigger>
                <TabsTrigger value="b">Hoạt động</TabsTrigger>
                <TabsTrigger value="c" disabled>
                  Khoá
                </TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="pt-3 text-sm">
                Nội dung tab "Tổng quan" — variant <code>{variant}</code>.
              </TabsContent>
              <TabsContent value="b" className="pt-3 text-sm">
                Nội dung tab "Hoạt động".
              </TabsContent>
            </Tabs>
          ))}
        </div>
      </Section>

      <Section title="Radio" hint="Chọn một, có mô tả phụ dưới nhãn.">
        <RadioGroup
          value={plan}
          onValueChange={setPlan}
          className="grid w-full max-w-md gap-3"
        >
          <Radio value="basic" description="1 người dùng, 5 dự án">
            Gói cơ bản
          </Radio>
          <Radio value="pro" description="10 người dùng, không giới hạn dự án">
            Gói Pro
          </Radio>
          <Radio
            value="enterprise"
            disabled
            description="Liên hệ đội kinh doanh"
          >
            Doanh nghiệp
          </Radio>
        </RadioGroup>
      </Section>

      <Section
        title="Checkbox group"
        hint="Nhiều lựa chọn trên cùng một mảng giá trị."
      >
        <div className="grid w-full max-w-md gap-3">
          <CheckboxGroup value={channels} onValueChange={setChannels}>
            <CheckboxOption value="email">Email</CheckboxOption>
            <CheckboxOption value="sms" description="Tính phí theo tin nhắn">
              SMS
            </CheckboxOption>
            <CheckboxOption value="zalo" disabled>
              Zalo OA (chưa kết nối)
            </CheckboxOption>
          </CheckboxGroup>
          <p className="text-xs text-muted-foreground">
            Đang chọn: {channels.join(', ') || '—'}
          </p>
        </div>
      </Section>

      <Section
        title="Date"
        hint="Gõ theo từng ô dd/mm/yyyy, hoặc mở lịch. Mũi tên lên/xuống chỉnh ô đang focus."
      >
        <div className="grid w-full gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>DateField (chỉ gõ)</Label>
              <DateField
                clearable
                value={date}
                onChange={setDate}
                locale="vi-VN"
                className="max-w-56"
              />
            </div>

            <div className="grid gap-2">
              <Label>DatePicker</Label>
              <DatePicker
                clearable
                value={date}
                onChange={setDate}
                locale="vi-VN"
                className="max-w-56"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>DateRangePicker</Label>
            <DateRangePicker
              clearable
              locale="vi-VN"
              value={range}
              onChange={setRange}
              className="max-w-96"
              presets={[
                {
                  label: '7 ngày qua',
                  value: { from: addDays(new Date(), -6), to: new Date() },
                },
                {
                  label: '30 ngày qua',
                  value: { from: addDays(new Date(), -29), to: new Date() },
                },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {range.from?.toLocaleDateString('vi-VN') ?? '—'} →{' '}
              {range.to?.toLocaleDateString('vi-VN') ?? '—'}
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Calendar (gắn thẳng vào trang)</Label>
            <Calendar
              locale="vi-VN"
              captionLayout="dropdown"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Timeline"
        hint="Trạng thái lan từ item xuống indicator và đường nối. Chấm mặc định 10px như antd; có children thì tự nở thành huy hiệu 24px."
      >
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">
              mặc định — chấm theo trạng thái
            </span>
            <Timeline className="w-full max-w-md">
              <TimelineItem status="complete">
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Tạo đơn hàng</TimelineTitle>
                    <TimelineTime>08:30</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    Đơn DH000002 đã được tạo.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="complete">
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Xác nhận thanh toán</TimelineTitle>
                    <TimelineTime>09:15</TimelineTime>
                  </TimelineHeader>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="current">
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Chuẩn bị giao xe</TimelineTitle>
                    <TimelineTime>Hôm nay</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    Đang kiểm tra hồ sơ.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="error">
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Xuất hoá đơn VAT</TimelineTitle>
                  </TimelineHeader>
                  <TimelineDescription>Thiếu mã số thuế.</TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem status="pending">
                <TimelineIndicator />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Bàn giao</TimelineTitle>
                  </TimelineHeader>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <span className="text-xs text-muted-foreground">
                size=&quot;icon&quot; — huy hiệu 24px chứa glyph
              </span>
              <Timeline>
                <TimelineItem status="complete">
                  <TimelineIndicator>
                    <CheckIcon />
                  </TimelineIndicator>
                  <TimelineContent className="pb-4">
                    <TimelineTitle>Đã thanh toán</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="current">
                  <TimelineIndicator loading />
                  <TimelineContent className="pb-4">
                    <TimelineTitle>Đang xử lý</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="error">
                  <TimelineIndicator>
                    <XIcon />
                  </TimelineIndicator>
                  <TimelineContent>
                    <TimelineTitle>Xuất hoá đơn lỗi</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>

            <div className="grid gap-2">
              <span className="text-xs text-muted-foreground">
                variant + color — ép một kiểu chấm cho cả rail
              </span>
              <Timeline>
                <TimelineItem status="complete">
                  <TimelineIndicator variant="outlined" />
                  <TimelineContent className="pb-4">
                    <TimelineTitle>outlined (mặc định của antd)</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem status="current">
                  <TimelineIndicator variant="filled" />
                  <TimelineContent className="pb-4">
                    <TimelineTitle>filled</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineIndicator color="#16a34a" />
                  <TimelineContent>
                    <TimelineTitle>color tự đặt</TimelineTitle>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Breadcrumb & Label & Collapsible">
        <div className="grid w-full gap-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Học vụ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Khoá học</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid max-w-xs gap-2">
            <Label htmlFor="showcase-label">Nhãn cho input</Label>
            <Input
              id="showcase-label"
              placeholder="Bấm vào nhãn sẽ focus vào đây"
            />
          </div>

          <Collapsible className="max-w-md rounded-md border p-3">
            <CollapsibleTrigger className="w-full cursor-pointer text-left text-sm font-medium">
              Chi tiết đơn hàng (bấm để mở)
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
              Nội dung ẩn/hiện. Dùng làm nền cho menu con của Tree và Sidebar.
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Section>

      <Section
        title="Layout"
        hint="Khung trang thuần: header, sider (thu gọn được), content, footer."
      >
        <Layout className="h-80 w-full overflow-hidden rounded-lg border">
          <LayoutSider
            collapsible
            collapsed={siderCollapsed}
            onCollapse={setSiderCollapsed}
          >
            <div
              className={`flex items-center gap-x-3 px-4 pt-4 pb-2 ${
                siderCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <div className="size-6 shrink-0 rounded-md bg-primary" />
              {!siderCollapsed && (
                <span className="truncate text-base">Luma</span>
              )}
            </div>

            <nav className="grid gap-1 p-2 text-sm">
              {!siderCollapsed && (
                <div className="px-2 py-1.5 text-[13px] text-muted-foreground">
                  Chung
                </div>
              )}
              {[
                { icon: <HomeIcon className="size-4" />, label: 'Tổng quan' },
                { icon: <ListIcon className="size-4" />, label: 'Công việc' },
                { icon: <MailIcon className="size-4" />, label: 'Chiến dịch' },
              ].map((item, index) => (
                <span
                  key={item.label}
                  className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl font-[450] ${
                    siderCollapsed ? 'justify-center' : 'px-3'
                  } ${
                    index === 0
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {item.icon}
                  {!siderCollapsed && item.label}
                </span>
              ))}
            </nav>

            <LayoutFooter className="text-xs">Luma © 0.0.0</LayoutFooter>
          </LayoutSider>

          <Layout>
            <LayoutHeader>
              <span className="text-sm text-muted-foreground">Tổng quan</span>
              <div className="flex items-center gap-x-2">
                <Button variant="ghost" size="icon-sm">
                  <CalendarIcon />
                </Button>
                <Avatar className="size-8">
                  <AvatarFallback>LA</AvatarFallback>
                </Avatar>
              </div>
            </LayoutHeader>
            <LayoutContent className="text-sm text-muted-foreground">
              Nội dung trang. Sider giữ đúng 220/66px, header 50px và content
              đệm 24px như app thật.
            </LayoutContent>
          </Layout>
        </Layout>
      </Section>

      <Section
        title="Slider"
        hint="Một hoặc hai tay kéo, có tooltip và mốc giá trị."
      >
        <div className="grid w-full gap-8 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">
              single — {volume}
            </span>
            <Slider value={volume} onChange={(v) => setVolume(v as number)} />
          </div>

          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">
              range — {budget[0]}% đến {budget[1]}%
            </span>
            <Slider
              range
              value={budget}
              onChange={(v) => setBudget(v as number[])}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">marks + step</span>
            <Slider
              defaultValue={50}
              step={25}
              marks={{ 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }}
              tooltip="always"
            />
          </div>

          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">disabled</span>
            <Slider defaultValue={30} disabled />
          </div>
        </div>
      </Section>

      <Section
        title="Empty"
        hint="Trạng thái rỗng cho bảng, danh sách, tìm kiếm."
      >
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-lg border">
            <Empty description="Chưa có học viên nào">
              <Button size="sm">Thêm học viên</Button>
            </Empty>
          </div>
          <div className="rounded-lg border">
            <Empty
              size="sm"
              title="Không tìm thấy kết quả"
              description="Thử bỏ bớt bộ lọc hoặc đổi từ khoá."
            />
          </div>
        </div>
      </Section>

      <Section
        title="Image"
        hint="Có placeholder khi tải, ảnh thay thế khi lỗi, và trình xem phóng to/xoay."
      >
        <div className="flex flex-wrap items-start gap-4">
          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">preview</span>
            <Image
              src="/logo.png"
              alt="Logo Luma"
              placeholder
              wrapperClassName="size-32 rounded-lg border bg-muted"
              className="size-32 object-contain p-4"
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">
              lỗi tải → fallback
            </span>
            <Image
              src="/khong-co-anh-nay.png"
              alt="Ảnh hỏng"
              wrapperClassName="size-32 rounded-lg border"
              className="size-32"
            />
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs text-muted-foreground">preview=false</span>
            <Image
              src="/logo.svg"
              alt="Logo"
              preview={false}
              wrapperClassName="size-32 rounded-lg border bg-muted"
              className="size-32 object-contain p-4"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Tag"
        hint="Chip có màu, đóng được, hoặc bật/tắt như checkbox."
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>Mặc định</Tag>
            <Tag color="primary">Thương hiệu</Tag>
            <Tag color="success">Đang hoạt động</Tag>
            <Tag color="processing">Đang xử lý</Tag>
            <Tag color="warning">Sắp hết hạn</Tag>
            <Tag color="error">Thất bại</Tag>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag color="purple" icon={<StarIcon />}>
              VIP
            </Tag>
            <Tag color="#0ea5e9">Màu tuỳ ý</Tag>
            <Tag bordered={false} color="teal">
              Không viền
            </Tag>
            {openTags.map((tag) => (
              <Tag
                key={tag}
                closable
                color="indigo"
                onClose={() =>
                  setOpenTags(openTags.filter((entry) => entry !== tag))
                }
              >
                {tag}
              </Tag>
            ))}
            {openTags.length === 0 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setOpenTags(TAGS)}
              >
                Khôi phục
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TAGS.map((tag) => (
              <CheckableTag
                key={tag}
                checked={pickedTags.includes(tag)}
                onChange={(on) =>
                  setPickedTags(
                    on
                      ? [...pickedTags, tag]
                      : pickedTags.filter((entry) => entry !== tag),
                  )
                }
              >
                {tag}
              </CheckableTag>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Tag"
        hint="Chip có màu, đóng được, hoặc bật/tắt như checkbox."
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>Mặc định</Tag>
            <Tag color="primary">Thương hiệu</Tag>
            <Tag color="success">Đang hoạt động</Tag>
            <Tag color="processing">Đang xử lý</Tag>
            <Tag color="warning">Sắp hết hạn</Tag>
            <Tag color="error">Thất bại</Tag>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tag color="purple" icon={<StarIcon />}>
              VIP
            </Tag>
            <Tag color="#0ea5e9">Màu tuỳ ý</Tag>
            <Tag bordered={false} color="teal">
              Không viền
            </Tag>
            {openTags.map((tag) => (
              <Tag
                key={tag}
                closable
                color="indigo"
                onClose={() =>
                  setOpenTags(openTags.filter((entry) => entry !== tag))
                }
              >
                {tag}
              </Tag>
            ))}
            {openTags.length === 0 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setOpenTags(TAGS)}
              >
                Khôi phục
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TAGS.map((tag) => (
              <CheckableTag
                key={tag}
                checked={pickedTags.includes(tag)}
                onChange={(on) =>
                  setPickedTags(
                    on
                      ? [...pickedTags, tag]
                      : pickedTags.filter((entry) => entry !== tag),
                  )
                }
              >
                {tag}
              </CheckableTag>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Typography"
        hint="Ellipsis và copyable là hai thứ dùng nhiều nhất."
      >
        <div className="flex w-full flex-col gap-3">
          <Typography.Title level={3}>Danh sách học viên</Typography.Title>
          <div className="flex flex-wrap items-center gap-4">
            <Typography.Text type="secondary">Phụ</Typography.Text>
            <Typography.Text type="success">Thành công</Typography.Text>
            <Typography.Text type="warning">Cảnh báo</Typography.Text>
            <Typography.Text type="danger">Lỗi</Typography.Text>
            <Typography.Text strong>Đậm</Typography.Text>
            <Typography.Text italic>Nghiêng</Typography.Text>
            <Typography.Text underline>Gạch chân</Typography.Text>
            <Typography.Text deleted>Đã xoá</Typography.Text>
            <Typography.Text code>pnpm dev</Typography.Text>
            <Typography.Text mark>Đánh dấu</Typography.Text>
          </div>
          <Typography.Text copyable>HV-2026-0042</Typography.Text>
          <div className="max-w-sm">
            <Typography.Text ellipsis>
              Ghi chú rất dài về học viên này, đáng lẽ sẽ làm vỡ chiều cao dòng
              trong bảng nếu không cắt bớt.
            </Typography.Text>
          </div>
          <Typography.Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            className="max-w-md"
          >
            Đoạn văn dài dùng để kiểm tra kẹp dòng. Học viên đăng ký khoá IELTS
            6.5+ từ tháng 8, đã hoàn thành 12/20 buổi, điểm giữa kỳ 6.0. Tư vấn
            viên ghi nhận nguyện vọng thi vào tháng 11 và cần bổ sung kỹ năng
            Writing Task 2.
          </Typography.Paragraph>
        </div>
      </Section>

      <Section
        title="TreeSelect"
        hint="Chọn trong cây, có thể tick nhiều nhánh."
      >
        <div className="flex w-full flex-wrap gap-4">
          <div className="w-64">
            <TreeSelect
              showSearch
              allowClear
              treeData={TREE}
              value={treeSingle}
              onChange={(next) => setTreeSingle(next as string)}
              placeholder="Chọn một mục"
            />
          </div>
          <div className="w-72">
            <TreeSelect
              treeCheckable
              showSearch
              allowClear
              maxTagCount={2}
              treeData={TREE}
              value={granted}
              onChange={(next) => setGranted(next as string[])}
              placeholder="Chọn quyền"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Cascader"
        hint="Đi từng cấp, hợp với tỉnh / quận / phường."
      >
        <div className="flex w-full flex-wrap gap-4">
          <div className="w-64">
            <Cascader
              allowClear
              options={REGIONS}
              value={area}
              onChange={setArea}
              placeholder="Chọn khu vực"
            />
          </div>
          <div className="w-64">
            <Cascader
              changeOnSelect
              expandTrigger="hover"
              options={REGIONS}
              placeholder="Chọn cấp nào cũng được"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Transfer"
        hint="Hai cột, thấy cả phần chưa chọn lẫn đã chọn."
      >
        <Transfer
          showSearch
          dataSource={PERMISSIONS}
          targetKeys={assigned}
          onChange={setAssigned}
          titles={['Chưa cấp', 'Đã cấp']}
        />
      </Section>

      <Section title="CountBadge" hint="Số hoặc chấm đè lên icon, avatar, tab.">
        <div className="flex flex-wrap items-center gap-6">
          <CountBadge count={5}>
            <Button variant="outline" size="icon">
              <BellIcon />
            </Button>
          </CountBadge>
          <CountBadge count={128}>
            <Button variant="outline" size="icon">
              <MailIcon />
            </Button>
          </CountBadge>
          <CountBadge dot>
            <Button variant="outline" size="icon">
              <BellIcon />
            </Button>
          </CountBadge>
          <CountBadge dot color="#22c55e">
            <Avatar>
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
          </CountBadge>
          <CountBadge count={0} showZero>
            <Button variant="outline" size="icon">
              <MailIcon />
            </Button>
          </CountBadge>
          <span className="flex items-center gap-2 text-sm">
            Đứng riêng <CountBadge count={9} />
          </span>
        </div>
      </Section>

      <Section title="Popconfirm" hint="Hỏi lại ngay tại nút, nhẹ hơn Modal.">
        <div className="flex flex-wrap items-center gap-3">
          <Popconfirm
            title="Xoá học viên này?"
            description="Hành động không thể hoàn tác."
            okVariant="destructive"
            onConfirm={() => toast.success('Đã xoá')}
          >
            <Button variant="destructive" size="sm">
              Xoá
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Gửi email cho 42 học viên?"
            placement="right"
            onConfirm={() =>
              new Promise((resolve) => setTimeout(resolve, 1200)).then(() =>
                toast.success('Đã gửi'),
              )
            }
          >
            <Button variant="outline" size="sm">
              Gửi (async)
            </Button>
          </Popconfirm>

          <Popconfirm title="Không có icon" icon={null} placement="bottom">
            <Button variant="ghost" size="sm">
              Gọn
            </Button>
          </Popconfirm>
        </div>
      </Section>

      <Section title="Steps" hint="Tiến trình nhiều bước, ngang hoặc dọc.">
        <div className="flex w-full flex-col gap-8">
          <Steps items={STEPS} current={step} onChange={setStep} />
          <Steps items={STEPS} current={1} status="error" size="sm" />
          <div className="max-w-xs">
            <Steps items={STEPS} current={2} direction="vertical" />
          </div>
        </div>
      </Section>

      <Section
        title="Typography"
        hint="Ellipsis và copyable là hai thứ dùng nhiều nhất."
      >
        <div className="flex w-full flex-col gap-3">
          <Typography.Title level={3}>Danh sách học viên</Typography.Title>
          <div className="flex flex-wrap items-center gap-4">
            <Typography.Text type="secondary">Phụ</Typography.Text>
            <Typography.Text type="success">Thành công</Typography.Text>
            <Typography.Text type="warning">Cảnh báo</Typography.Text>
            <Typography.Text type="danger">Lỗi</Typography.Text>
            <Typography.Text strong>Đậm</Typography.Text>
            <Typography.Text italic>Nghiêng</Typography.Text>
            <Typography.Text underline>Gạch chân</Typography.Text>
            <Typography.Text deleted>Đã xoá</Typography.Text>
            <Typography.Text code>pnpm dev</Typography.Text>
            <Typography.Text mark>Đánh dấu</Typography.Text>
          </div>
          <Typography.Text copyable>HV-2026-0042</Typography.Text>
          <div className="max-w-sm">
            <Typography.Text ellipsis>
              Ghi chú rất dài về học viên này, đáng lẽ sẽ làm vỡ chiều cao dòng
              trong bảng nếu không cắt bớt.
            </Typography.Text>
          </div>
          <Typography.Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            className="max-w-md"
          >
            Đoạn văn dài dùng để kiểm tra kẹp dòng. Học viên đăng ký khoá IELTS
            6.5+ từ tháng 8, đã hoàn thành 12/20 buổi, điểm giữa kỳ 6.0. Tư vấn
            viên ghi nhận nguyện vọng thi vào tháng 11 và cần bổ sung kỹ năng
            Writing Task 2.
          </Typography.Paragraph>
        </div>
      </Section>

      <Section title="Rate" hint="Có nửa sao, xoá bằng cách bấm lại.">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-4">
            <Rate value={score} onChange={setScore} />
            <Typography.Text type="secondary">{score || '—'}</Typography.Text>
          </div>
          <Rate defaultValue={2.5} allowHalf />
          <Rate value={4} readOnly size="sm" />
          <Rate
            defaultValue={3}
            tooltips={['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']}
            size="lg"
          />
        </div>
      </Section>

      <Section title="AutoComplete" hint="Gõ tự do, danh sách chỉ là gợi ý.">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <AutoComplete
            allowClear
            options={SEARCHES}
            value={query}
            onChange={setQuery}
            placeholder="Tìm học viên"
          />
          <Typography.Text type="secondary">
            Giá trị: {query || '—'}
          </Typography.Text>
        </div>
      </Section>

      <Section
        title="TreeSelect"
        hint="Chọn trong cây, có thể tick nhiều nhánh."
      >
        <div className="flex w-full flex-wrap gap-4">
          <div className="w-64">
            <TreeSelect
              showSearch
              allowClear
              treeData={TREE}
              value={treeSingle}
              onChange={(next) => setTreeSingle(next as string)}
              placeholder="Chọn một mục"
            />
          </div>
          <div className="w-72">
            <TreeSelect
              treeCheckable
              showSearch
              allowClear
              maxTagCount={2}
              treeData={TREE}
              value={granted}
              onChange={(next) => setGranted(next as string[])}
              placeholder="Chọn quyền"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Cascader"
        hint="Đi từng cấp, hợp với tỉnh / quận / phường."
      >
        <div className="flex w-full flex-wrap gap-4">
          <div className="w-64">
            <Cascader
              allowClear
              options={REGIONS}
              value={area}
              onChange={setArea}
              placeholder="Chọn khu vực"
            />
          </div>
          <div className="w-64">
            <Cascader
              changeOnSelect
              expandTrigger="hover"
              options={REGIONS}
              placeholder="Chọn cấp nào cũng được"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Transfer"
        hint="Hai cột, thấy cả phần chưa chọn lẫn đã chọn."
      >
        <Transfer
          showSearch
          dataSource={PERMISSIONS}
          targetKeys={assigned}
          onChange={setAssigned}
          titles={['Chưa cấp', 'Đã cấp']}
        />
      </Section>

      <Section title="Alert" hint="Thông báo nằm trong trang, khác toast.">
        <div className="grid w-full gap-3">
          <Alert
            type="info"
            showIcon
            message="Đang đồng bộ"
            description="Dữ liệu học viên sẽ cập nhật sau vài phút."
          />
          <Alert type="success" showIcon message="Đã lưu thay đổi" closable />
          <Alert
            type="warning"
            showIcon
            message="Sắp hết hạn"
            description="Gói dùng thử còn 3 ngày."
            action={
              <Button size="sm" variant="outline">
                Gia hạn
              </Button>
            }
          />
          <Alert
            type="error"
            showIcon
            message="Không gửi được email"
            description="Máy chủ SMTP từ chối kết nối."
            closable
          />
        </div>
      </Section>

      <Section
        title="Tooltip"
        hint="Truyền title và placement, không cần ghép trigger với content."
      >
        <TooltipProvider>
          <div className="grid w-fit grid-cols-3 gap-2">
            {TOOLTIP_PLACEMENTS.map(({ key, placement }) =>
              placement ? (
                <Tooltip
                  key={key}
                  title={`placement="${placement}"`}
                  placement={placement}
                >
                  <Button variant="outline" size="sm" className="w-28">
                    {placement}
                  </Button>
                </Tooltip>
              ) : (
                <div key={key} />
              ),
            )}
          </div>
        </TooltipProvider>
      </Section>

      <Section
        title="Message"
        hint="Pill ở đỉnh màn hình. Gọi message.* từ bất kỳ đâu, không cần hook."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => message.success('Đã lưu thay đổi')}
          >
            success
          </Button>
          <Button
            variant="outline"
            onClick={() => message.info('Có 3 mục mới')}
          >
            info
          </Button>
          <Button
            variant="outline"
            onClick={() => message.warning('Sắp hết dung lượng')}
          >
            warning
          </Button>
          <Button
            variant="outline"
            onClick={() => message.error('Không gửi được email', 5)}
          >
            error (5s)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Same key, so the second call replaces the first in place instead
              // of stacking a second pill.
              message.open({
                key: 'sync',
                type: 'loading',
                content: 'Đang đồng bộ…',
                duration: 0,
              });
              setTimeout(
                () =>
                  message.open({
                    key: 'sync',
                    type: 'success',
                    content: 'Đồng bộ xong',
                  }),
                2000,
              );
            }}
          >
            loading → success
          </Button>
          <Button variant="ghost" onClick={() => message.destroy()}>
            destroy
          </Button>
        </div>
      </Section>

      <Section title="Progress" hint="Dạng thanh và dạng vòng.">
        <div className="grid w-full gap-4">
          <Progress percent={30} />
          <Progress percent={72} status="active" size="lg" />
          <Progress percent={100} status="success" />
          <Progress percent={45} status="exception" />
          <div className="flex flex-wrap items-center gap-6">
            <Progress type="circle" percent={64} />
            <Progress type="circle" percent={100} status="success" />
            <Progress
              type="circle"
              percent={38}
              diameter={72}
              strokeWidth={6}
              status="exception"
            />
          </div>
        </div>
      </Section>

      <Section title="Switch" hint="Bật/tắt có hiệu lực ngay, khác Checkbox.">
        <div className="flex flex-wrap items-center gap-6">
          <Switch checked={notify} onCheckedChange={setNotify} />
          <Switch size="sm" defaultChecked />
          <Switch
            checkedChildren="Bật"
            uncheckedChildren="Tắt"
            defaultChecked
          />
          <Switch loading defaultChecked />
          <Switch disabled />
        </div>
      </Section>

      <Section title="Segmented" hint="Chọn một trong vài lựa chọn, hiện hết.">
        <div className="grid w-full gap-4">
          <Segmented
            options={[
              { label: 'Ngày', value: 'day' },
              { label: 'Tuần', value: 'week' },
              { label: 'Tháng', value: 'month' },
              { label: 'Năm', value: 'year', disabled: true },
            ]}
            value={period}
            onChange={setPeriod}
          />
          <Segmented
            block
            size="lg"
            options={[
              { label: 'Danh sách', value: 'list', icon: <ListIcon /> },
              { label: 'Lịch', value: 'calendar', icon: <CalendarIcon /> },
            ]}
          />
        </div>
      </Section>

      <Section title="Textarea" hint="Tự giãn theo nội dung và đếm ký tự.">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Textarea placeholder="Ghi chú tự do…" />
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={200}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="autoSize + showCount"
          />
        </div>
      </Section>

      <Section
        title="RichTextEditor"
        hint="Tiptap + thanh công cụ. Ảnh chọn/dán/kéo thả, bảng, task list, màu chữ, căn lề. value là HTML, chạy được cả controlled lẫn uncontrolled."
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Soạn nội dung email…"
            maxLength={2000}
            showCount
            minHeight={220}
            onUploadImage={uploadImage}
            onError={(error) => message.error(error.message)}
            toolbar={[
              ...DEFAULT_TOOLBAR,
              'divider',
              {
                key: 'today',
                title: 'Chèn ngày hôm nay',
                icon: <CalendarIcon />,
                onClick: (editor) =>
                  editor
                    .chain()
                    .focus()
                    .insertContent(new Date().toLocaleDateString('vi-VN'))
                    .run(),
              },
            ]}
          />

          <div className="flex flex-col gap-2">
            <RichTextEditor
              toolbar={COMPACT_TOOLBAR}
              placeholder="COMPACT_TOOLBAR — dùng cho ô ghi chú ngắn…"
              minHeight={96}
            />
            <RichTextEditor
              starterKit={{ codeBlock: false, blockquote: false }}
              toolbar={[
                'block',
                'divider',
                'bold',
                'italic',
                'divider',
                'link',
              ]}
              placeholder="starterKit={{ codeBlock: false, blockquote: false }}"
              minHeight={72}
            />
            <RichTextEditor readOnly value={body} minHeight={72} />
          </div>
        </div>
      </Section>

      <Section
        title="Comparison"
        hint="Kéo thanh chia để so sánh hai lớp. Focus vào khung rồi dùng phím mũi tên cũng được."
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <Comparison className="aspect-video rounded-lg border">
            <ComparisonItem position="left" className="bg-primary/15">
              <span className="absolute bottom-3 left-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium">
                Trước
              </span>
            </ComparisonItem>
            <ComparisonItem position="right" className="bg-emerald-500/20">
              <span className="absolute right-3 bottom-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium">
                Sau
              </span>
            </ComparisonItem>
            <ComparisonHandle />
          </Comparison>

          <div className="flex flex-col gap-2">
            <Comparison
              mode="hover"
              position={split}
              onPositionChange={setSplit}
              className="aspect-video rounded-lg border"
            >
              <ComparisonItem position="left" className="bg-muted">
                <span className="absolute bottom-3 left-3 text-xs text-muted-foreground">
                  mode="hover"
                </span>
              </ComparisonItem>
              <ComparisonItem position="right" className="bg-foreground/80" />
              <ComparisonHandle />
            </Comparison>
            <p className="text-xs text-muted-foreground">
              Vị trí: {Math.round(split)}%
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Descriptions"
        hint="Bảng chi tiết chỉ đọc, có/không viền."
      >
        <div className="grid w-full gap-6">
          <Descriptions
            title="Học viên"
            extra={
              <Button size="sm" variant="outline">
                Sửa
              </Button>
            }
            bordered
            column={2}
            items={[
              { label: 'Họ tên', children: 'Nguyễn Thị Ánh Nguyệt' },
              { label: 'Khoá học', children: 'IELTS 6.5+' },
              { label: 'Email', children: 'nguyet.nguyen@example.com' },
              { label: 'Điện thoại', children: '0901 234 567' },
              {
                label: 'Trạng thái',
                children: <Badge variant="success">Đang học</Badge>,
                span: 2,
              },
            ]}
          />

          <Descriptions
            layout="vertical"
            column={3}
            size="sm"
            items={[
              { label: 'Người tư vấn', children: 'Lê Minh Anh' },
              { label: 'Ngày tạo', children: '15/08/2026' },
              { label: 'Học phí', children: '12.500.000 ₫' },
            ]}
          />
        </div>
      </Section>

      <Section title="Statistic" hint="Một con số, dùng cho dashboard.">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="py-4">
            <CardContent>
              <Statistic
                title="Doanh thu tháng"
                value={125_400_000}
                locale="vi-VN"
                suffix="₫"
                trend="up"
                delta="+12,4% so với tháng trước"
              />
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <Statistic
                title="Học viên mới"
                value={48}
                trend="down"
                delta="-6 học viên"
              />
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <Statistic
                title="Tỉ lệ chuyển đổi"
                value={32.457}
                precision={1}
                locale="vi-VN"
                suffix="%"
              />
            </CardContent>
          </Card>
          <Card className="py-4">
            <CardContent>
              <Statistic title="Đang tải" value={0} loading />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Result" hint="Kết quả toàn trang: xong, lỗi, 404, 403.">
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <div className="rounded-lg border">
            <Result
              status="success"
              title="Đã tạo chiến dịch"
              subTitle="Email sẽ gửi lúc 09:00 ngày mai."
              extra={<Button size="sm">Về danh sách</Button>}
            />
          </div>
          <div className="rounded-lg border">
            <Result
              status="404"
              title="Không tìm thấy trang"
              subTitle="Đường dẫn có thể đã đổi hoặc bị xoá."
              extra={
                <Button size="sm" variant="outline">
                  Quay lại
                </Button>
              }
            />
          </div>
        </div>
      </Section>

      <Section
        title="Time"
        hint="Gõ từng ô hh:mm:ss, hoặc mở bảng cuộn. Mũi tên lên/xuống chỉnh ô đang focus theo đúng step."
      >
        <div className="grid w-full gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>TimeField (chỉ gõ)</Label>
              <TimeField
                clearable
                value={time}
                onChange={setTime}
                format="HH:mm"
                className="max-w-40"
              />
            </div>

            <div className="grid gap-2">
              <Label>TimePicker</Label>
              <TimePicker
                clearable
                value={time}
                onChange={setTime}
                format="HH:mm"
                minuteStep={5}
                className="max-w-40"
              />
              <p className="text-xs text-muted-foreground">
                {time?.toLocaleTimeString('vi-VN') ?? '—'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>12 giờ + giây</Label>
              <TimePicker
                clearable
                format="hh:mm:ss A"
                defaultValue={new Date(2026, 0, 1, 14, 30, 0)}
                className="max-w-56"
              />
            </div>

            <div className="grid gap-2">
              <Label>Giới hạn 08:30 – 17:00</Label>
              <TimePicker
                format="HH:mm"
                min={new Date(2026, 0, 1, 8, 30)}
                max={new Date(2026, 0, 1, 17, 0)}
                minuteStep={15}
                className="max-w-40"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>TimeRangePicker</Label>
            <TimeRangePicker
              clearable
              format="HH:mm"
              minuteStep={15}
              value={shift}
              onChange={setShift}
              className="max-w-72"
            />
            <p className="text-xs text-muted-foreground">
              Ca làm: {shift.from?.toLocaleTimeString('vi-VN') ?? '—'} →{' '}
              {shift.to?.toLocaleTimeString('vi-VN') ?? '—'}
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="InputNumber"
        hint="Mũi tên lên/xuống và nút bấm đều chạy theo step. Làm tròn và kẹp vào min/max khi rời ô."
      >
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Cơ bản (1 – 99)</Label>
            <InputNumber
              value={seats}
              onChange={setSeats}
              min={1}
              max={99}
              className="max-w-40"
            />
          </div>

          <div className="grid gap-2">
            <Label>Có đơn vị + phân cách nghìn</Label>
            <InputNumber
              value={fee}
              onChange={setFee}
              min={0}
              step={100000}
              addonAfter="₫"
              formatter={(v) => v.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              className="max-w-56"
            />
          </div>

          <div className="grid gap-2">
            <Label>Thập phân (step 0.5)</Label>
            <InputNumber
              defaultValue={4.5}
              min={0}
              max={5}
              step={0.5}
              suffix={<span className="text-xs">/ 5</span>}
              className="max-w-40"
            />
          </div>

          <div className="grid gap-2">
            <Label>Không nút, có prefix</Label>
            <InputNumber
              defaultValue={20}
              min={0}
              max={100}
              controls={false}
              prefix={<span className="text-xs">%</span>}
              className="max-w-40"
            />
          </div>

          <div className="grid gap-2">
            <Label>Kích thước</Label>
            <div className="grid gap-2">
              <InputNumber size="sm" defaultValue={1} className="max-w-40" />
              <InputNumber defaultValue={1} className="max-w-40" />
              <InputNumber size="lg" defaultValue={1} className="max-w-40" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Disabled / readOnly</Label>
            <div className="grid gap-2">
              <InputNumber disabled defaultValue={7} className="max-w-40" />
              <InputNumber readOnly defaultValue={7} className="max-w-40" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Dropzone"
        hint="Kéo thả hoặc bấm để chọn; tệp sai định dạng/quá nặng bị chặn ngay."
      >
        <div className="grid w-full max-w-md gap-2">
          <Dropzone
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            maxFiles={3}
            src={upload}
            onDrop={(accepted) => setUpload(accepted)}
            onRemove={(_, index) =>
              setUpload(upload.filter((__, i) => i !== index))
            }
            onError={(error) => toast.error(error.message)}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
      </Section>

      <Section title="ImageZoom" hint="Bấm vào ảnh để phóng to, Esc để đóng.">
        <ImageZoom>
          <img
            src="https://placehold.co/1200x800/0071f9/ffffff.png"
            alt="Ảnh minh hoạ"
            className="h-32 w-48 rounded-md object-cover"
          />
        </ImageZoom>
      </Section>

      <Section
        title="Marquee"
        hint="Chạy theo px/giây nên danh sách dài ngắn đều cùng tốc độ; rê chuột thì dừng."
      >
        <Marquee className="border-y border-border py-4">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent speed={60}>
            {OWNERS.slice(0, 6).map((owner) => (
              <MarqueeItem
                key={owner}
                className="flex h-10 items-center rounded-md bg-muted px-4 text-sm font-medium"
              >
                {owner}
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </Section>

      {modalContextHolder}
    </div>
  );
};
