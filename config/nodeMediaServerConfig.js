module.exports = {
    rtmp: {
      port: 11935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60,
      addr: '0.0.0.0',
    },
    http: {
      port: 8000,
      mediaroot: './media',
      webroot: './www',
      allow_origin: '*',
    },
    trans: {
      ffmpeg: 'C:/Users/User/Desktop/Programing/tools/ffmpeg/bin/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          hlsKeep: true,
          dash: false,
        },
      ],
    },
  }