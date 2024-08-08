document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('upload');
    const addButton = document.getElementById('add');
    const subtractButton = document.getElementById('subtract');
    const inventButton = document.getElementById('invent');
    const toleranceInput = document.getElementById('tolerance');
    const brightnessInput = document.getElementById('brightness');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const imageCountInput = document.getElementById('imageCount');
    const generateImagesButton = document.getElementById('generateImages');
    const generateOtpButton = document.getElementById('generateOtp');
    const otpElement = document.getElementById('otp');
    const canvasContainer = document.getElementById('canvasContainer');

    let image = null;

    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    image = img;
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    generateImagesButton.addEventListener('click', () => {
        if (!image) return;

        const width = parseInt(widthInput.value, 10);
        const height = parseInt(heightInput.value, 10);
        const imageCount = parseInt(imageCountInput.value, 10);
        canvasContainer.innerHTML = ''; // Clear existing canvases

        for (let i = 0; i < imageCount; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvasContainer.appendChild(canvas);
            generateImage(canvas, i);
        }
    });

    generateOtpButton.addEventListener('click', () => {
        const imageCount = parseInt(imageCountInput.value, 10);
        const otp = generateRandomOtp(imageCount);
        otpElement.textContent = `Your OTP is: ${otp}`;
    });

    function generateImage(canvas, index) {
        const ctx = canvas.getContext('2d');
        // Fill the canvas with a random background color
        const bgColor = getRandomColor();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image on top of the background color
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const brightness = parseFloat(brightnessInput.value);
        const tolerance = parseFloat(toleranceInput.value);

        for (let i = 0; i < data.length; i += 4) {
            // Apply brightness adjustment
            data[i] = data[i] * brightness; // Red
            data[i + 1] = data[i + 1] * brightness; // Green
            data[i + 2] = data[i + 2] * brightness; // Blue

            // Apply tolerance adjustment
            if (data[i + 3] > 0) { // If not fully transparent
                data[i] = data[i] * (1 - tolerance); // Red
                data[i + 1] = data[i + 1] * (1 - tolerance); // Green
                data[i + 2] = data[i + 2] * (1 - tolerance); // Blue
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function generateRandomOtp(length) {
        const otp = [];
        for (let i = 0; i < length; i++) {
            otp.push(Math.floor(Math.random() * 10));
        }
        return otp.join('');
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});