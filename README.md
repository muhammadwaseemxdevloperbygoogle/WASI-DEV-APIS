# WASI DEV APIs

A powerful, native scraping API infrastructure for WhatsApp bots and applications.

## 🚀 Features

- **TikTok** - Native video download & profile stalking
- **Pinterest** - Native search & media download
- **Instagram** - Media downloading
- **Google Search** - Web search results
- **Weather** - City weather information
- **Chatbot** - AI-powered responses
- **Media Converters** - Sticker maker, video to audio, image to URL

## 📦 Deployment to Heroku

### Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Git installed
- Heroku account

### Quick Deploy Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create a new Heroku app
heroku create your-app-name

# 3. Add FFmpeg buildpack (required for video/audio conversion)
heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git

# 4. Set environment variables
heroku config:set PORT=3000
heroku config:set CREATOR=WasiDev

# 5. Push to Heroku
git add .
git commit -m "Initial Heroku deployment"
git push heroku main
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (auto-set by Heroku) | 3000 |
| `CREATOR` | API creator name | WasiDev |

## 🔗 API Endpoints

### Stalkers
- `GET /api/stalk/github?username=...`

### Downloaders
- `GET /api/download/tiktok?url=...`
- `GET /api/download/instagram?url=...`
- `GET /api/download/pinterest?url=...`

### TikTok Tools
- `GET /api/tiktok/download?url=...`
- `GET /api/tiktok/stalk?username=...`

### Pinterest Tools
- `GET /api/search/pinterest?q=...`

### Search & AI
- `GET /api/search/google?q=...`
- `GET /api/search/weather?city=...`
- `GET /api/search/chat?message=...`

### Conversion Tools
- `POST /api/convert/tourl` (Upload image)
- `POST /api/convert/sticker` (Upload image/video)
- `POST /api/convert/toaudio` (Upload video)

### Health Check
- `GET /health`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📝 License

ISC - Created by Wasi Dev
