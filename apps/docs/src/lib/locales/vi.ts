import type { Dictionary } from '../types';

export const vi: Dictionary = {
  name: 'Tiếng Việt',
  lang: 'vi',

  chrome: {
    openMenu: 'Mở danh mục',
    toLight: 'Chuyển sang giao diện sáng',
    toDark: 'Chuyển sang giao diện tối',
    language: 'Ngôn ngữ',
    search: 'Tìm component…',
    noResults: 'Không có kết quả.',
    gettingStarted: 'Bắt đầu',
    tagline: 'Bộ component React khai báo.',
    docs: 'Tài liệu',
    components: 'Component',
    github: 'Kho mã trên GitHub',
    searchTitle: 'Tìm trong tài liệu',
    searchDescription: 'Tìm một bài hướng dẫn hoặc một component theo tên.',
    hintNavigate: 'di chuyển',
    hintOpen: 'mở',
    hintClose: 'đóng',
  },

  page: {
    onThisPage: 'Trên trang này',
    api: 'API',
    prop: 'Prop',
    type: 'Kiểu',
    default: 'Mặc định',
    description: 'Mô tả',
    linkTo: (title) => `Liên kết tới ${title}`,
    missingDemo: (path) =>
      `Trang này chưa có demo. Thêm tệp ${path} là nó xuất hiện ở đây.`,
    demoBroken: 'Demo này đang lỗi',
    showAll: (lines) => `Xem đầy đủ (${lines} dòng)`,
    copy: 'Chép mã',
    copied: 'Đã chép',
  },

  home: {
    installCommand: 'pnpm add @antkit/react',
    headlineLead: 'Props nói cái gì.',
    headlineRest: 'Codebase là Tailwind.',
    subtitle: (components) =>
      `${components} component React với props nói thẳng bạn muốn gì, dựng trên Radix và token Tailwind v4. Ship thẳng dạng source, nên bundler của bạn tự biên dịch còn agent của bạn đọc được.`,
    ctaStart: 'Bắt đầu',
    ctaBrowse: 'Xem component',
    trust: 'Giấy phép MIT · không bước build · tree-shake được',

    stats: {
      components: 'component',
      packages: 'package',
      buildSteps: 'bước build',
      licence: 'giấy phép',
    },

    api: {
      title: 'Props mô tả kết quả',
      body: 'Form nhận rules. Select nhận options và mode. Table nhận columns và dataSource. Không có gì chen giữa control và form của bạn — không thư viện schema, không resolver, không adapter.',
    },
    radix: {
      title: 'Radix bên dưới, Tailwind bên trên',
      body: 'Vai trò, quản lý focus và mô hình bàn phím đến từ Radix, nên dialog tự giam focus còn menu tự nghe phím mũi tên mà bạn không phải viết dòng nào. Phần nhìn là utility Tailwind v4, ghi đè bằng đúng các class bạn dùng ở phần còn lại của app.',
    },
    tokens: {
      title: 'Một tệp CSS chứa toàn bộ token',
      body: '@antkit/styles là màu, bo góc và thang chữ dưới dạng biến CSS, kèm biến thể dark. Đổi một token là mọi component đổi theo — không theme provider, không runtime, không build lại.',
    },
    agents: {
      title: 'Viết ra để agent đọc',
      body: 'Mỗi component mang một khối doc kèm ví dụ biên dịch được thật. npx antkit-skills gắn bài hướng dẫn vào dự án, còn @antkit/mcp phục vụ đúng nội dung đó dưới dạng tool. Agent của bạn đọc source thật trong node_modules, không phải một bản tóm tắt.',
    },
    gallery: {
      title: (groups, components) => `${groups} nhóm, ${components} component`,
      body: 'Đủ cho một trang quản trị, từ cái nút cho tới biểu đồ Gantt.',
      cta: 'Xem toàn bộ component',
    },
    install: {
      title: 'Hai package, một dòng import',
      body: 'Thêm package, trỏ Tailwind vào source, import tệp CSS. Cài đặt chỉ có vậy.',
      cta: 'Đọc hướng dẫn cài đặt',
    },
    footer: {
      docs: 'Tài liệu',
      components: 'Component',
      source: 'Mã nguồn',
      licence: 'Giấy phép MIT.',
    },
  },

  guides: {
    introduction: 'Giới thiệu',
    installation: 'Cài đặt',
  },

  groups: {
    general: 'Chung',
    layout: 'Bố cục',
    navigation: 'Điều hướng',
    dataEntry: 'Nhập liệu',
    dataDisplay: 'Hiển thị dữ liệu',
    feedback: 'Phản hồi',
  },

  components: {
    button:
      'Nút bấm với 6 variant, 5 kích thước, trạng thái loading và slot icon hai đầu.',
    typography:
      'Tiêu đề, đoạn văn và text phụ theo thang chữ của @antkit/styles.',

    layout: 'Khung trang: header, sider thu gọn được, content và footer.',
    sidebar:
      'Thanh điều hướng bên trái với nhóm menu, menu con, và chế độ thu gọn thành icon.',
    card: 'Khối nội dung có header, mô tả, phần thân và chân thẻ.',
    separator: 'Đường kẻ phân tách ngang hoặc dọc giữa các khối nội dung.',
    'scroll-shadow': 'Khung cuộn tự mờ dần ở cạnh nào còn nội dung phía sau.',

    breadcrumb: 'Đường dẫn phân cấp cho trang hiện tại.',
    'dropdown-menu':
      'Menu bật ra từ một nút: mục thường, checkbox, radio, menu con và nhóm.',
    'command-menu':
      'Bảng lệnh ⌘K: ô tìm kiếm trên một danh sách hành động, mở từ bất cứ đâu.',
    tabs: 'Chuyển nội dung theo tab, hai variant default và underline.',
    steps: 'Tiến trình nhiều bước theo chiều ngang hoặc dọc.',

    form: 'Form khai báo: rules đặt ngay trên field, không schema, không resolver.',
    input:
      'Ô nhập một dòng: mọi type của HTML, trạng thái lỗi, ghép icon và nút.',
    textarea: 'Ô nhập nhiều dòng, tự giãn theo nội dung và đếm ký tự.',
    'input-number':
      'Nhập số có nút tăng giảm, định dạng tiền tệ và giới hạn min/max.',
    label: 'Nhãn gắn với một control, bấm vào là focus.',
    select:
      'Một component phủ mọi biến thể: single, multiple, tags, search, group.',
    'auto-complete': 'Ô nhập tự do kèm gợi ý lọc theo những gì đang gõ.',
    cascader: 'Chọn giá trị theo nhiều cấp: tỉnh, quận, phường.',
    'tree-select': 'Select nhưng danh sách là một cây có thể tick nhiều nhánh.',
    transfer: 'Hai cột chuyển qua lại, dùng cho phân quyền và gán nhãn.',
    checkbox: 'Ô tick ba trạng thái, kể cả indeterminate.',
    'checkbox-group': 'Nhiều lựa chọn trên cùng một mảng giá trị.',
    radio: 'Chọn một trong nhiều, có mô tả phụ dưới nhãn.',
    switch: 'Bật/tắt tức thì, có trạng thái loading khi phải gọi API.',
    segmented: 'Nhóm nút chọn một, gọn hơn Radio khi chỉ có vài lựa chọn.',
    slider: 'Một hoặc hai tay kéo, có mốc giá trị và tooltip.',
    rate: 'Chấm sao, hỗ trợ nửa sao và ký tự tuỳ ý.',
    'date-picker':
      'Gõ theo từng ô dd/mm/yyyy hoặc mở lịch, có cả chọn khoảng ngày.',
    'time-picker': 'Chọn giờ theo cột, 12h hoặc 24h, có cả chọn khoảng ca làm.',
    dropzone: 'Vùng kéo thả tệp, có giới hạn loại, dung lượng và số lượng.',
    'rich-text-editor':
      'Trình soạn thảo có định dạng, ảnh và bảng — nhớ nạp lazy.',

    table:
      'Bảng dữ liệu: sort, chọn dòng, cột cố định, resize, mở rộng dòng, phân trang.',
    pagination:
      'Dải số trang, kèm đổi số dòng mỗi trang, ô nhảy nhanh và chế độ gọn.',
    descriptions: 'Danh sách nhãn – giá trị cho trang chi tiết.',
    statistic: 'Con số nổi bật kèm tiền tố, hậu tố và xu hướng tăng giảm.',
    tag: 'Chip có màu, đóng được, hoặc bật/tắt như checkbox.',
    badge: 'Nhãn trạng thái nhỏ với 8 tone dựng sẵn.',
    'count-badge': 'Chấm hoặc số đếm gắn vào góc một phần tử khác.',
    status: 'Chấm trạng thái kèm nhãn, có nhịp nhấp nháy.',
    avatar: 'Ảnh đại diện với chữ cái thay thế khi ảnh lỗi.',
    image: 'Ảnh có placeholder, fallback khi lỗi và trình xem phóng to.',
    'image-zoom': 'Phóng to ảnh ngay tại chỗ khi bấm vào.',
    comparison: 'Kéo thanh trượt để so sánh hai ảnh trước/sau.',
    calendar: 'Lịch gắn thẳng vào trang, chọn ngày hoặc khoảng ngày.',
    timeline: 'Dòng thời gian với trạng thái lan từ item xuống đường nối.',
    tree: 'Cây phân cấp có tick theo nhánh, đường nối và icon.',
    collapsible: 'Đóng mở một khối nội dung.',
    kanban: 'Bảng cột kéo thả thẻ trong cột và giữa các cột.',
    list: 'Danh sách nhóm, kéo dọc để chuyển item giữa các nhóm.',
    gantt: 'Biểu đồ tiến độ theo ngày/tuần/tháng, có mốc và zoom.',
    carousel:
      'Băng chuyền có snap, kèm chấm chỉ vị trí, mũi tên, tự chạy và hiệu ứng mờ dần.',
    marquee: 'Dải nội dung chạy vòng lặp, dừng khi rê chuột.',
    empty: 'Trạng thái rỗng cho bảng, danh sách và tìm kiếm.',
    tooltip: 'Chú thích ngắn khi rê chuột, 12 vị trí đặt.',
    popover: 'Thẻ nội dung bật ra từ một phần tử, có thể chứa control.',

    alert: 'Thông báo inline bốn trạng thái, đóng được, có nút hành động.',
    message: 'Thông báo mảnh ở đỉnh màn hình, gọi bằng lệnh.',
    notification:
      'Thẻ thông báo ở góc màn hình với tiêu đề, mô tả và hành động.',
    toast: 'Toast của Sonner đã gắn sẵn token và theme của kit.',
    modal: 'Hộp thoại khai báo hoặc gọi lệnh, tự thành sheet khi màn hình hẹp.',
    sheet: 'Panel trượt từ một cạnh màn hình.',
    popconfirm: 'Hỏi xác nhận ngay cạnh nút vừa bấm.',
    progress: 'Thanh hoặc vòng tiến độ, có trạng thái thành công và lỗi.',
    spinner: 'Vòng quay chờ, dùng kèm nút hoặc phủ lên một khối.',
    skeleton: 'Khối xám nhấp nháy giữ chỗ trong lúc dữ liệu đang tải.',
    result: 'Trang kết quả cho thành công, lỗi 403/404/500.',
  },
};
