const { createApp } = Vue;

createApp({
    data() {
        return {
            form: {
                name: '',
                email: '',
                message: ''
            },
            expandedProject: null
        };
    },
    methods: {
        toggleDetails(project) {
            console.log('Toggling project:', project);
            this.expandedProject = this.expandedProject === project ? null : project;
            console.log('Current expandedProject:', this.expandedProject); 
        },
        toggleTheme() {
            const theme = document.body.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
        },
        animateSections() {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    opacity: 0,
                    y: 50,
                    duration: 1
                });
            });
        },
        async submitForm() {
            const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // Secure webhook URL
            const payload = {
                content: `New Contact Form Submission:\n**Name:** ${this.form.name}\n**Email:** ${this.form.email}\n**Message:**\n${this.form.message}`
            };

            try {
                const response = await fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const successMessage = document.createElement("div");
                    successMessage.className = "alert alert-success";
                    successMessage.textContent = "Your message has been sent successfully!";
                    document.querySelector(".contact-form").appendChild(successMessage);
                    setTimeout(() => successMessage.remove(), 5000);

                    this.form.name = '';
                    this.form.email = '';
                    this.form.message = '';
                } else {
                    throw new Error("Failed to send the message.");
                }
            } catch (error) {
                const errorMessage = document.createElement("div");
                errorMessage.className = "alert alert-danger";
                errorMessage.textContent = "There was an error sending your message. Please try again.";
                document.querySelector(".contact-form").appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 5000);
                console.error(error);
            }
        },
        async triggerGitHubAction() {
            const apiUrl = "https://api.github.com/repos/your-username/your-repo/actions/workflows/webhook.yml/dispatches"; // Replace with your GitHub repo details
            const token = "your-github-token"; // Replace with your GitHub Personal Access Token

            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/vnd.github.v3+json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ref: "main" // Replace with your branch name
                    })
                });

                if (response.ok) {
                    alert("GitHub Action triggered successfully!");
                } else {
                    console.error("Failed to trigger GitHub Action:", response.status, await response.text());
                    alert("Failed to trigger GitHub Action. Please check the logs.");
                }
            } catch (error) {
                console.error("Error triggering GitHub Action:", error);
                alert("An error occurred while triggering GitHub Action.");
            }
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);
        this.animateSections();

        // Add event listener for the new button
        document.getElementById("trigger-webhook").addEventListener("click", this.triggerGitHubAction);
    }
}).mount('#app');
