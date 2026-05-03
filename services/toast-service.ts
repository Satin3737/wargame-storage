import {ToastOptions, toast} from 'react-toastify';

class ToastService {
    private readonly options: ToastOptions = {
        theme: 'dark',
        autoClose: 1000,
        closeOnClick: true,
        closeButton: false,
        hideProgressBar: true
    };

    public success(message: string): void {
        toast.success(message, this.options);
    }

    public error(message: string): void {
        toast.error(message, this.options);
    }

    public info(message: string): void {
        toast.info(message, this.options);
    }
}

const toastService = new ToastService();
export default toastService;
