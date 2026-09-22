# J2EE to React + Spring Boot: Cross-Application Single Sign-On (SSO) Guide

This guide explains how to configure your existing **J2EE application** to issue a JWT cookie upon login, and how your **React frontend** and **Spring Boot backend** pick it up securely to authorize pages and API calls.

---

## 1. How It Works

```
  [1. User Logs In]
        │
        ▼
 ┌───────────────┐
 │   J2EE App    │──(Creates JWT with HS256 secret)
 └───────┬───────┘
         │
         ▼ (Sets Cookie: wjl_jwt=<token>; Domain=.wejoinlife.com; Path=/; SameSite=Lax; HttpOnly; Secure)
 ┌───────────────┐
 │ User Browser  │
 └───────┬───────┘
         │
         ▼ (User opens React App on https://app.wejoinlife.com)
 ┌───────────────┐
 │   React App   │──(Calls API: GET /api/v1/auth/me with credentials: 'include')
 └───────┬───────┘
         │
         ▼ (Cookie automatically sent by browser)
 ┌───────────────────────┐
 │  Spring Boot Backend  │──(JwtAuthenticationFilter extracts wjl_jwt cookie,
 └───────────────────────┘   validates signature, and populates SecurityContext)
```

---

## 2. J2EE Application Configuration

### Step 2.1: Add JJWT Library
Place the following JARs in `WEB-INF/lib` of your J2EE application (or add to `pom.xml` if using Maven):
- `jjwt-api-0.12.6.jar`
- `jjwt-impl-0.12.6.jar`
- `jjwt-jackson-0.12.6.jar`

### Step 2.2: Add the Helper Class to J2EE
Copy [J2eeJwtCookieHelper.java](file:///d:/work/wejoinlife/backend/src/main/java/com/wejoinlife/api/security/j2ee/J2eeJwtCookieHelper.java) to your J2EE project (e.g. `com.wejoinlife.util.J2eeJwtCookieHelper`).

Key settings inside:
* **Secret Key:** `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` (matches Spring Boot `application.security.jwt.secret-key`).
* **Cookie Name:** `wjl_jwt` (matches Spring Boot `application.security.jwt.cookie-name`).

### Step 2.3: Set the Cookie on J2EE Login (Servlet or JSP)

#### In a Servlet (e.g., `LoginServlet.java`):
```java
// Inside your login processing method after verifying user password:
String email = user.getEmail();
String clientUuid = user.getClientUuid();
String clientId = String.valueOf(user.getId());
String role = isSeller ? "seller" : "buyer";
List<Integer> siteIds = getSellerSiteIds(clientUuid);

// 1. Generate JWT
String jwt = J2eeJwtCookieHelper.generateJwt(email, clientUuid, clientId, role, siteIds, "logged_in_user");

// 2. Set Cookie (Use ".wejoinlife.com" for production, or null for localhost)
String rootDomain = request.getServerName().endsWith("wejoinlife.com") ? ".wejoinlife.com" : null;
J2eeJwtCookieHelper.setJwtCookie(response, request, jwt, rootDomain, true);
```

#### In a JSP (e.g., `orderform.jsp` or `login.jsp`):
```jsp
<%@ page import="com.wejoinlife.security.j2ee.J2eeJwtCookieHelper" %>
<%
    // After user session is active:
    String email = (String) session.getAttribute("userEmail");
    String clientUuid = (String) session.getAttribute("clientUuid");
    String role = "buyer"; // or resolve from session

    if (email != null) {
        String jwt = J2eeJwtCookieHelper.generateJwt(email, clientUuid, null, role, null, "jsp_session");
        String rootDomain = request.getServerName().endsWith("wejoinlife.com") ? ".wejoinlife.com" : null;
        J2eeJwtCookieHelper.setJwtCookie(response, request, jwt, rootDomain, true);
    }
%>
```

---

## 3. Spring Boot Backend Configuration (Already Implemented)

1. **Dual-Mode Authentication:**
   [JwtAuthenticationFilter.java](file:///d:/work/wejoinlife/backend/src/main/java/com/wejoinlife/api/security/JwtAuthenticationFilter.java) automatically checks:
   - `Authorization: Bearer <token>` header first.
   - If absent, checks `Cookie: wjl_jwt=<token>`.
2. **Current User Endpoint:**
   `GET /wjlapi/api/v1/auth/me` (or `/api/v1/auth/me`) returns:
   ```json
   {
     "authenticated": true,
     "email": "testuser@wejoinlife.com",
     "role": "seller",
     "clientUuid": "...",
     "clientId": "42",
     "siteIds": [101, 102],
     "profile": "logged_in_user"
   }
   ```
3. **Cross-App Logout:**
   `POST /wjlapi/api/v1/auth/logout` clears `wjl_jwt` and legacy cookies.

---

## 4. React Frontend Integration: The In-Memory Token Handshake (Best Practice)

This is the recommended, OWASP-compliant Single Page Application (SPA) pattern:
1. J2EE sets `HttpOnly = true` cookie (`wjl_jwt`).
2. When React mounts, it calls `GET /wjlapi/api/v1/auth/me` with `credentials: 'include'`.
3. Spring Boot validates the cookie and returns:
   ```json
   {
     "authenticated": true,
     "accessToken": "eyJhbGciOi...",
     "tokenType": "Bearer",
     "email": "testuser@wejoinlife.com",
     "role": "seller",
     "clientUuid": "...",
     "clientId": "42",
     "siteIds": [101, 102]
   }
   ```
4. React saves `accessToken` **in JavaScript memory only** (see [frontend/lib/authStore.ts](file:///d:/work/wejoinlife/frontend/lib/authStore.ts)) — **never in localStorage**.
5. All subsequent requests made through [frontend/lib/api.ts](file:///d:/work/wejoinlife/frontend/lib/api.ts) automatically attach:
   `Authorization: Bearer <in_memory_token>`

### Reusable Frontend Files:
* **In-Memory Store:** [frontend/lib/authStore.ts](file:///d:/work/wejoinlife/frontend/lib/authStore.ts)
* **Axios API Client:** [frontend/lib/api.ts](file:///d:/work/wejoinlife/frontend/lib/api.ts) (Interceptor injects Bearer header)
* **Auth Hook:** [frontend/lib/useAuth.ts](file:///d:/work/wejoinlife/frontend/lib/useAuth.ts) (Handles initial handshake & state)
* **Protected Route:** [frontend/components/ProtectedRoute.tsx](file:///d:/work/wejoinlife/frontend/components/ProtectedRoute.tsx)
* **Dashboard Page:** [frontend/app/(portal)/dashboard/page.tsx](file:///d:/work/wejoinlife/frontend/app/%28portal%29/dashboard/page.tsx)

---

## 5. Testing the Flow Locally

1. **Start the Spring Boot API / Docker Container:**
   ```powershell
   docker-compose up backend
   ```
2. **Open the Login Portal:**
   Visit: `http://localhost:8080/login.html`
3. **Log In:**
   Click the green button **"🟢 Verified (Status 0)"** and click **Submit**.
   The response sets the `wjl_jwt` cookie on `localhost`.
4. **Open the Authorized React Page:**
   Click **"🚀 Open Authorized React App Page"** or visit:
   `http://localhost:8080/authorized.html`
   - The React page verifies authentication via `/api/v1/auth/me`.
   - Displays real-time user email, role, client UUID, and active claims.
   - Includes a button to execute live test requests against Spring Boot.
5. **Sign Out:**
   Click **Sign Out** to clear cookies and return to the login screen.
