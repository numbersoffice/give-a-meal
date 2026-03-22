# Give a Meal API Reference

Base URL: `http://localhost:3000`

All authenticated endpoints require a valid session token for a `businessUsers` collection user, passed via the `Authorization: Bearer <token>` header.

---

## Authentication

### `GET /api/auth/verify-id-token`

Verify the current session and get user info.

**Auth:** Required

**Response (200):**
```json
{ "email": "user@example.com", "uid": "abc123" }
```

**Response (403):**
```json
{ "error": "Unauthorized" }
```

---

### `GET /api/auth/verify-email-link`

Validates an email sign-in link and creates a session.

**Auth:** None (email verification flow)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | yes | The email to verify |
| `user-lang` | string | yes | Language code for redirect |

**Response:** Redirect to `/donors/profile` or `/donors/login`

---

### `GET /api/auth/logout`

Log out and delete the session cookie.

**Auth:** Optional

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | yes | Language code for redirect |

**Response:** Redirect to `/{lang}`

---

## Items

### `GET /api/items`

Get all active items for a business.

**Auth:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessId` | number | yes | The business ID |

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Coffee",
    "description": "A warm cup of coffee",
    "business": 1,
    "archived": false,
    "donationCount": 5
  }
]
```

---

### `POST /api/items`

Create a new item for a business.

**Auth:** Required

**Request Body:**
```json
{
  "businessId": 1,
  "title": "Coffee",
  "description": "A warm cup of coffee"
}
```

**Response (200):** The created item object.

**Response (400):**
```json
{ "error": "Item with this title already exists" }
```

---

### `PUT /api/items/:itemId`

Update an item's title and/or description.

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | number | The item ID |

**Request Body:**
```json
{
  "businessId": 1,
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response (200):** The updated item object.

---

### `DELETE /api/items/:itemId`

Archive (soft delete) an item.

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | number | The item ID |

**Request Body:**
```json
{ "businessId": 1 }
```

**Response (200):** The archived item object.

---

## Donations

### `GET /api/donations`

Get donations for a business, optionally filtered by active status.

**Auth:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessId` | number | yes | The business ID |
| `isActive` | string | no | `"true"` for unclaimed, `"false"` for redeemed, omit for all |

**Response (200):**
```json
[
  {
    "id": 1,
    "item": 1,
    "business": 1,
    "createdBy": "user123",
    "claimedBy": null,
    "redeemedBy": null,
    "redeemedAt": null,
    "donorName": "Jane Doe"
  }
]
```

---

### `POST /api/donations`

Create a new donation. Optionally associate a donor by email.

**Auth:** Required

**Request Body:**
```json
{
  "itemId": 1,
  "businessId": 1,
  "donorEmail": "donor@example.com"
}
```

`donorEmail` is optional. If provided and the donor doesn't exist, a donor profile is created and an email notification is sent.

**Response (200):** The created donation object.

---

### `GET /api/donations/claimed`

Get donations claimed by a specific storage ID (not yet redeemed).

**Auth:** None (storage ID-based)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `claimId` | string | yes | The storage ID of the claimer |

**Response (200):**
```json
[
  {
    "id": 1,
    "item": 1,
    "business": 1,
    "claimedBy": "storage-id-123",
    "redeemedAt": null
  }
]
```

---

### `POST /api/donations/:donationId/claim`

Claim a donation. Limited to 3 active claims per storage ID.

**Auth:** None (storage ID-based)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `donationId` | number | The donation ID |

**Request Body:**
```json
{ "storageId": "unique-device-id" }
```

**Response (200):**
```json
{ "data": { "message": "Claimed successfully" } }
```

**Response (400):**
```json
{ "error": { "message": "Already claimed", "code": "ALREADY_CLAIMED" } }
```

---

### `POST /api/donations/:donationId/redeem`

Redeem a claimed donation. Sends an email notification to the donor.

**Auth:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `donationId` | number | The donation ID |

**Request Body:**
```json
{ "businessId": 1 }
```

**Response (200):** The redeemed donation object.

---

## Team

### `GET /api/team`

Get all team members for a business.

**Auth:** Required (admin only)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessId` | number | yes | The business ID |

**Response (200):**
```json
[
  {
    "id": "profile-id",
    "email": "member@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "connectionType": "admin"
  }
]
```

---

### `GET /api/team/pending`

Get pending team member verification requests.

**Auth:** Required (admin only)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessId` | number | yes | The business ID |

**Response (200):**
```json
[
  {
    "id": 1,
    "verificationEmail": "pending@example.com",
    "verificationMode": "phone",
    "connectionType": "user",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### `POST /api/team/accept`

Accept a team member request. Creates a profile and business connection.

**Auth:** Required (admin only)

**Request Body:**
```json
{ "verificationId": 1, "businessId": 1 }
```

**Response (200):**
```json
{ "success": true }
```

---

### `POST /api/team/decline`

Decline a team member request.

**Auth:** Required (admin only)

**Request Body:**
```json
{ "verificationId": 1, "businessId": 1 }
```

**Response (200):**
```json
{ "success": true }
```

---

### `POST /api/team/remove`

Remove a team member from a business. Only the business owner can do this.

**Auth:** Required (business owner only)

**Request Body:**
```json
{ "profileId": "profile-id", "businessId": 1 }
```

**Response (200):** The removed connection data.

**Response (403):**
```json
{ "error": "Forbidden" }
```

---

## Verification

### `GET /api/verification/status`

Get the current verification status for the authenticated user.

**Auth:** Required

**Response (200):**
```json
{
  "verificationStatus": "new",
  "business": null,
  "profile": null,
  "verification": null
}
```

`verificationStatus` is one of: `"new"`, `"verificationPending"`, `"full"`.

When status is `"full"`:
```json
{
  "verificationStatus": "full",
  "business": { "id": 1, "businessName": "Cafe" },
  "profile": { "id": "abc", "email": "user@example.com" },
  "verification": null
}
```

When status is `"verificationPending"`:
```json
{
  "verificationStatus": "verificationPending",
  "business": null,
  "profile": null,
  "verification": {
    "verificationMode": "email",
    "connectionType": "admin",
    "placeId": "ChIJ..."
  }
}
```

---

### `POST /api/verification/direct`

Verify business ownership by matching the user's email domain to the business website domain.

**Auth:** Required

**Request Body:**
```json
{ "placeId": "ChIJ..." }
```

**Response (200):** Connection object with business and profile data.

**Response (400):**
```json
{ "error": "Email domain does not match business website" }
```

---

### `POST /api/verification/email`

Start email-based verification. Sends a verification link to the business email.

**Auth:** Required

**Request Body:**
```json
{ "placeId": "ChIJ...", "emailName": "info" }
```

The email is constructed as `{emailName}@{business-website-domain}`.

**Response (200):** The created verification entry.

---

### `GET /api/verification/email-link`

Complete email link verification. Creates the business, profile, and connection.

**Auth:** None (email link with key)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | string | yes | The verification key from the email link |

**Response:** HTML page showing success or error.

---

### `POST /api/verification/phone`

Start phone-based verification. Notifies admin for manual review.

**Auth:** Required

**Request Body:**
```json
{ "placeId": "ChIJ...", "verificationNotes": "Call between 9-5" }
```

`verificationNotes` is optional.

**Response (200):** The created verification entry.

---

### `POST /api/verification/cancel`

Cancel an active verification for a business.

**Auth:** Required

**Request Body:**
```json
{ "placeId": "ChIJ..." }
```

**Response (200):**
```json
{ "success": true }
```

---

### `POST /api/verification/user`

Create a user verification request to join an existing business team.

**Auth:** Required

**Request Body:**
```json
{ "businessId": 1 }
```

**Response (200):** The created verification entry.

---

## Businesses

### `GET /api/businesses/search`

Search for businesses by name, optionally near a location.

**Auth:** None (public)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `businessName` | string | yes | Search query |
| `lat` | string | no | Latitude for location bias |
| `lon` | string | no | Longitude for location bias |

**Response (200):**
```json
[
  {
    "placeId": "ChIJ...",
    "name": "Cafe Example",
    "formattedAddress": "123 Main St, City, State",
    "business": { "id": 1, "businessName": "Cafe Example" }
  }
]
```

`business` is `null` if the business is not yet registered on the platform.

---

### `GET /api/businesses/google`

Get detailed business info from Google Places.

**Auth:** None (public)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `placeId` | string | yes | Google Place ID |

**Response (200):**
```json
{
  "name": "Cafe Example",
  "address": {
    "address": "Main St",
    "streetNumber": "123",
    "city": "Springfield",
    "state": "IL",
    "country": "United States",
    "postalCode": "62701"
  },
  "location": { "lat": 39.7817, "lng": -89.6501 },
  "website": "https://cafeexample.com",
  "internationalPhoneNumber": "+1 555-0100",
  "businessStatus": "OPERATIONAL",
  "placeId": "ChIJ..."
}
```

---

## Notifications

### `POST /api/notifications/push-token`

Update the user's push notification token.

**Auth:** Required

**Request Body:**
```json
{ "pushToken": "ExponentPushToken[xxx]", "businessId": 1 }
```

**Response (200):** The updated profile object.

---

## Public

### `GET /api/public/recent`

Get the 5 most recent donations and businesses.

**Auth:** None (public)

**Response (200):**
```json
{
  "donations": [
    { "id": 1, "item": 1, "business": 1, "createdAt": "..." }
  ],
  "businesses": [
    { "id": 1, "businessName": "Cafe", "city": "Springfield" }
  ]
}
```

---

### `GET /api/public/businesses`

Get nearest businesses by location with optional bounding box.

**Auth:** None (public)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | string | yes | Latitude |
| `lon` | string | yes | Longitude |
| `minlat` | string | no | Bounding box min latitude |
| `maxlat` | string | no | Bounding box max latitude |
| `minlon` | string | no | Bounding box min longitude |
| `maxlon` | string | no | Bounding box max longitude |

**Response (200):**
```json
[
  {
    "id": 1,
    "businessName": "Cafe Example",
    "lat": 39.7817,
    "lon": -89.6501,
    "distance": 0.5
  }
]
```
