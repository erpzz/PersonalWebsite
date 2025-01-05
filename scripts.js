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
        async submitForm() {
            const webhookUrl = "https://discord.com/api/webhooks/1318803683240312843/BTskctoTvbfZVEXOMXrRDcPV53ebtH_E2vkiN4K3IuLUBIhXAkabRYOOcJpxxIGIEluw"; // Replace with your webhook URL
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
                    alert('Your message has been sent successfully!');
                    this.form.name = '';
                    this.form.email = '';
                    this.form.message = '';
                } else {
                    throw new Error("Failed to send the message.");
                }
            } catch (error) {
                alert('There was an error sending your message. Please try again.');
                console.error(error);
            }
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);
    }
}).mount('#app');
