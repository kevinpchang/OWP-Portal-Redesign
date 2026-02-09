<img src="./assets/owp.png" alt="OWP Logo">

# Office of Water Program's Learning Portal Redesign Project

## A project written in Vue.js that implements a modern and user-friendly portal into the official OWP website at California State University of Sacramento!

This colloborative senior project is a industry-grade redesign that provides the OWP website with:

- Personalized dashboard with greetings, course tracking, and certificates
- Streamlines access to certificates, purchase history, account management, and operator number updates
- Uses API-based data retrieval (no direct database access) for security and scalability
- Employs modern web technologies (Vue.js, Tailwind CSS, PHP, SQL) for performance and maintainability

### Expected Outcomes

- Enhanced student experience through intuitive navigation and updated UI
- Improved accessibility to learning materials and certification information
- Seamless integration with OWP’s existing systems
- A sustainable and maintainable platform for future OWP growth
- Personalized Webpages​, ease of access​, and intuitive navigation​

---

## How the site looks

**Dashboard Page**
![alt text](./assets/Dash.png)

**Instructor Slides Page**
![alt text](./assets/Slides.png)

**Purchase History Page**
![alt text](./assets/Purchase.png)

---

## How to install the OWP Portal Redesign on your local machine with Git

1. Clone this project
2. Install Node.js - https://nodejs.org/en/download
3. Open a terminal and CD to the 'frontend' folder
4. Run 'npm install' to install core project files
5. Run 'npm run dev' to run the site locally

## Testing

- Verified routing for each "link" element on the page.
- Checked hover, click, and dialog effects worked correctly.
- Ensured each page followed OWP design standards (font, color, and layout consistency).
- Tested responsiveness across desktop and mobile devices.
- Confirmed all data retrieval and mock API integrations worked as expected.

## Deployment

- Deployment for the OWP Learning Portal Redesign will be handled directly by the Office of Water Programs (OWP) through their existing Sacramento State infrastructure.

## Deployment Overview
- Frontend: Deployed on OWP’s existing Apache/PHP web servers, hosting compiled Vue.js static files.
- Backend/API: Connected through a PHP-based REST API, fully compatible with the OWP backend architecture.
- Database: Utilizes OWP’s secure, existing Microsoft SQL Server database managed internally by Sacramento State IT.
- Version Control: All code is versioned through git and reviewed before deployment.

## Hosting & Cost Summary
- API Costs (estimated): ~$80/month (based on 14,000 users/month and 400,000 events/month using comparable institutional REST APIs).
- Database Licensing: ~$7,890 initial + $20–$40/month for SQL Server licensing and storage.
- Server Costs: $0 for development and maintenance as a CSU subservice, OWP uses Sacramento State’s central IT hosting and licensing infrastructure.

## Deployment Process:
- Build production-ready frontend using npm run build.
- Upload the /dist folder output to OWP’s web directory on their Apache/PHP server.
- Verify API endpoint connections to the backend.
- Perform final QA and go-live under the OWP domain.
- Note: The deployment process will not incur direct costs for the development team or the university since OWP operates under Sacramento State’s IT infrastructure. 

## JIRA Timeline — API Integration and Development Sprints 

| **Sprint** | **Goal / Milestone** | **Description / Deliverables** |
|-----------|-----------------------|--------------------------------|
| **Sprint 5** | API Integration 1 | Connected Vue components to backend PHP API across all webpages. Established base endpoints and replaced mock data for all pages. |
| **Sprint 6** | API Integration 2 | Expanded API coverage across all pages. Implemented dynamic data retrieve on all pages like: message retrieval, purchase history lookup, course retrieval, live operator numbers and dynamic student data loading. Ensured JSON structure consistency. (refer to Client)|
| **Sprint 7** | API Integration 3 | Optimized API calls, added loading states, error handling, and improved page responsiveness. Implemented certificate filtering and course data enhancements. |
| **Sprint 8** | API Integration 4 + Debugging & Final Routing | Completed debugging, removed stale data, resolved API inconsistencies, connected final routes, and performed QA/testing for deployment-readiness. |


## Known issues (Work in progress)

- Scaling for mobile.
- Certain backend API endpoints may need caching for performance.

## Authors:
- Kevin Chang
- Ryan Crandall
- Youssef Boujebha
- Nicholas Guzman
- Uday Kyama 
- Cristobel Navarro-Miranda
- Vincent Lam
- Heet Shah
