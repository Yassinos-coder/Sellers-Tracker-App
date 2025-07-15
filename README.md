# 🧠 Client Admin Change Event Processor

This service handles admin change events for clients. When a change occurs, the system processes it asynchronously to send notifications and update historical records.

---

## 🔁 Process Overview

### 1. Webhook Received at `/api/changedAdminEvent`

An external system (e.g., TutorCruncher) sends a POST request to the `/api/changedAdminEvent` endpoint when a client's admin is changed.

---

### 2. Controller Processes the Event

The controller extracts and validates the relevant event data from the incoming request. It then formats the client and actor information and sends it to a job queue producer.

---

### 3. Job Enqueued in Bull

The producer places the event into the `admin-change-queue`. This ensures the task is handled asynchronously and reliably, even under load.

---

### 4. Worker Consumes the Job

A background worker listens for jobs on the `admin-change-queue`. When a job is received, the worker:

- Sends a Slack or Pabbly webhook notification about the admin change.
- Updates the corresponding client record in Supabase, logging the new admin under a historical tracking field.

---

### 5. Supabase Update

The client's `affected_cm_history` field in the `tutorax_sales` table is updated to include the new admin. This maintains a historical record of admin assignments for audit and reporting purposes.

---

## 🛠 Technologies Used

- **Node.js** + **TypeScript**
- **Express** for API routing
- **Bull** for job queue management
- **Redis** as the Bull backend
- **Supabase** as the data store
- **Pabbly** for webhook-based notifications

---

## 🚀 Local Development

To run both the API and the background worker simultaneously during development:

```bash
yarn dev
