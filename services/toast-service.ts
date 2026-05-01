import {type ToastOptions, toast} from 'react-toastify';

class ToastService {
    private readonly baseOptions: ToastOptions = {
        position: 'bottom-center',
        theme: 'dark',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
    };

    public success(message: string): void {
        toast.success(message, this.baseOptions);
    }

    public error(message: string): void {
        toast.error(message, this.baseOptions);
    }

    public info(message: string): void {
        toast.info(message, this.baseOptions);
    }
}

const toastService = new ToastService();
export default toastService;
