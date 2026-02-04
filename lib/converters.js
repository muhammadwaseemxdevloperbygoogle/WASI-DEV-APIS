const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

/**
 * Image to URL (Hosting on Telegra.ph)
 * @param {string} filePath 
 */
async function imageToUrl(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        const response = await axios.post('https://telegra.ph/upload', form, {
            headers: form.getHeaders()
        });
        if (response.data && response.data[0]) {
            return {
                status: true,
                creator: "Wasi Dev",
                url: 'https://telegra.ph' + response.data[0].src
            };
        }
        return { status: false, message: "Upload failed" };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

/**
 * Convert Media to Sticker (WebP)
 * Supports Image and Video
 * @param {string} inputPath 
 * @param {string} outputPath 
 * @param {boolean} isVideo 
 */
async function mediaToSticker(inputPath, outputPath, isVideo = false) {
    return new Promise((resolve, reject) => {
        if (isVideo) {
            ffmpeg(inputPath)
                .inputOptions(['-t 5'])
                .outputOptions([
                    '-vcodec libwebp',
                    '-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
                    '-loop 0',
                    '-preset default',
                    '-an',
                    '-vsync 0'
                ])
                .toFormat('webp')
                .save(outputPath)
                .on('end', () => resolve({ status: true, path: outputPath }))
                .on('error', (err) => reject({ status: false, message: err.message }));
        } else {
            sharp(inputPath)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toFile(outputPath)
                .then(() => resolve({ status: true, path: outputPath }))
                .catch(err => reject({ status: false, message: err.message }));
        }
    });
}

/**
 * Video to Audio (MP3) extraction
 * @param {string} inputPath 
 * @param {string} outputPath 
 */
async function videoToAudio(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('mp3')
            .save(outputPath)
            .on('end', () => resolve({ status: true, path: outputPath }))
            .on('error', (err) => reject({ status: false, message: err.message }));
    });
}

/**
 * PUBG Stalker (Scraping/API mirror)
 * @param {string} id 
 */
async function pubgStalk(id) {
    try {
        const apiUrl = `https://api.maher-zubair.tech/stalk/pubg?q=${encodeURIComponent(id)}`;
        const response = await axios.get(apiUrl);
        if (response.data && response.data.status === 200) {
            return {
                status: true,
                creator: "Wasi Dev",
                result: response.data.result
            };
        }
        return { status: false, message: "Player not found" };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = { imageToUrl, mediaToSticker, videoToAudio, pubgStalk };
