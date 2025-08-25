# **App Name**: CampusConnect

## Core Features:

- Home Dashboard: Home dashboard with welcome message and quick stats (Total Students, Topper, Pending Approvals) using responsive grid layout.
- Add Student Page: Add Student Page with a form (ID, Name, Age, Marks, Department) including client-side form validation. Ensures all fields are filled and marks are within 0-100 range.
- View Students Page: View Students Page: Displays student data in a table with columns: ID, Name, Age, Marks, Department, Actions (Edit/Delete). Includes a search box for filtering by name/ID and sorting options for marks and name.
- Update Student Page: Update Student Page with pre-filled forms for editing student information, mirroring the validation rules from the 'Add Student' page.
- Delete Confirmation Modal: Delete Confirmation Modal: Confirmation popup before deleting a student record.
- Report Page: Report Page that displays a marks table with an option to 'Download Report' in CSV or JSON format.
- Approval Queue Page: Approval Queue Page to show students pending approval with 'Approve/Reject' buttons for each student.
- Undo Page: Undo Page implemented as a stack showing the last deleted/updated student action and allows undoing changes via button.

## Style Guidelines:

- Primary color: Blue (#3498db) representing trust and intelligence, suitable for an educational environment.
- Background color: Light gray (#ecf0f1), offering a clean, unobtrusive backdrop that enhances readability and focus.
- Accent color: Orange (#e67e22), providing a contrasting color for interactive elements, making them pop and draw attention.
- Body and headline font: 'Inter', sans-serif font for clean, modern readability.
- Code font: 'Source Code Pro' for displaying code snippets.
- Modern line icons from FontAwesome, related to education and data management, consistent throughout the application.
- Responsive layout using CSS Grid for the main dashboard and Flexbox for smaller components, ensuring adaptability across different devices.
- Subtle animations like hover effects on buttons and smooth transitions for modal windows using CSS transitions, enhancing the user experience.