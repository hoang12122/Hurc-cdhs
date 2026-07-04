const { PDFParse } = require('pdf-parse');
import mammoth from 'mammoth';

export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        if (!buffer || buffer.length === 0) {
            throw new Error("Buffer is empty or undefined.");
        }

        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        if (!result || !result.text) {
            throw new Error("No text content returned from PDF parser.");
        }
        return result.text;
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

export async function parseXlsx(_buffer: Buffer): Promise<string> {
    throw new Error(
        "XLSX parsing is temporarily disabled because the previous parser dependency has unresolved security advisories. " +
        "Use CSV export or add a reviewed XLSX parser before enabling this path again."
    );
}
