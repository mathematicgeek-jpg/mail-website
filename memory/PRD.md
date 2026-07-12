# Product Requirements Document (PRD)
## Aarti Mathematics Geeks - Educational Website

**Last Updated:** December 2025

---

## 📋 Original Problem Statement

Create a modern, responsive, and high-conversion educational website for "Aarti Mathematics Geeks" - a mathematics coaching brand providing home tuition and online classes for Classes 7th-12th across ICSE, CBSE, IB, and Oxford curricula.

**Key Requirements:**
- Clean, modern academic design with premium feel
- Color scheme: Cyan + Yellow/Gold accents (matching the brand logo)
- Mobile responsive and conversion-optimized
- WhatsApp integration (+91 9702070357)
- Lead capture with contact form
- Showcase teacher profile, courses, testimonials, and results

---

## 👥 User Personas

### Primary Persona: Parents of Students (Age 35-50)
- Looking for quality mathematics tutoring for their children
- Value proven results and credentials
- Need flexibility in teaching modes (home/online)
- Want clear communication and regular updates

### Secondary Persona: Students (Age 12-18)
- Need personalized attention in mathematics
- Struggling with specific topics or preparing for boards
- Prefer interactive and engaging teaching methods
- Looking for doubt-clearing support

---

## 🎯 Core Requirements (Static)

### Functional Requirements
1. **Navigation:** Smooth scrolling to sections (Home, About, Courses, Testimonials, Contact)
2. **Contact Form:** Capture student name, phone, email, class, board, and message
3. **WhatsApp Integration:** Floating button with direct WhatsApp link
4. **Responsive Design:** Mobile, tablet, and desktop optimization
5. **Visual Appeal:** Modern UI with gradients, animations, and micro-interactions

### Content Sections
- Hero section with strong value proposition
- About section featuring teacher profile
- Courses section (Classes 7-10 & 11-12)
- Teaching modes (Home, Online, 1-on-1)
- Why Choose Us (6 key differentiators)
- Testimonials with score improvements
- Contact form with lead capture
- Footer with quick links and contact info

### Design Elements
- Color Palette: Cyan (#00D9FF), Yellow/Gold (#FFD700), Green accents
- Typography: Inter font family
- Components: Shadcn UI library
- Icons: Lucide React
- Animations: Smooth transitions, hover effects, floating elements

---

## ✅ What's Been Implemented (December 2025)

### Phase 1: Frontend with Mock Data ✓

**Components Created:**
1. `Header.jsx` - Fixed navigation with mobile menu and CTA button
2. `Hero.jsx` - Hero section with updated copy: "Personalized home & online coaching for ICSE, CBSE, IB, Oxford & international boards"
3. `About.jsx` - Teacher profile describing Aarti Agarwal as Merit Score Expert
4. `Courses.jsx` - Course cards with "Foundation Building" and "Board & Competitive Focus" subtitles
5. `TeachingModes.jsx` - Three teaching mode options with updated descriptions
6. `WhyChooseUs.jsx` - Six differentiators including "Logical & Analytical Thinking"
7. `Testimonials.jsx` - "Proven Results That Speak for Themselves" with updated testimonials
8. `Contact.jsx` - Lead capture form with "Preferred Mode" field added
9. `Footer.jsx` - Complete footer with social links
10. `WhatsAppButton.jsx` - Floating WhatsApp button with pulse animation

**Content Updates (Latest):**
- Hero: "Talk to Us on WhatsApp" button, 4 updated highlights
- About: Exact copy describing years of experience and student learning patterns
- Courses: "Structured Programs for Every Student" with program subtitles
- Teaching Modes: "Learn the Way That Suits You" 
- Testimonials: Updated with client-provided testimonials
- Contact: Added "Preferred Mode" dropdown (Home/Online/Both)
- All stats updated to show "Years+", "90%+ Board Scores"

---

## 📊 Architecture

### Current Stack
- **Frontend:** React 19 with Shadcn UI components
- **Styling:** Tailwind CSS with custom theme
- **Icons:** Lucide React
- **Notifications:** Sonner (toast library)
- **Backend:** FastAPI (not integrated yet)
- **Database:** MongoDB (not integrated yet)

### Data Flow (Current)
```
User Interaction → Frontend Components → Mock Data (mock.js) → UI Update
```

### Data Flow (Future with Backend)
```
User Interaction → Frontend Components → API Calls → FastAPI Backend → MongoDB → Response → UI Update
```

---

## 📝 Prioritized Backlog

### P0 - Next Immediate Tasks
1. **Backend Development**
   - Create MongoDB models for student inquiries
   - Build API endpoints for contact form submission
   - Implement email notifications for new inquiries
   - Add data validation and error handling

2. **Frontend-Backend Integration**
   - Connect contact form to backend API
   - Remove mock data dependency
   - Implement proper error handling
   - Add loading states during API calls

### P1 - High Priority Features
1. **Admin Dashboard**
   - View all student inquiries
   - Filter by class, board, date
   - Mark inquiries as contacted/pending
   - Export data to CSV

2. **Enhanced SEO**
   - Meta tags optimization
   - Structured data markup
   - Sitemap generation
   - Open Graph tags for social sharing

3. **Analytics Integration**
   - Google Analytics setup
   - Track form submissions
   - Monitor user engagement
   - A/B testing for CTAs

### P2 - Nice to Have Features
1. **Blog Section**
   - Math tips and tricks
   - Study strategies
   - Success stories
   - SEO content

2. **Video Testimonials**
   - Embed YouTube videos
   - Student interview clips
   - Teaching methodology demos

3. **Online Payment**
   - Course enrollment with payment
   - Stripe/Razorpay integration
   - Payment confirmation emails

4. **Student Portal**
   - Login system
   - View class schedules
   - Access study materials
   - Track progress

---

## 🔄 API Contracts (To Be Implemented)

### POST /api/contact
**Request:**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string (optional)",
  "studentClass": "string",
  "board": "string",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your request has been submitted successfully",
  "inquiry_id": "string"
}
```

### GET /api/inquiries (Admin)
**Response:**
```json
{
  "inquiries": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "email": "string",
      "studentClass": "string",
      "board": "string",
      "message": "string",
      "status": "pending|contacted|enrolled",
      "created_at": "timestamp"
    }
  ]
}
```

---

## 🎨 Design Guidelines Followed

1. **Color Theory:** Cyan for trust/academic, Yellow/Gold for excellence/achievement
2. **Typography:** Clear hierarchy with bold headings and readable body text
3. **Spacing:** Generous whitespace for premium feel
4. **Motion:** Smooth transitions and micro-animations on interactions
5. **Accessibility:** Proper focus states, ARIA labels, and semantic HTML
6. **Mobile-First:** Responsive design tested across all breakpoints

---

## 📈 Success Metrics (To Be Tracked)

1. **Conversion Rate:** % of visitors who submit the contact form
2. **Bounce Rate:** % of visitors who leave without interaction
3. **WhatsApp Clicks:** Number of WhatsApp button clicks
4. **Time on Site:** Average session duration
5. **Mobile vs Desktop:** Traffic breakdown
6. **Form Completion Rate:** % who start vs complete the form

---

## 🚀 Next Action Items

1. **Immediate:** Review the current frontend implementation and provide feedback
2. **Phase 2:** Build backend API for contact form and inquiry management
3. **Phase 3:** Integrate frontend with backend and test end-to-end
4. **Phase 4:** Add SEO optimization and analytics
5. **Phase 5:** Deploy to production with custom domain

---

**Notes:**
- All frontend components use mock data currently
- WhatsApp number: +91 9702070357
- Logo and teacher photo URLs are integrated
- Color scheme matches brand identity (Cyan + Yellow/Gold)
