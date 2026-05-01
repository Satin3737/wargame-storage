export interface IBarcodeScannerProps {
    open: boolean;
    onClose: () => void;
    onDetected: (code: string) => void;
}
