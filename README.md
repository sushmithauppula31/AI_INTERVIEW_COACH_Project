# AI Interview Coach

A browser-based interview practice website with account screens, mock interview questions, camera/microphone controls, speech input, feedback scoring, and practice history.

## Project structure

```text
AI-Interview-Coach/
├── index.html
├── login.html
├── signup.html
├── css/
│   ├── style.css
│   └── auth.css
├── js/
│   ├── app.js
│   ├── login.js
│   └── signup.js
├── assets/
│   └── README.md
├── README.md
└── .gitignore
```

## Run locally

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Start the site using the **Live Server** extension, or run any simple local static web server.
4. Open the local URL provided by the server.

You can also open `login.html` directly, but a local server is recommended for camera and microphone permissions. Browser media features generally require HTTPS or localhost.

## Deploy with GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. Wait for GitHub Pages to publish the site. Open the URL shown in the Pages settings.

## Important implementation notes

- This is currently a front-end/static project. Account records and interview history are stored in the browser's local storage; the login session uses session storage.
- Do not use real or sensitive passwords on this demo. Browser storage is not secure authentication and passwords are not protected by a backend.
- The interview page contains a hook for an AI provider, but without a configured provider integration it uses the built-in sample question bank and local feedback.
- Camera, microphone, speech recognition, and face-detection support depend on the browser and permissions. Eye-contact feedback is an estimate, not a validated measurement.

## Main features

- Login and sign-up screens
- Behavioral, technical, and HR interview practice
- Optional camera and microphone access
- Speech-to-text where supported by the browser
- Speaking pace and filler-word indicators
- Approximate face-position tracking where supported
- Interview summary and browser-local practice history
- Light/dark theme toggle
