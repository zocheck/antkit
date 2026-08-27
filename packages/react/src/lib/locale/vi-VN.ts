import type { Locale } from '../locale';

/**
 * Vietnamese. Import it from the subpath so it only lands in the bundle of an
 * app that actually uses it:
 *
 * ```tsx
 * import { viVN } from '@antkit/react/locale/vi-VN';
 *
 * <ConfigProvider locale={viVN}>{children}</ConfigProvider>;
 * ```
 */
export const viVN: Locale = {
  name: 'Tiếng Việt',
  lang: 'vi-VN',

  common: {
    ok: 'Đồng ý',
    cancel: 'Huỷ',
    close: 'Đóng',
    clear: 'Xoá',
    remove: 'Bỏ',
    search: 'Tìm kiếm…',
    noData: 'Không có dữ liệu',
    selectPlaceholder: 'Chọn…',
    processing: 'Đang xử lý…',
    loading: 'Đang tải',
    dialog: 'Hộp thoại',
    dialogDescription: 'Nội dung hộp thoại',
    expand: 'Xem thêm',
    collapse: 'Thu gọn',
    copy: 'Chép',
    copied: 'Đã chép',
  },

  pagination: {
    rowsPerPage: 'Số dòng mỗi trang',
    perPage: '/ trang',
    previousPage: 'Trang trước',
    nextPage: 'Trang sau',
    jumpToPage: 'Tới trang',
    go: 'Đi',
  },

  table: {
    selectAll: 'Chọn tất cả',
    selectRow: 'Chọn dòng',
    expandRow: 'Mở rộng dòng',
    collapseRow: 'Thu gọn dòng',
    resizeColumn: 'Đổi độ rộng cột',
  },

  carousel: {
    label: 'Băng chuyền',
    slide: 'Slide',
    previousSlide: 'Slide trước',
    nextSlide: 'Slide sau',
    goToSlide: 'Tới slide',
  },

  transfer: {
    source: 'Nguồn',
    target: 'Đã chọn',
    toSource: 'Chuyển về nguồn',
    toTarget: 'Chuyển sang đã chọn',
  },

  datePicker: {
    openCalendar: 'Mở lịch',
    clearDate: 'Xoá ngày',
    clearRange: 'Xoá khoảng ngày',
    placeholders: { day: 'dd', month: 'mm', year: 'yyyy' },
    segments: { day: 'Ngày', month: 'Tháng', year: 'Năm' },
    calendar: {
      previousMonth: 'Tháng trước',
      nextMonth: 'Tháng sau',
      monthSelect: 'Tháng',
      yearSelect: 'Năm',
    },
  },

  timePicker: {
    openPanel: 'Mở bảng giờ',
    clearTime: 'Xoá giờ',
    clearRange: 'Xoá khoảng giờ',
    now: 'Bây giờ',
    startTime: 'Bắt đầu',
    endTime: 'Kết thúc',
    placeholders: { hour: 'hh', minute: 'mm', second: 'ss', dayPeriod: '--' },
    segments: {
      hour: 'Giờ',
      minute: 'Phút',
      second: 'Giây',
      dayPeriod: 'SA/CH',
    },
    dayPeriod: { am: 'SA', pm: 'CH' },
  },

  image: {
    open: 'Xem ảnh',
    close: 'Đóng',
    zoomIn: 'Phóng to',
    zoomOut: 'Thu nhỏ',
    rotateLeft: 'Xoay trái',
    rotateRight: 'Xoay phải',
    zoom: 'Phóng to ảnh',
    unzoom: 'Thu nhỏ ảnh',
  },

  dropzone: {
    title: 'Kéo thả tệp vào đây',
    description: 'hoặc bấm để chọn từ máy',
    remove: 'Xoá tệp',
    files: (count: number) => `${count} tệp đã chọn`,
    hint: ({
      accept,
      minSize,
      maxSize,
      maxFiles,
    }: {
      accept?: string;
      minSize?: number;
      maxSize?: number;
      maxFiles?: number;
    }) => {
      const parts: string[] = [];

      if (accept) parts.push(accept);
      if (minSize && maxSize) parts.push(`${minSize} – ${maxSize}`);
      else if (maxSize) parts.push(`tối đa ${maxSize}`);
      else if (minSize) parts.push(`tối thiểu ${minSize}`);
      if (maxFiles && maxFiles > 1) parts.push(`tối đa ${maxFiles} tệp`);

      return parts.length ? parts.join(' · ') : null;
    },
    rejectedType: (name: string) => `${name}: định dạng không được chấp nhận`,
    rejectedTooLarge: (name: string, max: string) => `${name}: lớn hơn ${max}`,
    rejectedTooSmall: (name: string, min: string) => `${name}: nhỏ hơn ${min}`,
    rejectedTooMany: (name: string, limit: number) =>
      `${name}: vượt quá ${limit} tệp`,
  },

  inputNumber: { increase: 'Tăng', decrease: 'Giảm' },

  layout: { collapseMenu: 'Thu gọn menu' },

  modal: { grabToClose: 'Kéo xuống để đóng' },

  editor: {
    undo: 'Hoàn tác',
    redo: 'Làm lại',
    bold: 'Đậm',
    italic: 'Nghiêng',
    underline: 'Gạch chân',
    strike: 'Gạch ngang',
    inlineCode: 'Mã inline',
    subscript: 'Chỉ số dưới',
    superscript: 'Chỉ số trên',
    bulletList: 'Danh sách dấu chấm',
    orderedList: 'Danh sách đánh số',
    taskList: 'Danh sách công việc',
    blockquote: 'Trích dẫn',
    codeBlock: 'Khối mã',
    horizontalRule: 'Đường kẻ ngang',
    clearFormatting: 'Xoá định dạng',
    bodyText: 'Văn bản',
    heading: (level: number) => `Tiêu đề ${level}`,
    alignment: 'Căn lề',
    alignLeft: 'Căn trái',
    alignCenter: 'Căn giữa',
    alignRight: 'Căn phải',
    alignJustify: 'Căn đều',
    insertLink: 'Chèn liên kết',
    removeLink: 'Bỏ liên kết',
    save: 'Lưu',
    textColour: 'Màu chữ',
    clearTextColour: 'Bỏ màu chữ',
    highlight: 'Tô nền',
    clearHighlight: 'Bỏ nền',
    insertImage: 'Chèn ảnh',
    chooseImage: 'Chọn ảnh từ máy',
    uploading: 'Đang tải lên…',
    insert: 'Chèn',
    table: 'Bảng',
    insertTable: 'Chèn bảng 3 × 3',
    columnBefore: 'Thêm cột bên trái',
    columnAfter: 'Thêm cột bên phải',
    deleteColumn: 'Xoá cột',
    rowAbove: 'Thêm hàng phía trên',
    rowBelow: 'Thêm hàng phía dưới',
    deleteRow: 'Xoá hàng',
    mergeCells: 'Gộp / tách ô',
    toggleHeaderRow: 'Bật/tắt hàng tiêu đề',
    deleteTable: 'Xoá bảng',
    unreadableFile: 'Không đọc được tệp',
    imageTooLarge: (name: string, maxMb: number) =>
      `${name} nặng hơn ${maxMb} MB`,
  },

  validation: {
    required: 'Vui lòng nhập trường này',
    email: 'Email không hợp lệ',
    url: 'Đường dẫn không hợp lệ',
    number: 'Giá trị phải là số',
    integer: 'Giá trị phải là số nguyên',
    min: 'Giá trị nhỏ hơn mức cho phép',
    max: 'Giá trị lớn hơn mức cho phép',
    len: 'Độ dài không đúng',
    pattern: 'Định dạng không đúng',
    invalid: 'Giá trị không hợp lệ',
  },
};
