const express = require('express');
const router = express.Router();

// Get portfolio data
router.get('/', (req, res) => {
  res.json({
    name: 'Mr. Ransomware',
    title: 'Elite Cybersecurity Specialist',
    skills: [
      'Penetration Testing',
      'Network Security',
      'Malware Analysis',
      'Incident Response',
      'Security Architecture'
    ],
    projects: [
      {
        name: 'Advanced Threat Detection',
        description: 'Developed a real-time threat detection system',
        impact: 'Reduced security incidents by 75%'
      },
      {
        name: 'Network Security Audit',
        description: 'Conducted comprehensive security audit for Fortune 500 company',
        impact: 'Identified and patched 50+ critical vulnerabilities'
      }
    ]
  });
});

module.exports = router; 