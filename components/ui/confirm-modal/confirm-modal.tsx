import type {FC} from 'react';
import {BtnVariant, Button, Modal, ModalVariant} from '@/components';
import type {IConfirmModalProps} from './types';
import styles from './confirm-modal.module.scss';

const ConfirmModal: FC<IConfirmModalProps> = ({open, message, confirmLabel = 'Удалить', onConfirm, onCancel}) => (
    <Modal open={open} onClose={onCancel} variant={ModalVariant.center}>
        <div className={styles.wrap}>
            <p className={styles.message}>{message}</p>
            <div className={styles.actions}>
                <Button variant={BtnVariant.ghost} onClick={onCancel}>
                    {'Отмена'}
                </Button>
                <Button variant={BtnVariant.danger} onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    </Modal>
);

export default ConfirmModal;
