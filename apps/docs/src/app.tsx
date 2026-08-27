import { useEffect, useState } from 'react';

import {
  Button,
  MessageProvider,
  Toaster,
  UiConfigProvider,
} from '@antkit/react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Showcase } from './showcase';

/** The handful of strings the components ask their host to translate. */
const LABELS: Record<string, string> = {
  ok: 'Đồng ý',
  cancel: 'Huỷ',
  close: 'Đóng',
  now: 'Bây giờ',
  startTime: 'Bắt đầu',
  endTime: 'Kết thúc',
  clear: 'Xoá',
  remove: 'Bỏ',
  search: 'Tìm kiếm…',
  noData: 'Không có dữ liệu',
  selectPlaceholder: 'Chọn…',
  processing: 'Đang xử lý…',
  dialog: 'Hộp thoại',
  dialogDescription: 'Nội dung hộp thoại',
  rowsPerPage: 'Số dòng mỗi trang',
  previousPage: 'Trang trước',
  nextPage: 'Trang sau',
  selectAll: 'Chọn tất cả',
  selectRow: 'Chọn dòng',
  resizeColumn: 'Đổi độ rộng cột',
};

const translate = (key: string) => LABELS[key] ?? key;

const useTheme = () => {
  const [dark, setDark] = useState(
    () =>
      localStorage.getItem('antkit-theme') === 'dark' ||
      (!localStorage.getItem('antkit-theme') &&
        matchMedia('(prefers-color-scheme: dark)').matches),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('antkit-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark] as const;
};

export const App = () => {
  const [dark, setDark] = useTheme();

  return (
    <UiConfigProvider translate={translate}>
      <div className="min-h-dvh bg-background text-foreground">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <span className="font-medium">antkit</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={dark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            onClick={() => setDark(!dark)}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <Showcase />
        </main>
      </div>

      <Toaster />
      <MessageProvider />
    </UiConfigProvider>
  );
};
