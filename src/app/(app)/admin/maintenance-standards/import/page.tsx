"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, CheckCircle, AlertOctagon, InfoIcon, FileDown } from "lucide-react";
import { useLanguage, type Locale } from "@/contexts/language-context";
import { 
    type MaintenanceStandard,
    type MaintenanceStandardItem,
    MOCK_CURRENT_USER, 
    ROLE_ADMIN_PKTAT 
} from "@/lib/constants";
import {
    addMaintenanceStandard,
    addMaintenanceStandardItem,
    updateMaintenanceStandard,
    getMaintenanceStandards,
    getMaintenanceStandardItems
} from "@/lib/actions/maintenance.actions";
import { Badge } from "@/components/ui/badge"; 
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";


type ParsedStandard = MaintenanceStandard & { _action?: 'create' | 'update', _csvRowNumber?: number, _originalRowData?: string };
type ParsedItem = MaintenanceStandardItem & { _action?: 'create', _csvRowNumber?: number, _originalRowData?: string };

type ParseMessage = {
  type: 'error' | 'info' | 'warning';
  csvRowNumber: number; 
  field?: string;      
  value?: string;      
  message: string;
  originalRowData?: string; 
};

const translations = {
  vi: {
    pageTitle: "Nhập Định mức Bảo trì từ CSV",
    pageDescription: "Tải lên tệp CSV để nhập hàng loạt các Định mức Bảo trì và các Hạng mục chi tiết.",
    selectFile: "Chọn tệp CSV",
    downloadSampleCsv: "Tải mẫu CSV",
    fileSelected: (name: string) => `Đã chọn tệp: ${name}`,
    noFileSelected: "Chưa chọn tệp nào.",
    previewTitle: "Xem trước Dữ liệu Phân tích",
    standardsToImport: "Định mức sẽ được Nhập/Cập nhật",
    itemsToImport: "Hạng mục sẽ được Nhập",
    noPreview: "Chưa có dữ liệu để xem trước. Vui lòng chọn một tệp CSV.",
    noPreviewCheckMessages: "Chưa có dữ liệu để xem trước. Vui lòng kiểm tra thông báo phân tích ở trên nếu đã chọn tệp.",
    confirmImport: "Xác nhận Nhập",
    importSuccess: (standards: number, items: number) => `Đã nhập thành công. ${standards} định mức và ${items} hạng mục đã được xử lý.`,
    importErrorGeneral: "Lỗi khi phân tích tệp CSV. Vui lòng kiểm tra định dạng.",
    parsingProgressText: "Đang phân tích tệp...",
    backToList: "Quay lại Quản lý Định mức",
    csvInstruction: "Tệp CSV phải có dòng đầu tiên là header. Các cột mong muốn (thứ tự không quan trọng, tên cột phải khớp):",
    columnHeaders: { 
      recordType: "recordType (STANDARD hoặc ITEM)",
      standardId: "standardId (Bắt buộc)",
      standardName: "standardName (Bắt buộc cho STANDARD mới)",
      standardDescription: "standardDescription",
      itemCode: "itemCode (Bắt buộc cho ITEM)",
      itemText: "itemText (Bắt buộc cho ITEM)",
      itemCriteria: "itemCriteria",
    },
    errorMessagesTitle: "Lỗi & Cảnh báo Phân tích",
    infoMessagesTitle: "Thông tin Quá trình Nhập",
    downloadErrorCsv: "Tải xuống Báo cáo Lỗi/Thông tin (.csv)",
    requiredHeaderMissing: (header: string) => `Thiếu cột bắt buộc '${header}'.`,
    requiredFieldMissing: (csvRowNum: number, field: string) => `Dòng CSV ${csvRowNum}: Trường '${field}' là bắt buộc. Dòng này sẽ bị bỏ qua.`,
    invalidRecordType: (csvRowNum: number, type: string) => `Dòng CSV ${csvRowNum}: recordType '${type}' không hợp lệ. Phải là 'STANDARD' hoặc 'ITEM'. Dòng này sẽ bị bỏ qua.`,
    standardExistsUpdate: (csvRowNum: number, id: string) => `Dòng CSV ${csvRowNum}: Định mức standardId '${id}' đã tồn tại. Thông tin (tên, mô tả) sẽ được cập nhật nếu có.`,
    standardCreatedInfo: (csvRowNum: number, id: string) => `Dòng CSV ${csvRowNum}: Định mức standardId '${id}' sẽ được tạo mới.`,
    itemAddedInfo: (csvRowNum: number, code: string, standardId: string) => `Dòng CSV ${csvRowNum}: Hạng mục itemCode '${code}' sẽ được thêm vào định mức '${standardId}'.`,
    itemCodeExistsError: (csvRowNum: number, code: string, standardId: string) => `Dòng CSV ${csvRowNum}: itemCode '${code}' đã tồn tại trong định mức '${standardId}'. Bỏ qua hạng mục này.`,
    standardForItemSelectedNotFound: (csvRowNum: number, standardId: string) => `Dòng CSV ${csvRowNum}: Không tìm thấy định mức '${standardId}' (trong tệp CSV hoặc đã có) để thêm hạng mục. Hạng mục sẽ bị bỏ qua.`,
    fileTooShort: "Tệp CSV quá ngắn (cần ít nhất 2 dòng: header và 1 dòng dữ liệu).",
    nothingToImport: "Không có dữ liệu hợp lệ để nhập.",
    allRowsHaveErrors: "Tất cả các dòng dữ liệu đều có lỗi. Vui lòng kiểm tra báo cáo lỗi.",
    cannotReadFile: "Không thể đọc tệp.",
    errorCsvHeader_Original: "Dữ liệu CSV Gốc",
    errorCsvHeader_Reason: "Lý do Lỗi/Thông tin",
    errorCsvHeader_Type: "Loại Thông báo",
    errorDisplayFormat: (csvRowNum: number, field?: string, value?: string, message?: string) => `Dòng ${csvRowNum}${field ? `, Trường '${field}'` : ''}${value ? `, Giá trị '${value}'` : ''}: ${message}`,
    accessDenied: "Bạn không có quyền truy cập vào chức năng này.", 
    sampleCsv_standardId: "DM_VI_DU_01",
    sampleCsv_standardName: "Định mức Ví dụ 1",
    sampleCsv_standardDescription: "Mô tả cho định mức ví dụ 1",
    sampleCsv_itemCode1: "HM_VD_001",
    sampleCsv_itemText1: "Hạng mục ví dụ 1",
    sampleCsv_itemCriteria1: "Tiêu chí cho hạng mục 1",
    sampleCsv_itemCode2: "HM_VD_002",
    sampleCsv_itemText2: "Hạng mục ví dụ 2",
    sampleCsv_itemCriteria2: "Tiêu chí cho hạng mục 2",
  },
  en: {
    pageTitle: "Import Maintenance Standards from CSV",
    pageDescription: "Upload a CSV file to bulk import Maintenance Standards and their detailed Items.",
    selectFile: "Select CSV File",
    downloadSampleCsv: "Download Sample CSV",
    fileSelected: (name: string) => `Selected file: ${name}`,
    noFileSelected: "No file selected yet.",
    previewTitle: "Parsed Data Preview",
    standardsToImport: "Standards to be Imported/Updated",
    itemsToImport: "Standard Items to be Imported",
    noPreview: "No data to preview. Please select a CSV file.",
    noPreviewCheckMessages: "No data to preview. Please check parsing messages above if a file was selected.",
    confirmImport: "Confirm Import",
    importSuccess: (standards: number, items: number) => `Successfully imported. ${standards} standards and ${items} items processed.`,
    importErrorGeneral: "Error parsing CSV file. Please check the format.",
    parsingProgressText: "Parsing file...",
    backToList: "Back to Standard Management",
    csvInstruction: "The CSV file must have a header row. Expected columns (order doesn't matter, names must match):",
     columnHeaders: { 
      recordType: "recordType (STANDARD or ITEM)",
      standardId: "standardId (Required)",
      standardName: "standardName (Required for new STANDARD)",
      standardDescription: "standardDescription",
      itemCode: "itemCode (Required for ITEM)",
      itemText: "itemText (Required for ITEM)",
      itemCriteria: "itemCriteria",
    },
    errorMessagesTitle: "Parsing Errors & Warnings",
    infoMessagesTitle: "Import Process Information",
    downloadErrorCsv: "Download Error/Info Report (.csv)",
    requiredHeaderMissing: (header: string) => `Missing required header: '${header}'.`,
    requiredFieldMissing: (csvRowNum: number, field: string) => `CSV Row ${csvRowNum}: Field '${field}' is required. Row will be skipped.`,
    invalidRecordType: (csvRowNum: number, type: string) => `CSV Row ${csvRowNum}: recordType '${type}' is invalid. Must be 'STANDARD' or 'ITEM'. Row will be skipped.`,
    standardExistsUpdate: (csvRowNum: number, id: string) => `CSV Row ${csvRowNum}: Standard ID '${id}' already exists. Information (name, description) will be updated if provided.`,
    standardCreatedInfo: (csvRowNum: number, id: string) => `CSV Row ${csvRowNum}: Standard ID '${id}' will be created.`,
    itemAddedInfo: (csvRowNum: number, code: string, standardId: string) => `CSV Row ${csvRowNum}: Item code '${code}' will be added to standard '${standardId}'.`,
    itemCodeExistsError: (csvRowNum: number, code: string, standardId: string) => `CSV Row ${csvRowNum}: Item code '${code}' already exists in standard '${standardId}'. Skipping this item.`,
    standardForItemSelectedNotFound: (csvRowNum: number, standardId: string) => `CSV Row ${csvRowNum}: Standard '${standardId}' (in CSV or existing) not found for item. Item will be skipped.`,
    fileTooShort: "CSV file is too short (needs at least 2 rows: header and 1 data row).",
    nothingToImport: "No valid data to import.",
    allRowsHaveErrors: "All data rows have errors. Please check the error report.",
    cannotReadFile: "Cannot read the file.",
    errorCsvHeader_Original: "Original CSV Data",
    errorCsvHeader_Reason: "Error Reason/Info",
    errorCsvHeader_Type: "Message Type",
    errorDisplayFormat: (csvRowNum: number, field?: string, value?: string, message?: string) => `Row ${csvRowNum}${field ? `, Field '${field}'` : ''}${value ? `, Value '${value}'` : ''}: ${message}`,
    accessDenied: "You do not have permission to access this feature.", 
    sampleCsv_standardId: "SAMPLE_STD_01",
    sampleCsv_standardName: "Sample Standard 1",
    sampleCsv_standardDescription: "Description for sample standard 1",
    sampleCsv_itemCode1: "ITEM_EX_001",
    sampleCsv_itemText1: "Sample Item 1",
    sampleCsv_itemCriteria1: "Criteria for sample item 1",
    sampleCsv_itemCode2: "ITEM_EX_002",
    sampleCsv_itemText2: "Sample Item 2",
    sampleCsv_itemCriteria2: "Criteria for sample item 2",
  },
};

export default function MaintenanceStandardImportPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const currentUserRole = MOCK_CURRENT_USER.role; 

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  const [parsedStandards, setParsedStandards] = React.useState<ParsedStandard[]>([]);
  const [parsedItems, setParsedItems] = React.useState<ParsedItem[]>([]);
  const [parseMessages, setParseMessages] = React.useState<ParseMessage[]>([]);
  const [parsingProgress, setParsingProgress] = React.useState(0);
  const [csvRawHeaders, setCsvRawHeaders] = React.useState<string[]>([]);


  const errorsToDisplay = React.useMemo(() => parseMessages.filter(m => m.type === 'error'), [parseMessages]);
  const warningsToDisplay = React.useMemo(() => parseMessages.filter(m => m.type === 'warning'), [parseMessages]);
  const infosToDisplay = React.useMemo(() => parseMessages.filter(m => m.type === 'info'), [parseMessages]);
  
  const validStandardsToProcess = React.useMemo(() => 
    parsedStandards.filter(pItem => !errorsToDisplay.some(err => err.csvRowNumber === pItem._csvRowNumber)),
  [parsedStandards, errorsToDisplay]);

  const validItemsToProcess = React.useMemo(() =>
    parsedItems.filter(pItem => !errorsToDisplay.some(err => err.csvRowNumber === pItem._csvRowNumber)),
  [parsedItems, errorsToDisplay]);

  // Role check
  if (currentUserRole !== ROLE_ADMIN_PKTAT) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md p-8 text-center">
          <CardTitle className="text-2xl text-destructive mb-4">{t.accessDenied}</CardTitle>
          <CardDescription>{locale === 'vi' ? `Chỉ Quản trị viên (P.KTAT) mới có quyền truy cập trang này.` : `Only Administrators (P.KTAT) can access this page.`}</CardDescription>
           <Button asChild className="mt-6">
            <Link href="/admin/maintenance-standards">
              {t.backToList}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setParsedStandards([]);
      setParsedItems([]);
      setParseMessages([]);
      setCsvRawHeaders([]);
      setParsingProgress(0);
      parseCsvFile(file);
    } else {
      setSelectedFile(null);
      toast({ variant: "destructive", title: "Lỗi chọn tệp", description: "Vui lòng chỉ chọn tệp CSV." });
    }
  };

  const parseCsvFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadstart = () => setParsingProgress(1);

    reader.onprogress = (event) => {
        if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setParsingProgress(progress > 1 ? progress : 1);
        }
    };

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const localMessages: ParseMessage[] = [];
      const tempParsedStandards: Record<string, ParsedStandard> = {}; 
      const tempParsedItems: ParsedItem[] = [];

      if (!text) {
        localMessages.push({ type: 'error', csvRowNumber: 1, message: t.importErrorGeneral, originalRowData: ""});
        setParseMessages(localMessages);
        setParsingProgress(100);
        return;
      }
      const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        localMessages.push({ type: 'error', csvRowNumber: 1, message: t.fileTooShort, originalRowData: lines[0] || "" });
        setParseMessages(localMessages);
        setParsingProgress(100);
        return;
      }

      // Fetch current data for validation
      const currentStandards = await getMaintenanceStandards();
      const currentStandardItems = await getMaintenanceStandardItems();

      const headerLineRaw = lines[0];
      const rawHeadersFromFile = headerLineRaw.split(',').map(h => h.trim());
      setCsvRawHeaders(rawHeadersFromFile);
      const headerLine = rawHeadersFromFile.map(h => h.toLowerCase().trim());

      const headerMapping: Record<string, keyof (MaintenanceStandard & MaintenanceStandardItem & {recordType: string})> = {
        'recordtype': 'recordType',
        'standardid': 'id',
        'templateid': 'id', // Alias for backward compatibility
        'standardname': 'name',
        'templatename': 'name', // Alias
        'standarddescription': 'description', 
        'templatedescription': 'description', // Alias
        'itemcode': 'itemCode',
        'itemtext': 'itemText',
        'itemcriteria': 'criteria' 
      };
      
      const mappedFieldKeys = headerLine.map(h => headerMapping[h]);
      
      const hasRecordType = mappedFieldKeys.includes('recordType');
      const hasStandardId = mappedFieldKeys.includes('id');

      if (!hasRecordType || !hasStandardId) {
        let missingMsg = "";
        if (!hasRecordType) missingMsg += t.requiredHeaderMissing(t.columnHeaders.recordType.split('(')[0].trim());
        if (!hasStandardId) missingMsg += (missingMsg ? " " : "") + t.requiredHeaderMissing(t.columnHeaders.standardId.split('(')[0].trim());
        localMessages.push({type: 'error', csvRowNumber: 1, message: missingMsg || "Các cột 'recordType' và 'standardId' (hoặc 'templateId') là bắt buộc.", originalRowData: headerLineRaw});
        setParseMessages(localMessages);
        setParsingProgress(100);
        return;
      }

      const dataLines = lines.slice(1);
      
      dataLines.forEach((line, index) => {
        const csvRowNumber = index + 2; 
        const values = line.split(',').map(v => v.trim());
        const rowData: any = {};
        let skipRowDueToError = false;

        mappedFieldKeys.forEach((fieldKey, i) => {
          if (fieldKey && values[i] !== undefined) {
            rowData[fieldKey] = values[i].trim();
          }
        });

        const recordType = String(rowData.recordType || "").toUpperCase();
        const standardId = String(rowData.id || "");

        if (!standardId) {
            localMessages.push({ type: 'error', csvRowNumber, field: t.columnHeaders.standardId.split('(')[0].trim(), message: t.requiredFieldMissing(csvRowNumber, t.columnHeaders.standardId.split('(')[0].trim()), originalRowData: line });
            skipRowDueToError = true;
        }
        if (recordType !== 'STANDARD' && recordType !== 'ITEM') {
            localMessages.push({ type: 'error', csvRowNumber, field: t.columnHeaders.recordType.split('(')[0].trim(), value: recordType, message: t.invalidRecordType(csvRowNumber, recordType), originalRowData: line });
            skipRowDueToError = true;
        }

        if (skipRowDueToError) {
            if (recordType === 'STANDARD') tempParsedStandards[`ERROR-${csvRowNumber}`] = {id: `ERROR-${csvRowNumber}`, name: "Error Row", _csvRowNumber: csvRowNumber, _originalRowData: line};
            else if (recordType === 'ITEM') tempParsedItems.push({id: `ERROR-${csvRowNumber}`, standardId: "Error", itemCode: "Error", itemText: "Error Row", _csvRowNumber: csvRowNumber, _originalRowData: line});
            return;
        }

        if (recordType === 'STANDARD') {
            const standardName = String(rowData.name || "");
            const standardDescription = String(rowData.description || "");

            if (!standardName && !currentStandards.find(t => t.id === standardId) && !tempParsedStandards[standardId]) {
                localMessages.push({ type: 'error', csvRowNumber, field: t.columnHeaders.standardName.split('(')[0].trim(), message: t.requiredFieldMissing(csvRowNumber, t.columnHeaders.standardName.split('(')[0].trim() + ' (for new STANDARD)'), originalRowData: line });
                tempParsedStandards[`ERROR-${csvRowNumber}`] = {id: standardId || `ERROR-${csvRowNumber}`, name: "Error Row", description: standardDescription, _csvRowNumber: csvRowNumber, _originalRowData: line};
                return; 
            }
            
            const existingMockStandard = currentStandards.find(t => t.id === standardId);
            const existingParsedStandard = tempParsedStandards[standardId];

            if (existingMockStandard || existingParsedStandard) {
                const baseStandard = existingParsedStandard || existingMockStandard!;
                tempParsedStandards[standardId] = { 
                    ...baseStandard, 
                    name: standardName || baseStandard.name, 
                    description: standardDescription || baseStandard.description, 
                    _action: 'update', 
                    _csvRowNumber: csvRowNumber,
                    _originalRowData: line 
                };
                localMessages.push({ type: 'info', csvRowNumber, field: 'standardId', value: standardId, message: t.standardExistsUpdate(csvRowNumber, standardId), originalRowData: line});
            } else {
                 tempParsedStandards[standardId] = { id: standardId, name: standardName, description: standardDescription, _action: 'create', _csvRowNumber: csvRowNumber, _originalRowData: line };
                 localMessages.push({ type: 'info', csvRowNumber, field: 'standardId', value: standardId, message: t.standardCreatedInfo(csvRowNumber, standardId), originalRowData: line});
            }
        } else if (recordType === 'ITEM') {
            const itemCode = String(rowData.itemCode || "");
            const itemText = String(rowData.itemText || "");
            const itemCriteria = String(rowData.criteria || "");

            if (!itemCode) {
                localMessages.push({ type: 'error', csvRowNumber, field: t.columnHeaders.itemCode.split('(')[0].trim(), message: t.requiredFieldMissing(csvRowNumber, t.columnHeaders.itemCode.split('(')[0].trim() + ' (for ITEM recordType)'), originalRowData: line });
                skipRowDueToError = true;
            }
            if (!itemText) {
                localMessages.push({ type: 'error', csvRowNumber, field: t.columnHeaders.itemText.split('(')[0].trim(), message: t.requiredFieldMissing(csvRowNumber, t.columnHeaders.itemText.split('(')[0].trim() + ' (for ITEM recordType)'), originalRowData: line });
                skipRowDueToError = true;
            }
            if (skipRowDueToError) {
                tempParsedItems.push({id: `ERROR-${csvRowNumber}`, standardId, itemCode: itemCode || "Error", itemText: "Error Row", criteria: itemCriteria, _csvRowNumber: csvRowNumber, _originalRowData: line});
                return;
            }
            
            const standardExistsInCurrent = currentStandards.some(te => te.id === standardId);
            const standardExistsInParsed = !!tempParsedStandards[standardId];
            if(!standardExistsInCurrent && !standardExistsInParsed){
                localMessages.push({type: 'error', csvRowNumber, field: 'standardId', value: standardId, message: t.standardForItemSelectedNotFound(csvRowNumber, standardId), originalRowData: line});
                tempParsedItems.push({id: `ERROR-${csvRowNumber}`, standardId, itemCode, itemText, criteria: itemCriteria, _csvRowNumber: csvRowNumber, _originalRowData: line});
                return;
            }

            const itemAlreadyExistsInCurrent = currentStandardItems.some(i => i.standardId === standardId && i.itemCode === itemCode);
            const itemAlreadyParsedInCsv = tempParsedItems.some(i => i.standardId === standardId && i.itemCode === itemCode);

            if (itemAlreadyExistsInCurrent || itemAlreadyParsedInCsv) {
                localMessages.push({ type: 'error', csvRowNumber, field: 'itemCode', value: itemCode, message: t.itemCodeExistsError(csvRowNumber, itemCode, standardId), originalRowData: line});
                tempParsedItems.push({id: `ERROR-${csvRowNumber}`, standardId, itemCode, itemText, criteria: itemCriteria, _csvRowNumber: csvRowNumber, _originalRowData: line});
                return; 
            }
            
            tempParsedItems.push({ 
                id: `${standardId}-${itemCode}`, 
                standardId, 
                itemCode, 
                itemText, 
                criteria: itemCriteria, 
                _action: 'create', 
                _csvRowNumber: csvRowNumber,
                _originalRowData: line
            });
            localMessages.push({ type: 'info', csvRowNumber, message: t.itemAddedInfo(csvRowNumber, itemCode, standardId), originalRowData: line });
        }
      });

      setParseMessages(localMessages);
      setParsedStandards(Object.values(tempParsedStandards).filter(t => t.id && !t.id.startsWith('ERROR-'))); 
      setParsedItems(tempParsedItems.filter(i => i.id && !i.id.startsWith('ERROR-'))); 
      setParsingProgress(100);
    };

    reader.onerror = () => {
        setParseMessages([{ type: 'error', csvRowNumber: 1, message: t.cannotReadFile, originalRowData: "" }]);
        reader.abort();
        setParsingProgress(100);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleConfirmImport = async () => {
    if ((validStandardsToProcess.length === 0 && validItemsToProcess.length === 0) && (parsedStandards.length > 0 || parsedItems.length > 0)) {
       toast({ variant: "destructive", title: "Nhập Thất Bại", description: t.allRowsHaveErrors });
       return;
    }
    if (validStandardsToProcess.length === 0 && validItemsToProcess.length === 0) {
       toast({ title: "Thông báo", description: t.nothingToImport });
       return;
    }

    let standardsProcessedCount = 0;
    let itemsAddedCount = 0;
    const currentStandards = await getMaintenanceStandards();
    const currentItems = await getMaintenanceStandardItems();
    
    for (const pt of validStandardsToProcess) {
        const { _action, _csvRowNumber, _originalRowData, ...standardData } = pt;
        if (_action === 'create') {
            await addMaintenanceStandard(standardData); 
            standardsProcessedCount++;
        } else if (_action === 'update') {
            await updateMaintenanceStandard(standardData); 
            standardsProcessedCount++;
        }
    }
    
    const allKnownStandardIds = new Set([...currentStandards.map(tmpl => tmpl.id), ...validStandardsToProcess.filter(vt => vt._action === 'create').map(vt => vt.id)]);

    for (const pi of validItemsToProcess) {
        const { _action, _csvRowNumber, _originalRowData, ...itemData } = pi;
        if (!allKnownStandardIds.has(itemData.standardId)) {
            const message = t.standardForItemSelectedNotFound(pi._csvRowNumber || 0, itemData.standardId);
            if (!parseMessages.some(m => m.message === message && m.csvRowNumber === pi._csvRowNumber)) {
                 setParseMessages(prev => [...prev, { type: 'error', csvRowNumber: pi._csvRowNumber || 0, message, originalRowData: pi._originalRowData}]);
            }
            continue; 
        }
        if (!currentItems.some(existingItem => existingItem.standardId === itemData.standardId && existingItem.itemCode === itemData.itemCode)) {
            await addMaintenanceStandardItem(itemData);
            itemsAddedCount++;
        } else {
            const message = t.itemCodeExistsError(pi._csvRowNumber || 0, itemData.itemCode, itemData.standardId);
             if (!parseMessages.some(m => m.message === message && m.csvRowNumber === pi._csvRowNumber)) {
                 setParseMessages(prev => [...prev, { type: 'error', csvRowNumber: pi._csvRowNumber || 0, message, originalRowData: pi._originalRowData}]);
            }
        }
    }
    
    toast({
      title: "Hoàn thành Nhập",
      description: t.importSuccess(standardsProcessedCount, itemsAddedCount),
       action: (<Button variant="outline" size="sm" asChild><Link href="/admin/maintenance-standards">Xem Danh Sách</Link></Button>),
    });
    router.refresh();
    // Reset state
    setSelectedFile(null);
    setParsedStandards([]);
    setParsedItems([]);
    setParseMessages([]);
    setParsingProgress(0);
    setCsvRawHeaders([]);
    const fileInput = document.getElementById('csv-file-input-standard') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

 const handleDownloadErrorCsv = () => {
    if (parseMessages.length === 0) {
      toast({title: "Không có lỗi/thông tin", description: "Không có dòng nào có lỗi hoặc thông tin để tải xuống."});
      return;
    }
    
    const csvHeaderWithError = (csvRawHeaders.length > 0 ? csvRawHeaders.join(',') : t.errorCsvHeader_Original) + `,${t.errorCsvHeader_Reason},${t.errorCsvHeader_Type}`;
    const reportCsvRows = parseMessages.map(msg => {
        const reason = t.errorDisplayFormat(msg.csvRowNumber, msg.field, msg.value, msg.message).replace(/"/g, '""');
        let originalCells = msg.originalRowData ? msg.originalRowData.split(',') : (csvRawHeaders.length > 0 ? Array(csvRawHeaders.length).fill('') : [""]);
         if (csvRawHeaders.length > 0) {
            if (originalCells.length < csvRawHeaders.length) {
                originalCells = [...originalCells, ...Array(csvRawHeaders.length - originalCells.length).fill('')];
            } else if (originalCells.length > csvRawHeaders.length) {
                originalCells = originalCells.slice(0, csvRawHeaders.length);
            }
        }
        const rowDataEscaped = originalCells.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',');
        return `${rowDataEscaped},"${reason}","${msg.type.toUpperCase()}"`;
    });
    const csvContent = "\uFEFF" + csvHeaderWithError + "\n" + reportCsvRows.join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Standard_Import_Report_${selectedFile?.name || new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleCsv = () => {
    const headers = "recordType,standardId,standardName,standardDescription,itemCode,itemText,itemCriteria";
    const exampleStandard = `STANDARD,${t.sampleCsv_standardId},"${t.sampleCsv_standardName}","${t.sampleCsv_standardDescription}",,,`;
    const exampleItem1 = `ITEM,${t.sampleCsv_standardId},,,${t.sampleCsv_itemCode1},"${t.sampleCsv_itemText1}","${t.sampleCsv_itemCriteria1}"`;
    const exampleItem2 = `ITEM,${t.sampleCsv_standardId},,,${t.sampleCsv_itemCode2},"${t.sampleCsv_itemText2}","${t.sampleCsv_itemCriteria2}"`;
    
    const csvContent = "\uFEFF" + [headers, exampleStandard, exampleItem1, exampleItem2].join("\n"); 
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `sample_standard_import_${locale}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const csvInstructionText = `${t.csvInstruction}\n    - ${Object.values(t.columnHeaders).join('\n    - ')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageDescription}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/maintenance-standards">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.selectFile}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Label htmlFor="csv-file-input-standard" className="cursor-pointer">
              <Button variant="outline" asChild><span><UploadCloud className="mr-2 h-4 w-4" /> {t.selectFile}</span></Button>
              <Input id="csv-file-input-standard" type="file" accept=".csv" onChange={handleFileChange} className="hidden"/>
            </Label>
            <Button variant="outline" onClick={handleDownloadSampleCsv}>
              <FileDown className="mr-2 h-4 w-4" /> {t.downloadSampleCsv}
            </Button>
            {selectedFile && <p className="text-sm text-muted-foreground">{t.fileSelected(selectedFile.name)}</p>}
            {!selectedFile && <p className="text-sm text-muted-foreground">{t.noFileSelected}</p>}
          </div>
          {parsingProgress > 0 && parsingProgress < 100 && (
            <div className="space-y-1">
                <Progress value={parsingProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">{t.parsingProgressText}</p>
            </div>
          )}
           <p className="text-xs text-muted-foreground whitespace-pre-line">
            {csvInstructionText}
          </p>
        </CardContent>
      </Card>

      {(infosToDisplay.length > 0 || errorsToDisplay.length > 0 || warningsToDisplay.length > 0) && (
         <Card className="border-border">
           <CardHeader>
            <div className="flex justify-between items-center">
                 <CardTitle className="text-foreground flex items-center">
                    {locale === 'vi' ? 'Thông báo Phân tích & Xác thực' : 'Parsing & Validation Messages'} ({parseMessages.length})
                </CardTitle>
                 {(parseMessages.length > 0 || csvRawHeaders.length > 0) && (
                    <Button variant="outline" size="sm" onClick={handleDownloadErrorCsv}>
                        <FileDown className="mr-2 h-4 w-4" /> {t.downloadErrorCsv}
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {infosToDisplay.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-blue-600 dark:text-blue-400 flex items-center font-semibold mb-1">
                        <InfoIcon className="mr-2 h-5 w-5"/>{t.infoMessagesTitle} ({infosToDisplay.length})
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300 max-h-32 overflow-y-auto">
                        {infosToDisplay.map((info, idx) => <li key={`info-${idx}`}>{t.errorDisplayFormat(info.csvRowNumber, info.field, info.value, info.message)}</li>)}
                    </ul>
                </div>
            )}
            {warningsToDisplay.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-yellow-600 dark:text-yellow-400 flex items-center font-semibold mb-1">
                        <AlertOctagon className="mr-2 h-5 w-5"/>Cảnh báo ({warningsToDisplay.length})
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-500 max-h-32 overflow-y-auto">
                        {warningsToDisplay.map((warn, idx) => <li key={`warn-${idx}`}>{t.errorDisplayFormat(warn.csvRowNumber, warn.field, warn.value, warn.message)}</li>)}
                    </ul>
                </div>
            )}
            {errorsToDisplay.length > 0 && (
                 <div>
                    <h3 className="text-destructive flex items-center font-semibold mb-1">
                        <AlertOctagon className="mr-2 h-5 w-5"/>{t.errorMessagesTitle} ({errorsToDisplay.length})
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive max-h-32 overflow-y-auto">
                        {errorsToDisplay.map((err, idx) => <li key={`error-${idx}`}>{t.errorDisplayFormat(err.csvRowNumber, err.field, err.value, err.message)}</li>)}
                    </ul>
                </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedFile && (parsedStandards.length > 0 || parsedItems.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{t.previewTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedStandards.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">{t.standardsToImport} ({validStandardsToProcess.length} / {parsedStandards.length})</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                    <Table>
                        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Tên</TableHead><TableHead>Mô tả</TableHead><TableHead>Hành động</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {parsedStandards.map(std => (
                            <TableRow key={std.id} className={errorsToDisplay.some(e => e.csvRowNumber === std._csvRowNumber) ? "bg-destructive/10" : ""}>
                            <TableCell>{std.id}</TableCell><TableCell>{std.name}</TableCell><TableCell>{std.description}</TableCell>
                            <TableCell>
                                <Badge variant={std._action === 'create' ? 'secondary' : 'default'}>
                                    {std._action === 'create' ? (locale === 'vi' ? 'Tạo mới' : 'New') : (locale === 'vi' ? 'Cập nhật' : 'Update')}
                                </Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
              </div>
            )}
            {parsedItems.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">{t.itemsToImport} ({validItemsToProcess.length} / {parsedItems.length})</h3>
                 <div className="max-h-60 overflow-y-auto border rounded-md">
                    <Table>
                        <TableHeader><TableRow><TableHead>Standard ID</TableHead><TableHead>Item Code</TableHead><TableHead>Nội dung</TableHead><TableHead>Tiêu chí</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {parsedItems.map(item => (
                            <TableRow key={`${item.standardId}-${item.itemCode}`} className={errorsToDisplay.some(e => e.csvRowNumber === item._csvRowNumber) ? "bg-destructive/10" : ""}>
                            <TableCell>{item.standardId}</TableCell><TableCell>{item.itemCode}</TableCell><TableCell>{item.itemText}</TableCell><TableCell>{item.criteria}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                 </div>
              </div>
            )}
            {(validStandardsToProcess.length > 0 || validItemsToProcess.length > 0) && (
                 <div className="mt-6 flex justify-end">
                    <Button onClick={handleConfirmImport} disabled={parsingProgress < 100 || (validStandardsToProcess.length === 0 && validItemsToProcess.length === 0)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> {t.confirmImport} ({validStandardsToProcess.length + validItemsToProcess.length} {locale === 'vi' ? 'mục hợp lệ' : 'valid entries'})
                    </Button>
                </div>
            )}
            {parsingProgress === 100 && validStandardsToProcess.length === 0 && validItemsToProcess.length === 0 && (parsedStandards.length > 0 || parsedItems.length > 0) && (
                <p className="text-destructive">{t.allRowsHaveErrors}</p>
            )}
             {parsingProgress === 100 && parsedStandards.length === 0 && parsedItems.length === 0 && (
                <p className="text-muted-foreground">{errorsToDisplay.length > 0 ? t.noPreviewCheckMessages : t.noPreview}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
