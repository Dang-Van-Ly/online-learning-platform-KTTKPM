# Hướng dẫn Deploy lên Render

## Chuẩn bị trước khi deploy

### 1. Tạo Database MySQL (PlanetScale - miễn phí)
1. Vào https://planetscale.com → Đăng ký → New Database
2. Tên database: `online_learning`, Region: `ap-southeast` (gần VN nhất)
3. Vào **Connect** → chọn **Connect with: Java** → copy thông tin:
   - Host: `xxx.connect.psdb.cloud`
   - Username: `...`
   - Password: `...`
4. Connection string sẽ có dạng:
   ```
   jdbc:mysql://xxx.connect.psdb.cloud/online_learning?sslMode=VERIFY_IDENTITY
   ```

### 2. Tạo Redis (Upstash - miễn phí)
1. Vào https://upstash.com → Đăng ký → Create Database
2. Chọn Region: `ap-southeast-1`
3. Sau khi tạo, vào **Details** → copy:
   - **Endpoint** (host): `xxx.upstash.io`
   - **Port**: `6379`
   - **Password**: `...`

---

## Deploy lên Render

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "add render deployment config"
git push origin main
```

### Bước 2: Tạo Blueprint trên Render
1. Vào https://render.com → **New** → **Blueprint**
2. Kết nối GitHub repo của bạn
3. Render sẽ đọc file `render.yaml` và tạo tất cả services

### Bước 3: Điền Environment Variables

Sau khi Render tạo xong các services, vào từng service để điền env vars.
Các biến có `sync: false` cần điền thủ công.

#### auth-service, course-service, order-service (điền giống nhau):
| Key | Giá trị |
|-----|---------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST/online_learning?sslMode=VERIFY_IDENTITY` |
| `SPRING_DATASOURCE_USERNAME` | username từ PlanetScale |
| `SPRING_DATASOURCE_PASSWORD` | password từ PlanetScale |
| `SPRING_DATA_REDIS_HOST` | endpoint từ Upstash (không có port) |
| `SPRING_DATA_REDIS_PASSWORD` | password từ Upstash |
| `AWS_ACCESS_KEY` | AWS access key của bạn |
| `AWS_SECRET_KEY` | AWS secret key của bạn |
| `AWS_REGION` | ví dụ: `ap-southeast-1` |
| `AWS_BUCKET_NAME` | tên S3 bucket của bạn |

#### api-gateway (điền sau khi 3 services trên đã deploy xong):
Lấy URL của từng service (dạng `xxx.onrender.com`), **bỏ `https://`**:

| Key | Giá trị ví dụ |
|-----|--------------|
| `AUTH_SERVICE_HOST` | `auth-service-xxxx.onrender.com` |
| `COURSE_SERVICE_HOST` | `course-service-xxxx.onrender.com` |
| `ORDER_SERVICE_HOST` | `order-service-xxxx.onrender.com` |
| `FRONTEND_ORIGIN` | `https://online-learning-frontend.onrender.com` |

#### online-learning-frontend:
| Key | Giá trị |
|-----|---------|
| `VITE_API_BASE_URL` | `https://api-gateway-xxxx.onrender.com` |

### Bước 4: Redeploy Frontend
Sau khi điền `VITE_API_BASE_URL`, vào frontend service → **Manual Deploy** để rebuild với env var mới.

---

## Lưu ý quan trọng

- **Free tier sẽ sleep sau 15 phút** không có request → lần đầu truy cập sẽ chậm ~30 giây
- **Thứ tự deploy**: DB → Redis → 3 backend services → API Gateway → Frontend
- **MariaDB vs MySQL**: PlanetScale dùng MySQL, cần đổi driver trong `application.properties`:
  - `spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver`
  - `spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect`
  - Xem file `PLANETSCALE_MIGRATION.md` để biết thêm chi tiết

---

## Kiểm tra sau khi deploy
- Frontend: `https://online-learning-frontend.onrender.com`
- API Gateway health: `https://api-gateway-xxxx.onrender.com/health`
