
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuBtn.textContent =
        navLinks.classList.contains("show") ? "✕" : "☰";
});

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        menuBtn.textContent = "☰";
    });
});

document.getElementById("year").textContent =
    new Date().getFullYear();

// Load projects from MySQL through Express API
async function loadProjects() {
    const projectList = document.getElementById("projectList");

    try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
            throw new Error("Could not load projects");
        }

        const projects = await response.json();

        projectList.innerHTML = "";

        if (projects.length === 0) {
            projectList.textContent = "No projects available.";
            return;
        }

        projects.forEach(project => {
            const card = document.createElement("article");
            card.className = "project-card";

            const title = document.createElement("h3");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.textContent = project.description;

            const technologies = document.createElement("small");
            technologies.textContent = project.technologies;

            card.append(title, description, technologies);
            projectList.appendChild(card);
        });

    } catch (error) {
        projectList.textContent =
            "Unable to load projects. Please try again.";
        console.error(error);
    }
}

loadProjects();

// Submit contact form to backend
document.getElementById("contactForm")
    .addEventListener("submit", async (event) => {

    event.preventDefault();

    const status = document.getElementById("formStatus");

    const contactData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    if (!contactData.name ||
        !contactData.email ||
        !contactData.message) {
        status.textContent = "Please fill all fields.";
        return;
    }

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        status.textContent = result.message;
        event.target.reset();

    } catch (error) {
        status.textContent = error.message ||
            "Something went wrong. Please try again.";
    }
});
