import {toast} from 'react-toastify';

class ToastService {
    public success(message: string): void {
        toast.success(message);
    }

    public error(message: string): void {
        toast.error(message);
    }

    public info(message: string): void {
        toast.info(message);
    }
}

const toastService = new ToastService();
export default toastService;
