import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        await parser.destroy();
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF file.");
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
