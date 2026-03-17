# HƯỚNG DẪN TEST INVENTORY API TRÊN POSTMAN

## CHUẨN BỊ

- Đảm bảo server đang chạy: `npm start`
- Base URL: `http://localhost:3000`
- MongoDB đang chạy trên port 27017

---

## BƯỚC 1: TẠO CATEGORY (Cần thiết cho Product)

**Request:**

```
POST http://localhost:3000/api/v1/categories
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Electronics"
}
```

**Response mẫu:**

```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "Electronics",
  "slug": "electronics",
  "description": "",
  "image": "https://i.imgur.com/ZANVnHE.jpeg",
  "isDeleted": false,
  "createdAt": "2024-03-17T10:00:00.000Z",
  "updatedAt": "2024-03-17T10:00:00.000Z"
}
```

**Lưu lại `_id` của category để dùng cho bước tiếp theo!**

---

## BƯỚC 2: TẠO PRODUCT (Tự động tạo Inventory)

**Request:**

```
POST http://localhost:3000/api/v1/products
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "title": "iPhone 15 Pro",
  "price": 999,
  "description": "Latest iPhone model",
  "category": "65f1234567890abcdef12345",
  "images": ["https://example.com/iphone.jpg"]
}
```

**Thay `category` bằng ID từ bước 1!**

**Response mẫu:**

```json
{
  "_id": "65f9876543210abcdef98765",
  "title": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "price": 999,
  "description": "Latest iPhone model",
  "images": ["https://example.com/iphone.jpg"],
  "category": "65f1234567890abcdef12345",
  "isDeleted": false,
  "createdAt": "2024-03-17T10:05:00.000Z",
  "updatedAt": "2024-03-17T10:05:00.000Z"
}
```

**Lưu lại `_id` của product để dùng cho các bước tiếp theo!**

**✅ Inventory đã được tự động tạo ở background!**

---

## BƯỚC 3: XEM TẤT CẢ INVENTORIES

**Request:**

```
GET http://localhost:3000/api/v1/inventories
```

**Response mẫu:**

```json
[
  {
    "_id": "65fa111111111abcdef11111",
    "product": {
      "_id": "65f9876543210abcdef98765",
      "title": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "price": 999,
      "description": "Latest iPhone model",
      "images": ["https://example.com/iphone.jpg"],
      "category": "65f1234567890abcdef12345"
    },
    "stock": 0,
    "reserved": 0,
    "soldCount": 0,
    "isDeleted": false,
    "createdAt": "2024-03-17T10:05:01.000Z",
    "updatedAt": "2024-03-17T10:05:01.000Z"
  }
]
```

---

## BƯỚC 4: XEM INVENTORY THEO ID

**Request:**

```
GET http://localhost:3000/api/v1/inventories/65fa111111111abcdef11111
```

**Thay ID bằng `_id` của inventory từ bước 3!**

**Response:** Giống như 1 item trong mảng ở bước 3

---

## BƯỚC 5: THÊM STOCK (Nhập hàng)

**Request:**

```
POST http://localhost:3000/api/v1/inventories/add-stock
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "product": "65f9876543210abcdef98765",
  "quantity": 100
}
```

**Thay `product` bằng ID của product từ bước 2!**

**Response mẫu:**

```json
{
  "_id": "65fa111111111abcdef11111",
  "product": "65f9876543210abcdef98765",
  "stock": 100,
  "reserved": 0,
  "soldCount": 0,
  "isDeleted": false,
  "createdAt": "2024-03-17T10:05:01.000Z",
  "updatedAt": "2024-03-17T10:10:00.000Z"
}
```

**✅ Stock tăng từ 0 lên 100!**

---

## BƯỚC 6: RESERVATION (Khách đặt hàng)

**Request:**

```
POST http://localhost:3000/api/v1/inventories/reservation
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "product": "65f9876543210abcdef98765",
  "quantity": 5
}
```

**Response mẫu:**

```json
{
  "_id": "65fa111111111abcdef11111",
  "product": "65f9876543210abcdef98765",
  "stock": 95,
  "reserved": 5,
  "soldCount": 0,
  "isDeleted": false,
  "createdAt": "2024-03-17T10:05:01.000Z",
  "updatedAt": "2024-03-17T10:15:00.000Z"
}
```

**✅ Stock giảm 5 (100→95), Reserved tăng 5 (0→5)!**

---

## BƯỚC 7: SOLD (Khách thanh toán)

**Request:**

```
POST http://localhost:3000/api/v1/inventories/sold
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "product": "65f9876543210abcdef98765",
  "quantity": 3
}
```

**Response mẫu:**

```json
{
  "_id": "65fa111111111abcdef11111",
  "product": "65f9876543210abcdef98765",
  "stock": 95,
  "reserved": 2,
  "soldCount": 3,
  "isDeleted": false,
  "createdAt": "2024-03-17T10:05:01.000Z",
  "updatedAt": "2024-03-17T10:20:00.000Z"
}
```

**✅ Reserved giảm 3 (5→2), SoldCount tăng 3 (0→3)!**

---

## BƯỚC 8: REMOVE STOCK (Giảm hàng tồn kho)

**Request:**

```
POST http://localhost:3000/api/v1/inventories/remove-stock
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "product": "65f9876543210abcdef98765",
  "quantity": 10
}
```

**Response mẫu:**

```json
{
  "_id": "65fa111111111abcdef11111",
  "product": "65f9876543210abcdef98765",
  "stock": 85,
  "reserved": 2,
  "soldCount": 3,
  "isDeleted": false,
  "createdAt": "2024-03-17T10:05:01.000Z",
  "updatedAt": "2024-03-17T10:25:00.000Z"
}
```

**✅ Stock giảm 10 (95→85)!**

---

## TEST CASES LỖI (Error Handling)

### 1. Reservation khi stock không đủ:

```json
POST /api/v1/inventories/reservation
{
    "product": "65f9876543210abcdef98765",
    "quantity": 1000
}
```

**Response:**

```json
{
  "message": "Stock khong du de dat hang"
}
```

### 2. Sold khi reserved không đủ:

```json
POST /api/v1/inventories/sold
{
    "product": "65f9876543210abcdef98765",
    "quantity": 100
}
```

**Response:**

```json
{
  "message": "Reserved khong du"
}
```

### 3. Remove stock khi stock không đủ:

```json
POST /api/v1/inventories/remove-stock
{
    "product": "65f9876543210abcdef98765",
    "quantity": 1000
}
```

**Response:**

```json
{
  "message": "Stock khong du"
}
```

### 4. Quantity <= 0:

```json
POST /api/v1/inventories/add-stock
{
    "product": "65f9876543210abcdef98765",
    "quantity": -5
}
```

**Response:**

```json
{
  "message": "quantity phai lon hon 0"
}
```

### 5. Product không tồn tại:

```json
POST /api/v1/inventories/add-stock
{
    "product": "000000000000000000000000",
    "quantity": 10
}
```

**Response:**

```json
{
  "message": "Inventory khong ton tai"
}
```

---

## FLOW HOÀN CHỈNH - TEST SCENARIO

### Scenario: Bán 10 sản phẩm iPhone

1. **Tạo product** → Inventory tự động tạo (stock=0, reserved=0, soldCount=0)
2. **Nhập hàng:** Add stock 100 → stock=100
3. **Khách A đặt 5 cái:** Reservation 5 → stock=95, reserved=5
4. **Khách B đặt 3 cái:** Reservation 3 → stock=92, reserved=8
5. **Khách A thanh toán:** Sold 5 → stock=92, reserved=3, soldCount=5
6. **Khách B thanh toán:** Sold 3 → stock=92, reserved=0, soldCount=8
7. **Nhập thêm hàng:** Add stock 50 → stock=142
8. **Hàng hỏng, loại bỏ:** Remove stock 2 → stock=140

**Kết quả cuối:**

- stock: 140 (còn trong kho)
- reserved: 0 (không có đơn đang chờ)
- soldCount: 8 (đã bán 8 sản phẩm)

---

## TIPS POSTMAN

1. **Tạo Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `product_id`: Lưu ID product sau khi tạo
   - `category_id`: Lưu ID category sau khi tạo

2. **Sử dụng Tests tab để tự động lưu ID:**

```javascript
// Trong Tests tab của request POST product
pm.environment.set("product_id", pm.response.json()._id);
```

3. **Tạo Collection với thứ tự:**
   - 1. Create Category
   - 2. Create Product
   - 3. Get All Inventories
   - 4. Add Stock
   - 5. Reservation
   - 6. Sold
   - 7. Remove Stock

4. **Run Collection:** Có thể chạy toàn bộ flow tự động bằng Collection Runner

---

## KIỂM TRA DATABASE

Nếu muốn kiểm tra trực tiếp trong MongoDB:

```javascript
// Kết nối MongoDB shell
use NNPTUD-C3

// Xem tất cả inventories
db.inventories.find().pretty()

// Xem inventory với product info
db.inventories.aggregate([
    {
        $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productInfo"
        }
    }
])
```

---

## LƯU Ý QUAN TRỌNG

1. **Thứ tự test:** Phải tạo Category → Product trước khi test Inventory
2. **Product ID:** Luôn sử dụng đúng product ID trong body request
3. **Validation:** Hệ thống sẽ tự động kiểm tra stock/reserved đủ hay không
4. **Auto-create:** Inventory tự động tạo khi tạo product, không cần tạo thủ công
5. **Populate:** GET endpoints tự động join với product info

---

## TROUBLESHOOTING

**Lỗi "Inventory khong ton tai":**

- Kiểm tra product ID có đúng không
- Kiểm tra product đã được tạo chưa
- Xem database: `db.inventories.find()`

**Lỗi "Stock khong du":**

- Cần add stock trước khi reservation
- Kiểm tra số lượng stock hiện tại

**Lỗi "Reserved khong du":**

- Cần reservation trước khi sold
- Kiểm tra số lượng reserved hiện tại

**Server không chạy:**

```bash
npm start
```

**MongoDB không kết nối:**

- Kiểm tra MongoDB service đang chạy
- Kiểm tra connection string trong app.js
