/**
 * ข้อมูลตัวอย่างสำหรับ MVP
 * พิกัดเป็นค่าประมาณเพื่อการเรียนรู้ — ก่อนใช้งานจริงควรดึงจาก OSM/Overpass
 * แล้วตรวจสอบความแม่นยำอีกครั้ง (OSM อยู่ภายใต้ ODbL — ต้องให้เครดิต)
 */

export interface Station {
  id: string;
  name: string;
  nameEn: string;
  coord: [number, number]; // [lng, lat]
}

export interface Line {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  stations: Station[];
}

export const LINES: Line[] = [
  {
    id: 'bts-sukhumvit',
    name: 'BTS สายสุขุมวิท',
    nameEn: 'BTS Sukhumvit Line',
    color: '#00A950',
    stations: [
      { id: 'siam', name: 'สยาม', nameEn: 'Siam', coord: [100.5341, 13.7455] },
      { id: 'chitlom', name: 'ชิดลม', nameEn: 'Chit Lom', coord: [100.5432, 13.744] },
      { id: 'phloenchit', name: 'เพลินจิต', nameEn: 'Phloen Chit', coord: [100.5485, 13.743] },
      { id: 'nana', name: 'นานา', nameEn: 'Nana', coord: [100.5534, 13.7405] },
      { id: 'asok', name: 'อโศก', nameEn: 'Asok', coord: [100.5612, 13.7371] },
      { id: 'phromphong', name: 'พร้อมพงษ์', nameEn: 'Phrom Phong', coord: [100.5695, 13.7304] },
      { id: 'thonglo', name: 'ทองหล่อ', nameEn: 'Thong Lo', coord: [100.5784, 13.7242] },
      { id: 'ekkamai', name: 'เอกมัย', nameEn: 'Ekkamai', coord: [100.5852, 13.7196] },
      { id: 'phrakhanong', name: 'พระโขนง', nameEn: 'Phra Khanong', coord: [100.5912, 13.7152] },
      { id: 'onnut', name: 'อ่อนนุช', nameEn: 'On Nut', coord: [100.601, 13.7057] },
      { id: 'bangchak', name: 'บางจาก', nameEn: 'Bang Chak', coord: [100.607, 13.697] },
      { id: 'punnawithi', name: 'ปุณณวิถี', nameEn: 'Punnawithi', coord: [100.6113, 13.6907] },
    ],
  },
  {
    id: 'mrt-blue',
    name: 'MRT สายสีน้ำเงิน',
    nameEn: 'MRT Blue Line',
    color: '#1D4EA6',
    stations: [
      { id: 'hualamphong', name: 'หัวลำโพง', nameEn: 'Hua Lamphong', coord: [100.5171, 13.7374] },
      { id: 'samyarn', name: 'สามย่าน', nameEn: 'Sam Yan', coord: [100.5296, 13.7337] },
      { id: 'silom', name: 'สีลม', nameEn: 'Si Lom', coord: [100.534, 13.7292] },
      { id: 'lumphini', name: 'ลุมพินี', nameEn: 'Lumphini', coord: [100.5395, 13.7258] },
      { id: 'khlongtoei', name: 'คลองเตย', nameEn: 'Khlong Toei', coord: [100.5538, 13.7224] },
      {
        id: 'qsncc',
        name: 'ศูนย์การประชุมแห่งชาติสิริกิติ์',
        nameEn: 'QSNCC',
        coord: [100.5595, 13.7232],
      },
      { id: 'sukhumvit', name: 'สุขุมวิท', nameEn: 'Sukhumvit', coord: [100.5612, 13.7371] },
      { id: 'phetchaburi', name: 'เพชรบุรี', nameEn: 'Phetchaburi', coord: [100.5635, 13.7496] },
      { id: 'phraram9', name: 'พระราม 9', nameEn: 'Phra Ram 9', coord: [100.565, 13.7571] },
      {
        id: 'culturalcenter',
        name: 'ศูนย์วัฒนธรรมแห่งประเทศไทย',
        nameEn: 'Thailand Cultural Centre',
        coord: [100.5726, 13.7663],
      },
      { id: 'huaykwang', name: 'ห้วยขวาง', nameEn: 'Huai Khwang', coord: [100.5738, 13.7777] },
      { id: 'latphrao', name: 'ลาดพร้าว', nameEn: 'Lat Phrao', coord: [100.5612, 13.816] },
    ],
  },
];
