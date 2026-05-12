const { PDFParse } = require('pdf-parse');
const path = require('path');
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        if (!buffer || buffer.length === 0) {
            throw new Error("Buffer is empty or undefined.");
        }

        // Fix for Next.js resolve issues: Point directly to the CJS worker
        try {
            const workerPath = require.resolve('pdf-parse/worker');
            PDFParse.setWorker(workerPath);
        } catch (e) {
            console.warn("Could not resolve pdf-parse/worker via require.resolve, falling back to manual path.");
            const manualPath = path.resolve(process.cwd(), 'node_modules/pdf-parse/dist/worker/cjs/index.cjs');
            PDFParse.setWorker(manualPath);
        }

        const parser = new PDFParse({ data: buffer });
        try {
            const result = await parser.getText();
            if (!result || !result.text) {
                throw new Error("No text content returned from PDF parser.");
            }
            return result.text;
        } finally {
            await parser.destroy();
        }
    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        throw new Error(`Failed to parse PDF: ${error.message || 'Unknown error'}`);
    }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("DOCX Parsing Error:", error);
        throw new Error("Failed to parse Word file.");
    }
}

export async function parseXlsx(buffer: Buffer): Promise<string> {
    try {
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        let text = "";
        workbook.SheetNames.forEach(name => {
            const sheet = workbook.Sheets[name];
            text += `### Sheet: ${name}\n`;
            text += xlsx.utils.sheet_to_csv(sheet);
            text += "\n\n";
        });
        return text;
    } catch (error) {
        console.error("XLSX Parsing Error:", error);
        throw new Error("Failed to parse Excel file.");
    }
}
