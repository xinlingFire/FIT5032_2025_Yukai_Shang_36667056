# FIT5032 A1: Design Report

**Student:** Yukai Shang  
**Student number:** 36667056  
**Project:** Open Shelf Health Connect

## Declaration

This report presents the design direction for Open Shelf Health Connect. Any external sources and AI-assisted content used during the work are acknowledged in the final section.

## 1. Executive Summary

Open Shelf Health Connect is a fictional health charity web application for newly arrived migrant communities in Australia. Its purpose is to make reliable starting points for health information easier to discover, save and revisit. The service focuses on plain-language resource navigation rather than medical diagnosis, clinical advice, appointment booking or emergency response.

Newly arrived migrants can find it difficult to understand local health services, decide what questions to ask, or locate language support. The application responds with a mobile-friendly health resource hub covering health care access, interpreter support, mental wellbeing, child and family health, preventive health, everyday wellbeing, older people and urgent help. Visitors can search by resource name or provider, filter by health topic and read a short summary before deciding whether the resource is useful.

Registered community members can save resources and submit one usefulness rating and feedback entry per resource. Service coordinators can add, edit and remove resources through an administrator-only area. This gives the charity a practical way to keep the resource collection current while allowing community voices to shape priorities.

The application prominently states that its content is general information only. It does not replace advice from a doctor or other qualified health professional. For urgent help in Australia, users are directed to call 000.

## 2. Content Research

| Website | Useful design observations applied to this project |
| --- | --- |
| Healthdirect Australia, `healthdirect.gov.au` | Clear topic-based navigation, plain language, links to appropriate services and visible emergency direction. |
| Multicultural Centre for Women's Health, `mcwh.com.au` | Culturally responsive health education, accessible language and community-focused resource presentation. |
| Beyond Blue, `beyondblue.org.au` | Calm visual hierarchy, clear support pathways and responsible mental-wellbeing language. |

The research indicates that health content should be easy to scan, avoid unnecessary medical jargon, clearly identify the organisation providing a resource and separate general education from urgent support. Open Shelf Health Connect applies these principles through concise cards, provider labels, health-topic filters and repeated safety notices.

## 3. User Personas

### Mia Chen - Newly arrived university student

Mia is 20 and recently moved to Melbourne for study. She primarily uses her phone and is comfortable with everyday technology, but is unfamiliar with Medicare, GP appointments and interpreter services. She needs short, trustworthy explanations that she can save and revisit before speaking with a health professional. The responsive health resource hub, search, topic filter and saved resources address this need.

### Daniel Rahman - Busy migrant worker

Daniel is 34, works irregular hours and is settling his family into a new area. He wants efficient access to information about mental wellbeing, family services and local health pathways without reading long pages. He benefits from concise summaries, clearly named providers, feedback from other community members and the ability to return to saved resources.

### Sarah Williams - Family support person

Sarah is 42 and helps relatives who have recently migrated. She needs understandable resources about children, older relatives, vaccinations and urgent health options. She values clear safety boundaries, the ability to find a topic quickly and confidence that resources are kept up to date by service coordinators.

## 4. Sitemap

```text
Home / Health resources
|- Search and health-topic filter
|- Resource detail
|  |- General information safety notice
|  |- Save resource
|  |- Usefulness rating and community feedback
|- Suggest a resource
|- Register / Log in
|- My account
|  |- Saved resources (community members)
|- Service coordinator area
|  |- Community member list
|  |- Resource management
|- Access denied
`- Not found
```

## 5. Low-Fidelity Wireframes

### BR1: Search and browse health resources

```text
+----------------------------------------------------------+
| Open Shelf Health | Health resources | My account        |
+----------------------------------------------------------+
| [ Community health workshop image ]                      |
| Find health information you can use.                     |
+----------------------------------------------------------+
| Important: general information only. Emergency: call 000 |
+----------------------------------------------------------+
| Search resources or providers [____________]             |
| Health topic [All topics v] [Clear]                      |
+----------------------------------------------------------+
| Topic | Resource title | Provider | usefulness score      |
| Short plain-language summary              [View resource]|
+----------------------------------------------------------+
```

### BR2: Save a resource and share feedback

```text
+----------------------------------------------------------+
| Back to health resources                                 |
| Health topic | Resource name | Provided by organisation  |
| Last updated | Plain-language summary                    |
+----------------------------------------------------------+
| Important: general information only. Emergency: call 000 |
+----------------------------------------------------------+
| Community feedback: 4.5 / 5                              |
| [Save this resource]                                     |
| Was this resource useful?  [1] [2] [3] [4] [5]           |
| Your feedback [______________________________________]   |
| [Save feedback]                                          |
+----------------------------------------------------------+
```

## 6. Accessibility and Safety Decisions

- The interface uses responsive layouts, keyboard-accessible form controls, labels, live result counts and readable contrast.
- Resource cards use consistent provider and health-topic labels so users can scan quickly.
- The app gives general educational information only. It does not diagnose, treat, triage or replace qualified medical advice.
- The home and resource-detail views show an urgent-help notice directing users to call 000 in an emergency.
- Community feedback uses Vue text interpolation, not raw HTML rendering, so submitted text is displayed as text rather than executable markup.

## 7. AI and External Content Acknowledgement

AI assistance was used to help restructure the original project from an online bookstore concept into a fictional migrant-community health resource hub, draft initial interface copy and support code implementation. All output was reviewed and adapted for the assessment. The homepage workshop image is sourced from Unsplash for prototype use. Health-resource entries are illustrative navigation content and should be checked against authoritative providers before any real-world deployment.
