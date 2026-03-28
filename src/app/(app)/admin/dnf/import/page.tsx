
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileText, CheckCircle, FileDown, AlertOctagon, InfoIcon } from "lucide-react";
import { useLanguage, type Locale } from "@/contexts/language-context";
import { 
    DNF_METHODS_OF_DETECTION, 
    DNF_HAZARD_LEVELS, 
    DNF_STATUSES, 
    MOCK_CURRENT_USER,
    type DnfDocument, type DnfStatus, type NavItemLabel, type ImageAttachment as AppImageAttachment, type Subsystem, type PatrolLocation
} from "@/lib/constants";
import { addManyDnfs, updateMockDnf, getDnfs } from "@/lib/actions/dnf.actions";
import { getSubsystems, getLocations } from "@/lib/actions/category.actions";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Helper function to parse flexible date string
function parseFlexibleDateTime(dateTimeStr: string): Date | null {
  if (!dateTimeStr || typeof dateTimeStr !== 'string' || dateTimeStr.trim() === "") return null;

  const trimmedStr = dateTimeStr.trim();

  // Try ISO format with T like YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS
  if (trimmedStr.includes('T') && trimmedStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z?$/)) {
    const date = new Date(trimmedStr);
    if (!isNaN(date.getTime())) return date;
  }
  
  // Try YYYY-MM-DD HH:MM:SS or YYYY-MM-DD HH:MM or YYYY-MM-DD
  const isoLikeMatch = trimmedStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (isoLikeMatch) {
    const [, year, month, day, hour = '00', minute = '00', second = '00'] = isoLikeMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD/MM/YYYY HH:MM:SS or DD/MM/YYYY HH:MM or DD/MM/YYYY
  const dmyMatch = trimmedStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dmyMatch) {
    const [, dayStr, monthStr, yearStr, hourStr = '00', minuteStr = '00', secondStr = '00'] = dmyMatch;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = parseInt(secondStr, 10);

    if (year >= 1000 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= 31 &&
        hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
      const date = new Date(year, month - 1, day, hour, minute, second);
      if (!isNaN(date.getTime())) return date;
    }
  }
  
  try {
    const genericDate = new Date(trimmedStr);
    if (!isNaN(genericDate.getTime()) && genericDate.getFullYear() > 1900) return genericDate; 
  } catch (e) {
    // ignore
  }

  return null; 
}

type ParsedDnfItem = DnfDocument & { _action?: 'create' | 'update', _originalRowData?: string, _csvRowNumber?: number };

type ParseMessage = {
  type: 'error' | 'info';
  csvRowNumber: number; 
  field?: string;      
  value?: string;      
  message: string;
  originalRowData?: string; 
};


const translations = {
  vi: {
    pageTitle: "Nhập Dữ liệu Báo cáo sự cố (DNF) từ CSV",
    pageDescription: "Tải lên tệp CSV để nhập hàng loạt các Báo cáo sự cố.",
    selectFile: "Chọn tệp CSV",
    fileSelected: (name: string) => `Đã chọn tệp: ${name}`,
    noFileSelected: "Chưa chọn tệp nào.",
    previewTitle: "Xem trước Dữ liệu Phân tích",
    previewTitleCounts: (createCount: number, updateCount: number) => `Xem trước (${createCount} mới, ${updateCount} cập nhật)`,
    previewPageInfo: (currentPage: number, totalPages: number, totalItems: number) => `Trang ${currentPage}/${totalPages} (Tổng số ${totalItems} mục)`,
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    noPreview: "Chưa có dữ liệu để xem trước. Vui lòng chọn một tệp CSV.",
    noPreviewCheckMessages: "Chưa có dữ liệu để xem trước. Vui lòng kiểm tra thông báo phân tích ở trên nếu đã chọn tệp.",
    allParsedItemsHaveErrorsTitle: "Tất cả các Mục Đã Phân Tích Đều Có Lỗi",
    allParsedItemsHaveErrorsDesc: "Không có mục nào hợp lệ để nhập. Vui lòng kiểm tra các thông báo lỗi và thông tin ở trên.",
    confirmImport: "Xác nhận Nhập",
    importSuccess: (createCount: number, updateCount: number) => `Đã nhập thành công. ${createCount} DNF mới được tạo, ${updateCount} DNF được cập nhật.`,
    importErrorGeneral: "Lỗi khi phân tích tệp CSV. Vui lòng kiểm tra định dạng.",
    parsingProgressText: "Đang phân tích tệp...",
    backToList: "Quay lại Danh sách DNF",
    csvInstruction: "Tệp CSV phải có dòng đầu tiên là header (phân cách bằng dấu phẩy). Các tên cột dưới đây là gợi ý, bạn có thể dùng tên cột tương tự trong tệp CSV của mình. Ưu tiên tên cột tiếng Anh từ biểu mẫu nếu có:",
    columnHeaders: { 
      id: "DNF ID (Tùy chọn - Nếu cung cấp và tồn tại, DNF sẽ được cập nhật)",
      failureReportNo: "Failure Report No (HTC Reference Only) / Số Báo cáo HTC",
      locationOfFailure: "Location of the failure / Vị trí",
      failedComponentEquipmentLRUTrainNumber: "Failed Component Equipment/LRU/Train Number after LRU / Thiết bị Lỗi",
      subsystem: "Subsystem / Hệ thống con",
      descriptionOfFailure: "Description of Failure / Mô tả Khiếm khuyết",
      impactAssessment: "Impact Assessment / Đánh giá Ảnh hưởng",
      staffWhoIdentifiedFailure: "Staff who identified the failure / Người Phát Hiện",
      dateTimeOfFailureOccurrence: "Date & Time of Failure occurrence / Ngày Giờ Xảy Ra (Hỗ trợ: DD/MM/YYYY, YYYY-MM-DD, có thể kèm HH:MM:SS)",
      methodOfFailureDetection: "Method of failure detection / Phương Pháp Phát Hiện",
      hazardLevel: "Hazard Level / Mức Độ Mối Nguy",
      status: "Status / Trạng Thái",
      attachments: "Attachments / Đính kèm (URL phân cách bởi dấu ;)",
    },
    fieldNames_dnf: { 
        id: "ID DNF",
        failureReportNo: "Số Báo cáo HTC",
        locationOfFailure: "Vị trí",
        failedComponentEquipmentLRUTrainNumber: "Thiết bị Lỗi",
        subsystem: "Hệ thống con",
        descriptionOfFailure: "Mô tả Khiếm khuyết",
        impactAssessment: "Đánh giá Ảnh hưởng",
        staffWhoIdentifiedFailure: "Người Phát Hiện",
        dateTimeOfFailureOccurrence: "Ngày Giờ Xảy Ra",
        methodOfFailureDetection: "Phương Pháp Phát Hiện",
        hazardLevelId: "Mức Độ Mối Nguy",
        status: "Trạng Thái",
        attachments: "Đính kèm",
    },
    errorMessagesTitle: "Lỗi Phân Tích & Xác Thực Dữ liệu",
    infoMessagesTitle: "Thông tin Quá trình Nhập",
    downloadErrorCsv: "Tải xuống Báo cáo Lỗi/Thông tin (.csv)",
    requiredHeaderMissing: (header: string) => `Thiếu cột bắt buộc '${header}' trong CSV.`,
    requiredFieldMissing: (csvRowNum: number, columnName: string) => `Dòng CSV ${csvRowNum}: Trường bắt buộc '${columnName}' không được để trống. Dòng này sẽ bị bỏ qua.`,
    idExistsUpdate: (csvRowNum: number, id: string) => `Dòng CSV ${csvRowNum}: ID DNF '${id}' đã tồn tại. Dữ liệu sẽ được cập nhật.`,
    statusNotFound: (csvRowNum: number, status: string, defaultStatus: string) => `Dòng CSV ${csvRowNum}: Trạng thái '${status}' không hợp lệ. Đã mặc định thành '${defaultStatus}'.`,
    locationNotFound: (csvRowNum: number, loc: string) => `Dòng CSV ${csvRowNum}: Giá trị Vị trí '${loc}' không tìm thấy trong danh mục. Dòng này sẽ bị bỏ qua.`,
    subsystemNotFound: (csvRowNum: number, sub: string) => `Dòng CSV ${csvRowNum}: Giá trị Hệ thống con '${sub}' không tìm thấy trong danh mục. Dòng này sẽ bị bỏ qua.`,
    detectionMethodNotFound: (csvRowNum: number, method: string) => `Dòng CSV ${csvRowNum}: Giá trị Phương pháp Phát hiện '${method}' không tìm thấy trong danh mục. Dòng này sẽ bị bỏ qua.`,
    invalidDateFormatError: (csvRowNum: number, val: string, fieldName: string) => `Dòng CSV ${csvRowNum}: Trường '${fieldName}' có giá trị ngày giờ '${val}' không hợp lệ. Các định dạng được chấp nhận bao gồm DD/MM/YYYY, YYYY-MM-DD (có thể kèm HH:MM:SS). Dòng này sẽ bị bỏ qua.`,
    infoStaffIdentifiedDefault: (csvRowNum: number, defaultName: string) => `Dòng CSV ${csvRowNum}: Người phát hiện không được cung cấp. Đã tự động điền '${defaultName}'.`,
    infoHazardLevelNotFoundSetDefault: (csvRowNum: number, providedLevel: string, defaultLevelLabel: string) => `Dòng CSV ${csvRowNum}: Mức độ mối nguy '${providedLevel}' không hợp lệ. Đã mặc định thành '${defaultLevelLabel}'.`,
    infoHazardLevelMissingSetDefault: (csvRowNum: number, defaultLevelLabel: string) => `Dòng CSV ${csvRowNum}: Mức độ mối nguy không được cung cấp. Đã mặc định thành '${defaultLevelLabel}'.`,
    fileTooShort: "Tệp CSV quá ngắn (cần ít nhất 2 dòng: header và 1 dòng dữ liệu).",
    cannotReadFile: "Không thể đọc tệp.",
    noValidDnfsToImport: "Không có DNF hợp lệ nào được nhập. Vui lòng kiểm tra lỗi.",
    allRowsHaveErrors: "Tất cả các dòng dữ liệu đều có lỗi. Vui lòng kiểm tra báo cáo lỗi.",
    nothingToImport: "Vui lòng chọn một tệp CSV để nhập.",
    errorCsvHeader_Original: "Dữ liệu CSV Gốc",
    errorCsvHeader_Reason: "Lý do Lỗi/Thông tin",
    errorCsvHeader_Type: "Loại Thông báo",
    errorDisplayFormat: (csvRowNum: number, field?: string, value?: string, message?: string) => `Dòng ${csvRowNum}${field ? `, Trường '${field}'` : ''}${value ? `, Giá trị '${value}'` : ''}: ${message}`,

  },
  en: {
    pageTitle: "Import DNF Data from CSV",
    pageDescription: "Upload a CSV file to bulk import Defect Reports.",
    selectFile: "Select CSV File",
    fileSelected: (name: string) => `Selected file: ${name}`,
    noFileSelected: "No file selected yet.",
    previewTitle: "Parsed Data Preview",
    previewTitleCounts: (createCount: number, updateCount: number) => `Preview (${createCount} new, ${updateCount} to update)`,
    previewPageInfo: (currentPage: number, totalPages: number, totalItems: number) => `Page ${currentPage}/${totalPages} (Total ${totalItems} items)`,
    previousPage: "Previous",
    nextPage: "Next",
    noPreview: "No data to preview. Please select a CSV file.",
    noPreviewCheckMessages: "No data to preview. Please check parsing messages above if a file was selected.",
    allParsedItemsHaveErrorsTitle: "All Parsed Items Have Errors",
    allParsedItemsHaveErrorsDesc: "No valid items to import. Please review the error and information messages above.",
    confirmImport: "Confirm Import",
    importSuccess: (createCount: number, updateCount: number) => `Successfully imported. ${createCount} new DNFs created, ${updateCount} DNFs updated.`,
    importErrorGeneral: "Error parsing CSV file. Please check the format.",
    parsingProgressText: "Parsing file...",
    backToList: "Back to DNF List",
    csvInstruction: "The CSV file must have a header row (comma-separated). The column names below are suggestions; you can use similar column names in your CSV file. Prioritize English names from the form if available:",
    columnHeaders: { 
      id: "DNF ID (Optional - If provided and exists, DNF will be updated)",
      failureReportNo: "Failure Report No (HTC Reference Only)",
      locationOfFailure: "Location of the failure",
      failedComponentEquipmentLRUTrainNumber: "Failed Component Equipment/LRU/Train Number after LRU",
      subsystem: "Subsystem",
      descriptionOfFailure: "Description of Failure",
      impactAssessment: "Impact Assessment",
      staffWhoIdentifiedFailure: "Staff who identified the failure",
      dateTimeOfFailureOccurrence: "Date & Time of Failure occurrence (Supported: DD/MM/YYYY, YYYY-MM-DD, optionally with HH:MM:SS)",
      methodOfFailureDetection: "Method of failure detection",
      hazardLevel: "Hazard Level",
      status: "Status",
      attachments: "Attachments (URLs separated by ;)",
    },
    fieldNames_dnf: { 
        id: "DNF ID",
        failureReportNo: "Failure Report No",
        locationOfFailure: "Location",
        failedComponentEquipmentLRUTrainNumber: "Failed Component",
        subsystem: "Subsystem",
        descriptionOfFailure: "Description of Failure",
        impactAssessment: "Impact Assessment",
        staffWhoIdentifiedFailure: "Identified By",
        dateTimeOfFailureOccurrence: "Occurrence Date & Time",
        methodOfFailureDetection: "Detection Method",
        hazardLevelId: "Hazard Level",
        status: "Status",
        attachments: "Attachments",
    },
    errorMessagesTitle: "Data Parsing & Validation Errors",
    infoMessagesTitle: "Import Process Information",
    downloadErrorCsv: "Download Error/Info Report (.csv)",
    requiredHeaderMissing: (header: string) => `Required CSV header missing: '${header}'.`,
    requiredFieldMissing: (csvRowNum: number, columnName: string) => `CSV Row ${csvRowNum}: Required field '${columnName}' cannot be empty. Row will be skipped.`,
    idExistsUpdate: (csvRowNum: number, id: string) => `CSV Row ${csvRowNum}: DNF ID '${id}' already exists. Data will be updated.`,
    statusNotFound: (csvRowNum: number, status: string, defaultStatus: string) => `CSV Row ${csvRowNum}: Status '${status}' is invalid. Defaulted to '${defaultStatus}'.`,
    locationNotFound: (csvRowNum: number, loc: string) => `CSV Row ${csvRowNum}: Location value '${loc}' not found in categories. Row will be skipped.`,
    subsystemNotFound: (csvRowNum: number, sub: string) => `CSV Row ${csvRowNum}: Subsystem value '${sub}' not found in categories. Row will be skipped.`,
    detectionMethodNotFound: (csvRowNum: number, method: string) => `CSV Row ${csvRowNum}: Detection Method value '${method}' not found in categories. Row will be skipped.`,
    invalidDateFormatError: (csvRowNum: number, val: string, fieldName: string) => `CSV Row ${csvRowNum}: Field '${fieldName}' has invalid date/time value '${val}'. Accepted formats include DD/MM/YYYY, YYYY-MM-DD (optionally with HH:MM:SS). Row will be skipped.`,
    infoStaffIdentifiedDefault: (csvRowNum: number, defaultName: string) => `CSV Row ${csvRowNum}: Identifier not provided. Defaulted to '${defaultName}'.`,
    infoHazardLevelNotFoundSetDefault: (csvRowNum: number, providedLevel: string, defaultLevelLabel: string) => `CSV Row ${csvRowNum}: Hazard Level '${providedLevel}' is invalid. Defaulted to '${defaultLevelLabel}'.`,
    infoHazardLevelMissingSetDefault: (csvRowNum: number, defaultLevelLabel: string) => `CSV Row ${csvRowNum}: Hazard Level not provided. Defaulted to '${defaultLevelLabel}'.`,
    fileTooShort: "CSV file is too short (needs at least 2 rows: header and 1 data row).",
    cannotReadFile: "Cannot read the file.",
    noValidDnfsToImport: "No valid DNFs were imported. Please check the errors.",
    allRowsHaveErrors: "All data rows have errors. Please check the error report.",
    nothingToImport: "Please select a CSV file to import.",
    errorCsvHeader_Original: "Original CSV Data",
    errorCsvHeader_Reason: "Error Reason/Info",
    errorCsvHeader_Type: "Message Type",
    errorDisplayFormat: (csvRowNum: number, field?: string, value?: string, message?: string) => `Row ${csvRowNum}${field ? `, Field '${field}'` : ''}${value ? `, Value '${value}'` : ''}: ${message}`,
  }
};

const PREVIEW_PAGE_SIZE = 20;

type DnfFieldKey = keyof DnfDocument | 'id';

const getDisplayFieldName = (
    internalKey: DnfFieldKey, 
    rawHeaders: string[], 
    mappedFieldKeys: (DnfFieldKey | undefined)[], 
    tDnfFieldNames: Record<string, string>
): string => {
    const indexInMappedKeys = mappedFieldKeys.indexOf(internalKey);
    if (indexInMappedKeys !== -1 && rawHeaders[indexInMappedKeys]) {
        return rawHeaders[indexInMappedKeys]; 
    }
    return tDnfFieldNames[internalKey] || internalKey; 
};


export default function DnfImportPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const tDnfFieldNames = t.fieldNames_dnf;
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  const [parsedDnfItems, setParsedDnfItems] = React.useState<ParsedDnfItem[]>([]);
  const [parseMessages, setParseMessages] = React.useState<ParseMessage[]>([]);
  const [csvRawHeaders, setCsvRawHeaders] = React.useState<string[]>([]);
  const [parsingProgress, setParsingProgress] = React.useState(0);
  const [existingDnfs, setExistingDnfs] = React.useState<DnfDocument[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);

  const [previewPage, setPreviewPage] = React.useState(1);
  
  const errorsToDisplay = React.useMemo(() => parseMessages.filter(m => m.type === 'error'), [parseMessages]);
  const infosToDisplay = React.useMemo(() => parseMessages.filter(m => m.type === 'info'), [parseMessages]);

  React.useEffect(() => {
    const fetchData = async () => {
        const [dnfData, subsystemData, locationData] = await Promise.all([
            getDnfs(),
            getSubsystems(),
            getLocations(),
        ]);
        setExistingDnfs(dnfData);
        setSubsystems(subsystemData);
        setLocations(locationData);
    };
    fetchData();
  }, []);

  const validItemsToProcessCount = React.useMemo(() => {
    return parsedDnfItems.filter(pItem => 
      !errorsToDisplay.some(err => err.csvRowNumber === pItem._csvRowNumber)
    ).length;
  }, [parsedDnfItems, errorsToDisplay]);
  
  const dnfsToCreate = React.useMemo(() => parsedDnfItems.filter(item => item._action === 'create' && !errorsToDisplay.some(err => err.csvRowNumber === item._csvRowNumber)), [parsedDnfItems, errorsToDisplay]);
  const dnfsToUpdate = React.useMemo(() => parsedDnfItems.filter(item => item._action === 'update' && !errorsToDisplay.some(err => err.csvRowNumber === item._csvRowNumber)), [parsedDnfItems, errorsToDisplay]);

  const totalPreviewPages = Math.ceil(parsedDnfItems.length / PREVIEW_PAGE_SIZE);
  const displayablePreviewDnfs = parsedDnfItems.slice(
    (previewPage - 1) * PREVIEW_PAGE_SIZE,
    previewPage * PREVIEW_PAGE_SIZE
  );

  const findIdByLabel = (label: string | undefined, collection: ({id: string, label: string | NavItemLabel})[], currentLocale: Locale): string | undefined => {
    if (!label || typeof label !== 'string') return undefined;
    const lowerLabel = label.trim().toLowerCase();
    if (lowerLabel === "") return undefined;

    const item = collection.find(i => {
      const itemLabelEn = (typeof i.label === 'string' ? i.label : i.label.en)?.trim().toLowerCase();
      const itemLabelVi = (typeof i.label === 'string' ? i.label : i.label.vi)?.trim().toLowerCase();
      const currentLocaleLabel = (typeof i.label === 'string' ? i.label : i.label[currentLocale])?.trim().toLowerCase();
      
      return currentLocaleLabel === lowerLabel || itemLabelEn === lowerLabel || itemLabelVi === lowerLabel;
    });
    return item?.id;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setParsedDnfItems([]);
      setParseMessages([]);
      setCsvRawHeaders([]);
      setParsingProgress(0);
      setPreviewPage(1);
      parseCsvFile(file);
    } else {
      setSelectedFile(null);
      toast({ variant: "destructive", title: "Lỗi chọn tệp", description: "Vui lòng chỉ chọn tệp CSV." });
    }
  };

  const parseCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadstart = () => setParsingProgress(1); 

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setParsingProgress(progress > 1 ? progress : 1); 
      }
    };

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const localMessages: ParseMessage[] = [];

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

      const headerLineRaw = lines[0];
      const rawHeaders = headerLineRaw.split(',').map(h => h.trim());
      setCsvRawHeaders(rawHeaders);
      const headerLine = rawHeaders.map(h => h.toLowerCase().trim());

      const headerMapping: Record<string, DnfFieldKey | 'attachments'> = {
        // English from form image (case-insensitive priority)
        "failure report no (htc reference only)": 'failureReportNo',
        "location of the failure": 'locationOfFailure',
        "failed component equipment/lru/train number after lru": 'failedComponentEquipmentLRUTrainNumber',
        "subsystem": 'subsystemIds', 
        "description of failure": 'descriptionOfFailure',
        "impact assessment": 'impactAssessment',
        "staff who identified the failure": 'staffWhoIdentifiedFailure',
        "date & time of failure occurrence": 'dateTimeOfFailureOccurrence',
        "method of failure detection": 'methodOfFailureDetection',
        "hazard level": 'hazardLevelId',
        "status": 'status', 
        "attachments": 'attachments',
        
        // Vietnamese primary / alternatives
        [t.columnHeaders.id.split('(')[0].trim().toLowerCase()]: 'id',
        "dnf id": 'id',
        [t.columnHeaders.failureReportNo.split('/')[1].trim().toLowerCase()]: 'failureReportNo', 
        "số báo cáo htc": 'failureReportNo', 
        [t.columnHeaders.locationOfFailure.split('/')[1].trim().toLowerCase()]: 'locationOfFailure', 
        "vị trí": 'locationOfFailure', 
        [t.columnHeaders.failedComponentEquipmentLRUTrainNumber.split('/')[1].trim().toLowerCase()]: 'failedComponentEquipmentLRUTrainNumber', 
        "thiết bị lỗi": 'failedComponentEquipmentLRUTrainNumber',
        [t.columnHeaders.subsystem.split('/')[1].trim().toLowerCase()]: 'subsystemIds', 
        "hệ thống con": 'subsystemIds',
        [t.columnHeaders.descriptionOfFailure.split('/')[1].trim().toLowerCase()]: 'descriptionOfFailure', 
        "mô tả khiếm khuyết": 'descriptionOfFailure',
        "đánh giá ảnh hưởng": 'impactAssessment',
        [t.columnHeaders.staffWhoIdentifiedFailure.split('/')[1].trim().toLowerCase()]: 'staffWhoIdentifiedFailure', 
        "người phát hiện": 'staffWhoIdentifiedFailure',
        [t.columnHeaders.dateTimeOfFailureOccurrence.split('/')[1].trim().toLowerCase().split('(')[0].trim()]: 'dateTimeOfFailureOccurrence', 
        "ngày giờ xảy ra": 'dateTimeOfFailureOccurrence',
        [t.columnHeaders.methodOfFailureDetection.split('/')[1].trim().toLowerCase()]: 'methodOfFailureDetection', 
        "phương pháp phát hiện": 'methodOfFailureDetection',
        [t.columnHeaders.hazardLevel.split('/')[1].trim().toLowerCase()]: 'hazardLevelId', 
        "mức độ mối nguy": 'hazardLevelId',
        [t.columnHeaders.status.split('/')[1].trim().toLowerCase()]: 'status', 
        "trạng thái": 'status',
        "đính kèm": "attachments",
      };
            
      const mappedFieldKeys = headerLine.map(h => headerMapping[h]);
      
      const requiredInternalKeys: DnfFieldKey[] = ['locationOfFailure', 'subsystemIds', 'descriptionOfFailure', 'dateTimeOfFailureOccurrence', 'methodOfFailureDetection', 'status'];
      
      const missingHeaders = requiredInternalKeys.filter(reqKey => !mappedFieldKeys.includes(reqKey));

      if (missingHeaders.length > 0) {
          missingHeaders.forEach(internalKey => {
            const displayHeaderName = getDisplayFieldName(internalKey, rawHeaders, mappedFieldKeys, tDnfFieldNames);
            localMessages.push({type: 'error', csvRowNumber: 1, field: displayHeaderName, message: t.requiredHeaderMissing(displayHeaderName), originalRowData: headerLineRaw})
          });
          setParseMessages(localMessages);
          setParsingProgress(100);
          return;
      }

      const dataLines = lines.slice(1);
      const parsedItems: ParsedDnfItem[] = [];
      
      dataLines.forEach((line, index) => {
        const csvRowNumber = index + 2; 
        const values = line.split(',').map(v => v.trim()); 
        const dnfData: Partial<DnfDocument> & { id?: string; hazardLevelId?: string; attachments?: string; } = {};
        let skipRowDueToError = false;
        let isUpdate = false;
        let originalDnfForUpdate: DnfDocument | undefined = undefined;

        mappedFieldKeys.forEach((fieldKey, i) => {
          if (fieldKey && values[i] !== undefined) { 
            (dnfData as any)[fieldKey] = values[i].trim();
          }
        });
        
        if (dnfData.id && String(dnfData.id).trim() !== "") {
            originalDnfForUpdate = existingDnfs.find(d => d.id === dnfData.id);
            if (originalDnfForUpdate) {
                isUpdate = true;
                localMessages.push({ type: 'info', csvRowNumber, field: getDisplayFieldName('id', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: dnfData.id, message: t.idExistsUpdate(csvRowNumber, dnfData.id!), originalRowData: line });
            }
        } else {
            if (!isUpdate) dnfData.id = `DNF-IMPORT-${Date.now()}-${index}`; 
        }
        
        if (!dnfData.staffWhoIdentifiedFailure || String(dnfData.staffWhoIdentifiedFailure).trim() === "") {
            dnfData.staffWhoIdentifiedFailure = MOCK_CURRENT_USER.name;
            localMessages.push({ type: 'info', csvRowNumber, field: getDisplayFieldName('staffWhoIdentifiedFailure', rawHeaders, mappedFieldKeys, tDnfFieldNames), message: t.infoStaffIdentifiedDefault(csvRowNumber, MOCK_CURRENT_USER.name), originalRowData: line });
        }

        const checkRequiredField = (fieldKey: DnfFieldKey) => {
          const value = dnfData[fieldKey];
          const displayFieldName = getDisplayFieldName(fieldKey, rawHeaders, mappedFieldKeys, tDnfFieldNames);
          if (value === undefined || String(value).trim() === "") {
            localMessages.push({ type: 'error', csvRowNumber, field: displayFieldName, message: t.requiredFieldMissing(csvRowNumber, displayFieldName), originalRowData: line });
            skipRowDueToError = true;
          }
        };
        
        requiredInternalKeys.forEach(key => checkRequiredField(key));
        
        const locationId = findIdByLabel(String(dnfData.locationOfFailure), locations, locale);
        if (dnfData.locationOfFailure && !locationId) { 
            localMessages.push({ type: 'error', csvRowNumber, field: getDisplayFieldName('locationOfFailure', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: String(dnfData.locationOfFailure), message: t.locationNotFound(csvRowNumber, String(dnfData.locationOfFailure)), originalRowData: line}); 
            skipRowDueToError = true;
        } else if (locationId) {
            dnfData.locationOfFailure = locationId;
        }
        
        const subsystemId = findIdByLabel(String(dnfData.subsystemIds), subsystems, locale);
        if (dnfData.subsystemIds && !subsystemId) { 
            localMessages.push({ type: 'error', csvRowNumber, field: getDisplayFieldName('subsystemIds', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: String(dnfData.subsystemIds), message: t.subsystemNotFound(csvRowNumber, String(dnfData.subsystemIds)), originalRowData: line}); 
            skipRowDueToError = true;
        } else if (subsystemId) {
            dnfData.subsystemIds = [subsystemId];
        }

        const methodId = findIdByLabel(String(dnfData.methodOfFailureDetection), DNF_METHODS_OF_DETECTION, locale);
        if (dnfData.methodOfFailureDetection && !methodId) { 
            localMessages.push({ type: 'error', csvRowNumber, field: getDisplayFieldName('methodOfFailureDetection', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: String(dnfData.methodOfFailureDetection), message: t.detectionMethodNotFound(csvRowNumber, String(dnfData.methodOfFailureDetection)), originalRowData: line}); 
            skipRowDueToError = true;
        } else if (methodId) {
             dnfData.methodOfFailureDetection = methodId;
        }
        
        const defaultStatus: DnfStatus = "Mới";
        if (dnfData.status && !DNF_STATUSES.includes(dnfData.status as DnfStatus)) {
            localMessages.push({ type: 'info', csvRowNumber, field: getDisplayFieldName('status', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: String(dnfData.status), message: t.statusNotFound(csvRowNumber, String(dnfData.status), defaultStatus), originalRowData: line});
            dnfData.status = defaultStatus; 
        } else if (!dnfData.status) { 
            dnfData.status = defaultStatus;
        }
        
        try {
            if (dnfData.dateTimeOfFailureOccurrence) {
                 const parsedDate = parseFlexibleDateTime(String(dnfData.dateTimeOfFailureOccurrence));
                 if (!parsedDate) throw new Error("Invalid date format");
                 dnfData.dateTimeOfFailureOccurrence = parsedDate.toISOString();
            } else { 
                // This case should be caught by requiredField check, but for safety:
                throw new Error("Date field is empty");
            }
        } catch (e: any) {
            const displayFieldName = getDisplayFieldName('dateTimeOfFailureOccurrence', rawHeaders, mappedFieldKeys, tDnfFieldNames);
            localMessages.push({ type: 'error', csvRowNumber, field: displayFieldName, value: String(dnfData.dateTimeOfFailureOccurrence || ""), message: t.invalidDateFormatError(csvRowNumber, String(dnfData.dateTimeOfFailureOccurrence || ""), displayFieldName), originalRowData: line});
            skipRowDueToError = true;
        }

        let parsedHazardLevelId: 'high' | 'medium' | 'low' | undefined = undefined;
        const defaultHazardLevelId = 'low'; 
        const defaultHazardLevel = DNF_HAZARD_LEVELS.find(l => l.id === defaultHazardLevelId);
        const defaultHazardLevelLabel = defaultHazardLevel?.label[locale] || defaultHazardLevelId;

        if (dnfData.hazardLevelId && String(dnfData.hazardLevelId).trim() !== "") {
            parsedHazardLevelId = findIdByLabel(String(dnfData.hazardLevelId), DNF_HAZARD_LEVELS, locale) as 'high'|'medium'|'low'|undefined;
            if (!parsedHazardLevelId) {
                localMessages.push({ type: 'info', csvRowNumber, field: getDisplayFieldName('hazardLevelId', rawHeaders, mappedFieldKeys, tDnfFieldNames), value: String(dnfData.hazardLevelId), message: t.infoHazardLevelNotFoundSetDefault(csvRowNumber, String(dnfData.hazardLevelId), defaultHazardLevelLabel), originalRowData: line });
                parsedHazardLevelId = defaultHazardLevelId as 'high' | 'medium' | 'low';
            }
        } else {
             localMessages.push({ type: 'info', csvRowNumber, field: getDisplayFieldName('hazardLevelId', rawHeaders, mappedFieldKeys, tDnfFieldNames), message: t.infoHazardLevelMissingSetDefault(csvRowNumber, defaultHazardLevelLabel), originalRowData: line });
             parsedHazardLevelId = defaultHazardLevelId as 'high' | 'medium' | 'low';
        }
        dnfData.hazardLevelId = parsedHazardLevelId;
        
        if (skipRowDueToError) {
          // Add a placeholder to parsedItems so the row numbers in error messages and preview remain consistent
          parsedItems.push({ 
            id: dnfData.id || `ERROR-ROW-${csvRowNumber}`, // Use provided ID or generate a temporary one
            _action: isUpdate ? 'update' : 'create',
            _originalRowData: line,
            _csvRowNumber: csvRowNumber,
            // Fill with placeholder data or parts that were parsed, clearly indicating error
            locationOfFailure: dnfData.locationOfFailure || "SKIPPED_ROW",
            subsystemIds: Array.isArray(dnfData.subsystemIds) ? dnfData.subsystemIds : [],
            descriptionOfFailure: dnfData.descriptionOfFailure || "Dòng bị bỏ qua do lỗi",
            staffWhoIdentifiedFailure: dnfData.staffWhoIdentifiedFailure || "SKIPPED_ROW",
            dateTimeOfFailureOccurrence: dnfData.dateTimeOfFailureOccurrence || new Date(0).toISOString(),
            methodOfFailureDetection: dnfData.methodOfFailureDetection || "SKIPPED_ROW",
            status: (dnfData.status as DnfStatus) || "Mới",
            hazardLevelId: dnfData.hazardLevelId || defaultHazardLevelId as 'high' | 'medium' | 'low',
            createdById: "SYSTEM",
            statusHistory: [],
            createdAt: originalDnfForUpdate?.createdAt || new Date(0).toISOString(),
            updatedAt: new Date(0).toISOString(),
          });
          return; 
        }

        const attachmentsRaw = dnfData.attachments ? String(dnfData.attachments) : "";
        const attachments: AppImageAttachment[] = attachmentsRaw.split(';').map(url => url.trim()).filter(url => url).map((url, i) => ({
            id: `imported-img-${Date.now()}-${i}`,
            url,
            name: url.substring(url.lastIndexOf('/') + 1) || `attachment-${i+1}`,
            'data-ai-hint': 'imported attachment'
        }));
        
        const finalDnfRecord: ParsedDnfItem = {
            id: dnfData.id!,
            failureReportNo: dnfData.failureReportNo,
            locationOfFailure: dnfData.locationOfFailure!,
            failedComponentEquipmentLRUTrainNumber: dnfData.failedComponentEquipmentLRUTrainNumber,
            subsystemIds: dnfData.subsystemIds as string[],
            descriptionOfFailure: dnfData.descriptionOfFailure!,
            impactAssessment: dnfData.impactAssessment,
            staffWhoIdentifiedFailure: dnfData.staffWhoIdentifiedFailure!,
            dateTimeOfFailureOccurrence: dnfData.dateTimeOfFailureOccurrence!,
            methodOfFailureDetection: dnfData.methodOfFailureDetection!,
            hazardLevelId: dnfData.hazardLevelId,
            status: dnfData.status as DnfStatus,
            attachments: attachments, 
            createdById: isUpdate && originalDnfForUpdate ? originalDnfForUpdate.createdById : MOCK_CURRENT_USER.id,
            statusHistory: isUpdate && originalDnfForUpdate?.statusHistory ? originalDnfForUpdate.statusHistory : [],
            createdAt: isUpdate && originalDnfForUpdate?.createdAt ? originalDnfForUpdate.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _action: isUpdate ? 'update' : 'create',
            _originalRowData: line,
            _csvRowNumber: csvRowNumber
        };
        parsedItems.push(finalDnfRecord);
      });

      setParseMessages(localMessages);
      setParsedDnfItems(parsedItems);
      setParsingProgress(100);
    };
    reader.onerror = () => {
      setParseMessages([{ type: 'error', csvRowNumber: 1, message: t.cannotReadFile, originalRowData: "" }]);
      reader.abort();
      setParsingProgress(100);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
     if (!selectedFile) {
      toast({ title: t.nothingToImport, description: locale === 'vi' ? "Vui lòng chọn một tệp CSV trước." : "Please select a CSV file first.", variant: "default" });
      return;
    }

    const validItemsToProcess = parsedDnfItems.filter(pItem => 
      !errorsToDisplay.some(m => m.type === 'error' && m.csvRowNumber === pItem._csvRowNumber)
    );
    
    if (parsedDnfItems.length > 0 && validItemsToProcess.length === 0) {
      toast({ variant: "destructive", title: "Nhập Thất Bại", description: t.allRowsHaveErrors });
      return;
    }
    
    if (validItemsToProcess.length === 0 && parsedDnfItems.length === 0 && errorsToDisplay.length === 0) {
        toast({ variant: "default", title: "Không có dữ liệu", description: t.noValidDnfsToImport });
        return;
    }
     if (validItemsToProcess.length === 0 && (parsedDnfItems.length > 0 || errorsToDisplay.length > 0)) {
      toast({ variant: "destructive", title: "Nhập Thất Bại", description: t.noValidDnfsToImport });
      return;
    }


    const finalDnfsToCreate = validItemsToProcess.filter(item => item._action === 'create');
    const finalDnfsToUpdate = validItemsToProcess.filter(item => item._action === 'update');

    if (finalDnfsToCreate.length > 0) {
        await addManyDnfs(finalDnfsToCreate.map(({ id, _action, _originalRowData, _csvRowNumber, createdAt, createdById, updatedAt, statusHistory, ...rest }) => rest)); 
    }
    if (finalDnfsToUpdate.length > 0) {
        for (const item of finalDnfsToUpdate) {
            const { _action, _originalRowData, _csvRowNumber, ...rest } = item;
            await updateMockDnf(rest);
        }
    }
    
    if (finalDnfsToCreate.length > 0 || finalDnfsToUpdate.length > 0) {
        toast({
            title: "Nhập Thành Công",
            description: t.importSuccess(finalDnfsToCreate.length, finalDnfsToUpdate.length),
            action: (<Button variant="outline" size="sm" asChild><Link href="/dnf">Xem Danh Sách</Link></Button>),
        });
        setSelectedFile(null);
        setParsedDnfItems([]);
        setParseMessages([]); // Clear messages after successful import
        setCsvRawHeaders([]);
        setParsingProgress(0);
        setPreviewPage(1);
        const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    } else {
        toast({ variant: "default", title: "Không có gì được nhập", description: "Không có DNF hợp lệ nào để tạo mới hoặc cập nhật." });
    }
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
    link.setAttribute("download", `DNF_Import_Report_${selectedFile?.name || new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const csvInstructionText = `
    ${t.csvInstruction}
    ${Object.values(t.columnHeaders).map(header => `- ${header}`).join('\n    ')}
  `;

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
          <Link href="/dnf">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.selectFile}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="csv-file-input" className="cursor-pointer">
              <Button variant="outline" asChild><span><UploadCloud className="mr-2 h-4 w-4" /> {t.selectFile}</span></Button>
              <Input id="csv-file-input" type="file" accept=".csv" onChange={handleFileChange} className="hidden"/>
            </Label>
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

      {(infosToDisplay.length > 0 || errorsToDisplay.length > 0) && (
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
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300 max-h-40 overflow-y-auto">
                        {infosToDisplay.map((info, idx) => (
                            <li key={`info-${idx}`}>
                                {t.errorDisplayFormat(info.csvRowNumber, info.field, info.value, info.message)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {errorsToDisplay.length > 0 && (
                 <div>
                    <h3 className="text-destructive flex items-center font-semibold mb-1">
                        <AlertOctagon className="mr-2 h-5 w-5"/>{t.errorMessagesTitle} ({errorsToDisplay.length})
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive max-h-40 overflow-y-auto">
                        {errorsToDisplay.map((err, idx) => (
                            <li key={`error-${idx}`}>
                                {t.errorDisplayFormat(err.csvRowNumber, err.field, err.value, err.message)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </CardContent>
        </Card>
      )}


      {selectedFile && parsedDnfItems.length > 0 && (
        <Card>
          <CardHeader>
            {validItemsToProcessCount === 0 && parsedDnfItems.length > 0 ? (
                 <CardTitle className="text-destructive">{t.allParsedItemsHaveErrorsTitle}</CardTitle>
            ) : (
                 <CardTitle>{t.previewTitleCounts(dnfsToCreate.length, dnfsToUpdate.length)}</CardTitle>
            )}
            <CardDescription>
                {validItemsToProcessCount === 0 && parsedDnfItems.length > 0 
                    ? t.allParsedItemsHaveErrorsDesc
                    : t.previewPageInfo(previewPage, totalPreviewPages, parsedDnfItems.length)
                }
            </CardDescription>
          </CardHeader>
          {parsedDnfItems.length > 0 && ( // Show table if there are any parsed items, even with errors
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{locale === 'vi' ? 'Hành động' : 'Action'}</TableHead>
                      <TableHead>{tDnfFieldNames.descriptionOfFailure}</TableHead>
                      <TableHead>{tDnfFieldNames.locationOfFailure}</TableHead>
                      <TableHead>{tDnfFieldNames.hazardLevelId}</TableHead>
                      <TableHead>{tDnfFieldNames.status}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayablePreviewDnfs.map((dnf, index) => (
                      <TableRow key={dnf.id || index} className={errorsToDisplay.some(err => err.csvRowNumber === dnf._csvRowNumber) ? "bg-destructive/10" : ""}>
                        <TableCell className="font-mono text-xs">{dnf.id}</TableCell>
                        <TableCell>
                          {dnf._action === 'create' && <Badge variant="secondary">{locale === 'vi' ? 'Tạo mới' : 'New'}</Badge>}
                          {dnf._action === 'update' && <Badge variant="default">{locale === 'vi' ? 'Cập nhật' : 'Update'}</Badge>}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{dnf.descriptionOfFailure}</TableCell>
                        <TableCell>{locations.find(l => l.id === dnf.locationOfFailure)?.label || dnf.locationOfFailure}</TableCell>
                        <TableCell>{DNF_HAZARD_LEVELS.find(hl => hl.id === dnf.hazardLevelId)?.label[locale] || dnf.hazardLevelId || "N/A"}</TableCell>
                        <TableCell>{dnf.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPreviewPages > 1 && (
                  <div className="mt-4 flex justify-between items-center">
                      <Button variant="outline" size="sm" onClick={() => setPreviewPage(p => Math.max(1, p - 1))} disabled={previewPage === 1}>
                          {t.previousPage}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                          {t.previewPageInfo(previewPage, totalPreviewPages, parsedDnfItems.length)}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => setPreviewPage(p => Math.min(totalPreviewPages, p + 1))} disabled={previewPage === totalPreviewPages}>
                          {t.nextPage}
                      </Button>
                  </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleConfirmImport} 
                  disabled={validItemsToProcessCount === 0 || parsingProgress < 100}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t.confirmImport} ({validItemsToProcessCount} {locale === 'vi' ? 'mục hợp lệ' : 'valid items'})
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
       {selectedFile && parsedDnfItems.length === 0 && parsingProgress === 100 && (
         <Card>
            <CardHeader><CardTitle>{t.previewTitle}</CardTitle></CardHeader>
            <CardContent>
                <p>{errorsToDisplay.length > 0 ? t.noPreviewCheckMessages : t.noPreview} ({locale === 'vi' ? 'Không có dòng dữ liệu nào hợp lệ hoặc tệp rỗng/chỉ có header.' : 'No valid data rows found or file is empty/header-only.'})</p>
            </CardContent>
         </Card>
       )}
    </div>
  );
}
