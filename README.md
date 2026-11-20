# TravelGo API

Backend của **TravelGo**, app giúp người "gánh team" lên lịch trình và ngân sách chung cho chuyến đi trong nước của nhóm bạn. App di động ở repo [travelgo-app](https://github.com/devHieu04/travelgo-app).

- NestJS 12 (ESM), TypeScript, Vitest, oxlint
- PostgreSQL + TypeORM, đổi schema bằng migration
- Thiết kế database: [docs/database.md](docs/database.md)

## Chạy trên máy

Cần Node 24 (`nvm use` đọc `.nvmrc`), Yarn 1 và Docker.

```bash
nvm use
yarn install
cp .env.example .env
yarn db:up            # Postgres 17 trong docker, cổng DB_PORT (mặc định 5432)
yarn migration:run
yarn start:dev        # http://localhost:3000
```

Nếu máy đã có Postgres chạy ở 5432, đổi `DB_PORT` trong `.env` (ví dụ 5433) trước `yarn db:up`.

## Lệnh

| Lệnh | Việc |
|---|---|
| `yarn start:dev` | Chạy API, tự tải lại khi sửa code |
| `yarn build` | Build ra `dist/` |
| `yarn test` / `yarn test:e2e` | Unit test / e2e (e2e cần database) |
| `yarn lint` / `yarn format` | oxlint / prettier |
| `yarn db:up` / `yarn db:down` | Bật / tắt Postgres trong docker |
| `yarn migration:generate src/database/migrations/TenMigration` | Sinh migration từ thay đổi của entity |
| `yarn migration:run` / `yarn migration:revert` | Chạy / lùi migration |
| `yarn migration:show` | Xem migration nào đã chạy |
| `yarn migration:run:prod` | Chạy migration từ `dist/` khi deploy |

Các lệnh migration build trước rồi gọi TypeORM CLI trên `dist/database/data-source.js`, vì dự án là ESM và entity dùng decorator.

## Cấu trúc

```
src/
  database/              cấu hình TypeORM, naming strategy, migration
  users/                 users
  places/                destinations, places, giờ mở cửa, dịp lễ
  itinerary-templates/   lịch trình mẫu do team biên soạn
  trips/                 chuyến đi, thành viên, link mời, lịch trình, bình chọn, đồ mang theo
  expenses/              khoản chi, phần chia, chuyển khoản trả nợ
docs/database.md         sơ đồ và lý do thiết kế
```

Mỗi thư mục sẽ thành một module Nest khi làm tính năng; PR đầu chỉ có entity và migration.
