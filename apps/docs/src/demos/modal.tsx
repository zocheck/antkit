import { useState } from 'react';

import { Button, Input, Label, Modal, useIsMobile } from '@antkit/react';
import { toast } from 'sonner';

import type { DemoMeta } from '../lib/types';

export const meta: DemoMeta = {
  imports: ['Modal'],
  api: [
    {
      title: 'Modal',
      description:
        'A dialog driven by `open`, with the footer already built. Use `Sheet` for a panel sliding in from an edge, and `Popconfirm` to ask right beside the button just pressed.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          description:
            'The open state. Required — the modal holds none of its own.',
        },
        {
          name: 'variant',
          type: "'default' | 'alert'",
          default: "'default'",
          description:
            'alert is the choice that cannot be sidestepped: role="alertdialog", no close button, neither Escape nor a click outside dismisses it, on a phone it stays centred rather than becoming a sheet, and focus opens on the cancel button.',
        },
        { name: 'title', type: 'ReactNode', description: 'The title.' },
        {
          name: 'description',
          type: 'ReactNode',
          description:
            'The description for screen readers, also drawn above the body when present.',
        },
        {
          name: 'onOk / onCancel',
          type: '() => void',
          description: 'The two buttons of the default footer.',
        },
        {
          name: 'okText / cancelText',
          type: 'ReactNode',
          description:
            'The text on the two buttons. Defaults come from `ConfigProvider`.',
        },
        {
          name: 'okVariant',
          type: "'default' | 'destructive'",
          default: "'default'",
          description: 'The style of the OK button.',
        },
        {
          name: 'confirmLoading',
          type: 'boolean',
          default: 'false',
          description:
            'Spins the OK button and locks both buttons, along with the mask and Escape.',
        },
        {
          name: 'hideCancel',
          type: 'boolean',
          default: 'false',
          description:
            'Drops the Cancel button — for a dialog that only asks to be acknowledged.',
        },
        {
          name: 'footer',
          type: 'ReactNode | null',
          description: 'Replaces the footer entirely. `null` removes it.',
        },
        {
          name: 'width',
          type: 'number | string',
          default: '520',
          description:
            'Any CSS width. Ignored once the dialog has become a sheet.',
        },
        {
          name: 'centered',
          type: 'boolean',
          default: 'false',
          description: 'Centres it vertically instead of sitting high.',
        },
        {
          name: 'mobileSheet',
          type: 'boolean',
          default: 'true',
          description:
            'Under 768px it opens from the bottom edge as a sheet: full width, rounded at the top, with a grab handle to pull it down and two buttons splitting one row within thumb reach. Set `false` for a dialog that has to stay centred.',
        },
        {
          name: 'maskClosable',
          type: 'boolean',
          default: 'true',
          description:
            'A click outside or Escape closes it. Switched off while `confirmLoading`.',
        },
      ],
    },
    {
      title: 'Modal.useModal()',
      description:
        'A confirmation dialog called imperatively — something you `await` rather than render. It returns `[modal, contextHolder]`, and `contextHolder` has to be rendered: it is the dialog itself, and living in your tree is what lets it see the app providers (theme, i18n, router). That is why this is a hook rather than a global `Modal.confirm`.',
      props: [
        {
          name: 'modal.confirm(options)',
          type: 'Promise<boolean>',
          description:
            'Resolves `true` when the user agrees, `false` when they walk away.',
        },
        {
          name: 'options.content',
          type: 'ReactNode',
          description: 'The body of the dialog.',
        },
        {
          name: 'options.onOk',
          type: '() => unknown | Promise<unknown>',
          description:
            'Runs while the dialog is still open and the OK button is spinning. Resolve and the dialog closes; reject and it stays put so you can report the error.',
        },
        {
          name: 'options.*',
          type: 'ModalProps',
          description:
            'Every other `Modal` prop except `open`, `onCancel` and `children`.',
        },
      ],
    },
  ],
};

/**
 * Basic
 *
 * `open` is yours to hold; the modal does not close itself on OK — you decide
 * when the work is done.
 */
export const Basic = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>

      <Modal
        open={open}
        title="Modal title"
        description="A short description, for screen readers and for the reader."
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
          toast.success('Saved');
        }}
      >
        Any content at all.
      </Modal>
    </>
  );
};

/**
 * Forcing a choice
 *
 * `variant="alert"` is for what cannot be undone: no close button, Escape does
 * nothing, a click outside does nothing. On a phone it stays centred rather
 * than becoming a sheet — a sheet swipes away, which is exactly what this
 * dialog must not do. Focus opens on cancel, not on delete.
 */
export const Alert = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>

      <Modal
        variant="alert"
        open={open}
        title="Delete this project?"
        okText="Delete"
        okVariant="destructive"
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
          toast.success('Project deleted');
        }}
      >
        Every board and every task inside goes with it. This cannot be undone.
      </Modal>
    </>
  );
};

/**
 * While it works
 *
 * `confirmLoading` locks the mask, Escape and the close button — nobody walks
 * out of an operation half-finished.
 */
export const ConfirmLoading = () => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Save with a delay
      </Button>

      <Modal
        open={open}
        title="Save changes"
        confirmLoading={saving}
        onCancel={() => setOpen(false)}
        onOk={() => {
          setSaving(true);
          setTimeout(() => {
            setSaving(false);
            setOpen(false);
            toast.success('Saved');
          }, 1500);
        }}
      >
        Press OK to watch the working state.
      </Modal>
    </>
  );
};

/**
 * Called imperatively
 *
 * `Modal.useModal()` returns a promise, so a delete flow reads as one straight
 * async function. Remember to render `contextHolder`.
 */
export const Confirm = () => {
  const [modal, contextHolder] = Modal.useModal();

  const remove = async () => {
    const ok = await modal.confirm({
      title: 'Delete this record?',
      content: 'This cannot be undone.',
      okText: 'Delete',
      okVariant: 'destructive',
      onOk: () => new Promise((resolve) => setTimeout(resolve, 1200)),
    });

    if (ok) toast.success('Deleted');
  };

  return (
    <>
      {contextHolder}
      <Button variant="destructive" onClick={remove}>
        Delete (async)
      </Button>
    </>
  );
};

/**
 * Holding a form
 *
 * `footer` replaces the two default buttons when the flow needs more than OK
 * and Cancel.
 */
export const WithForm = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Add student
      </Button>

      <Modal
        open={open}
        title="Add student"
        onCancel={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Later
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success('Added');
              }}
            >
              Add and continue
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="modal-name">Full name</Label>
            <Input id="modal-name" placeholder="Sarah Chen" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modal-phone">Phone</Label>
            <Input id="modal-phone" placeholder="+1 415 555 0134" />
          </div>
        </div>
      </Modal>
    </>
  );
};

/**
 * Acknowledgement only
 *
 * `hideCancel` drops the Cancel button; `maskClosable={false}` makes the
 * reader press it.
 */
export const Acknowledge = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Important notice
      </Button>

      <Modal
        open={open}
        title="Scheduled maintenance"
        okText="Understood"
        hideCancel
        maskClosable={false}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        The system is down from 22:00 to 23:00 tonight.
      </Modal>
    </>
  );
};

/**
 * On a narrow screen
 *
 * By default the modal slides up from the bottom edge under 768px.
 * `mobileSheet={false}` keeps it centred. Narrow the window to see the
 * difference.
 */
export const MobileSheet = () => {
  const [sheet, setSheet] = useState(false);
  const [centered, setCentered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Button onClick={() => setSheet(true)}>
        Default {isMobile ? '(on mobile → sheet)' : ''}
      </Button>
      <Button variant="secondary" onClick={() => setCentered(true)}>
        mobileSheet={'{false}'}
      </Button>

      <Modal
        open={sheet}
        title="Default"
        okText="Understood"
        hideCancel
        onOk={() => setSheet(false)}
        onCancel={() => setSheet(false)}
      >
        Under 768px this dialog slides up from the bottom edge and carries a
        handle to pull it back down.
      </Modal>

      <Modal
        open={centered}
        mobileSheet={false}
        title="Always centred"
        okText="Understood"
        hideCancel
        onOk={() => setCentered(false)}
        onCancel={() => setCentered(false)}
      >
        This dialog keeps its shape at every screen size.
      </Modal>
    </>
  );
};
