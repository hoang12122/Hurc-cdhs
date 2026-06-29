export type RailLineStatus = 'operating' | 'construction' | 'planned' | 'proposed';

export type RailStationType = 'standard' | 'interchange' | 'terminal' | 'future';

export interface RailMapPoint {
  x: number;
  y: number;
}

export interface RailStationNode extends RailMapPoint {
  id: string;
  name: string;
  code: string;
  lineIds: string[];
  type?: RailStationType;
  note?: string;
}

export interface RailLineModel {
  id: string;
  code: string;
  name: string;
  color: string;
  textClassName: string;
  status: RailLineStatus;
  terminalA: string;
  terminalB: string;
  description: string;
  stations: RailStationNode[];
}

const createStation = (
  id: string,
  code: string,
  name: string,
  x: number,
  y: number,
  lineIds: string[],
  type: RailStationType = 'standard',
  note?: string,
): RailStationNode => ({ id, code, name, x, y, lineIds, type, note });

export const HCMC_METRO_LINES: RailLineModel[] = [
  {
    id: 'm1',
    code: 'M1',
    name: 'Tuyến Metro số 1',
    color: '#e11d48',
    textClassName: 'text-rose-600',
    status: 'operating',
    terminalA: 'Bến Thành',
    terminalB: 'BX. Miền Đông Mới',
    description: 'Trục Đông Bắc, kết nối trung tâm Thành phố với khu Thủ Đức - Suối Tiên.',
    stations: [
      createStation('ben-thanh', 'M1-BT', 'Bến Thành', 52, 68, ['M1', 'M2', 'M3', 'M4'], 'interchange'),
      createStation('nha-hat', 'M1-NH', 'Nhà hát', 56, 60, ['M1']),
      createStation('ba-son', 'M1-BS', 'Ba Son', 60, 52, ['M1']),
      createStation('van-thanh', 'M1-VT', 'Văn Thánh', 64, 45, ['M1']),
      createStation('tan-cang', 'M1-TC', 'Tân Cảng', 68, 40, ['M1']),
      createStation('thao-dien', 'M1-TD', 'Thảo Điền', 75, 37, ['M1']),
      createStation('an-phu', 'M1-AP', 'An Phú', 82, 36, ['M1']),
      createStation('rach-chiec', 'M1-RC', 'Rạch Chiếc', 88, 33, ['M1']),
      createStation('phuoc-long', 'M1-PL', 'Phước Long', 92, 28, ['M1']),
      createStation('binh-thai', 'M1-BTH', 'Bình Thái', 93, 22, ['M1']),
      createStation('thu-duc', 'M1-TDU', 'Thủ Đức', 93, 16, ['M1']),
      createStation('cong-nghe-cao', 'M1-CNC', 'Công nghệ cao', 93, 11, ['M1']),
      createStation('suoi-tien', 'M1-ST', 'Suối Tiên', 93, 6, ['M1']),
      createStation('bx-mien-dong-moi', 'M1-MDM', 'BX. Miền Đông Mới', 93, 2, ['M1'], 'terminal'),
    ],
  },
  {
    id: 'm2',
    code: 'M2',
    name: 'Tuyến Metro số 2',
    color: '#a21caf',
    textClassName: 'text-fuchsia-700',
    status: 'planned',
    terminalA: 'BX. An Sương Mới',
    terminalB: 'Cát Lái',
    description: 'Trục Tây Bắc - trung tâm - Đông Nam, có nhiều điểm trung chuyển với M1, M3, M4, M5, M6.',
    stations: [
      createStation('bx-an-suong-moi', 'M2-AS', 'BX. An Sương Mới', 24, 2, ['M2'], 'terminal'),
      createStation('tan-thoi-nhat', 'M2-TTN', 'Tân Thới Nhất', 24, 6, ['M2']),
      createStation('tham-luong', 'M2-TL', 'Tham Lương', 24, 11, ['M2']),
      createStation('pham-van-bach', 'M2-PVB', 'Phạm Văn Bạch', 24, 16, ['M2']),
      createStation('ba-queo', 'M2-BQ', 'Bà Quẹo', 24, 21, ['M2']),
      createStation('nguyen-hong-dao', 'M2-NHD', 'Nguyễn Hồng Đào', 24, 27, ['M2']),
      createStation('dong-den', 'M2-DD', 'Đồng Đen', 26, 33, ['M2']),
      createStation('bay-hien', 'M2-BH', 'Bảy Hiền', 29, 38, ['M2', 'M5'], 'interchange'),
      createStation('cho-tan-binh', 'M2-CTB', 'Chợ Tân Bình', 33, 43, ['M2', 'M5'], 'interchange'),
      createStation('pham-van-hai', 'M2-PVH', 'Phạm Văn Hai', 37, 48, ['M2', 'M5'], 'interchange'),
      createStation('le-thi-rieng', 'M2-LTR', 'Lê Thị Riêng', 41, 53, ['M2']),
      createStation('hoa-hung', 'M2-HH', 'Hòa Hưng', 45, 58, ['M2']),
      createStation('dan-chu', 'M2-DC', 'Dân Chủ', 48, 63, ['M2']),
      createStation('tao-dan', 'M2-TD', 'Tao Đàn', 50, 66, ['M2', 'M3'], 'interchange'),
      createStation('ben-thanh', 'M2-BT', 'Bến Thành', 52, 68, ['M1', 'M2', 'M3', 'M4'], 'interchange'),
      createStation('me-linh', 'M2-ML', 'Mê Linh', 59, 68, ['M2']),
      createStation('ba-chieu', 'M2-BC', 'Bà Chiểu', 66, 69, ['M2']),
      createStation('dinh-tien-hoang', 'M2-DTH', 'Đinh Tiên Hoàng', 72, 70, ['M2']),
      createStation('ton-duc-thang', 'M2-TDT', 'Tôn Đức Thắng', 78, 70, ['M2']),
      createStation('binh-khanh', 'M2-BK', 'Bình Khánh', 84, 71, ['M2']),
      createStation('binh-trung', 'M2-BTR', 'Bình Trưng', 90, 76, ['M2']),
      createStation('dong-van-cong', 'M2-DVC', 'Đồng Văn Cống', 94, 82, ['M2']),
      createStation('cat-lai', 'M2-CL', 'Cát Lái', 98, 88, ['M2'], 'terminal'),
    ],
  },
  {
    id: 'm3',
    code: 'M3',
    name: 'Tuyến Metro số 3',
    color: '#16a34a',
    textClassName: 'text-green-700',
    status: 'planned',
    terminalA: 'BX. Miền Tây Mới',
    terminalB: 'Ga Dĩ An',
    description: 'Trục Tây - Đông Bắc, kết nối khu Tây Thành phố với Hàng Xanh, Bình Triệu, Sóng Thần và Dĩ An.',
    stations: [
      createStation('bx-mien-tay-moi', 'M3-MTM', 'BX. Miền Tây Mới', 2, 68, ['M3'], 'terminal'),
      createStation('tan-kien', 'M3-TK', 'Tân Kiên', 10, 68, ['M3']),
      createStation('an-lac', 'M3-AL', 'An Lạc', 15, 68, ['M3']),
      createStation('cv-phu-lam', 'M3-CVPL', 'CV. Phú Lâm', 20, 68, ['M3']),
      createStation('phu-lam', 'M3-PL', 'Phú Lâm', 25, 68, ['M3']),
      createStation('cay-go', 'M3-CG', 'Cây Gõ', 30, 68, ['M3']),
      createStation('cho-lon', 'M3-CL', 'Chợ Lớn', 35, 68, ['M3']),
      createStation('thuan-kieu', 'M3-TK', 'Thuận Kiều', 40, 68, ['M3', 'M5'], 'interchange'),
      createStation('van-lang', 'M3-VL', 'Vạn Lang', 45, 68, ['M3']),
      createStation('an-duong', 'M3-AD', 'An Dương', 49, 68, ['M3']),
      createStation('cong-hoa', 'M3-CH', 'Cộng Hòa', 52, 68, ['M3', 'M6'], 'interchange'),
      createStation('23-thang-9', 'M3-239', '23 Tháng 9', 48, 63, ['M3']),
      createStation('tao-dan', 'M3-TD', 'Tao Đàn', 50, 60, ['M2', 'M3'], 'interchange'),
      createStation('ho-con-rua', 'M3-HCR', 'Hồ Con Rùa', 55, 57, ['M3', 'M4'], 'interchange'),
      createStation('thao-cam-vien', 'M3-TCV', 'Thảo Cầm Viên', 60, 50, ['M3']),
      createStation('thi-nghe', 'M3-TN', 'Thị Nghè', 64, 44, ['M3']),
      createStation('hang-xanh', 'M3-HX', 'Hàng Xanh', 68, 38, ['M3', 'M5'], 'interchange'),
      createStation('xo-viet-nghe-tinh', 'M3-XVNT', 'Xô Viết Nghệ Tĩnh', 68, 31, ['M3']),
      createStation('binh-trieu', 'M3-BTR', 'Bình Triệu', 68, 24, ['M3']),
      createStation('hiep-binh-phuoc', 'M3-HBP', 'Hiệp Bình Phước', 69, 17, ['M3']),
      createStation('tam-binh-go-dua', 'M3-TBGD', 'Tam Bình - Gò Dưa', 73, 11, ['M3']),
      createStation('song-than', 'M3-ST', 'Sóng Thần', 78, 6, ['M3']),
      createStation('ga-di-an', 'M3-GDA', 'Ga Dĩ An', 82, 2, ['M3'], 'terminal'),
    ],
  },
  {
    id: 'm4',
    code: 'M4',
    name: 'Tuyến Metro số 4',
    color: '#facc15',
    textClassName: 'text-yellow-600',
    status: 'planned',
    terminalA: 'Nhà Bè',
    terminalB: 'Thuận An',
    description: 'Trục Bắc - Nam qua Bến Thành, kết nối Gò Vấp, Phú Nhuận, Quận 1 và khu Nam Thành phố.',
    stations: [
      createStation('thuan-an', 'M4-TA', 'Thuận An', 58, 2, ['M4'], 'terminal'),
      createStation('thanh-loc', 'M4-TL', 'Thạnh Lộc', 54, 5, ['M4']),
      createStation('thanh-xuan', 'M4-TX', 'Thạnh Xuân', 50, 8, ['M4']),
      createStation('xom-moi', 'M4-XM', 'Xóm Mới', 50, 14, ['M4']),
      createStation('bv-go-vap', 'M4-BVGV', 'BV. Gò Vấp', 50, 20, ['M4']),
      createStation('nguyen-van-luong', 'M4-NVL', 'Nguyễn Văn Lượng', 50, 27, ['M4']),
      createStation('quang-trung', 'M4-QT', 'Quang Trung', 50, 33, ['M4']),
      createStation('cv-gia-dinh', 'M4-CVGD', 'CV. Gia Định', 50, 39, ['M4']),
      createStation('nguyen-kiem', 'M4-NK', 'Nguyễn Kiệm', 50, 45, ['M4']),
      createStation('phu-nhuan', 'M4-PN', 'Phú Nhuận', 50, 51, ['M4', 'M5'], 'interchange'),
      createStation('cau-kieu', 'M4-CK', 'Cầu Kiệu', 50, 56, ['M4']),
      createStation('cv-le-van-tam', 'M4-CVLVT', 'CV. Lê Văn Tám', 51, 61, ['M4']),
      createStation('ho-con-rua', 'M4-HCR', 'Hồ Con Rùa', 55, 62, ['M3', 'M4'], 'interchange'),
      createStation('ben-thanh', 'M4-BT', 'Bến Thành', 52, 68, ['M1', 'M2', 'M3', 'M4'], 'interchange'),
      createStation('khanh-hoi', 'M4-KH', 'Khánh Hội', 52, 76, ['M4']),
      createStation('tan-hung', 'M4-TH', 'Tân Hưng', 52, 83, ['M4']),
      createStation('ho-ban-nguyet', 'M4-HBN', 'Hồ Bán Nguyệt', 57, 88, ['M4']),
      createStation('nguyen-van-linh', 'M4-NVL2', 'Nguyễn Văn Linh', 63, 91, ['M4']),
      createStation('nam-sai-gon', 'M4-NSG', 'Nam Sài Gòn', 68, 95, ['M4']),
      createStation('phu-my', 'M4-PM', 'Phú Mỹ', 72, 98, ['M4']),
      createStation('nha-be', 'M4-NB', 'Nhà Bè', 76, 100, ['M4'], 'terminal'),
    ],
  },
  {
    id: 'm5',
    code: 'M5',
    name: 'Tuyến Metro số 5',
    color: '#0284c7',
    textClassName: 'text-sky-700',
    status: 'planned',
    terminalA: 'BX. Cần Giuộc',
    terminalB: 'Cầu Sài Gòn',
    description: 'Trục kết nối khu Nam - Tây Nam với Phú Thọ, Bảy Hiền, Phú Nhuận, Hàng Xanh và Cầu Sài Gòn.',
    stations: [
      createStation('bx-can-giuoc', 'M5-CG', 'BX. Cần Giuộc', 40, 100, ['M5'], 'terminal'),
      createStation('binh-hung', 'M5-BH', 'Bình Hưng', 40, 92, ['M5']),
      createStation('ta-quang-buu', 'M5-TQB', 'Tạ Quang Bửu', 40, 84, ['M5']),
      createStation('xom-cui', 'M5-XC', 'Xóm Củi', 40, 76, ['M5']),
      createStation('thuan-kieu', 'M5-TK', 'Thuận Kiều', 40, 68, ['M3', 'M5'], 'interchange'),
      createStation('phu-tho', 'M5-PT', 'Phú Thọ', 40, 62, ['M5', 'M6'], 'interchange'),
      createStation('bach-khoa', 'M5-BK', 'Bách Khoa', 40, 56, ['M5']),
      createStation('bac-hai', 'M5-BH2', 'Bắc Hải', 40, 50, ['M5']),
      createStation('pham-van-hai', 'M5-PVH', 'Phạm Văn Hai', 42, 45, ['M2', 'M5'], 'interchange'),
      createStation('cho-tan-binh', 'M5-CTB', 'Chợ Tân Bình', 48, 43, ['M2', 'M5'], 'interchange'),
      createStation('phu-nhuan', 'M5-PN', 'Phú Nhuận', 55, 43, ['M4', 'M5'], 'interchange'),
      createStation('hang-xanh', 'M5-HX', 'Hàng Xanh', 68, 38, ['M3', 'M5'], 'interchange'),
      createStation('cau-sai-gon', 'M5-CSG', 'Cầu Sài Gòn', 72, 42, ['M5'], 'terminal'),
    ],
  },
  {
    id: 'm6',
    code: 'M6',
    name: 'Tuyến Metro số 6',
    color: '#f97316',
    textClassName: 'text-orange-600',
    status: 'planned',
    terminalA: 'Quốc lộ 1A',
    terminalB: 'Cộng Hòa',
    description: 'Tuyến vành đai phía Tây, kết nối khu Tân Phú - Bình Tân - Quận 6 với nút Cộng Hòa.',
    stations: [
      createStation('quoc-lo-1a', 'M6-QL1A', 'Quốc lộ 1A', 18, 24, ['M6'], 'terminal'),
      createStation('binh-hung-hoa', 'M6-BHH', 'Bình Hưng Hòa', 18, 30, ['M6']),
      createStation('son-ky', 'M6-SK', 'Sơn Kỳ', 18, 36, ['M6']),
      createStation('nguyen-son', 'M6-NS', 'Nguyễn Sơn', 18, 43, ['M6']),
      createStation('bon-xa', 'M6-BX', 'Bốn Xã', 18, 50, ['M6']),
      createStation('hoa-binh', 'M6-HB', 'Hòa Bình', 20, 57, ['M6']),
      createStation('dam-sen', 'M6-DS', 'Đầm Sen', 24, 63, ['M6']),
      createStation('lanh-binh-thang', 'M6-LBT', 'Lãnh Binh Thăng', 29, 68, ['M6']),
      createStation('phu-tho', 'M6-PT', 'Phú Thọ', 36, 62, ['M5', 'M6'], 'interchange'),
      createStation('thanh-thai', 'M6-TT', 'Thành Thái', 42, 62, ['M6']),
      createStation('ly-thai-to', 'M6-LTT', 'Lý Thái Tổ', 47, 62, ['M6']),
      createStation('cong-hoa', 'M6-CH', 'Cộng Hòa', 52, 68, ['M3', 'M6'], 'interchange'),
    ],
  },
];

export const LINE_STATUS_LABELS: Record<RailLineStatus, string> = {
  operating: 'Đang khai thác',
  construction: 'Đang xây dựng',
  planned: 'Quy hoạch',
  proposed: 'Đề xuất',
};

export const getUniqueStations = () => {
  const map = new Map<string, RailStationNode>();
  for (const line of HCMC_METRO_LINES) {
    for (const station of line.stations) {
      const current = map.get(station.id);
      if (!current) {
        map.set(station.id, station);
      } else {
        map.set(station.id, {
          ...current,
          lineIds: Array.from(new Set([...current.lineIds, ...station.lineIds])),
          type: current.type === 'interchange' || station.type === 'interchange' ? 'interchange' : current.type,
        });
      }
    }
  }
  return Array.from(map.values());
};

export const RAIL_NETWORK_SUMMARY = {
  lines: HCMC_METRO_LINES.length,
  stations: getUniqueStations().length,
  interchanges: getUniqueStations().filter((station) => station.type === 'interchange').length,
};
