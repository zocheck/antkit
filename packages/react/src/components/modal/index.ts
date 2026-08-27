import { Modal as ModalRoot } from './modal';
import { useModal } from './use-modal';

export * from './dialog';
export type { ModalProps } from './modal';
export type { ConfirmOptions, ModalApi } from './use-modal';

export const Modal = Object.assign(ModalRoot, { useModal });
export { useModal };
