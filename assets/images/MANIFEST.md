# Image Manifest

Maps every original Weebly image to its local source and generated web-ready variants.
Use during Phase 3 to rewrite `<img>` and `<picture>` references.

Notes:

- Source-Weebly URLs have all query-string cache busters stripped.
- All band-photo originals were saved as the `_orig` (full-resolution) variants where the live site offered both.
- Social icons are the `_3` Weebly variant set (the one used in the live footer); the `_1`, `_2`, `_4`, `_5`, `_7` style alternates were dropped.
- The build script never upscales: variants are clamped to the source's native width and the **actual** output width appears in each filename. Sources ≥ 1100 px get four variants; smaller sources collapse to three.
- Where a page heading PNG and a same-named root-level `_orig` PNG both existed (e.g. `editor/2.png` vs `2_orig.png`), only the root-level `_orig` was downloaded.

| Original Weebly URL | Local original | Web-ready variants (assets/images/) |
| --- | --- | --- |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/wild-animal-1_orig.png | `_originals/logo.png` | `logo-400.webp`, `logo-800.webp`, `logo-1312.webp`, `logo-1312.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/wild-animal-2-1_orig.png | `_originals/wordmark-home.png` | `wordmark-home-400.webp`, `wordmark-home-800.webp`, `wordmark-home-1312.webp`, `wordmark-home-1312.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/published/wild-animal-2-1_1.png | `_originals/wordmark-musings.png` | `wordmark-musings-400.webp`, `wordmark-musings-800.webp`, `wordmark-musings-1309.webp`, `wordmark-musings-1309.png` |
| Marie 2025 | `_originals/heading-about.png` | `heading-about-400.webp`, `heading-about-800.webp`, `heading-about-1280.webp`, `heading-about-1280.png` |
| Marie 2025 | `_originals/heading-music.png` | `heading-music-400.webp`, `heading-music-800.webp`, `heading-music-1280.webp`, `heading-music-1280.png` |
| Marie 2025 | `_originals/heading-live.png` | `heading-live-400.webp`, `heading-live-800.webp`, `heading-live-1280.webp`, `heading-live-1280.png` |
| Marie 2025 | `_originals/heading-lyrics.png` | `heading-lyrics-400.webp`, `heading-lyrics-800.webp`, `heading-lyrics-1280.webp`, `heading-lyrics-1280.png` |
| Marie 2025 | `_originals/heading-contact.png` | `heading-contact-400.webp`, `heading-contact-800.webp`, `heading-contact-1280.webp`, `heading-contact-1280.png` |
| Marie 2025 | `_originals/heading-musings.png` | `heading-musings-400.webp`, `heading-musings-800.webp`, `heading-musings-1280.webp`, `heading-musings-1280.png` |
| Marie 2025 | `_originals/heading-magisches-theater.png` | `heading-magisches-theater-400.webp`, `heading-magisches-theater-800.webp`, `heading-magisches-theater-1280.webp`, `heading-magisches-theater-1280.png` |
| Marie 2025 | `_originals/heading-self-titled2025.png` | `heading-self-titled2025-400.webp`, `heading-self-titled2025-800.webp`, `heading-self-titled2025-1280.webp`, `heading-self-titled2025-1280.png` |
| Marie 2025 | `_originals/heading-about-de.png` | `heading-about-de-400.webp`, `heading-about-de-800.webp`, `heading-about-de-1280.webp`, `heading-about-de-1280.png` |
| Marie 2025 | `_originals/heading-music-de.png` | `heading-music-de-400.webp`, `heading-music-de-800.webp`, `heading-music-de-1280.webp`, `heading-music-de-1280.png` |
| Marie 2025 | `_originals/heading-contact-de.png` | `heading-contact-de-400.webp`, `heading-contact-de-800.webp`, `heading-contact-de-1280.webp`, `heading-contact-de-1280.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/44-eja-4716-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-01.jpg` | `band-photo-01-400.webp`, `band-photo-01-800.webp`, `band-photo-01-1100.webp`, `band-photo-01-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/335-eja-5323-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-02.jpg` | `band-photo-02-400.webp`, `band-photo-02-800.webp`, `band-photo-02-1100.webp`, `band-photo-02-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/144-eja-4913-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-03.jpg` | `band-photo-03-400.webp`, `band-photo-03-800.webp`, `band-photo-03-1100.webp`, `band-photo-03-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/1-eja-4623-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-04.jpg` | `band-photo-04-400.webp`, `band-photo-04-800.webp`, `band-photo-04-1100.webp`, `band-photo-04-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/101-eja-4817-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-05.jpg` | `band-photo-05-400.webp`, `band-photo-05-800.webp`, `band-photo-05-1100.webp`, `band-photo-05-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/230-eja-5101-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-06.jpg` | `band-photo-06-400.webp`, `band-photo-06-800.webp`, `band-photo-06-1100.webp`, `band-photo-06-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/abe1e0b7-6d69-44d9-953f-c8348dceec3b_orig.jpg | `_originals/band-photo-07.jpg` | `band-photo-07-400.webp`, `band-photo-07-800.webp`, `band-photo-07-1065.webp`, `band-photo-07-1065.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/151-eja-4931-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-08.jpg` | `band-photo-08-400.webp`, `band-photo-08-800.webp`, `band-photo-08-1100.webp`, `band-photo-08-1100.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/307-eja-5265-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-09.jpg` | `band-photo-09-400.webp`, `band-photo-09-800.webp`, `band-photo-09-1065.webp`, `band-photo-09-1065.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/301-eja-5252-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-10.jpg` | `band-photo-10-400.webp`, `band-photo-10-800.webp`, `band-photo-10-1065.webp`, `band-photo-10-1065.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/57-eja-4737-ejafoto-com-marie-john-30-11-2025_orig.jpg | `_originals/band-photo-contact.jpg` | `band-photo-contact-400.webp`, `band-photo-contact-800.webp`, `band-photo-contact-1065.webp`, `band-photo-contact-1065.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/background-images/445896950.jpg | `_originals/band-photo-home.jpg` | `band-photo-home-400.webp`, `band-photo-home-800.webp`, `band-photo-home-1600.webp`, `band-photo-home-1600.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/wa-child-cover-final_orig.jpg | `_originals/album-cover-2025.jpg` | `album-cover-2025-400.webp`, `album-cover-2025-800.webp`, `album-cover-2025-800.jpg` |
| Marie 2025 | `_originals/album-cover-2024.png` | `album-cover-2024-400.webp`, `album-cover-2024-800.webp`, `album-cover-2024-1215.webp`, `album-cover-2024-1215.png` |
| Wild Animal — Acoustic cover (2020) | `_originals/album-cover-2020.jpg` | `album-cover-2020-400.webp`, `album-cover-2020-800.webp`, `album-cover-2020-1600.webp`, `album-cover-2020-1600.jpg` |
| Wild Animal — Self-Titled cover (2019) | `_originals/album-cover-2019.jpg` | `album-cover-2019-400.webp`, `album-cover-2019-800.webp`, `album-cover-2019-1600.webp`, `album-cover-2019-1600.jpg` |
| Wild Animal — Neither Predator Nor Prey cover (2016) | `_originals/album-cover-2016.jpg` | `album-cover-2016-400.webp`, `album-cover-2016-800.webp`, `album-cover-2016-1600.webp`, `album-cover-2016-1600.jpg` |
| John 2025 (About page wallpaper) | `_originals/about-wallpaper.jpg` | `about-wallpaper-400.webp`, `about-wallpaper-800.webp`, `about-wallpaper-906.webp`, `about-wallpaper-906.jpg` |
| Marie 2025 (Music page wallpaper) | `_originals/music-wallpaper.jpg` | `music-wallpaper-400.webp`, `music-wallpaper-800.webp`, `music-wallpaper-1414.webp`, `music-wallpaper-1414.jpg` |
| Marie 2025 (Live page wallpaper) | `_originals/live-wallpaper.jpg` | `live-wallpaper-400.webp`, `live-wallpaper-800.webp`, `live-wallpaper-1414.webp`, `live-wallpaper-1414.jpg` |
| Marie 2025 (Lyrics index wallpaper; from `Lyrics_Neu.png`) | `_originals/lyrics-wallpaper.jpg` | `lyrics-wallpaper-400.webp`, `lyrics-wallpaper-800.webp`, `lyrics-wallpaper-1414.webp`, `lyrics-wallpaper-1414.jpg` |
| Marie 2025 (Musings index wallpaper; from `Musings_Neu2.png`) | `_originals/musings-wallpaper.jpg` | `musings-wallpaper-400.webp`, `musings-wallpaper-800.webp`, `musings-wallpaper-1414.webp`, `musings-wallpaper-1414.jpg` |
| Marie 2025 (Contact page wallpaper; from `Contact.png`) | `_originals/contact-wallpaper.jpg` | `contact-wallpaper-400.webp`, `contact-wallpaper-800.webp`, `contact-wallpaper-1414.webp`, `contact-wallpaper-1414.jpg` |
| Marie 2025 (Acoustic lyrics-page wallpaper; from `Acoustic.png`) | `_originals/acoustic-wallpaper.jpg` | `acoustic-wallpaper-400.webp`, `acoustic-wallpaper-800.webp`, `acoustic-wallpaper-1414.webp`, `acoustic-wallpaper-1414.jpg` |
| Marie 2025 (Self-titled 2025 "Child" wallpaper — release + lyrics pages; from `Child_Background.png`) | `_originals/child-wallpaper.jpg` | `child-wallpaper-400.webp`, `child-wallpaper-800.webp`, `child-wallpaper-1414.webp`, `child-wallpaper-1414.jpg` |
| Marie 2025 (Magisches Theater wallpaper — release + lyrics pages; from `MagischesTheater_background.png`) | `_originals/magisches-theater-wallpaper.jpg` | `magisches-theater-wallpaper-400.webp`, `magisches-theater-wallpaper-800.webp`, `magisches-theater-wallpaper-1414.webp`, `magisches-theater-wallpaper-1414.jpg` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/20_orig.png | `_originals/self-titled-photo-20.png` | `self-titled-photo-20-400.webp`, `self-titled-photo-20-800.webp`, `self-titled-photo-20-1080.webp`, `self-titled-photo-20-1080.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/18_orig.png | `_originals/self-titled-photo-18.png` | `self-titled-photo-18-400.webp`, `self-titled-photo-18-800.webp`, `self-titled-photo-18-1080.webp`, `self-titled-photo-18-1080.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/insa_3.png | `_originals/social-instagram.png` | `social-instagram-400.webp`, `social-instagram-800.webp`, `social-instagram-800.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/spoti_3.png | `_originals/social-spotify.png` | `social-spotify-400.webp`, `social-spotify-800.webp`, `social-spotify-800.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/bc_3.png | `_originals/social-bandcamp.png` | `social-bandcamp-400.webp`, `social-bandcamp-800.webp`, `social-bandcamp-800.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/fb_3.png | `_originals/social-facebook.png` | `social-facebook-400.webp`, `social-facebook-800.webp`, `social-facebook-800.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/5_3.png | `_originals/social-youtube.png` | `social-youtube-400.webp`, `social-youtube-800.webp`, `social-youtube-800.png` |
| https://www.wildanimalmusic.com/uploads/1/3/0/7/130754475/9_3.png | `_originals/social-soundcloud.png` | `social-soundcloud-400.webp`, `social-soundcloud-800.webp`, `social-soundcloud-800.png` |
| Marie 2025 | `_originals/mt-single-green-fields.png` | `mt-single-green-fields-400.webp`, `mt-single-green-fields-800.webp`, `mt-single-green-fields-1600.webp`, `mt-single-green-fields-1600.png` |
| Marie 2025 | `_originals/mt-single-jungle.png` | `mt-single-jungle-400.webp`, `mt-single-jungle-800.webp`, `mt-single-jungle-1600.webp`, `mt-single-jungle-1600.png` |
| Marie 2025 | `_originals/mt-single-silence.png` | `mt-single-silence-400.webp`, `mt-single-silence-800.webp`, `mt-single-silence-1600.webp`, `mt-single-silence-1600.png` |
| Marie 2025 | `_originals/mt-single-its-chaos.png` | `mt-single-its-chaos-400.webp`, `mt-single-its-chaos-800.webp`, `mt-single-its-chaos-1600.webp`, `mt-single-its-chaos-1600.png` |
| Marie 2025 | `_originals/mt-single-shuree.png` | `mt-single-shuree-400.webp`, `mt-single-shuree-800.webp`, `mt-single-shuree-1600.webp`, `mt-single-shuree-1600.png` |
