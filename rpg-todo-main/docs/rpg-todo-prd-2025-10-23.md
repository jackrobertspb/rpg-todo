# Executive Summary

The RPG Todo application is a gamified task management tool designed to motivate users to complete their to-dos by rewarding them with experience points (XP), levels, and achievements. Users can create tasks with priorities and custom labels, earn XP upon completion, and level up as they accumulate XP. The application features a user-friendly interface built with React, Express, Shadcn components, and Tailwind CSS, incorporating a fantasy RPG aesthetic to enhance user engagement. Core features include user registration and profiles, task management with custom labels, an XP and leveling system, and an achievement system.

# Platforms

*   Web: React
*   Backend: Express
*   Server: Vercel
*   Database: Supabase

# User Types

*   Guest
*   User

# Feature Groups

### Uncategorised

### User Authentication and Profiles

### Task Management

### XP and Leveling System

### Data Seeding and Initial Setup

### Achievement System

### Custom Labels

### User Interface (UI) Components

# Feature Specifications

## Uncategorised

## User Authentication and Profiles

*   **Tasks:**
    *   Allow users to register with a unique username, email, and a secure password.
    *   Authenticate registered users via username/email and password.
    *   Display user profiles showing username, level, XP, achievements earned, a customizable profile picture, and a bio.
    *   Implement a single "User" role with permissions to fully utilize the application.
*   **Potential Dependencies:**
    *   Database for storing user credentials and profile information.
    *   Hashing algorithm for secure password storage.
    *   Session management for maintaining user login state.

## Task Management

*   **Tasks:**
    *   Enable users to create tasks with a title, description, priority level (High, Medium, Low), due date, and custom labels.
    *   Allow users to mark tasks as complete.
    *   Display a prioritized list of incomplete tasks on the main dashboard.
    *   Implement task filtering by labels.
    *   Display task completion history, including task title, completion date, priority, XP earned, and associated labels.
*   **Potential Dependencies:**
    *   Database for storing task information.
    *   Custom labels feature.
    *   XP and Leveling System for calculating XP upon completion.
    *   User Authentication and Profiles to associate tasks with users.

## XP and Leveling System

*   **Tasks:**
    *   Calculate XP based on task priority (High: 100 XP, Medium: 50 XP, Low: 25 XP).
    *   Implement exponential level requirements up to level 20.
    *   Display the user's current level and XP progress in the profile and website header using a progress bar.
    *   Award bonus XP for relevant achievements earned.
*   **Potential Dependencies:**
    *   Task Management for task completion events.
    *   Achievement System for achievement awarding.
    *   Database for storing user XP and level information.

## Data Seeding and Initial Setup

*   **Tasks:**
    *   Seed the database with 20 levels, each requiring exponentially increasing XP.
    *   Seed the database with 10 achievements.
    *   Seed the database with default labels: "Work," "Personal," "Errands," and "Goals."
*   **Potential Dependencies:**
    *   Database connection and schema setup.
    *   XP and Leveling System for level data.
    *   Achievement System for achievement data.
    *   Custom Labels feature for label data.

## Achievement System

*   **Tasks:**
    *   Implement achievements for:
        *   Creating 5, 10, and 20 tasks.
        *   Completing one task of each priority level (high, medium, low).
        *   Reaching levels 5, 10, 15, and 20.
        *   Creating 3, 5, and 10 custom labels.
    *   Display all achievements from the start.
    *   Display achievements earned on the user profile and dashboard.
    *   Provide visual cues (toast notifications) when an achievement is earned.
*   **Potential Dependencies:**
    *   Task Management for tracking task creation and completion.
    *   XP and Leveling System for tracking user level.
    *   Custom Labels feature for tracking label creation.
    *   Database for storing achievement information and user progress.

## Custom Labels

*   **Tasks:**
    *   Implement a label management interface within the task creation/editing modal, allowing users to create, edit, and delete labels.
    *   Allow users to assign custom labels to tasks.
    *   Implement task filtering by labels.
    *   Allow unlimited custom labels.
*   **Potential Dependencies:**
    *   Task Management for task creation and editing.
    *   Database for storing label information.

## User Interface (UI) Components

*   **Tasks:**
    *   Develop React components for:
        *   User registration/login.
        *   Task creation form.
        *   Task list display.
        *   Profile page.
        *   Achievement list.
        *   Level progression bar.
    *   Use Shadcn components and Tailwind CSS for styling and functionality.
    *   Incorporate a color palette of deep blues and greens and pixel-art style icons to align with a fantasy RPG aesthetic.
    *   Implement dark mode and light mode themes.
    *   Implement tooltips on task creation form fields and achievement descriptions.
    * Implement a brief interactive tutorial highlighting task creation, priority setting, and XP earning upon a user's first login.
*   **Potential Dependencies:**
    *   Shadcn component library.
    *   Tailwind CSS framework.
    *   User Authentication and Profiles for registration/login components.
    *   Task Management for task list and creation form components.
    *   XP and Leveling System for level progression bar component.
    *   Achievement System for achievement list component.
    *   Custom Labels feature for label selection in task creation form.

# User Experience Requirements

*   **User Registration:** The registration process should be straightforward, requiring only username, email, and password. Error messages should be clear and informative.
*   **Task Creation:** The task creation form should be intuitive and easy to use, with clear labels and instructions. Users should be able to quickly add tasks with the necessary details.
*   **Dashboard:** The dashboard should provide a clear overview of the user's progress, including their level, XP, achievements, and prioritized tasks.
*   **Achievement Notifications:** Toast notifications should be visually appealing and non-intrusive, providing immediate feedback when an achievement is earned.
*   **Tutorial:** The tutorial should be interactive and engaging, guiding new users through the core features of the application.
*   **Visual Consistency:** The application should maintain a consistent and visually appealing design, adhering to the fantasy RPG aesthetic with deep blues and greens, pixel-art style icons, and appropriate fonts.
*   **Accessibility:** The application should be accessible to users with disabilities, following accessibility best practices.

# Integration Requirements

*   **Database:** (e.g., PostgreSQL, MySQL, MongoDB) for storing user data, task data, level data, achievement data, and label data.
*   **Authentication Service:** (e.g., custom implementation, Auth0, Firebase Authentication) for user registration, login, and session management.

## User Stories

### High Priority

- As a user, I want to register with a username, email, and password so that I can create an account and start using the todo list application. (3, 4)
  - **Acceptance Criteria:** - The registration form should include fields for username, email, and password.
- The system should validate that the email is in a valid format.
- The system should validate that the username is unique.
- The system should securely store the user's password (e.g., using hashing).
- Upon successful registration, the user should be automatically logged in or redirected to the login page.
- As a user, I want to create tasks with a title, description, priority level (High, Medium, Low), and custom labels so that I can effectively organize and track my to-dos and earn XP for level progression and achievements.
  - **Acceptance Criteria:** 1. A task creation form should be available to the user.
2. The form should include fields for 'Title' (text), 'Description' (text), 'Priority' (dropdown with options 'High', 'Medium', 'Low'), and 'Custom Labels' (text input allowing multiple labels).
3. Upon submission, a new task should be created in the system with the provided details.
4. The task should be associated with the currently logged-in user.
5. The task should be saved to the database with the correct data types for each field.
- As a user, I want the XP required to level up to increase exponentially, so that the game remains challenging and rewarding as I progress. (1)
  - **Acceptance Criteria:** 1. Level XP requirements increase exponentially as the user levels up. 2. The exponential scaling factor is configurable by an administrator. 3. Level cap is 20.
- As a developer, I want to seed the database with 20 levels on application startup so that the game has a progression system from the beginning.
  - **Acceptance Criteria:** 1. The database is seeded with 20 level records.
2. Each level record includes an XP requirement.
3. The XP requirements for each level increase exponentially based on a defined formula.
4. A script or process is in place to automatically seed these levels on the first application launch or when the database is initialized.
- As a user, I want to earn achievements for creating 5, 10, and 20 tasks so that I am motivated to create and manage my tasks effectively.
  - **Acceptance Criteria:** Given a user has created fewer than 5 tasks, when they create their 5th task, they are awarded the 'Task Creator I' achievement. Given a user has created fewer than 10 tasks, when they create their 10th task, they are awarded the 'Task Creator II' achievement. Given a user has created fewer than 20 tasks, when they create their 20th task, they are awarded the 'Task Creator III' achievement.  The system accurately tracks the number of tasks created by the user.
- As a user, I want to categorize my tasks with custom labels like 'Work', 'Personal', 'Home', 'Errands', and 'Goals' so that I can easily organize and manage my tasks according to my individual needs.
  - **Acceptance Criteria:** 1. The system includes the custom labels 'Work', 'Personal', 'Home', 'Errands', and 'Goals' for task categorization.
2. Users can apply these labels to tasks.
- As a user, I want the UI to use a color palette of deep blues and greens so that the application has a visually appealing and consistent aesthetic. (Based on Question 1)
  - **Acceptance Criteria:** 1. The UI uses deep blue and green color schemes for backgrounds, text, and interactive elements.
2. The color scheme is consistently applied across all UI components.
- As a user, I want to be motivated to complete my tasks through gamification with XP, levels, and achievements, so that I am more productive and engaged in my task management. 
  - **Acceptance Criteria:** The application implements a system for awarding XP upon task completion. The application implements a leveling system based on accumulated XP. The application implements an achievement system that rewards users for specific actions or milestones.
- As a user, I want to be able to register for an account with a username, email, and password so that I can start using the RPG Todo application and track my tasks and progress.
  - **Acceptance Criteria:** - A registration form is available on the application.
- The registration form includes fields for username, email, and password.
- Password must meet minimum security requirements (e.g., minimum length, special characters).
- Upon successful registration, the user is automatically logged in or redirected to the login page.
- Error messages are displayed for invalid input (e.g., existing username, invalid email format, weak password).
- As a user, I want to view my profile, which displays my username, level, XP, and achievements earned, so that I can track my progress and see my accomplishments. (1)
  - **Acceptance Criteria:** - The user profile page should display the user's username, current level, total XP, and a list of achievements earned.
- The level and XP values should be accurately calculated based on completed tasks.
- The achievements list should display the name and a brief description of each achievement.
- As a user, I want to assign a due date to a task so that I can track task deadlines.
  - **Acceptance Criteria:** 1. The task creation/edit form should include a 'Due Date' field.
2. The 'Due Date' field should be a date picker.
3. When a due date is selected, it should be stored with the task in the database as a date type.
4. The due date should be displayed on the task details view.
- As a developer, I want the initial 20 levels seeded in the database, so the game has levels.
  - **Acceptance Criteria:** 1. The database includes 20 seeded levels with corresponding XP requirements. 2. The seeded levels are readily accessible and configurable.
- As a developer, I want to seed the database with 10 achievements on application startup so that users have initial goals and rewards to pursue.
  - **Acceptance Criteria:** 1. The database is seeded with 10 achievement records.
2. Each achievement record includes a title, description, and criteria for completion (e.g., create X tasks, complete Y tasks, reach level Z).
3. The achievements are related to task creation, task completion, and reaching specific levels.
4. A script or process is in place to automatically seed these achievements on the first application launch or when the database is initialized.
- As a user, I want to earn achievements for completing tasks of each priority level (high, medium, low) so that I am motivated to complete a variety of tasks.
  - **Acceptance Criteria:** Given a user has not completed a high-priority task, when they complete a high-priority task, they are awarded the 'High Priority Task Master' achievement. Given a user has not completed a medium-priority task, when they complete a medium-priority task, they are awarded the 'Medium Priority Task Master' achievement. Given a user has not completed a low-priority task, when they complete a low-priority task, they are awarded the 'Low Priority Task Master' achievement. The system accurately tracks the completion of tasks for each priority level.
- As a user, I want a label management interface within the task creation/editing modal so that I can create new labels.
  - **Acceptance Criteria:** 1. A 'Create Label' function is available within the task creation/editing modal.
2. User is able to input a name for the new label.
- As a user, I want the UI to incorporate pixel-art style icons so that the application aligns with a fantasy RPG aesthetic. (Based on Question 1)
  - **Acceptance Criteria:** 1. Pixel-art style icons are used for all relevant UI elements, such as buttons, task categories, and achievement badges.
2. Icons are visually clear and recognizable, complementing the application's theme.
- As a new user, I want to be presented with an interactive tutorial upon my first login, so that I can quickly understand how to use the application.
  - **Acceptance Criteria:** Upon first login, the user is automatically presented with an interactive tutorial. The tutorial provides clear instructions and visual cues. The tutorial is easily dismissable after completion.
- As a user, I want to be able to log in to the RPG Todo application using my registered username and password so that I can access my tasks and profile.
  - **Acceptance Criteria:** - A login form is available on the application.
- The login form includes fields for username/email and password.
- Upon successful login, the user is redirected to the main application interface (e.g., todo list).
- Error messages are displayed for incorrect username/password combinations.
- As a user, I want to customize my profile picture so that I can personalize my account. (1)
  - **Acceptance Criteria:** - The profile page should include an option to upload or select a profile picture.
- The system should support common image formats (e.g., JPG, PNG).
- The system should allow the user to crop or resize the image.
- The uploaded profile picture should be displayed on the user's profile and in other areas of the application where the user is identified.
- As a user, I want the task priority level to determine the XP earned upon completion, with higher priority tasks awarding more XP so that completing higher priority tasks feels more rewarding.
  - **Acceptance Criteria:** 1. The system should have predefined XP values for each priority level (High, Medium, Low).
2. When a task is marked as complete, the system should calculate the XP earned based on the task's priority.
3. The user's total XP should be updated with the earned XP.
4.  High priority will earn 100 XP, Medium will earn 50 XP, and Low will earn 25 XP.
- As a user, I want tasks with higher priority to award more XP, so that I am rewarded appropriately for completing more important tasks. (1, 2, 4)
  - **Acceptance Criteria:** 1. XP awarded for a task is directly proportional to its priority level. 2. High-priority tasks award more XP than medium-priority tasks, and medium-priority tasks award more XP than low-priority tasks. 3. Base XP values for each priority level are configurable by an administrator. 4. The only factor influencing XP is priority level.
- As a user, I want to earn achievements for reaching levels 5, 10, 15, and 20 so that I am motivated to continue using the app and completing tasks.
  - **Acceptance Criteria:** Given a user is below level 5, when they reach level 5, they are awarded the 'Level 5 Achiever' achievement. Given a user is below level 10, when they reach level 10, they are awarded the 'Level 10 Achiever' achievement. Given a user is below level 15, when they reach level 15, they are awarded the 'Level 15 Achiever' achievement. Given a user is below level 20, when they reach level 20, they are awarded the 'Level 20 Achiever' achievement. The system accurately tracks the user's level.
- As a user, I want a label management interface within the task creation/editing modal so that I can edit existing labels.
  - **Acceptance Criteria:** 1. An 'Edit Label' function is available within the task creation/editing modal.
2. User is able to change the name of the selected label.
- As a user, I want the UI to maintain a fantasy RPG aesthetic so that the application feels immersive and engaging. (Based on Question 1)
  - **Acceptance Criteria:** 1. The overall design and layout of the UI components reflect a fantasy RPG theme, including fonts, borders, and imagery.
2. The UI elements should feel consistent with the application's intended genre.
- As a new user, I want the tutorial to show me how to create tasks, so that I can begin adding tasks to my todo list.
  - **Acceptance Criteria:** The tutorial demonstrates the task creation process, including entering a title, description, and other relevant details. The tutorial guides the user through submitting their first task.
- As a user, I want to add a bio to my profile so that I can provide additional information about myself. (1)
  - **Acceptance Criteria:** - The profile page should include a text field for the user to enter a bio.
- The system should limit the bio to a reasonable character count.
- The bio should be displayed on the user's profile page.
- As a user, I want to see my task completion history, including task title, completion date, priority, XP earned, and associated labels, so that I can track my progress and review completed tasks.
  - **Acceptance Criteria:** 1. A 'Task History' section should be accessible to the user.
2. The task history should display a list of completed tasks.
3. For each task in the history, the following information should be displayed: Task Title, Completion Date, Priority, XP Earned, and Associated Labels.
4. The task history should be sorted by completion date (most recent first).
- As a user, I want to receive significant XP bonuses for earning milestone achievements, so that I feel a greater sense of accomplishment. (1, 3)
  - **Acceptance Criteria:** 1. Completing milestone achievements grants a bonus XP reward. 2. The amount of bonus XP is configurable per achievement by an administrator. 3. The bonus XP is automatically added to the user's total XP upon unlocking the achievement. 4. Relevant achievements are displayed to the user. 5. XP awarded for task completion will be influenced by task priority, as well as any bonus XP earned from relevant achievements.
- As a user, I want to earn achievements for creating 3, 5, and 10 custom labels so that I am motivated to organize my tasks with custom labels.
  - **Acceptance Criteria:** Given a user has created fewer than 3 custom labels, when they create their 3rd custom label, they are awarded the 'Label Creator I' achievement. Given a user has created fewer than 5 custom labels, when they create their 5th custom label, they are awarded the 'Label Creator II' achievement. Given a user has created fewer than 10 custom labels, when they create their 10th custom label, they are awarded the 'Label Creator III' achievement.  The system accurately tracks the number of custom labels created by the user.
- As a user, I want a label management interface within the task creation/editing modal so that I can delete labels that I no longer need.
  - **Acceptance Criteria:** 1. A 'Delete Label' function is available within the task creation/editing modal.
2. Deleting a label removes it from all tasks it was assigned to.
3. The system prompts the user to confirm the deletion.
- As a user, I want a React component for user registration/login using Shadcn components and Tailwind CSS so that I can securely access the application. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component includes fields for username/email and password.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
4. The component handles user registration and login functionality correctly.
- As a new user, I want the tutorial to explain how to set priority levels for tasks, so that I can understand how priority impacts XP earnings.
  - **Acceptance Criteria:** The tutorial demonstrates how to select a priority level (e.g., high, medium, low) for a task. The tutorial explains the correlation between priority level and the amount of XP awarded upon task completion.
- As a user, I want to be assigned the role of 'User' with permissions to create, manage, and complete tasks, earn XP, level up, and track achievements, so that I can fully interact with the application. (2)
  - **Acceptance Criteria:** - The system should automatically assign the 'User' role to newly registered users.
- Users with the 'User' role should be able to create, edit, delete, and mark tasks as complete.
- Users with the 'User' role should earn XP upon completing tasks.
- Users with the 'User' role should level up when they reach the required XP threshold.
- Users with the 'User' role should be able to view their achievements and track their progress.
- As a user, I want to mark tasks as complete so that I can track my progress.
  - **Acceptance Criteria:** 1. Each task should have a checkbox or similar control to mark it as complete.
2. When a task is marked as complete, its completion status should be updated in the database.
3. Completed tasks should be visually distinguished from incomplete tasks in the task list (e.g., strikethrough, different background color).
- As a developer, I want to have 10 initial achievements seeded in the database, so the game starts with achievements.
  - **Acceptance Criteria:** 1. The database includes 10 seeded achievements. 2. Achievements must have fields such as name, description, XP rewards, and unlock conditions.
- As a developer, I want to seed 10 achievements into the system so that users can start earning achievements immediately.
  - **Acceptance Criteria:** The database contains 10 pre-defined achievement records, including 'Task Creator I', 'Task Creator II', 'Task Creator III', 'High Priority Task Master', 'Medium Priority Task Master', 'Low Priority Task Master', 'Level 5 Achiever', 'Level 10 Achiever', 'Level 15 Achiever', and 'Label Creator I'. Each achievement has a name, description, and the conditions for earning it.
- As a developer, I want the database to be seeded with default labels such as 'Work', 'Personal', 'Errands', and 'Goals' so that new users have a starting point for organizing their tasks.
  - **Acceptance Criteria:** 1. Upon initial setup or database reset, the database is populated with the labels 'Work', 'Personal', 'Errands', and 'Goals'.
2. These labels are available to all users upon registration.
- As a user, I want a React component for a task creation form using Shadcn components and Tailwind CSS so that I can easily add new tasks to my todo list. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component includes fields for task title, description, priority level, and custom labels.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
4. The component correctly saves the task details.
- As a new user, I want the tutorial to explain the XP system and level progression, so that I understand how to gain levels.
  - **Acceptance Criteria:** The tutorial explains how XP is earned and accumulated. The tutorial describes how accumulated XP contributes to leveling up. The tutorial visually shows the user's current XP and level.
- As a user, I want to see all available achievements from the start so that I know what I can aim for.
  - **Acceptance Criteria:** The achievement list displays all 10 achievements from the beginning, regardless of whether the user has met the criteria for earning them or not.
- As a user, I want to create and assign as many custom labels to tasks as I need so that I am not restricted in organizing my tasks.
  - **Acceptance Criteria:** 1. The system does not limit the number of custom labels a user can create.
2. The system does not limit the number of custom labels a user can assign to a single task.
- As a user, I want a React component for a task list display using Shadcn components and Tailwind CSS so that I can view and manage my tasks. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component displays a list of tasks with their title, description, priority, and labels.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
4. The component allows users to mark tasks as complete.
- As a new user, I want the tutorial to show me how to create custom labels for tasks, so that I can categorize my tasks in a way that makes sense to me.
  - **Acceptance Criteria:** The tutorial guides the user on creating and applying custom labels to tasks. The tutorial shows how labels can be used to filter and organize tasks.
- As a user, I want to receive a notification when I earn an achievement so that I know I've made progress.
  - **Acceptance Criteria:** When a user meets the criteria for an achievement, a toast notification appears on the screen. The notification includes an achievement icon and a brief description of the achievement earned. The toast notification disappears automatically after a short period.
- As a user, I want to filter tasks by selecting one or more labels from a dropdown menu so that I can easily find tasks with specific labels.
  - **Acceptance Criteria:** 1. A dropdown menu is available to select one or more labels.
2. Selecting labels from the dropdown filters the task list to display only tasks with the selected labels.
3. The filtering should be able to handle multiple label selections (AND or OR logic as defined by the product owner/stakeholder).
- As a user, I want a React component for a profile page using Shadcn components and Tailwind CSS so that I can view my profile information. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component displays user profile information such as username, current level, and XP.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
4. The profile page component includes a level progression bar (see story below).
- As a new user, I want the tutorial to show me where the achievements page is and how to view it, so that I can see which achievements are available and what I need to do to earn them.
  - **Acceptance Criteria:** The tutorial shows the user how to navigate to the achievements page. The tutorial briefly describes the purpose of the achievements page.
- As a developer, I want to seed the database with the custom labels 'Personal', 'Work', and 'Errands' so that the tutorial can encourage initial user categorization.
  - **Acceptance Criteria:** 1. On database seed, create 'Personal', 'Work', and 'Errands' custom labels
2. 'Personal', 'Work', and 'Errands' custom labels should be visible in the tutorial.
- As a user, I want a React component for an achievement list using Shadcn components and Tailwind CSS so that I can see my earned achievements. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component displays a list of achievements with their descriptions and icons.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
- As a user, I want a React component for a level progression bar using Shadcn components and Tailwind CSS so that I can track my progress. (Based on Question 2)
  - **Acceptance Criteria:** 1. The component visually displays the user's current level and XP progress towards the next level.
2. The component utilizes Shadcn components for styling and functionality.
3. The component is styled with Tailwind CSS to match the application's aesthetic.
- As a user, I want a progress bar component in the user profile to visually display my current level and XP progress towards the next level. (Based on Question 3)
  - **Acceptance Criteria:** 1. The progress bar visually represents the user's current level and XP.
2. The progress bar updates dynamically as the user earns XP.
3. The progress bar is clearly visible and easy to understand on the user profile page.
- As a user, I want a progress bar component in the website header to visually display my current level and XP progress towards the next level. (Based on Question 3)
  - **Acceptance Criteria:** 1. The progress bar visually represents the user's current level and XP.
2. The progress bar updates dynamically as the user earns XP.
3. The progress bar is clearly visible and easy to understand in the website header.
- As a user, I want the main dashboard to display a summary of my profile, including my current level and XP, so that I can quickly see my progress. (Based on Question 4)
  - **Acceptance Criteria:** 1. The dashboard displays the user's current level and XP.
2. This information is prominently displayed and easy to find on the dashboard.
- As a user, I want the main dashboard to display a summary of my achievements earned so that I can see my accomplishments. (Based on Question 4)
  - **Acceptance Criteria:** 1. The dashboard displays a list or summary of the user's earned achievements.
2. The display includes the achievement names and icons.
- As a user, I want the main dashboard to display a prioritized list of incomplete tasks so that I can easily focus on what needs to be done. (Based on Question 4)
  - **Acceptance Criteria:** 1. The dashboard displays a list of incomplete tasks sorted by priority.
2. The list includes task titles and, optionally, descriptions and due dates.
- As a user, I want the main dashboard to include an option to create new tasks so that I can quickly add items to my todo list. (Based on Question 4)
  - **Acceptance Criteria:** 1. The dashboard includes a clear and accessible button or link to create a new task.
2. Clicking the button or link opens the task creation form.
- As a user, I want the main dashboard to include options to filter existing tasks so that I can easily find specific tasks. (Based on Question 4)
  - **Acceptance Criteria:** 1. The dashboard includes filtering options for tasks, such as by priority, label, or status.
2. The filter options are easy to use and understand.
- As a user, I want to be able to switch between a dark mode and a light mode theme so that I can customize the application's appearance to my preference. (Based on Question 5)
  - **Acceptance Criteria:** 1. The application provides a clear and accessible option to switch between dark and light themes.
2. Switching themes changes the overall color scheme of the UI.
3. Both themes are visually appealing and easy to read.
- As a user, I want tooltips on task creation form fields so that I can understand the purpose of each field. (Based on Question 6)
  - **Acceptance Criteria:** 1. Tooltips are displayed when hovering over or focusing on task creation form fields.
2. Tooltips provide helpful information about the purpose and expected input for each field.
- As a user, I want tooltips on achievement descriptions so that I can understand the requirements for each achievement. (Based on Question 6)
  - **Acceptance Criteria:** 1. Tooltips are displayed when hovering over achievement descriptions.
2. Tooltips provide helpful information about the requirements and benefits of each achievement.

