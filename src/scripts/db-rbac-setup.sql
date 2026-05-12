-- TASK 7.1: Phân quyền truy cập Database cho Hurc1CRM

-- 1. Tạo Role cho Nghiệp vụ (Ops)
CREATE ROLE hurc_ops_user WITH LOGIN PASSWORD 'ops_secure_pass';
GRANT CONNECT ON DATABASE ops_db TO hurc_ops_user;
GRANT USAGE ON SCHEMA public TO hurc_ops_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hurc_ops_user;
-- Chặn quyền truy cập sang AI Database
REVOKE ALL ON DATABASE ai_db FROM hurc_ops_user;

-- 2. Tạo Role cho AI/Audit (Chỉ đọc Ops, Toàn quyền AI)
CREATE ROLE hurc_ai_user WITH LOGIN PASSWORD 'ai_secure_pass';
GRANT CONNECT ON DATABASE ai_db TO hurc_ai_user;
GRANT USAGE ON SCHEMA public TO hurc_ai_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hurc_ai_user;

-- AI chỉ được phép ĐỌC dữ liệu từ Ops Database (để đối soát)
GRANT CONNECT ON DATABASE ops_db TO hurc_ai_user;
GRANT USAGE ON SCHEMA public TO hurc_ai_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO hurc_ai_user;
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM hurc_ai_user;

-- 3. Chặn quyền xóa log đối với tài khoản thường
-- (Áp dụng Row Level Security hoặc Trigger nếu cần nâng cao)
