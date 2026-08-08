# TownDrop — Hyperlocal Commerce & Delivery Platform

**TownDrop (LocalConnect)** is a multi-role hyperlocal commerce platform built for Tier-2 and Tier-3 towns (e.g., Karmala).

Built with:
- **React 19 + Vite 6**
- **Tailwind CSS** (porting Stitch Warm Minimalist design system)
- **Supabase** (Auth + Postgres DB + Realtime subscriptions)
- **Recharts** (Platform Ops Analytics)

---

## ⚡ Roles & Features

1. **Customer**: Browse local shops by category, add products to cart, place orders, and track deliveries with live interactive route map (`Placed` → `Accepted` → `Assigned` → `Picked Up` → `Delivered`).
2. **Merchant**: Manage incoming orders, accept orders with auto-nearest rider allocation, add new inventory products, and view stock tables.
3. **Rider**: Toggle work availability (`Available` vs `Busy`), view assigned tasks, and advance delivery statuses (`Mark Picked Up` → `Mark Delivered`).
4. **Admin**: Platform bento metrics, real-time order table, and Recharts merchant volume analytics bar chart.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173/`.
