# GraphQL Profile Page with XP Visualization

This project is a personal profile page built with HTML, JavaScript, and SVG. It connects to the Gritlab's GraphQL API and allows authenticated users to view their own school-related data. The project was created to learn and demonstrate the use of GraphQL, DOM manipulation, and SVG-based data visualization.

## 🌐 Live Demo

You can check out the hosted version here: https://karusmari.github.io/graphql/

---

## 📌 Features

- **GraphQL Authentication**  
  Users log in using either their username or email to receive a JWT token, which is then used to authenticate all data requests.

- **Personalized Profile Page**  
  Displays personal data such as:
  - Basic identification info (login, name, etc.)
  - XP progress
  - Audit stats

- **SVG-Based Data Visualization**  
  Contains at least two custom-built SVG graphs:
  - 📈 **XP Progress Over Time**: A line graph showing cumulative XP earned.
  - 📊 **Skills Visualization**: A graph to show the gained skills

- **Interactive Tooltips**  
  Hover over key XP data points to get extra info (project name and XP amount).

- **Responsive Design Considerations**  
  Layout is divided into:
  - Two-column user info section
  - Vertically stacked graphs for a clean, readable UI

---

## 🧑‍💻 Technologies Used

- **JavaScript**: For DOM manipulation and logic
- **SVG**: For rendering custom, scalable graphs
- **GraphQL**: To query authenticated user data
- **HTML/CSS**: Basic structure and styling
