import Compressor from 'compressorjs';

class ImageOptimizer {
    public async optimize(file: File | Blob, quality: number = 0.4): Promise<File | Blob | null> {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    console.error(err.message);
                    reject(null);
                }
            });
        });
    }
}

const imageOptimizer = new ImageOptimizer();
export default imageOptimizer;
