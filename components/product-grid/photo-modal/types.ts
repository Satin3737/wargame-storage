export interface IPhotoModalProps {
    blob: Blob | null;
    open: boolean;
    onClose: () => void;
}
