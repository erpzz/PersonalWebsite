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
                    const webhookUrl = ; // Replace with your webhook URL
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
                }
            },
            mounted() {
                gsap.registerPlugin(ScrollTrigger);
                this.animateSections();
            }
        }).mount('#app');
