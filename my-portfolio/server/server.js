const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Portfolio Data
const portfolioData = {
    bio: {
        name: "Devin Gaughan",
        title: "SOFTWARE ENGINEER",
        description: "Building software to simulate materials chemistry and physics for use in designing the next generation of computing hardware.",
        aboutText: [
            "Hello, I'm Devin Gaughan – a dedicated Software Engineer with experience in embedded systems and firmware development. I'm currently working on crystal lattice simulation software for use in materials science in microchip research.",
            "I'm driven by a passion for technology, with interests that extend into Chemistry, Physics, Math, and a deep appreciation for the outdoors and the natural world. I strive to push technological boundaries while creating solutions that harmonize with and respect our environment.",
            "My expertise spans low-level firmware development, real-time systems, IoT devices, and industrial automation. I thrive on solving complex technical challenges and optimizing system performance."
        ]
    },
    skills: [
        { category: "Programming Languages", tags: ["C", "C++", "Python", "Assembly", "Rust"] },
        { category: "Embedded Systems", tags: ["ARM Cortex", "STM32", "ESP32", "RTOS", "FreeRTOS", "Bare Metal"] },
        { category: "Protocols & Interfaces", tags: ["I2C", "SPI", "UART", "CAN", "USB", "Modbus"] },
        { category: "Tools & Platforms", tags: ["JTAG/SWD", "Oscilloscope", "Logic Analyzer", "Git", "Docker"] },
        { category: "Specializations", tags: ["Low-Power Design", "Real-Time Systems", "IoT", "Bootloaders", "Device Drivers"] },
        { category: "Scientific Computing", tags: ["Simulation Software", "Materials Science", "Physics Modeling", "Chemistry"] }
    ],
    projects: [
        {
            title: "Crystal Lattice Simulation Software",
            description: "Advanced simulation software for modeling materials chemistry and physics to aid in designing next-generation computing hardware. This cutting-edge tool enables researchers to predict material properties and optimize microchip design at the atomic level.",
            tech: ["Python", "C++", "Scientific Computing", "Materials Science", "Physics Simulation"],
            metric: "Enabling breakthroughs in semiconductor research",
            isFeatured: true
        },
        {
            title: "Industrial Automation System",
            description: "Developed low-level firmware for an industrial automation system, implementing real-time control algorithms and optimizing data processing pipelines.",
            tech: ["C", "STM32", "Modbus", "RTOS"],
            metric: "⚡ +25% Operational Efficiency",
            isFeatured: false
        },
        {
            title: "Wearable Health Device",
            description: "Created firmware for a wearable health monitoring device, focusing on ultra-low-power consumption and real-time biometric data processing with cloud synchronization.",
            tech: ["C++", "Nordic nRF52", "BLE", "Low-Power Design"],
            metric: "🔋 Extended Battery Life to 7 Days",
            isFeatured: false
        },
        {
            title: "Next-Gen Printer Firmware",
            description: "Engineered firmware for a next-generation printer, implementing custom bootloader and optimizing initialization routines to dramatically reduce startup times.",
            tech: ["C", "ARM Cortex-M", "USB", "Bootloader"],
            metric: "🚀 -15% Boot Time Reduction",
            isFeatured: false
        },
        {
            title: "IoT Home Security System",
            description: "Developed secure and reliable firmware for an IoT-based home security system with real-time monitoring, encrypted communications, and instant alert capabilities.",
            tech: ["C", "ESP32", "WiFi", "MQTT", "Security"],
            metric: "🔒 Military-Grade Encryption",
            isFeatured: false
        },
        {
            title: "Robotic Arm Controller",
            description: "Designed and implemented firmware for a precision robotic arm, enabling sub-millimeter accuracy and enhanced automation capabilities in manufacturing environments.",
            tech: ["C++", "Real-Time Control", "CAN Bus", "PID Control"],
            metric: "🎯 ±0.1mm Precision Control",
            isFeatured: false
        },
        {
            title: "Smart Thermostat",
            description: "Created energy-efficient firmware for a smart thermostat, integrating AI-driven algorithms for optimized climate control and predictive energy management.",
            tech: ["C", "AI/ML", "WiFi", "Sensors"],
            metric: "💡 30% Energy Savings",
            isFeatured: false
        }
    ],
    socialLinks: [
        { name: "Email", url: "mailto:devin@devingaughan.com", icon: "email" },
        { name: "LinkedIn", url: "https://linkedin.com/in/devinpgaughan", icon: "linkedin" },
        { name: "GitHub", url: "https://github.com/devin-gaughan", icon: "github" },
        { name: "Resume", url: "/Devin_Gaughan_Resume.pdf", icon: "resume" }
    ]
};


// GET Route for Data
app.get('/api/portfolio', (req, res) => {
    res.json(portfolioData);
});

// POST Route for Contact Form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log("Received message:", name, email, message);

    // 1. Mock Response (Use this for testing locally)
    /*
    setTimeout(() => {
        res.status(200).json({ status: 'Message Received' });
    }, 1000);
    */

    // 2. Real Email Sending (Uncomment and configure to use)
    
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred email provider
        auth: {
            user: 'your-email@gmail.com', // Your email
            pass: 'your-app-password'     // Your App Password (not login password)
        }
    });

    const mailOptions = {
        from: email,
        to: 'devin@devingaughan.com', // Where you want to receive the portfolio emails
        subject: `Portfolio Contact: ${name}`,
        text: `From: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'Email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error sending email' });
    }
    
});

// API Endpoints
app.get('/api/portfolio', (req, res) => {
    res.json(portfolioData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors({
    origin: ["https://your-vercel-project-name.vercel.app", "http://localhost:5173"]
}));