## Project Structure

* `public/` - Static assets served directly
* `src/`
  * `assets/` - Images and static files used in the app
  * `components/` - Reusable UI components
  * `pages/` - Page-level components organised by role
    * `auth/` - Login pages for customers and staff
    * `menu/` - Customer-facing menu and ordering flow
    * `staff/` - Waiter and kitchen dashboards
  * `App.jsx` - Root component and route definitions
  * `main.jsx` - Application entry point