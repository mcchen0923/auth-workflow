
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video')
    const placeholder = document.getElementById('placeholder')
    
    fetch(`/api/user/${username}/live-status`)
        .then(response => response.json())
        .then(data => {
            if (data.live) {
                const liveStatusDiv = document.getElementById('live-status')
                const liveIcon = document.createElement('img')
                liveIcon.src = '/images/live.png'
                liveIcon.alt = 'Live'
                liveIcon.className = 'live-icon'
                liveStatusDiv.appendChild(liveIcon)
                fetch(`/stream/${username}`)
                .then(response => response.json())
                .then(data => {
                    const videoSrc = data.streamUrl
                    const video = document.getElementById('video')
                    video.muted = true

                    if (Hls.isSupported()) {
                        const hls = new Hls()
                        hls.loadSource(videoSrc)
                        hls.attachMedia(video)
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            setTimeout(() => {
                                video.play().catch(error => {
                                    console.log('Playback error:', error)
                                })
                            }, 1000)
                            
                        })
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = videoSrc
                        video.addEventListener('loadedmetadata', function () {
                            setTimeout(() => {
                                video.play().catch(error => {
                                    console.log('Playback error:', error)
                                })
                            }, 1000)
                            
                        })
                    }
                    video.style.display = 'block'
                    placeholder.style.display = 'none'
                })
                .catch(err => {
                    console.error('Error fetching stream URL:', err)
                })
            }
            else {
                video.style.display = 'none' 
                placeholder.style.display = 'block'
                placeholder.src = '/images/default.png'
            }
        })
        .catch(error => console.error('Error fetching live status:', error))
})
