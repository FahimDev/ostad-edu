// =============================================================
// SEED DATA — runs automatically when the container first starts
// Collections created:
//   employees   — used for most aggregation examples
//   orders      — used for group by, sum, avg, facet
//   products    — used for lookup (join) examples
//   departments — used for lookup (join) examples
// =============================================================

db = db.getSiblingDB("practicedb");

// ── employees ──────────────────────────────────────────────
db.employees.drop();
db.employees.insertMany([
  { name: "Aisha Rahman",  dept: "Engineering", salary: 95000, age: 28, city: "Dhaka",     joinDate: new Date("2020-03-15"), active: true,  skills: ["js","mongodb","react"] },
  { name: "Karim Hossain", dept: "Engineering", salary: 88000, age: 32, city: "Chittagong", joinDate: new Date("2019-07-01"), active: true,  skills: ["python","mongodb"] },
  { name: "Fatima Begum",  dept: "HR",          salary: 62000, age: 35, city: "Dhaka",     joinDate: new Date("2018-01-20"), active: true,  skills: ["communication","excel"] },
  { name: "Rahim Uddin",   dept: "HR",          salary: 58000, age: 29, city: "Sylhet",    joinDate: new Date("2021-06-10"), active: false, skills: ["recruitment","excel"] },
  { name: "Nadia Islam",   dept: "Finance",     salary: 75000, age: 31, city: "Dhaka",     joinDate: new Date("2017-11-05"), active: true,  skills: ["accounting","excel","python"] },
  { name: "Tariq Ahmed",   dept: "Finance",     salary: 82000, age: 27, city: "Rajshahi",  joinDate: new Date("2022-02-28"), active: true,  skills: ["accounting","powerbi"] },
  { name: "Sadia Akter",   dept: "Engineering", salary: 91000, age: 26, city: "Dhaka",     joinDate: new Date("2021-09-01"), active: true,  skills: ["java","spring","mongodb"] },
  { name: "Imran Khan",    dept: "Marketing",   salary: 67000, age: 34, city: "Chittagong", joinDate: new Date("2016-04-18"), active: false, skills: ["seo","content","analytics"] },
  { name: "Mim Chowdhury", dept: "Marketing",   salary: 71000, age: 30, city: "Dhaka",     joinDate: new Date("2020-08-22"), active: true,  skills: ["social-media","seo"] },
  { name: "Zara Sultana",  dept: "Finance",     salary: 79000, age: 33, city: "Sylhet",    joinDate: new Date("2019-03-14"), active: true,  skills: ["accounting","forecasting"] },
]);

// ── products ───────────────────────────────────────────────
db.products.drop();
db.products.insertMany([
  { _id: 1, name: "Laptop Pro",    category: "Electronics", price: 1200, stock: 45 },
  { _id: 2, name: "Wireless Mouse",category: "Electronics", price: 35,   stock: 200 },
  { _id: 3, name: "Office Desk",   category: "Furniture",   price: 450,  stock: 20 },
  { _id: 4, name: "Notebook Pack", category: "Stationery",  price: 12,   stock: 500 },
  { _id: 5, name: "Monitor 27\"",  category: "Electronics", price: 380,  stock: 60 },
  { _id: 6, name: "Standing Desk", category: "Furniture",   price: 850,  stock: 15 },
]);

// ── orders ─────────────────────────────────────────────────
db.orders.drop();
db.orders.insertMany([
  { orderId: "ORD001", productId: 1, customerId: "C01", qty: 2, status: "delivered", orderDate: new Date("2024-01-10"), discount: 0.10 },
  { orderId: "ORD002", productId: 2, customerId: "C02", qty: 5, status: "delivered", orderDate: new Date("2024-01-15"), discount: 0.00 },
  { orderId: "ORD003", productId: 3, customerId: "C01", qty: 1, status: "pending",   orderDate: new Date("2024-02-01"), discount: 0.05 },
  { orderId: "ORD004", productId: 1, customerId: "C03", qty: 1, status: "delivered", orderDate: new Date("2024-02-14"), discount: 0.00 },
  { orderId: "ORD005", productId: 5, customerId: "C02", qty: 3, status: "shipped",   orderDate: new Date("2024-03-05"), discount: 0.15 },
  { orderId: "ORD006", productId: 4, customerId: "C04", qty: 10,status: "delivered", orderDate: new Date("2024-03-20"), discount: 0.00 },
  { orderId: "ORD007", productId: 6, customerId: "C03", qty: 2, status: "cancelled", orderDate: new Date("2024-04-01"), discount: 0.20 },
  { orderId: "ORD008", productId: 2, customerId: "C01", qty: 8, status: "delivered", orderDate: new Date("2024-04-18"), discount: 0.05 },
  { orderId: "ORD009", productId: 5, customerId: "C04", qty: 1, status: "pending",   orderDate: new Date("2024-05-02"), discount: 0.00 },
  { orderId: "ORD010", productId: 3, customerId: "C02", qty: 2, status: "delivered", orderDate: new Date("2024-05-28"), discount: 0.10 },
]);

// ── departments ────────────────────────────────────────────
db.departments.drop();
db.departments.insertMany([
  { _id: "Engineering", location: "Floor 3", budget: 500000, head: "Dr. Kamal" },
  { _id: "HR",          location: "Floor 1", budget: 200000, head: "Ms. Rima"  },
  { _id: "Finance",     location: "Floor 2", budget: 300000, head: "Mr. Sajib" },
  { _id: "Marketing",   location: "Floor 1", budget: 250000, head: "Ms. Tania" },
]);

print("✅ Seed data loaded into practicedb");
