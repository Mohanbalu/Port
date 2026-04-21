# 🧪 Port Logistics System – Testing Guide

## 📌 Overview

This document provides step-by-step testing instructions with sample inputs to validate the complete workflow of the **Port Freight & Container Logistics Management System**.

---

# 🚀 1. Start the Application

## Backend

```bash
mvn clean package
java -jar target/*.jar
```

## Frontend

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 👤 2. Test Users

| Role              | Username  | Password     |
| ----------------- | --------- | ------------ |
| ADMIN             | admin     | admin123     |
| SHIPPING_LINE     | shipping  | shipping123  |
| CUSTOMS_OFFICER   | customs   | customs123   |
| FREIGHT_FORWARDER | forwarder | forwarder123 |

---

# 🚢 3. SHIPPING_LINE FLOW

## ✅ Step 1: Create Vessel

Go to **Vessels Page**

| Field       | Value      |
| ----------- | ---------- |
| Vessel Name | MSC Aurora |
| IMO Number  | IMO1234567 |
| Capacity    | 5000       |

---

## ✅ Step 2: Create Vessel Schedule

| Field          | Value            |
| -------------- | ---------------- |
| Vessel ID      | 1                |
| Arrival Time   | 2026-04-25 10:00 |
| Departure Time | 2026-04-27 18:00 |
| Status         | SCHEDULED        |

---

## 📦 Step 3: Create Container

Go to **Containers Page**

| Field             | Value       |
| ----------------- | ----------- |
| Container Number  | MSCU1234567 |
| Type              | STANDARD    |
| Size              | 20          |
| Weight            | 1200        |
| Seal Number       | SEAL123     |
| Cargo Description | Electronics |

---

# 🛃 4. CUSTOMS OFFICER FLOW

## ✅ Step 4: File Declaration

Go to **Customs Page**

| Field          | Value  |
| -------------- | ------ |
| Container ID   | 1      |
| HS Code        | 123456 |
| Declared Value | 60000  |

---

## ✅ Step 5: Review & Clear

| Field          | Value    |
| -------------- | -------- |
| Declaration ID | 1        |
| Action         | CLEAR    |
| Remarks        | Approved |

---

# 📦 5. FREIGHT FORWARDER FLOW

## ✅ Step 6: Create Booking

Go to **Bookings Page**

| Field        | Value  |
| ------------ | ------ |
| User ID      | 3      |
| Container ID | 1      |
| Destination  | Mumbai |

---

# 🚚 6. TRACKING FLOW

## ✅ Step 7: Track Container

Go to **Tracking Page**

| Field        | Value |
| ------------ | ----- |
| Container ID | 1     |

Expected:

* Full lifecycle movement logs displayed

---

# 👨‍💼 7. ADMIN FLOW

Login as ADMIN and verify:

* Users list
* Containers list
* Customs declarations
* Reports:

  * Fees collected
  * Containers per vessel
  * Clearance time

---

# 🔄 COMPLETE WORKFLOW

```
SHIPPING_LINE
→ Create Vessel
→ Create Schedule
→ Create Container
        ↓
CUSTOMS_OFFICER
→ Declare Container
→ Clear Container
        ↓
FREIGHT_FORWARDER
→ Create Booking
        ↓
TRACKING
→ View Container Journey
        ↓
ADMIN
→ Monitor System
```

---

# ⚠️ VALIDATION RULES

* Container number format: `4 letters + 7 digits` (e.g., MSCU1234567)
* Weight must be ≥ 1000 kg
* Customs clearance required before booking
* Container must exist before declaration
* Schedule must exist before container creation

---

# ❌ COMMON ERRORS & FIXES

| Error                      | Cause                     | Fix                 |
| -------------------------- | ------------------------- | ------------------- |
| FK constraint error        | Invalid container/user ID | Use existing IDs    |
| ByteBuddyInterceptor error | Entity serialization      | Use DTO fix         |
| Validation failed          | Wrong container format    | Use correct format  |
| No data shown              | No records created        | Follow step-by-step |

---

# ✅ EXPECTED OUTPUT

* Vessel created successfully
* Schedule created successfully
* Container created and visible
* Customs cleared
* Booking created
* Tracking shows movement
* Admin dashboard shows data

---

# 🎯 CONCLUSION

Following this testing guide ensures:

* Complete end-to-end system validation
* Correct role-based workflow execution
* No runtime or validation errors

This workflow demonstrates a real-world port logistics lifecycle from vessel arrival to container delivery.
