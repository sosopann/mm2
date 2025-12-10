# MM2 Digital Items E-Commerce Platform - Design Guidelines

## Design Approach
**Reference-Based Gaming Aesthetic**: Drawing inspiration from Roblox gaming interfaces, modern gaming marketplaces (Steam, Epic Games Store), and cyberpunk/neon gaming themes. This is an experience-focused platform where visual excitement drives engagement and purchase decisions.

## Core Design Principles
1. **High Energy Gaming Aesthetic**: Bold, dynamic layouts with sharp edges and geometric patterns
2. **Digital Premium Feel**: Treat virtual items as valuable collectibles with premium presentation
3. **Clear Purchase Funnel**: Streamlined path from browsing to checkout optimized for impulse purchases
4. **Trust & Security**: Professional presentation despite edgy aesthetic to build buyer confidence

---

## Typography System

**Primary Font**: **Orbitron** or **Rajdhana** (Google Fonts) - geometric, futuristic gaming feel
**Secondary Font**: **Inter** or **Roboto** - clean readability for body text

### Hierarchy
- **Hero Headlines**: text-5xl to text-7xl, font-bold, uppercase, letter-spacing: wide
- **Section Titles**: text-3xl to text-4xl, font-bold, uppercase
- **Product Names**: text-xl to text-2xl, font-semibold
- **Pricing**: text-2xl to text-3xl, font-bold (emphasized)
- **Body Text**: text-base to text-lg, font-normal
- **Buttons/CTAs**: text-sm to text-base, font-semibold, uppercase, tracking-wide

---

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, m-8, gap-6)
**Container Max-Width**: max-w-7xl for main content
**Grid Systems**: 
- Product grids: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Page-Specific Layouts

### Homepage

**Hero Section** (100vh):
- Full-width hero with diagonal geometric overlays
- Centered headline: "MM2 Premium Digital Items - Instant Delivery"
- Subheading highlighting top items or current deals
- Dual CTAs: "Browse Shop" (primary) + "View Bundles" (secondary)
- Floating product cards showcasing 3-4 featured items with glow effects
- Stats bar at bottom: "500+ Items • Instant Delivery • Secure Transactions • Egyptian Payments"

**Featured Categories Section** (py-24):
- Grid of 6 category cards (Knives, Guns, Godlys, Ancients, Bundles, Packages)
- Each card: category icon, name, item count, neon border on hover
- Hexagonal or angular card shapes for gaming aesthetic

**Top Selling Items** (py-20):
- 4-column product grid
- Each product card: image, name, price badge, "Add to Cart" button
- Glowing borders on expensive/rare items

**Bundle Showcase** (py-24):
- 2-3 featured bundle cards in large format
- Savings badge prominently displayed
- Bundle contents listed with checkmarks
- Comparison: "Buy Separately: X ج.م → Bundle Price: Y ج.م"

**Trust Section** (py-16):
- 3-column grid: "Instant Delivery" • "Secure Checkout" • "24/7 Support"
- Icon + title + brief description per column

**CTA Section** (py-20):
- "Ready to Upgrade Your Inventory?"
- Large search bar + "Browse All Items" button

### Shop/Category Pages

**Page Header** (py-12):
- Category name (large, bold)
- Active filters display
- Item count

**Sidebar Filters** (left, w-64):
- Price range slider
- Category checkboxes
- Sort options (Price: Low to High, High to Low, Name)
- "Clear All Filters" link

**Product Grid** (flex-1):
- 3-4 columns responsive grid
- Gap-6 spacing
- Each product card (h-80):
  - Product image (square, object-cover)
  - Item name
  - Price (large, bold)
  - Rarity badge (e.g., "Godly", "Ancient")
  - "Quick Add" button
  - Hover: elevate card, show glow effect

### Product Detail Page

**Layout** (2-column grid, gap-12):

**Left Column**:
- Large product image (aspect-square)
- Thumbnail gallery if multiple views
- Zoom on hover capability

**Right Column**:
- Breadcrumb navigation
- Product name (text-4xl)
- Rarity badge
- Price (text-5xl, emphasized)
- Description paragraph
- Stats/details list (if applicable)
- Quantity selector
- "Add to Cart" (large, full-width button)
- Payment methods accepted (icons)
- "Instant Delivery" guarantee badge

**Related Items Section** (py-20):
- "You May Also Like" heading
- 4-column grid of similar items

### Cart Page

**Layout** (2-column grid on desktop, stacked mobile):

**Left Column** (w-2/3):
- Cart items table/list
- Each row: thumbnail, name, price, quantity controls, remove button
- Subtotal calculation

**Right Column** (w-1/3):
- Sticky order summary card
- Subtotal, taxes (if any), total
- "Proceed to Checkout" button (prominent)
- Accepted payment methods display
- Promo code input field

### Checkout Page

**Single Column Layout** (max-w-3xl, centered):

**Contact Information Section**:
- Email input (for order confirmation)
- Roblox username input (for delivery)

**Payment Method Selection**:
- Radio buttons for Vodafone Cash / InstaPay
- Each option expands to show instructions:
  - Vodafone Cash: "Transfer [Amount] ج.م to: [Number] and send screenshot"
  - InstaPay: "Send to: [InstaPay ID] and provide transaction reference"
- Upload area for payment proof

**Order Summary** (sticky sidebar or below):
- Items list (compact)
- Total amount
- "Complete Order" button
- Trust badges

### Contact Page

**Split Layout** (2-column):

**Left Column**:
- Contact form (name, email, Roblox username, message)
- Submit button

**Right Column**:
- Contact information
- Response time: "We reply within 2 hours"
- FAQ accordion:
  - "How long does delivery take?" → "Instant after payment confirmation"
  - "What payment methods?" → List
  - "Is it safe?" → Security explanation

---

## Component Library

### Navigation Header
- Sticky top navigation (h-20)
- Logo (left) with MM2 branding
- Category links (center)
- Search icon, cart icon with badge count (right)
- Mobile: hamburger menu

### Footer
- 4-column grid (mobile stacks)
- Column 1: About + social links
- Column 2: Quick links (Shop, Categories, Contact)
- Column 3: Payment methods accepted
- Column 4: Newsletter signup
- Bottom bar: Copyright + "Trusted Egyptian MM2 Shop"

### Product Card
- Aspect-square image container
- Neon border accent (1-2px)
- Product name (text-lg, truncate after 2 lines)
- Price badge (text-xl, font-bold)
- Rarity indicator (small badge, top-right corner)
- Button: "Add to Cart" or "Quick View"

### Buttons
- Primary: Rounded-md, px-8, py-3, neon glow effect
- Secondary: Outlined with border-2
- All buttons: uppercase, tracking-wide, font-semibold
- Disabled state: reduced opacity

### Badges/Tags
- Rarity badges: px-3 py-1, rounded-full, text-xs, font-bold
- Price badges: Prominent display with ج.م symbol
- "Best Value" or "Popular" tags on bundles

---

## Images

**Hero Section Image**: 
Full-width background featuring MM2 game screenshot or dramatic knife/gun montage with motion blur effect. Image should convey action and excitement. Overlay with dark gradient for text readability.

**Product Images**:
Clean, isolated item renders on transparent or solid backgrounds. High quality game asset screenshots. Square format (1:1 ratio).

**Category Headers**:
Each category page features a banner image (16:9 ratio) showing representative items from that category with geometric pattern overlays.

**Bundle Showcase Images**:
Composite images showing all items in bundle arranged in attractive layout, possibly with glow/highlight effects.

**Trust/Feature Icons**:
Gaming-themed iconography (shield for security, lightning for instant delivery, headset for support) using geometric/angular styles.

---

## Animations

**Minimal, purposeful only**:
- Product card hover: Slight elevation (transform: translateY(-4px))
- Hero entrance: Fade-in on load
- Button interaction: Subtle pulse on primary CTA
- Cart icon: Bounce when item added
- No scroll animations or excessive motion

---

## Special Considerations

**Egyptian Market Focus**:
- All prices display ج.م prominently
- Payment instructions in clear, simple Arabic-friendly English
- Trust indicators emphasizing local payment methods

**Gaming Audience**:
- Fast-loading (optimize all images)
- Mobile-first (many gamers browse on phones)
- Instant feedback on interactions
- Clear item categorization for quick browsing

**Premium Digital Goods**:
- High-value items get special visual treatment (enhanced glow, larger cards)
- Bundle savings heavily emphasized
- Scarcity indicators ("Limited", "Rare") where appropriate