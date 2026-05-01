class HapticsService {
    public tap(): void {
        this.vibrate(15);
    }

    public success(): void {
        this.vibrate([20, 40, 20]);
    }

    public error(): void {
        this.vibrate([60, 30, 60]);
    }

    private vibrate(pattern: number | number[]): void {
        if (typeof navigator === 'undefined') return;
        if (typeof navigator.vibrate !== 'function') return;

        try {
            navigator.vibrate(pattern);
        } catch {
            // ignore
        }
    }
}

const hapticsService = new HapticsService();
export default hapticsService;
