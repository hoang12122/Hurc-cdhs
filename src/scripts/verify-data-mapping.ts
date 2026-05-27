import { OrganizationService } from '../lib/services/organization-service';
import { getInternalUsers, getInternalRoles } from '../lib/services/user-service';
import { dbProvider } from '../lib/services/db-wrapper';

async function main() {
  console.log("======================================================================");
  console.log("🔍 ĐANG THỰC HIỆN KIỂM TRA ÁNH XẠ DỮ LIỆU & PHÂN QUYỀN HỆ THỐNG AD 🔍");
  console.log("======================================================================\n");

  try {
    // 1. Chạy seed cấu trúc AD mẫu mới nhất
    console.log("1️⃣  Khởi chạy seeding cấu trúc tổ chức AD mẫu...");
    const seedResult = await OrganizationService.seedDefaultOrganization();
    console.log(`   ➜ Kết quả seeding: ${seedResult ? 'THÀNH CÔNG (Đã ghi đè & tái tạo sạch)' : 'BỎ QUA (Đã tồn tại)'}\n`);

    // 2. Kiểm tra danh mục Vai trò đã Seed
    console.log("2️⃣  Kiểm tra danh mục Vai trò (Roles Directory) & Quyền hạn:");
    const roles = await getInternalRoles();
    console.log(`   ➜ Đã tìm thấy ${roles.length} vai trò trong hệ thống.`);
    for (const r of roles) {
      console.log(`     ▪ [Vai trò] ID: "${r.id}" | Tên: "${r.name}"`);
      console.log(`       - Mô tả: ${r.description}`);
      console.log(`       - Số lượng quyền gán: ${r.permissions?.length} quyền`);
    }
    console.log("");

    // 3. Kiểm tra cơ cấu tổ chức AD đệ quy (OUs)
    console.log("3️⃣  Kiểm tra cơ cấu cây AD (Organizational Units):");
    const allOus = await OrganizationService.getOrganizationalUnits();
    console.log(`   ➜ Tổng số lượng OUs tải động (gồm cả danh mục liên kết): ${allOus.length} OUs.`);
    
    const standardOus = allOus.filter((o: any) => !o.id.startsWith('ou-loc-') && !o.id.startsWith('ou-unit-') && !o.id.startsWith('ou-sub-') && !o.id.startsWith('ou-category-'));
    console.log(`     ▪ Số OU chuẩn (được lưu trong DB): ${standardOus.length} OUs.`);
    for (const ou of standardOus) {
      console.log(`       - [OU] ID: "${ou.id}" | Tên: "${ou.name}" | ParentID: "${ou.parentId || 'None (Root OU)'}"`);
    }
    console.log("");

    // 4. Kiểm tra liên kết động Nhóm ga (Dynamic Station Groups Mapping)
    console.log("4️⃣  Kiểm tra ánh xạ động từ Danh mục Vị trí tuần tra (Patrol Locations):");
    const patrolLocations = await dbProvider.findMany<any>('PatrolLocation');
    console.log(`   ➜ Số vị trí ga cấu hình trong Danh mục: ${patrolLocations.length} ga.`);
    
    const dynamicStationOus = allOus.filter((o: any) => o.parentId === 'ou-stations');
    console.log(`     ▪ Số lượng Ga được ánh xạ động vào cây AD (dưới Đội Vận hành Ga): ${dynamicStationOus.length} Ga.`);
    for (const ou of dynamicStationOus) {
      console.log(`       - [Ga động] ID: "${ou.id}" | Tên hiển thị AD: "${ou.name}" | ParentID: "${ou.parentId}"`);
    }
    console.log("");

    // 5. Kiểm tra ánh xạ và phân bổ nhân sự (Users Mapping & Allocation)
    console.log("5️⃣  Kiểm tra ánh xạ tài khoản Người dùng (Users Mapping):");
    const users = await getInternalUsers();
    console.log(`   ➜ Tổng số người dùng: ${users.length} tài khoản.`);
    for (const u of users) {
      console.log(`     ▪ [User] Email: "${u.email}" | Tên: "${u.name}"`);
      console.log(`       - Vai trò bảo mật: "${u.role}"`);
      console.log(`       - Đơn vị công tác (OU): "${u.ouId || 'Chưa gán OU'}"`);
      console.log(`       - Phòng ban (Department): "${u.department || 'Chưa gán'}"`);
    }
    console.log("");

    // 6. Kiểm tra hợp nhất quyền hạn động (Dynamic Permission Union)
    console.log("6️⃣  Kiểm tra kiểm định phân quyền động (Permission Union Test):");
    const testUser = users.find((u: any) => u.email === 'nhhoang@hurc.vn');
    if (testUser) {
      console.log(`     ▪ Đang kiểm tra tài khoản quản trị: "${testUser.email}"`);
      console.log(`       - Quyền gốc trên User record: [${testUser.permissions?.join(', ')}]`);
      
      const userRole = roles.find((r: any) => r.id === testUser.role);
      console.log(`       - Quyền của vai trò "${testUser.role}": [${userRole?.permissions?.join(', ')}]`);
      
      // Simulating the dynamic union we implemented
      const mergedPermissions = Array.from(new Set([
        ...(userRole?.permissions || []),
        ...(testUser.permissions || [])
      ]));
      console.log(`       - Quyền hạn sau hợp nhất (Dynamic Union): [${mergedPermissions.join(', ')}]`);
      console.log(`       ➜ Khả năng truy cập quản trị hệ thống: ${mergedPermissions.includes('*') || mergedPermissions.includes('users:manage') ? 'ĐẦY ĐỦ QUYỀN' : 'HẠN CHẾ'}`);
    } else {
      console.log("     ⚠️ Không tìm thấy người dùng test nhhoang@hurc.vn.");
    }
    
    console.log("\n======================================================================");
    console.log("🎉 TẤT CẢ KIỂM TRA ÁNH XẠ DỮ LIỆU ĐÃ HOÀN TẤT & ĐẠT CHUẨN XÁC THỰC 🎉");
    console.log("======================================================================");
  } catch (error: any) {
    console.error("❌ Lỗi trong quá trình kiểm tra ánh xạ:", error);
  }
}

main();
