# AGENTS.md

## Sản phẩm

TravelGo giúp người "gánh team" lên lịch trình và ngân sách chung cho chuyến đi trong nước của nhóm bạn. Phạm vi MVP và lý do thiết kế database: [docs/database.md](docs/database.md).

- TravelGo **không tích hợp AI**: không có lịch trình do AI soạn, gợi ý bằng AI hay LLM. Gợi ý dùng quy tắc cố định (khoảng cách, giờ mở cửa, ngân sách) và lịch trình mẫu do team biên soạn.
- Đặt chỗ, đánh giá, cộng đồng đang tạm dừng trong MVP.

## NestJS

Bản NestJS ở đây (12) có thể mới hơn những gì agent biết. Tài liệu theo chương: https://docs.nestjs.com/llms.txt. Bộ skill chính thức của Nest cài bằng `npx @nestjs/skills add --agent all` (thư mục `.agents/` và `.claude/skills/` không được commit).

- Dự án là ESM: import tương đối kết thúc bằng `.js`, không có `__dirname` (dùng `import.meta.dirname`).
- Test chạy bằng Vitest (`vi.fn()`, không phải `jest.fn()`). Unit test đặt cạnh code (`*.spec.ts`), e2e trong `test/` và cần database.
- Lint bằng oxlint (`yarn lint`), format bằng prettier (`yarn format`).

## Database

- PostgreSQL + TypeORM. Đổi schema bằng migration, không bao giờ bật `synchronize`.
- Thêm entity: tạo file `*.entity.ts` trong thư mục của domain, thêm vào `src/database/entities.ts`, rồi `yarn migration:generate src/database/migrations/TenMigration` và đọc lại SQL sinh ra.
- Bảng và cột `snake_case` (đã có `SnakeNamingStrategy`), khoá chính `uuid`, thời gian `timestamptz`, tiền `bigint` theo đồng kèm `moneyTransformer`.
- Khoá ngoại khai báo cả cột `xxxId` lẫn quan hệ `@ManyToOne` + `@JoinColumn()`; kiểu quan hệ bọc trong `Relation<>` để tránh lỗi import vòng trong ESM.
- Tiền gắn với `trip_members`, không gắn với `users`. Khoá ngoại từ bảng tiền tới `trip_members` dùng `MEMBER_MONEY_FK`.
