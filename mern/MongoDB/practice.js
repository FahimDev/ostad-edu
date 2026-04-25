// ================================================================
//  MONGODB AGGREGATION PRACTICE
//  Database : practicedb
//  Run each section individually in:
//    • Mongo Shell  : mongosh "mongodb://admin:secret123@localhost:27017/practicedb?authSource=admin"
//    • mongo-express: http://localhost:8081  → practicedb → Run Query
//
//  Paste any ONE section at a time and hit Enter / Execute.
//  Every section is self-contained and can run independently.
// ================================================================

use("practicedb");   // switch to our practice database

// ================================================================
//  SECTION 1 — LIMITING
//  $limit  : stop the pipeline after N documents
//  Use case: "show me only the first 3 employees"
//  Think of it like SQL: SELECT * FROM employees LIMIT 3
// ================================================================
db.employees.aggregate([
  { $limit: 3 }    // stop after 3 documents come through the pipeline
]);


// ================================================================
//  SECTION 2 — FIRST AND LAST
//  $first / $last are used INSIDE $group to grab the first or last
//  value seen in each group.
//  $sort first so "first" and "last" are meaningful.
//  Use case: "who joined the Engineering dept first (earliest)?"
// ================================================================
db.employees.aggregate([ 
  // Step 1 — sort by joinDate ascending so the earliest joiner is "first"
  { $sort: { joinDate: 1 } },

  // Step 2 — group by department; pick the first and last doc per group
  {
    $group: {
      _id: "$dept",                        // group key
      firstJoiner: { $first: "$name" },    // name of the person who joined earliest
      lastJoiner:  { $last:  "$name" },    // name of the person who joined most recently
      firstDate:   { $first: "$joinDate" },
      lastDate:    { $last:  "$joinDate" },
    }
  },

  // Step 3 — sort output alphabetically by dept name
  { $sort: { _id: 1 } }
]);


// ================================================================
//  SECTION 3 — MATCH CONDITION
//  $match  : filters documents — like WHERE in SQL
//  Place it as early as possible so later stages process fewer docs.
//  Multiple conditions in one $match use implicit AND.
// ================================================================

// --- 3a. Single condition: only active employees ---
db.employees.aggregate([
  { $match: { active: true } }      // keep only docs where active === true
]);

// --- 3b. AND condition: active engineers ---
db.employees.aggregate([
  { $match: { active: true, dept: "Engineering" } }
]);

// --- 3c. OR condition: Dhaka OR salary > 80000 ---
db.employees.aggregate([
  {
    $match: {
      $or: [
        { city: "Dhaka" },
        { salary: { $gt: 80000 } }
      ]
    }
  }
]);

// --- 3d. Range condition: age between 28 and 32 (inclusive) ---
db.employees.aggregate([
  {
    $match: {
      age: { $gte: 28, $lte: 32 }   // $gte = ≥,  $lte = ≤
    }
  }
]);


// ================================================================
//  SECTION 4 — LIKE (pattern / regex matching)
//  MongoDB does not have SQL's LIKE keyword.
//  We use $regex inside $match.
//  Syntax: { field: { $regex: "pattern", $options: "i" } }
//  "i" means case-insensitive.
// ================================================================

// --- 4a. Names starting with "A" (SQL: WHERE name LIKE 'A%') ---
db.employees.aggregate([
  { $match: { name: { $regex: "^A", $options: "i" } } }
  //                   ^ = starts with
]);

// --- 4b. Names containing "ah" anywhere (SQL: WHERE name LIKE '%ah%') ---
db.employees.aggregate([
  { $match: { name: { $regex: "ah", $options: "i" } } }
]);

// --- 4c. Names ending with "n" (SQL: WHERE name LIKE '%n') ---
db.employees.aggregate([
  { $match: { name: { $regex: "n$", $options: "i" } } }
  //                       $ = ends with
]);

// --- 4d. City containing "hat" (matches "Chittagong") ---
db.employees.aggregate([
  { $match: { city: { $regex: "hat", $options: "i" } } }
]);


// ================================================================
//  SECTION 5 — PROJECTION
//  $project : choose which fields to INCLUDE or EXCLUDE in output
//  1 = include,  0 = exclude
//  You cannot mix 1s and 0s (except _id which can always be 0)
//  Equivalent to: SELECT name, dept, salary FROM employees
// ================================================================

// --- 5a. Include only specific fields ---
db.employees.aggregate([
  {
    $project: {
      _id: 0,          // hide the _id field
      name: 1,         // show name
      dept: 1,         // show dept
      salary: 1        // show salary
    }
  }
]);

// --- 5b. Exclude one field, show everything else ---
db.employees.aggregate([
  {
    $project: {
      skills: 0,        // hide the skills array; show everything else
      joinDate: 0
    }
  }
]);

// --- 5c. Rename a field using $project ---
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      fullName: "$name",          // rename "name" → "fullName"
      department: "$dept",        // rename "dept" → "department"
      monthlySalary: { $divide: ["$salary", 12] }  // compute while projecting
    }
  }
]);


// ================================================================
//  SECTION 6 — SKIP AND LIMIT  (Pagination)
//  $skip  : discard the first N documents
//  $limit : keep only the next M documents
//  ORDER MATTERS: always sort first, then skip, then limit.
//  SQL equivalent: SELECT ... ORDER BY salary DESC OFFSET 3 LIMIT 3
// ================================================================
db.employees.aggregate([
  { $sort:  { salary: -1 } },   // -1 = descending  (highest first)
  { $skip:  3 },                 // skip the top 3 (already seen on page 1)
  { $limit: 3 }                  // return the next 3 (page 2)
]);

// --- Page formula ---
// Page 1 : skip 0,  limit 3
// Page 2 : skip 3,  limit 3
// Page 3 : skip 6,  limit 3
// skip = (pageNumber - 1) * pageSize


// ================================================================
//  SECTION 7 — GROUP BY
//  $group  : collapses many documents into fewer groups
//  _id     : the field(s) you are grouping BY
//  SQL equivalent: SELECT dept, COUNT(*) FROM employees GROUP BY dept
// ================================================================

// --- 7a. Count employees per department ---
db.employees.aggregate([
  {
    $group: {
      _id: "$dept",               // group by the "dept" field
      totalEmployees: { $sum: 1 } // count: add 1 for each doc in the group
    }
  },
  { $sort: { totalEmployees: -1 } }   // largest dept first
]);

// --- 7b. Count per city ---
db.employees.aggregate([
  {
    $group: {
      _id: "$city",
      count: { $sum: 1 }
    }
  }
]);


// ================================================================
//  SECTION 8 — GROUP BY SUM
//  $sum  inside $group  : total a numeric field per group
//  SQL: SELECT dept, SUM(salary) AS totalSalary FROM employees GROUP BY dept
// ================================================================
db.employees.aggregate([
  {
    $group: {
      _id: "$dept",
      totalSalary: { $sum: "$salary" }   // sum of salary field within each dept group
    }
  },
  { $sort: { totalSalary: -1 } }
]);


// ================================================================
//  SECTION 9 — GROUP BY AVG
//  $avg inside $group : average of a numeric field per group
//  SQL: SELECT dept, AVG(salary) FROM employees GROUP BY dept
// ================================================================
db.employees.aggregate([
  {
    $group: {
      _id: "$dept",
      avgSalary: { $avg: "$salary" }    // average salary within each group
    }
  },
  // $round makes the output readable: round to 2 decimal places
  {
    $project: {
      dept: "$_id",
      avgSalary: { $round: ["$avgSalary", 2] },
      _id: 0
    }
  },
  { $sort: { avgSalary: -1 } }
]);


// ================================================================
//  SECTION 10 — MAX / MIN
//  $max / $min inside $group : highest or lowest value per group
//  SQL: SELECT dept, MAX(salary), MIN(salary) FROM employees GROUP BY dept
// ================================================================
db.employees.aggregate([
  {
    $group: {
      _id: "$dept",
      highestSalary: { $max: "$salary" },  // top earner's salary in this dept
      lowestSalary:  { $min: "$salary" },  // lowest earner's salary
      salarySpread:  { $subtract: [{ $max: "$salary" }, { $min: "$salary" }] }
      // NOTE: $subtract here does NOT work directly — we compute spread in a $project below
    }
  },
  {
    $project: {
      _id: 1,
      highestSalary: 1,
      lowestSalary: 1,
      salarySpread: { $subtract: ["$highestSalary", "$lowestSalary"] }
    }
  }
]);


// ================================================================
//  SECTION 11 — WITHOUT GROUP BY: SUM / AVG / MAX / MIN
//  When _id: null in $group, it treats the WHOLE collection as one group.
//  Use case: "what is the total salary bill for the entire company?"
//  SQL: SELECT SUM(salary), AVG(salary), MAX(salary), MIN(salary) FROM employees
// ================================================================
db.employees.aggregate([
  {
    $group: {
      _id: null,                          // null = no grouping = whole collection
      totalSalary:   { $sum: "$salary" },
      averageSalary: { $avg: "$salary" },
      maxSalary:     { $max: "$salary" },
      minSalary:     { $min: "$salary" },
      employeeCount: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,                             // hide the useless null _id
      totalSalary: 1,
      averageSalary: { $round: ["$averageSalary", 2] },
      maxSalary: 1,
      minSalary: 1,
      employeeCount: 1
    }
  }
]);


// ================================================================
//  SECTION 12 — GROUP BY MULTIPLE FIELDS
//  Pass an OBJECT to _id to group by more than one field.
//  SQL: SELECT dept, city, COUNT(*) FROM employees GROUP BY dept, city
// ================================================================

// --- 12a. Group by dept AND city ---
db.employees.aggregate([
  {
    $group: {
      _id: { department: "$dept", city: "$city" },  // composite group key
      count:      { $sum: 1 },
      avgSalary:  { $avg: "$salary" }
    }
  },
  { $sort: { "_id.department": 1, "_id.city": 1 } }
]);

// --- 12b. Group by dept AND active status ---
db.employees.aggregate([
  {
    $group: {
      _id: { dept: "$dept", active: "$active" },
      count:       { $sum: 1 },
      totalSalary: { $sum: "$salary" }
    }
  },
  { $sort: { "_id.dept": 1 } }
]);


// ================================================================
//  SECTION 13 — JOIN WITH $lookup  (like SQL JOIN)
//  $lookup lets you join a foreign collection into the current pipeline.
//  It produces an array field containing the matched documents.
//
//  Structure:
//  { $lookup: {
//      from:         "foreignCollection",  // collection to join from
//      localField:   "fieldInThisDoc",     // field in current pipeline
//      foreignField: "fieldInForeignDoc",  // field in foreign collection
//      as:           "resultArrayName"     // name of the output array
//  }}
// ================================================================

// --- 13a. Join orders → products  (attach product info to each order) ---
db.orders.aggregate([
  {
    $lookup: {
      from:         "products",    // join the products collection
      localField:   "productId",   // orders.productId
      foreignField: "_id",         // products._id
      as:           "productInfo"  // result stored as an array called "productInfo"
    }
  },
  // $unwind: flatten the array — since each order has exactly one product,
  // we unwind to get the product as an object instead of a single-item array
  { $unwind: "$productInfo" }
]);

// --- 13b. Join employees → departments ---
db.employees.aggregate([
  {
    $lookup: {
      from:         "departments",
      localField:   "dept",         // employees.dept  (e.g. "Engineering")
      foreignField: "_id",          // departments._id (e.g. "Engineering")
      as:           "deptDetails"
    }
  },
  { $unwind: "$deptDetails" },      // flatten single-element array to object
  { $limit: 3 }                     // preview first 3 results
]);


// ================================================================
//  SECTION 14 — FACET OPERATOR
//  $facet runs MULTIPLE sub-pipelines in parallel on the SAME input.
//  Each sub-pipeline produces its own output array.
//  Use case: "give me salary stats AND a department breakdown in one query"
//  This avoids making 2–3 separate queries to the database.
// ================================================================
db.employees.aggregate([
  {
    $facet: {

      // Sub-pipeline 1: overall salary statistics
      "salaryStats": [
        {
          $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            avgSalary:   { $avg: "$salary" },
            maxSalary:   { $max: "$salary" },
            minSalary:   { $min: "$salary" }
          }
        },
        { $project: { _id: 0 } }
      ],

      // Sub-pipeline 2: count of employees per department
      "byDepartment": [
        { $group: { _id: "$dept", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],

      // Sub-pipeline 3: count of employees per city
      "byCity": [
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]
    }
  }
]);


// ================================================================
//  SECTION 15 — PROJECTION AFTER JOIN
//  After a $lookup + $unwind, use $project to shape the final output.
//  Pull fields from both the original doc and the joined doc.
// ================================================================
db.orders.aggregate([
  // Step 1 — join products onto orders
  {
    $lookup: {
      from:         "products",
      localField:   "productId",
      foreignField: "_id",
      as:           "product"
    }
  },
  { $unwind: "$product" },

  // Step 2 — project ONLY the fields we want (from both collections)
  {
    $project: {
      _id: 0,
      orderId:      1,                        // from orders
      status:       1,                        // from orders
      qty:          1,                        // from orders
      productName:  "$product.name",          // from joined product
      category:     "$product.category",      // from joined product
      unitPrice:    "$product.price",         // from joined product
      lineTotal: {                            // computed: qty × price
        $multiply: ["$qty", "$product.price"]
      }
    }
  }
]);


// ================================================================
//  SECTION 16 — ADD NEW FIELD WITH RESULT  ($addFields)
//  $addFields adds computed fields to each document WITHOUT removing
//  existing fields (unlike $project which must list everything).
//  Think of it as "I want everything plus these new computed columns".
// ================================================================

// --- 16a. Add monthlySalary and seniorityLabel to each employee ---
db.employees.aggregate([
  {
    $addFields: {
      // compute monthly salary from annual
      monthlySalary: { $round: [{ $divide: ["$salary", 12] }, 2] },

      // compute years since joining
      yearsAtCompany: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), "$joinDate"] }, // ms difference
            1000 * 60 * 60 * 24 * 365                 // ms in a year
          ]
        }
      },

      // add a label based on salary (we'll cover $cond fully in Section 22)
      salaryBand: {
        $switch: {
          branches: [
            { case: { $gte: ["$salary", 90000] }, then: "Senior" },
            { case: { $gte: ["$salary", 70000] }, then: "Mid" }
          ],
          default: "Junior"
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      dept: 1,
      salary: 1,
      monthlySalary: 1,
      yearsAtCompany: 1,
      salaryBand: 1
    }
  }
]);


// ================================================================
//  SECTION 17 — ARITHMETIC AGGREGATION OPERATORS
//  These work inside $project or $addFields to compute values.
//  $add       : a + b  (or add milliseconds to a date)
//  $subtract  : a - b
//  $multiply  : a * b
//  $divide    : a / b
//  $mod       : a % b  (remainder)
//  $abs       : absolute value
//  $ceil      : round UP to nearest integer
//  $floor     : round DOWN to nearest integer
//  $round     : round to N decimal places
//  $pow       : a ^ b  (power)
//  $sqrt      : square root
// ================================================================
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      salary: 1,

      // $divide: annual → monthly
      monthly:       { $divide: ["$salary", 12] },

      // $multiply: 10% bonus
      bonus:         { $multiply: ["$salary", 0.10] },

      // $add: salary + bonus
      totalComp:     { $add: ["$salary", { $multiply: ["$salary", 0.10] }] },

      // $subtract: take-home after 15% tax
      takeHome:      { $subtract: ["$salary", { $multiply: ["$salary", 0.15] }] },

      // $mod: check if salary is divisible by 1000 (remainder)
      salaryMod1000: { $mod: ["$salary", 1000] },

      // $round: round monthly to 2 decimal places
      monthlyRounded: { $round: [{ $divide: ["$salary", 12] }, 2] },

      // $abs: absolute difference from 75000 benchmark
      diffFrom75k:   { $abs: { $subtract: ["$salary", 75000] } },

      // $floor / $ceil: floor and ceiling of monthly salary
      monthlyFloor:  { $floor: { $divide: ["$salary", 12] } },
      monthlyCeil:   { $ceil:  { $divide: ["$salary", 12] } },

      // $pow: salary squared (illustrative)
      salarySquared: { $pow: ["$salary", 2] },

      // $sqrt: square root of salary
      salarySqrt:    { $round: [{ $sqrt: "$salary" }, 4] }
    }
  }
]);


// ================================================================
//  SECTION 18 — STRING AGGREGATION OPERATORS
//  $concat       : join strings together
//  $toUpper      : uppercase
//  $toLower      : lowercase
//  $substr       : extract a substring  (field, startIndex, length)
//  $strLenCP     : string length in characters
//  $trim         : remove leading/trailing whitespace
//  $ltrim/$rtrim : left-trim / right-trim
//  $split        : split string into array by delimiter
//  $indexOfCP    : find position of a substring (-1 if not found)
//  $replaceOne   : replace first occurrence of a pattern
//  $regexFind    : find a regex match (returns match info)
// ================================================================
db.employees.aggregate([
  {
    $project: {
      _id: 0,

      // $concat: build a display string
      displayName:  { $concat: ["$name", " (", "$dept", ")"] },

      // $toUpper / $toLower: case conversion
      nameUpper:    { $toUpper: "$name" },
      deptLower:    { $toLower: "$dept" },

      // $strLenCP: count characters in the name
      nameLength:   { $strLenCP: "$name" },

      // $substr: first 5 characters of name (index 0, length 5)
      namePrefix:   { $substr: ["$name", 0, 5] },

      // $split: split name into [firstName, lastName]
      nameParts:    { $split: ["$name", " "] },

      // $indexOfCP: position of "a" in city name (-1 = not found)
      posOfA:       { $indexOfCP: [{ $toLower: "$city" }, "a"] },

      // $replaceOne: replace "Engineer" with "Dev" in dept string
      deptRenamed:  {
        $replaceOne: {
          input: "$dept",
          find: "Engineering",
          replacement: "Development"
        }
      },

      // $concat with $substr: "A. Rahman" style short name
      shortName: {
        $concat: [
          { $substr: ["$name", 0, 1] },  // first letter of first name
          ". ",
          // last word of name: split → arrayElemAt with index -1
          { $arrayElemAt: [{ $split: ["$name", " "] }, -1] }
        ]
      }
    }
  }
]);


// ================================================================
//  SECTION 19 — DATE AGGREGATION OPERATORS
//  $year, $month, $dayOfMonth  : extract year / month / day
//  $hour, $minute, $second     : extract time parts
//  $dayOfWeek    : 1=Sunday … 7=Saturday
//  $dayOfYear    : 1–366
//  $week         : ISO week number
//  $dateToString : format a date as a string
//  $dateDiff     : compute difference between two dates
//  $dateAdd      : add an amount to a date
//  $toDate       : convert a string to a Date
// ================================================================
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      joinDate: 1,

      // extract individual date parts
      joinYear:   { $year:       "$joinDate" },
      joinMonth:  { $month:      "$joinDate" },
      joinDay:    { $dayOfMonth: "$joinDate" },
      joinWeekDay:{ $dayOfWeek:  "$joinDate" },  // 1=Sun, 2=Mon, …
      joinWeek:   { $week:       "$joinDate" },

      // format as readable string
      joinFormatted: {
        $dateToString: {
          format: "%d %B %Y",   // e.g. "15 March 2020"
          date:   "$joinDate"
        }
      },

      // how many YEARS has this person been at the company?
      yearsService: {
        $dateDiff: {
          startDate: "$joinDate",
          endDate:   "$$NOW",    // $$NOW = current moment
          unit:      "year"
        }
      },

      // how many DAYS since they joined?
      daysService: {
        $dateDiff: {
          startDate: "$joinDate",
          endDate:   "$$NOW",
          unit:      "day"
        }
      },

      // add 30 days to joinDate (e.g. probation end date)
      probationEnd: {
        $dateAdd: {
          startDate: "$joinDate",
          unit:      "day",
          amount:    30
        }
      }
    }
  },
  // filter to only those who joined before 2020
  { $match: { joinYear: { $lt: 2020 } } },
  { $sort:  { joinDate: 1 } }
]);


// ================================================================
//  SECTION 20 — COMPARISON AGGREGATION OPERATORS
//  These return true/false (boolean) — used inside $project/$addFields
//  $eq   : a == b
//  $ne   : a != b
//  $gt   : a >  b
//  $gte  : a >= b
//  $lt   : a <  b
//  $lte  : a <= b
//  $cmp  : returns -1 / 0 / 1  (like strcmp)
//
//  NOTE: In $match we write { salary: { $gt: 80000 } }
//        But in $project/$addFields we write { $gt: ["$salary", 80000] }
//        The EXPRESSION syntax takes an ARRAY of two operands.
// ================================================================
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      dept: 1,
      salary: 1,

      // is salary exactly 88000?
      isExact88k:  { $eq:  ["$salary", 88000] },

      // is salary NOT equal to 88000?
      notExact88k: { $ne:  ["$salary", 88000] },

      // is salary above 80000?
      isHighPaid:  { $gt:  ["$salary", 80000] },

      // is salary 80000 or above?
      isSeniorPay: { $gte: ["$salary", 80000] },

      // is age below 30?
      isYoung:     { $lt:  ["$age", 30] },

      // is age 30 or below?
      isNotSenior: { $lte: ["$age", 30] },

      // $cmp: compare salary to 75000 benchmark
      //  -1 = salary < 75000 (below benchmark)
      //   0 = salary = 75000 (exactly at benchmark)
      //   1 = salary > 75000 (above benchmark)
      salaryVsBenchmark: { $cmp: ["$salary", 75000] }
    }
  }
]);


// ================================================================
//  SECTION 21 — BOOLEAN AGGREGATION OPERATORS
//  $and  : true if ALL conditions are true
//  $or   : true if ANY condition is true
//  $not  : inverts a boolean value
//  These work in $project/$addFields as expression operators.
//  They take ARRAYS of boolean expressions.
// ================================================================
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      dept: 1,
      salary: 1,
      age: 1,
      active: 1,

      // $and: both conditions must be true
      isActiveHighEarner: {
        $and: [
          "$active",                          // is active
          { $gt: ["$salary", 80000] }         // AND salary > 80000
        ]
      },

      // $or: at least one condition must be true
      isDhakaOrWellPaid: {
        $or: [
          { $eq:  ["$city", "Dhaka"] },       // lives in Dhaka
          { $gte: ["$salary", 90000] }        // OR earns >= 90k
        ]
      },

      // $not: invert active status
      isInactive: { $not: ["$active"] },

      // $and + $not: active but NOT in Engineering
      activeNonEngineer: {
        $and: [
          "$active",
          { $not: [{ $eq: ["$dept", "Engineering"] }] }
        ]
      },

      // complex: (salary > 70k AND active) OR age < 28
      priorityCandidate: {
        $or: [
          {
            $and: [
              { $gt:  ["$salary", 70000] },
              "$active"
            ]
          },
          { $lt: ["$age", 28] }
        ]
      }
    }
  }
]);


// ================================================================
//  SECTION 22 — CONDITIONAL AGGREGATION OPERATORS
//  $cond    : ternary IF / THEN / ELSE
//             { $cond: { if: <expr>, then: <val>, else: <val> } }
//             or shorthand: { $cond: [<if>, <then>, <else>] }
//  $ifNull  : use a fallback value when a field is null / missing
//             { $ifNull: ["$field", "fallback"] }
//  $switch  : multi-branch CASE / WHEN
//             { $switch: { branches: [...], default: "..." } }
// ================================================================

// --- 22a. $cond: simple IF / THEN / ELSE ---
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      salary: 1,
      active: 1,

      // "Is this a senior salary?"
      seniorityLabel: {
        $cond: {
          if:   { $gte: ["$salary", 85000] },  // condition
          then: "Senior",                       // value when TRUE
          else: "Junior / Mid"                  // value when FALSE
        }
      },

      // shorthand array form: [ if, then, else ]
      statusText: {
        $cond: ["$active", "Currently Employed", "No Longer Active"]
      }
    }
  }
]);

// --- 22b. $ifNull: handle missing/null fields ---
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      // if "bonus" field doesn't exist, use 0 as fallback
      bonus:    { $ifNull: ["$bonus", 0] },
      // if city is null/missing, label as "Unknown"
      location: { $ifNull: ["$city", "Unknown Location"] }
    }
  }
]);

// --- 22c. $switch: multi-branch case (like SQL CASE WHEN) ---
db.employees.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      dept: 1,
      salary: 1,

      // salary band with 4 tiers
      salaryTier: {
        $switch: {
          branches: [
            { case: { $gte: ["$salary", 90000] }, then: "💎 Platinum (90k+)" },
            { case: { $gte: ["$salary", 80000] }, then: "🥇 Gold    (80k–89k)" },
            { case: { $gte: ["$salary", 70000] }, then: "🥈 Silver  (70k–79k)" },
            { case: { $gte: ["$salary", 60000] }, then: "🥉 Bronze  (60k–69k)" }
          ],
          default: "⚪ Entry   (< 60k)"   // none of the above matched
        }
      },

      // age group classification
      ageGroup: {
        $switch: {
          branches: [
            { case: { $lt:  ["$age", 25] }, then: "Gen Z"      },
            { case: { $lt:  ["$age", 32] }, then: "Early Career" },
            { case: { $lt:  ["$age", 40] }, then: "Mid Career"  }
          ],
          default: "Senior Professional"
        }
      }
    }
  },
  { $sort: { salary: -1 } }
]);


// ================================================================
//  BONUS — COMBINED PIPELINE EXAMPLE
//  Demonstrates using many operators together in one pipeline.
//  "Give me a report per department: only active employees,
//   showing avg salary, headcount, and salary tier breakdown."
// ================================================================
db.employees.aggregate([
  // Step 1: keep only active employees
  { $match: { active: true } },

  // Step 2: add a computed salary tier
  {
    $addFields: {
      tier: {
        $switch: {
          branches: [
            { case: { $gte: ["$salary", 85000] }, then: "Senior"  },
            { case: { $gte: ["$salary", 70000] }, then: "Mid"     }
          ],
          default: "Junior"
        }
      }
    }
  },

  // Step 3: group by dept to compute stats
  {
    $group: {
      _id: "$dept",
      headcount:   { $sum: 1 },
      avgSalary:   { $avg: "$salary" },
      totalSalary: { $sum: "$salary" },
      seniors:     { $sum: { $cond: [{ $eq: ["$tier", "Senior"] }, 1, 0] } },
      mids:        { $sum: { $cond: [{ $eq: ["$tier", "Mid"]    }, 1, 0] } },
      juniors:     { $sum: { $cond: [{ $eq: ["$tier", "Junior"] }, 1, 0] } }
    }
  },

  // Step 4: clean up and round numbers
  {
    $project: {
      _id: 0,
      department:  "$_id",
      headcount:   1,
      avgSalary:   { $round: ["$avgSalary", 0] },
      totalSalary: 1,
      tierBreakdown: {
        senior: "$seniors",
        mid:    "$mids",
        junior: "$juniors"
      }
    }
  },

  // Step 5: sort by average salary descending
  { $sort: { avgSalary: -1 } }
]);
