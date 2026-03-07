# G1 – CRUD Data Flow (Resources)

This document models how the Booking System Phase6 handles **Create, Read, Update, Delete** operations for `resources`, following the same style as the course example.

> Status codes, URLs, and payloads are based on the current Phase6 implementation and should be checked once with DevTools Network tab.

---

## 1️⃣ CREATE – Resource

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant FE as Frontend (resources.html + JS)
    participant API as Express /api/resources
    participant LOG as log.service.js
    participant DB as PostgreSQL (resources, logs)

    %% User fills form and clicks Create
    U->>FE: Fill resource form and click "Create"
    FE->>FE: Client-side validation (name, description, etc.)

    alt Client-side validation passes
        FE->>API: POST /api/resources (JSON body)
        API->>API: Run resourceValidators (express-validator)

        alt Server-side validation passes
            API->>DB: INSERT INTO resources (name, description, available, price, price_unit) VALUES (...)
            DB-->>API: New resource row (id, name, description, available, price, price_unit, created_at)

            %% Logging
            API->>LOG: logEvent("Resource created (ID X)")
            LOG->>DB: INSERT INTO logs (actor_user_id, message, entity_type, entity_id, created_at)
            DB-->>LOG: Log row stored

            API-->>FE: 201 Created { ok: true, data: createdResource }
            FE->>FE: onResourceActionSuccess({ action: "create" })
            FE->>API: GET /api/resources (reload list)
            API->>DB: SELECT * FROM resources ORDER BY created_at DESC
            DB-->>API: Rows
            API-->>FE: 200 OK { ok: true, data: [...] }
            FE->>U: Show updated resource list and cleared form

        else Server-side validation fails
            API-->>FE: 400 Bad Request { ok: false, errors: [ { field, msg }, ... ] }
            FE->>U: Show validation error messages
        end

        opt Duplicate name constraint
            API->>DB: INSERT ... (unique name violation)
            DB-->>API: Error code 23505
            API-->>FE: 409 Conflict { ok: false, error: "Duplicate resource name" }
            FE->>U: Show "duplicate name" message
        end

    else Client-side validation fails
        FE->>U: Show inline validation errors (no request sent)
    end
