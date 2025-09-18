// Ensure config.js is loaded before this script.js
        document.addEventListener('DOMContentLoaded', function () {
            const textInput = document.getElementById('text-input');
            const voiceSelect = document.getElementById('voiceSelect');
            const generateBtn = document.getElementById('generateBtn');
            const loadingIndicator = document.getElementById('loadingIndicator');
            const errorMessage = document.getElementById('errorMessage');
            const audioContainer = document.getElementById('audioContainer');
            const audioPlayer = document.getElementById('audioPlayer');
            const downloadBtn = document.getElementById('downloadBtn');
            const mainCard = document.querySelector('.main-card');

            // Replace this with your actual API Gateway URL
            const apiUrl = API_URL; // From config.js

            // Auto-resize textarea
            textInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.max(180, this.scrollHeight) + 'px';
            });

            // Character counter (optional enhancement)
            function updateCharCount() {
                const count = textInput.value.length;
                // You can add character count display here if needed
            }

            textInput.addEventListener('input', updateCharCount);

            generateBtn.addEventListener('click', async function () {
                const text = textInput.value.trim();

                if (!text) {
                    showError('Please enter some text to convert to speech. ✍️');
                    return;
                }

                if (text.length > 3000) {
                    showError('Text is too long. Please keep it under 3000 characters. 📝');
                    return;
                }

                // Show loading state
                showLoading();

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            text: text,
                            voice: voiceSelect.value
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}. Please try again. 🔄`);
                    }

                    const data = await response.json();

                    if (data.audioUrl) {
                        showSuccess(data.audioUrl);
                    } else {
                        throw new Error('No audio URL received from the server. Please try again. 🤖');
                    }
                } catch (error) {
                    console.error('Conversion error:', error);
                    showError(`Oops! ${error.message || 'Something went wrong. Please try again.'} 🚫`);
                } finally {
                    hideLoading();
                }
            });

            function showLoading() {
                loadingIndicator.classList.add('visible');
                audioContainer.classList.remove('visible');
                errorMessage.classList.remove('visible');
                generateBtn.disabled = true;
                generateBtn.textContent = '🔄 Processing...';
            }

            function hideLoading() {
                loadingIndicator.classList.remove('visible');
                generateBtn.disabled = false;
                generateBtn.textContent = '🎵 Generate Audio';
            }

            function showSuccess(audioUrl) {
                audioPlayer.src = audioUrl;
                audioContainer.classList.add('visible');
                mainCard.classList.add('success-animation');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    mainCard.classList.remove('success-animation');
                }, 600);

                // Set up download functionality
                downloadBtn.onclick = function () {
                    const a = document.createElement('a');
                    a.href = audioUrl;
                    a.download = `voiceify-speech-${Date.now()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };

                // Auto-play if user has interacted with the page
                audioPlayer.play().catch(() => {
                    // Auto-play failed, user needs to click play manually
                    console.log('Auto-play prevented - user interaction required');
                });
            }

            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.classList.add('visible');
                audioContainer.classList.remove('visible');
                
                // Auto-hide error after 5 seconds
                setTimeout(() => {
                    errorMessage.classList.remove('visible');
                }, 5000);
            }

            // Keyboard shortcut: Ctrl/Cmd + Enter to generate
            textInput.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!generateBtn.disabled) {
                        generateBtn.click();
                    }
                }
            });

            // Add some interactive feedback
            generateBtn.addEventListener('mouseenter', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                }
            });

            generateBtn.addEventListener('mouseleave', function() {
                if (!this.disabled) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        });