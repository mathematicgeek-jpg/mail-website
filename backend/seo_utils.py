"""
SEO Utilities for Mathematics Geek Merit Score Expert
Handles sitemap generation, structured data, and SEO helpers
"""

from datetime import datetime, timezone
from typing import List, Dict
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


def generate_sitemap_xml(base_url: str, pages: List[Dict]) -> str:
    """
    Generate XML sitemap with all pages
    
    Args:
        base_url: Base URL of the website
        pages: List of page dicts with {url, lastmod, changefreq, priority}
    
    Returns:
        XML sitemap string
    """
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    urlset.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    urlset.set('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')
    
    for page in pages:
        url = SubElement(urlset, 'url')
        
        loc = SubElement(url, 'loc')
        loc.text = f"{base_url}{page['url']}"
        
        if 'lastmod' in page:
            lastmod = SubElement(url, 'lastmod')
            lastmod.text = page['lastmod']
        
        changefreq = SubElement(url, 'changefreq')
        changefreq.text = page.get('changefreq', 'weekly')
        
        priority = SubElement(url, 'priority')
        priority.text = str(page.get('priority', '0.5'))
    
    # Pretty print XML
    rough_string = tostring(urlset, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")


def get_static_pages() -> List[Dict]:
    """Get all static pages for sitemap"""
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    
    return [
        {'url': '/', 'lastmod': now, 'changefreq': 'daily', 'priority': '1.0'},
        {'url': '/#about', 'lastmod': now, 'changefreq': 'monthly', 'priority': '0.8'},
        {'url': '/#courses', 'lastmod': now, 'changefreq': 'weekly', 'priority': '0.9'},
        {'url': '/#testimonials', 'lastmod': now, 'changefreq': 'weekly', 'priority': '0.7'},
        {'url': '/#contact', 'lastmod': now, 'changefreq': 'monthly', 'priority': '0.8'},
    ]


def get_programmatic_pages() -> List[Dict]:
    """Generate programmatic SEO pages for sitemap"""
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    pages = []
    
    # Classes
    classes = ['6', '7', '8', '9', '10', '11', '12']
    
    # Boards
    boards = ['cbse', 'icse', 'ib', 'gcse', 'cambridge', 'oxford']
    
    # Topics
    topics = ['algebra', 'geometry', 'trigonometry', 'calculus', 'statistics', 'number-theory', 'arithmetic']
    
    # Blog list page
    pages.append({'url': '/blog', 'changefreq': 'daily', 'priority': '0.9'})
    
    # Math tricks by class
    for cls in classes:
        pages.append({
            'url': f'/math-tricks/class-{cls}',
            'lastmod': now,
            'changefreq': 'weekly',
            'priority': '0.8'
        })
    
    # Vedic math by class
    for cls in classes:
        pages.append({
            'url': f'/vedic-math/class-{cls}',
            'lastmod': now,
            'changefreq': 'weekly',
            'priority': '0.8'
        })
    
    # Board-specific pages
    for board in boards:
        pages.append({
            'url': f'/board/{board}',
            'lastmod': now,
            'changefreq': 'monthly',
            'priority': '0.7'
        })
    
    # Topic pages
    for topic in topics:
        pages.append({
            'url': f'/topics/{topic}',
            'lastmod': now,
            'changefreq': 'monthly',
            'priority': '0.7'
        })
    
    # Exam prep pages (combination of board + class)
    for board in ['cbse', 'icse', 'ib', 'gcse']:
        for cls in ['10', '12']:  # Focus on board exam classes
            pages.append({
                'url': f'/exam-prep/{board}-class-{cls}',
                'lastmod': now,
                'changefreq': 'monthly',
                'priority': '0.7'
            })
    
    return pages


def generate_organization_schema(base_url: str) -> Dict:
    """Generate Organization JSON-LD schema"""
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Mathematics Geek Merit Score Expert",
        "alternateName": "Mathematics Geek",
        "url": base_url,
        "logo": f"{base_url}/logo.png",
        "description": "Expert mathematics coaching for Classes 6th-12th across CBSE, ICSE, IB, GCSE, and Oxford boards. Specializing in Vedic Math, mental math tricks, and exam preparation.",
        "email": "mathematicgeek@gmail.com",
        "telephone": "+919639351708",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://mathematicsgeek.com"
        ],
        "offers": {
            "@type": "Offer",
            "category": "Educational Services"
        }
    }


def generate_course_schema(base_url: str) -> Dict:
    """Generate Course JSON-LD schema"""
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Mathematics Coaching for Classes 6-12",
        "description": "Comprehensive mathematics coaching covering CBSE, ICSE, IB, GCSE, and Oxford curricula with personalized attention and proven results.",
        "provider": {
            "@type": "EducationalOrganization",
            "name": "Mathematics Geek Merit Score Expert",
            "url": base_url
        },
        "educationalLevel": "Secondary School",
        "teaches": [
            "Algebra",
            "Geometry",
            "Trigonometry",
            "Calculus",
            "Statistics",
            "Vedic Mathematics",
            "Mental Math Tricks"
        ],
        "availableLanguage": ["en"],
        "inLanguage": "en",
        "courseMode": ["Online", "Offline", "Blended"],
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": ["Online", "Offline"],
            "instructor": {
                "@type": "Person",
                "name": "Aarti Agarwal",
                "jobTitle": "Mathematics Expert & Merit Score Specialist"
            }
        }
    }


def generate_faq_schema(faqs: List[Dict]) -> Dict:
    """Generate FAQ JSON-LD schema"""
    main_entity = []
    
    for faq in faqs:
        main_entity.append({
            "@type": "Question",
            "name": faq['question'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['answer']
            }
        })
    
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": main_entity
    }


def generate_breadcrumb_schema(items: List[Dict], base_url: str) -> Dict:
    """Generate Breadcrumb JSON-LD schema"""
    item_list_element = []
    
    for i, item in enumerate(items, 1):
        item_list_element.append({
            "@type": "ListItem",
            "position": i,
            "name": item['name'],
            "item": f"{base_url}{item['url']}"
        })
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": item_list_element
    }


# Predefined FAQs for homepage
HOMEPAGE_FAQS = [
    {
        "question": "What grades do you teach mathematics for?",
        "answer": "We provide expert mathematics coaching for students from Class 6th to 12th, covering all major educational boards including CBSE, ICSE, IB, GCSE, Cambridge, and Oxford curricula."
    },
    {
        "question": "Do you offer online mathematics coaching?",
        "answer": "Yes, we offer both online and offline mathematics coaching with flexible teaching modes including one-on-one personalized sessions and small group classes. Our online sessions are conducted via interactive platforms with screen sharing and digital whiteboards."
    },
    {
        "question": "What is Vedic Mathematics and how does it help?",
        "answer": "Vedic Mathematics is an ancient system of calculation that enables students to solve complex mathematical problems 10-15 times faster using mental math techniques. It improves calculation speed, accuracy, and builds confidence for competitive exams like SAT, CBSE, ICSE, IB, and other board exams."
    },
    {
        "question": "What are the teaching modes available?",
        "answer": "We offer four teaching modes: (1) Offline classes at our center, (2) Online classes via video conferencing, (3) One-on-one personalized tutoring, and (4) Small group classes with 3-5 students for peer learning."
    },
    {
        "question": "How can I book a free demo class?",
        "answer": "You can book a free demo class by filling out the contact form on our website, calling us at +91 9639351708, or sending an email to mathematicgeek@gmail.com. We'll schedule a convenient time for your trial session."
    },
    {
        "question": "What is the student success rate?",
        "answer": "Our students consistently achieve 95%+ average scores in their board exams and show significant improvement in problem-solving speed and confidence. We have a proven track record of helping students excel in CBSE, ICSE, IB, and GCSE examinations."
    }
]
