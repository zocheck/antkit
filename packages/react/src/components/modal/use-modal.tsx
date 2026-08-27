import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { Modal } from './modal';
import type { ModalProps } from './modal';

export type ConfirmOptions = Omit<
  ModalProps,
  'open' | 'onOk' | 'onCancel' | 'children'
> & {
  content?: ReactNode;
  /**
   * Runs while the dialog stays open with its OK button spinning. The dialog
   * closes when the promise resolves; a rejection leaves it open so the caller
   * can surface the error.
   */
  onOk?: () => unknown | Promise<unknown>;
};

export type ModalApi = {
  /** Resolves `true` when confirmed, `false` when dismissed. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

type PendingConfirm = {
  options: ConfirmOptions;
  settle: (confirmed: boolean) => void;
};

/**
 * Imperative confirmation dialogs: one you `await` rather than render.
 *
 * ```tsx
 * const [modal, contextHolder] = Modal.useModal();
 *
 * const remove = async () => {
 *   const ok = await modal.confirm({
 *     title: t('deleteTodo'),
 *     content: t('deleteTodoConfirm'),
 *     okVariant: 'destructive',
 *     onOk: () => deleteTodo.mutateAsync(id),
 *   });
 *   if (ok) toast.success(t('deleted'));
 * };
 *
 * return <>{contextHolder}<Button onClick={remove}>…</Button></>;
 * ```
 *
 * The returned `contextHolder` must be rendered — it is the dialog itself, kept
 * inside your tree so it still sees the app's providers (theme, i18n, router).
 * That is the whole reason this is a hook rather than a global `Modal.confirm`.
 */
export const useModal = (): [ModalApi, ReactNode] => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ options, settle: resolve });
      }),
    [],
  );

  const close = useCallback(
    (confirmed: boolean) => {
      pending?.settle(confirmed);
      setPending(null);
      setLoading(false);
    },
    [pending],
  );

  const handleOk = useCallback(async () => {
    if (!pending) return;

    const result = pending.options.onOk?.();

    if (result instanceof Promise) {
      setLoading(true);
      try {
        await result;
      } catch {
        // Keep the dialog open; the caller reports the failure its own way.
        setLoading(false);
        return;
      }
    }

    close(true);
  }, [pending, close]);

  const api = useMemo<ModalApi>(() => ({ confirm }), [confirm]);

  const contextHolder = (
    <Modal
      {...pending?.options}
      open={!!pending}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={() => close(false)}
    >
      {pending?.options.content}
    </Modal>
  );

  return [api, contextHolder];
};
