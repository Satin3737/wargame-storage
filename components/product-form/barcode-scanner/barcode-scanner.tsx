'use client';

import {XIcon} from '@phosphor-icons/react/ssr';
import {BrowserMultiFormatReader, type IScannerControls} from '@zxing/browser';
import {type FC, useEffect, useRef, useState} from 'react';
import {hapticsService, toastService} from '@/services';
import {IconButton, Modal, ModalVariant, Spinner} from '@/components';
import type {IBarcodeScannerProps} from './types';
import styles from './barcode-scanner.module.scss';

const CooldownMs = 1500;

const BarcodeScanner: FC<IBarcodeScannerProps> = ({open, onClose, onDetected}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [starting, setStarting] = useState(false);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        if (!open) return;
        const video = videoRef.current;
        if (!video) return;

        let controls: IScannerControls | null = null;
        let cancelled = false;
        setStarting(true);

        const reader = new BrowserMultiFormatReader();
        reader
            .decodeFromVideoDevice(undefined, video, (result, _err, ctrl) => {
                controls = ctrl;
                if (!result) return;
                const now = Date.now();
                if (now - lastTimeRef.current < CooldownMs) return;
                lastTimeRef.current = now;
                hapticsService.success();
                onDetected(result.getText());
            })
            .then(ctrl => {
                if (cancelled) {
                    ctrl.stop();
                    return;
                }
                controls = ctrl;
                setStarting(false);
            })
            .catch(() => {
                toastService.error('Нет доступа к камере');
                setStarting(false);
                onClose();
            });

        return () => {
            cancelled = true;
            controls?.stop();
        };
    }, [open, onDetected, onClose]);

    return (
        <Modal open={open} onClose={onClose} variant={ModalVariant.center} contentClassName={styles.modalContent}>
            <div className={styles.header}>
                <span className={styles.title}>{'Сканирование штрихкода'}</span>
                <IconButton onClick={onClose} aria-label={'close'}>
                    <XIcon size={20} />
                </IconButton>
            </div>
            <div className={styles.viewport}>
                <video ref={videoRef} className={styles.video} muted playsInline />
                <div className={styles.overlay}>
                    <span className={styles.cornerTl} />
                    <span className={styles.cornerTr} />
                    <span className={styles.cornerBl} />
                    <span className={styles.cornerBr} />
                    <span className={styles.line} />
                </div>
                {starting && (
                    <div className={styles.loading}>
                        <Spinner size={24} />
                    </div>
                )}
            </div>
            <p className={styles.hint}>{'Наведите камеру на штрихкод'}</p>
        </Modal>
    );
};

export default BarcodeScanner;
