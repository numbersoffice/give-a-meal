# API Changes: Donation Reservation System

## Overview

Donation claim/reservation data has been moved off the donation document into a dedicated `reservations` collection. Reservations now use a 6-digit PIN for redemption verification. The donation itself only tracks which staff member redeemed it and when.

---

## New Collection: `reservations`

| Field      | Type         | Required | Description                              |
|------------|--------------|----------|------------------------------------------|
| `donation` | relationship | Yes      | Reference to the reserved donation       |
| `deviceId` | text         | Yes      | Anonymous device ID of the claimant      |
| `pin`      | text         | Yes      | 6-digit PIN required to redeem           |

---

## Removed Fields

### `donations.claimedBy`

This field has been removed. Claim/reservation state is now represented by the existence of a document in the `reservations` collection.

---

## Endpoint Changes

### POST `/api/custom/donations/[donationId]/claim`

**Request body** — unchanged:
```json
{ "storageId": "string" }
```

**Response** — now includes `pin`:
```json
{
  "data": {
    "message": "Success",
    "details": "Successfully claimed donation.",
    "pin": "123456",
    "hint": "",
    "code": 200
  }
}
```

**Behavior changes:**
- Creates a `reservation` document instead of setting `claimedBy` on the donation.
- The max-claims-per-device check (3) now counts reservations instead of donations.
- Checks for an existing reservation on the donation instead of checking `claimedBy`.
- Additionally rejects claims on already-redeemed donations.

---

### POST `/api/custom/donations/[donationId]/redeem`

**Request body** — `pin` is now required:
```json
{ "businessId": "string", "pin": "string" }
```

**Behavior changes:**
- Looks up the reservation for the donation and validates the PIN.
- Returns `401` if the PIN is incorrect.
- Returns `404` if no active reservation exists for the donation.
- On success: sets `redeemedBy` and `redeemedAt` on the donation, then deletes the reservation.

---

### GET `/api/custom/donations/claimed?claimId=<deviceId>`

**Query params** — unchanged.

**Response** — each donation object now includes reservation metadata:
```json
[
  {
    "id": "...",
    "item": { ... },
    "business": { ... },
    "pin": "123456",
    "reservationId": "...",
    ...
  }
]
```

**Behavior changes:**
- Queries the `reservations` collection by `deviceId` instead of querying donations by `claimedBy`.
- Attaches `pin` and `reservationId` to each returned donation.

---

## Unchanged Endpoints

- **GET `/api/custom/donations?businessId=...&isActive=...`** — staff donation list. Still filters by `redeemedAt`. No changes needed.
- **POST `/api/custom/donations`** — create donation. No changes.
- **GET `/api/custom/public/businesses`** — public business list with donation counts. No changes.
- **GET `/api/custom/public/recent`** — recent activity feed. No changes.
