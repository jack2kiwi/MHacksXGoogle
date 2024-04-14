// The video stream from the webcam
let videoStream;

// Get the video and canvas elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Audio data chunks for MediaRecorder
let audioChunks = [];
let mediaRecorder;

let imageBlob;
let autoCaptureIntervalId = null;

// Initialize SpeechRecognition
let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.onresult = function(event) {
    let speechResult = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            speechResult += event.results[i][0].transcript;
        }
    }
    document.getElementById('speech-to-text').innerText = speechResult;
};

// Set up camera stream
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        videoStream = stream;
        video.srcObject = stream;
        video.play();
    });
}

function takeSnapshot() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    //Call function with the image as a Blob instead
    canvas.toBlob(function(blob) {
        processCapturedImageBlob(blob);
    }, 'image/png')
}

function processCapturedImageBlob(blob) {
    // Handle the blob as needed, such as attaching it to a FormData object for upload
    imageBlob = blob;
    console.log('Image captured as Blob:', blob);
}

  // Speech Recognition functions
function startSpeechRecognition() {
    recognition.start();
    document.getElementById('start-speech-btn').disabled = true;
    document.getElementById('stop-speech-btn').disabled = false;
}

function stopSpeechRecognition() {
    recognition.stop();
    document.getElementById('start-speech-btn').disabled = false;
    document.getElementById('stop-speech-btn').disabled = true;
}

  // Audio Recording functions
function startAudioRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(e) {
                audioChunks.push(e.data);
            };
            mediaRecorder.onstop = function(e) {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audio-playback').src = audioUrl;
            };
            mediaRecorder.start();
            document.getElementById('start-audio-record-btn').disabled = true;
            document.getElementById('stop-audio-record-btn').disabled = false;
        })
        .catch(function(err) {
            console.error('Could not start audio recording:', err);
        });
}

function stopAudioRecording() {
    mediaRecorder.stop();
    document.getElementById('start-audio-record-btn').disabled = false;
    document.getElementById('stop-audio-record-btn').disabled = true;
}

// Stop the video and audio streams when navigating away from the page (optional)
window.onbeforeunload = function() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
};

function uploadImage() {
    if (!imageBlob) {
        return console.error('No image to upload.');
    }

    const formData = new FormData();
    formData.append('image', imageBlob, 'image.png');

    fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error uploading image:', error));
}

function uploadAudioSearch() {
    const textInput = document.getElementById('speech-to-text');
    const inputString = textInput.innerText;
    uploadImageWithDescription(inputString);
}

function uploadTextSearch() {
    const textInput = document.getElementById('text-to-speak');
    const inputString = textInput.value;
    uploadImageWithDescription(inputString);
}

function uploadImageWithDescription(inputString) {
    if (!imageBlob) {
        return console.error('No image to upload.');
    }

    const formData = new FormData();
    formData.append('image', imageBlob, 'image.png');
    console.log(inputString)
    formData.append('description', inputString);

    fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Image uploaded:', data);
        document.getElementById('search-response').innerText = data.message;
        speakTextByInput(data.message);
    })
    .catch(error => console.error('Error uploading image:', error));
}

// Function to upload the audio Blob
function uploadAudio() {
    if (!mediaRecorder) {
        return console.error('No audio recording available to upload.');
    }
      
    // Create a Blob from the audio data chunks
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    fetch('http://localhost:5000/upload-audio', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error uploading audio:', error));
}

  // Function to start auto-capture
function startAutoCapture() {
    if (autoCaptureIntervalId === null) {
        // Take the first snapshot after 5 seconds
        setTimeout(takeSnapshotAndUpload, 5000);
        
        // Call the takeSnapshotAndUpload function every 10 seconds (10000 milliseconds)
        autoCaptureIntervalId = setInterval(takeSnapshotAndUpload, 20000);

        // Disable the start button and enable the stop button
        document.getElementById('start-auto-capture').disabled = true;
        document.getElementById('stop-auto-capture').disabled = false;
        console.log("Auto capture started.");
    }
}

  // Function to stop auto-capture
  function stopAutoCapture() {
    if (autoCaptureIntervalId !== null) {
        // Stop the interval
        clearInterval(autoCaptureIntervalId);
        autoCaptureIntervalId = null;
    }

    // Enable the start button and disable the stop button
    document.getElementById('start-auto-capture').disabled = false;
    document.getElementById('stop-auto-capture').disabled = true;
    console.log("Auto capture stopped.");
  }

function takeSnapshotAndUpload() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('image', blob, `image_${Date.now()}.png`);

        // Send the Blob to the server using fetch
        fetch('http://localhost:5000/upload-walking-image', { // Replace with the path to your Flask endpoint
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Image uploaded:', data);
            document.getElementById('auto-capture-response').innerText = data.message;
            speakTextByInput(data.message);
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
    }, 'image/png');
}

function speakText() {
    const textInput = document.getElementById('text-to-speak');
    const text = textInput.value;

    // Check if there's any text
    if (text.trim().length === 0) {
        alert('Please enter some text to speak.');
        return;
    }

    // Initialize a new SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set the properties for the speech
    utterance.pitch = 1;  // Range between 0 (lowest) and 2 (highest), with 1 as the default.
    utterance.rate = 1;   // Range between 0.1 (slowest) and 10 (fastest), with 1 as the default.
    utterance.volume = 1; // Volume level from 0 to 1.

    // Optionally, select a specific voice
    // utterance.voice = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')[0];

    // Speak out loud
    window.speechSynthesis.speak(utterance);
}

function speakTextByInput(text) {

    // Check if there's any text
    if (text.trim().length === 0) {
        alert('No response');
        return;
    }

    // Initialize a new SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set the properties for the speech
    utterance.pitch = 1;  // Range between 0 (lowest) and 2 (highest), with 1 as the default.
    utterance.rate = 2;   // Range between 0.1 (slowest) and 10 (fastest), with 1 as the default.
    utterance.volume = 1; // Volume level from 0 to 1.

    // Optionally, select a specific voice
    // utterance.voice = speechSynthesis.getVoices().filter(voice => voice.lang === 'en-US')[0];

    // Speak out loud
    window.speechSynthesis.speak(utterance);
}