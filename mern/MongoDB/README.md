# MongoDB Aggregation Practice Project

## Quick Start

```bash
# 1. Start everything
docker compose up -d

# 2. Wait ~10 seconds for MongoDB to initialize, then open the UI
open http://localhost:8081

# 3. Open a shell into MongoDB (optional)
docker exec -it mongo_practice mongosh \
  "mongodb://admin:secret123@localhost:27017/practicedb?authSource=admin"
```

## Credentials

| Item              | Value                                         |
|-------------------|-----------------------------------------------|
| Mongo host        | `localhost:27017`                             |
| Username          | `admin`                                       |
| Password          | `secret123`                                   |
| Database          | `practicedb`                                  |
| Browser UI        | http://localhost:8081  (no login required)    |

## Compass (desktop) connection string

```
mongodb://admin:secret123@localhost:27017/?authSource=admin
```

## Running practice queries

### Option A — Browser UI (mongo-express)
1. Go to http://localhost:8081
2. Click **practicedb** → pick any collection (e.g. `employees`)
3. Click the **"Run Query"** tab, paste a section from `practice.js`, click Execute

### Option B — mongosh terminal
```bash
docker exec -it mongo_practice mongosh \
  "mongodb://admin:secret123@localhost:27017/practicedb?authSource=admin"
```
Then paste any query block from `practice.js`.

## Collections

| Collection    | Description                              |
|---------------|------------------------------------------|
| `employees`   | 10 employees — main practice collection  |
| `products`    | 6 products — used in $lookup examples    |
| `orders`      | 10 orders — links to products            |
| `departments` | 4 departments — used in $lookup examples |

## Topics covered in `practice.js`

| Section | Topic                             |
|---------|-----------------------------------|
| 1       | Limiting                          |
| 2       | First and Last                    |
| 3       | Match Condition                   |
| 4       | Like (regex)                      |
| 5       | Projection                        |
| 6       | Skip and Limit                    |
| 7       | Group By                          |
| 8       | Group By SUM                      |
| 9       | Group By AVG                      |
| 10      | Max / Min                         |
| 11      | Without Group By: Sum Avg Max Min |
| 12      | Group By Multiple Fields          |
| 13      | Join with $lookup                 |
| 14      | Facet Operator                    |
| 15      | Projection After Join             |
| 16      | Add New Field with $addFields     |
| 17      | Arithmetic Operators              |
| 18      | String Operators                  |
| 19      | Date Operators                    |
| 20      | Comparison Operators              |
| 21      | Boolean Operators                 |
| 22      | Conditional Operators             |
| Bonus   | Combined pipeline example         |

## Stop / Reset

```bash
# Stop containers (keeps data)
docker compose down

# Stop AND wipe all data (fresh start)
docker compose down -v
```
