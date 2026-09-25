# WeJoinLife - System Architecture & AI Coding Guidelines

> 🚨 **MANDATORY DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**
> 1. Read this entire document **BEFORE** generating, modifying, or refactoring any code in this repository.
> 2. You **MUST** strictly adhere to the established package structure and conventions detailed below.
> 3. Do **NOT** introduce new architectural layers, conflicting ORMs (e.g. Hibernate/JPA), or arbitrary folders without explicit instructions.
> 4. Respect the **Layered Architecture Boundaries**: Never bypass layers (e.g., no SQL in Controllers).

---

## 1. Core Technology Stack (Non-Negotiable)

* **Backend:** Spring Boot 4.1.1 (Java 25 target).
* **Database Access:** Spring Boot 3+ **`JdbcClient`** (Fluent SQL, named parameters, auto-mapping). **NO JPA / Hibernate.**
* **Security:** Spring Security + JJWT (Bearer header only) + Bucket4j rate limiting + Jsoup XSS sanitization.
* **Async & Concurrency:** Spring `@EnableAsync`, managed `ThreadPoolTaskExecutor`, and common `ExecutorService` / `ThreadPoolManager`. No unmanaged ad-hoc threads.
* **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind CSS, Shadcn UI).
* **State Management:** **Zustand** for client-side state.
* **Database Note:** Connects to an **existing database**. `spring.sql.init.mode=never`. Do **NOT** run DDL table creation scripts unless instructed.

---

## 2. Directory Matrix (Where Every File MUST Live)

```text
D:\work\wejoinlife/
├── backend/src/main/java/com/wejoinlife/api/
│   ├── config/              # Infrastructure beans (@Configuration + @Bean): PasswordEncoder, ThreadPoolConfig, ThreadPoolManager, RestClient, Clock
│   ├── controller/          # REST API endpoints ONLY (@RestController). NO business logic. NO SQL.
│   │   ├── public/          # 100% Public endpoints (Products, Shops, Categories). NO LOGIN NEEDED.
│   │   ├── buyer/           # Buyer endpoints (Checkout, Profile). Role: BUYER.
│   │   ├── seller/          # Merchant endpoints (Products, Sub-Orders, Wallet). Role: SELLER.
│   │   └── admin/           # Platform operator endpoints (Shops, Fees, Approvals). Role: ADMIN.
│   ├── dto/                 # Request & Response contracts defined strictly as JAVA RECORDS.
│   │   ├── auth/            # LoginRequest, RegisterRequest, AuthResponse
│   │   ├── product/         # ProductCreateRequest, ProductResponse
│   │   └── order/           # CheckoutRequest, OrderResponse, SubOrderResponse
│   ├── model/               # Domain POJOs and Enums representing business data.
│   │   ├── enums/           # Role.java, OrderStatus.java, PaymentStatus.java
│   │   └── *.java           # Product.java, Shop.java, ParentOrder.java, SubOrder.java
│   ├── repository/          # Data access ONLY using Spring JdbcClient. Injects JdbcClient.
│   ├── security/            # SecurityConfig, JwtService, JwtAuthenticationFilter, RateLimitFilter, XssFilter
│   ├── service/             # Business logic ONLY (@Service). Handles transactions (@Transactional).
│   └── exception/           # GlobalExceptionHandler (@RestControllerAdvice) and custom exceptions.
│
├── frontend/
│   ├── app/
│   │   ├── (storefront)/    # 🌍 PUBLIC SHOPPING: Server-Side Rendered (SSR/SSG). SEO & Social Sharing.
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── shops/       # Shop directory & individual shop profiles (/shops/[slug])
│   │   │   └── products/    # Product details (/products/[slug]) with OpenGraph metadata
│   │   └── (portal)/        # 🔒 PROTECTED DASHBOARDS: Client-side ('use client'). NO SEO needed.
│   │       ├── seller/      # Seller Portal (Products, Sub-Orders, Wallet)
│   │       └── admin/       # Super Admin Portal (Shops, Approvals, Fees)
│   ├── components/
│   │   ├── ui/              # Shadcn UI primitives (Button, Dialog, Badge, Input, Table)
│   │   ├── storefront/      # Buyer widgets (ProductCard, ShopCard)
│   │   └── portal/          # Merchant & Admin widgets (DataTable, StatsCard)
│   ├── stores/              # Zustand stores
│   └── lib/                 # Shared utilities (utils.ts cn() helper, api.ts)
```

---

## 3. Strict Rules & Anti-Patterns (Golden Rules for AI)

### ❌ ANTI-PATTERN 1: No SQL or Database Access in Controllers
* **FORBIDDEN:** Injecting `JdbcClient` or `JdbcTemplate` into a `@RestController`.
* **MANDATORY:** Controllers **only** accept HTTP requests, validate DTOs (`@Valid`), call a `@Service`, and return `ResponseEntity`.

### ❌ ANTI-PATTERN 2: No Raw RowMapper Boilerplate with JdbcClient
* **FORBIDDEN:** Writing 30 lines of `rs.getString("col")` like old JDBC.
* **MANDATORY:** Use `JdbcClient`'s automatic class/record mapping:
  ```java
  // CORRECT:
  return jdbcClient.sql("SELECT * FROM products WHERE id = :id")
          .param("id", id)
          .query(Product.class)
          .optional();
  ```

### ❌ ANTI-PATTERN 3: Never Return Domain Models Directly to Frontend
* **FORBIDDEN:** Returning `Product` or `User` database models directly from controllers.
* **MANDATORY:** Always map models to immutable **DTO Records** (e.g. `ProductResponse`, `UserResponse`). This prevents internal database column leakage.

### ❌ ANTI-PATTERN 4: DTOs Must Be Java Records
* **FORBIDDEN:** Writing verbose Lombok classes with 10 getters/setters for simple request payloads.
* **MANDATORY:** Use **Java Records** with validation annotations:
  ```java
  public record ProductCreateRequest(
      @NotBlank(message = "Name is required") String name,
      @NotNull @Positive BigDecimal price,
      int stockQuantity
  ) {}
  ```

### ❌ ANTI-PATTERN 5: Never Accept JWT Tokens in URL Parameters
* **FORBIDDEN:** Checking `request.getParameter("token")` in filters.
* **MANDATORY:** Only extract Bearer tokens from the `Authorization: Bearer <token>` header to prevent token leakage in access logs.

### ❌ ANTI-PATTERN 6: Never Blindly Mutate JSON Passwords during XSS
* **FORBIDDEN:** Deserializing all JSON strings with Jsoup (which breaks passwords like `Pass<123>`).
* **MANDATORY:** Use `XssFilter` on request/URL query parameters only.

### ❌ ANTI-PATTERN 7: Public Storefront Must Remain SEO-Friendly
* **FORBIDDEN:** Turning public shop/product pages into pure client-side `'use client'` pages with no SSR.
* **MANDATORY:** Keep public product and shop pages server-rendered so search engine crawlers and WhatsApp preview bots receive complete HTML and OpenGraph tags.

### ❌ ANTI-PATTERN 8: Never Create Manual or Unmanaged Threads
* **FORBIDDEN:** Calling `new Thread(...)`, `Executors.newFixedThreadPool(...)`, or `ForkJoinPool.commonPool()` directly inside services or controllers.
* **MANDATORY:** Inject `ThreadPoolManager`, `ExecutorService` (qualified with `@Qualifier("commonExecutor")`), or use Spring's `@Async` annotation. This ensures bounded queueing, proper thread naming in logs, and graceful shutdown during deployments.

---

## 4. Standard Implementation Templates

### A. Repository Pattern (`JdbcClient`)
```java
@Repository
@RequiredArgsConstructor
public class ShopRepository {
    private final JdbcClient jdbcClient;

    public Optional<Shop> findById(String id) {
        return jdbcClient.sql("SELECT * FROM shops WHERE id = :id")
                .param("id", id)
                .query(Shop.class)
                .optional();
    }

    public List<Shop> findAllActive() {
        return jdbcClient.sql("SELECT * FROM shops WHERE status = 'ACTIVE' ORDER BY rating DESC")
                .query(Shop.class)
                .list();
    }
}
```

### B. Service Pattern (`@Service`)
```java
@Service
@RequiredArgsConstructor
public class ShopService {
    private final ShopRepository shopRepository;

    public ShopResponse getShopById(String id) {
        return shopRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with ID: " + id));
    }

    private ShopResponse toResponse(Shop s) {
        return new ShopResponse(s.getId(), s.getShopName(), s.getSlug(), s.getRating());
    }
}
```

### C. Controller Pattern (`@RestController`)
* All REST controllers must include `/wjlapi` as the base path (e.g. `/wjlapi/api/v1/...` and `/wjlapi/v1/...`), with legacy `/api/v1/...` aliases where backwards compatibility is needed.
```java
@RestController
@RequestMapping({"/wjlapi/api/v1/public/shops", "/wjlapi/v1/public/shops", "/api/v1/public/shops"})
@RequiredArgsConstructor
public class PublicShopController {
    private final ShopService shopService;

    @GetMapping("/{id}")
    public ResponseEntity<ShopResponse> getShop(@PathVariable String id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }
}
```

### D. Asynchronous Concurrency Pattern (`ThreadPoolManager` / `ExecutorService`)
```java
@Service
@RequiredArgsConstructor
public class NotificationService {

    // Option 1: Inject ThreadPoolManager for CompletableFuture utilities & metrics
    private final ThreadPoolManager threadPoolManager;

    // Option 2: Inject standard ExecutorService directly
    @Qualifier("commonExecutor")
    private final ExecutorService executorService;

    public void sendNotificationAsync(String recipient, String message) {
        // Fire-and-forget
        threadPoolManager.execute(() -> doSend(recipient, message));

        // Or with CompletableFuture
        CompletableFuture<Boolean> future = threadPoolManager.supplyAsync(() -> doSendWithAck(recipient, message));
    }
}
```

---

## 5. Verification Checklist Before Committing Changes

Before an AI agent marks a task complete, verify:
1. [ ] Did I put the new file in the correct directory matching the matrix above?
2. [ ] Did I avoid writing SQL inside any Controller?
3. [ ] Are all new Request/Response classes written as Java Records with validation?
4. [ ] Does the repository use `JdbcClient` with named parameters (no raw SQL injection)?
5. [ ] Did I preserve the `mode=never` setting so existing database tables are not dropped or overwritten?
6. [ ] Is the public frontend page server-rendered with SEO meta tags?
7. [ ] Did I avoid manual thread creation (`new Thread()`) and use `ThreadPoolManager` / `ExecutorService` or `@Async` instead?
