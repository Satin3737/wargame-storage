import type {IProduct} from '@/db';
import {CategoryLabel} from '@/constants';

class ExportService {
    public async exportXlsx(products: IProduct[]): Promise<void> {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Склад');

        sheet.columns = [
            {header: 'Название', key: 'name', width: 40},
            {header: 'Количество', key: 'qty', width: 16},
            {header: 'Категория', key: 'category', width: 24},
            {header: 'Фото', key: 'photo', width: 16},
            {header: 'Штрихкод', key: 'barcode', width: 40},
            {header: 'Обновлено', key: 'updated', width: 24},
            {header: 'ID', key: 'id', width: 40}
        ];

        const headerRow = sheet.getRow(1);
        headerRow.font = {bold: true};

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            const row = sheet.addRow({
                name: product.name,
                qty: product.qty,
                category: CategoryLabel[product.category],
                photo: '',
                barcode: product.barcode,
                updated: this.formatTimestamp(product.updatedAt),
                id: product.id
            });

            row.height = 64;

            if (product.photoBlob) {
                const normalized = await this.normalizePhoto(product.photoBlob);
                const imageId = workbook.addImage(normalized);
                const rowNumber = row.number;

                sheet.addImage(imageId, {
                    tl: {col: 3.1, row: rowNumber - 1 + 0.1},
                    ext: {width: 80, height: 80}
                });
            }
        }

        sheet.autoFilter = {
            from: {row: 1, column: 1},
            to: {row: products.length + 1, column: 6}
        };

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const filename = `склад_${this.formatTimestamp(Date.now()).replace(/[: ]/g, '-')}.xlsx`;
        await this.deliver(blob, filename);
    }

    private formatTimestamp(ts: number): string {
        const d = new Date(ts);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    private async normalizePhoto(blob: Blob): Promise<{buffer: ArrayBuffer; extension: 'png' | 'jpeg' | 'gif'}> {
        const supported = blob.type.includes('webp') ? await this.transcodeToPng(blob) : blob;
        const buffer = await supported.arrayBuffer();
        const extension = supported.type.includes('png') ? 'png' : supported.type.includes('gif') ? 'gif' : 'jpeg';
        return {buffer, extension};
    }

    private async transcodeToPng(blob: Blob): Promise<Blob> {
        const bitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) return blob;
        ctx.drawImage(bitmap, 0, 0);
        return canvas.convertToBlob({type: 'image/png'});
    }

    private async deliver(blob: Blob, filename: string): Promise<void> {
        const file = new File([blob], filename, {type: blob.type});

        const nav = navigator as Navigator & {
            canShare?: (data: ShareData) => boolean;
            share?: (data: ShareData) => Promise<void>;
        };

        if (typeof nav.canShare === 'function' && typeof nav.share === 'function' && nav.canShare({files: [file]})) {
            try {
                await nav.share({files: [file], title: filename});
                return;
            } catch (e) {
                console.warn(e);
            }
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }
}

const exportService = new ExportService();
export default exportService;
