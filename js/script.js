
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header background change on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.9)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });

        // URL checker functionality
        const phishingKeywords = [
            'login', 'verify', 'secure', 'account', 'update', 'suspended', 'urgent',
            'click', 'confirm', 'paypal', 'bank', 'amazon', 'microsoft', 'apple',
            'password', 'expire', 'locked', 'security'
        ];

        const suspiciousDomains = [
            'bit.ly', 'tinyurl.com', 'short.link', 'click.me', 'free-', 'secure-',
            'account-', 'login-', 'verify-'
        ];

        function checkURL() {
            const urlInput = document.getElementById('urlInput');
            const result = document.getElementById('result');
            const url = urlInput.value.trim();

            if (!url) {
                showResult('Please enter a URL to check.', 'danger');
                return;
            }

            try {
                const urlObj = new URL(url);
                const analysis = analyzeURL(urlObj);
                
                if (analysis.score > 50) {
                    showResult(`
                        <strong>⚠️ POTENTIAL PHISHING DETECTED</strong><br>
                        Risk Score: ${analysis.score}/100<br>
                        Suspicious factors: ${analysis.factors.join(', ')}<br>
                        <strong>Recommendation:</strong> Do not click this link and verify its authenticity.
                    `, 'danger');
                } else {
                    showResult(`
                        <strong>✅ URL APPEARS SAFE</strong><br>
                        Risk Score: ${analysis.score}/100<br>
                        The URL passed our basic security checks.<br>
                        <strong>Note:</strong> Always exercise caution with unfamiliar links.
                    `, 'safe');
                }
            } catch (e) {
                showResult('Invalid URL format. Please enter a valid URL starting with http:// or https://', 'danger');
            }
        }

        function analyzeURL(urlObj) {
            let score = 0;
            const factors = [];

            // Check URL length
            if (urlObj.href.length > 100) {
                score += 20;
                factors.push('Long URL');
            }

            // Check for suspicious keywords
            const lowerUrl = urlObj.href.toLowerCase();
            const foundKeywords = phishingKeywords.filter(keyword => lowerUrl.includes(keyword));
            if (foundKeywords.length > 0) {
                score += foundKeywords.length * 10;
                factors.push(`Phishing keywords: ${foundKeywords.join(', ')}`);
            }

            // Check for suspicious characters
            if (urlObj.href.includes('@') || urlObj.href.includes('$')) {
                score += 15;
                factors.push('Suspicious characters');
            }

            // Check domain
            const domain = urlObj.hostname.toLowerCase();
            if (suspiciousDomains.some(sus => domain.includes(sus))) {
                score += 25;
                factors.push('Suspicious domain pattern');
            }

            // Check for multiple subdomains
            const subdomains = domain.split('.').length - 2;
            if (subdomains > 2) {
                score += 15;
                factors.push('Multiple subdomains');
            }

            // Check for hyphens in domain
            if (domain.includes('-')) {
                score += 10;
                factors.push('Hyphens in domain');
            }

            // Check for IP address instead of domain
            if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) {
                score += 30;
                factors.push('IP address instead of domain');
            }

            return { score: Math.min(score, 100), factors };
        }

        function showResult(message, type) {
            const result = document.getElementById('result');
            result.innerHTML = message;
            result.className = `result ${type}`;
            result.style.display = 'block';
        }

        // Add enter key support for URL input
        document.getElementById('urlInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkURL();
            }
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe all feature cards and stat cards
        document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
