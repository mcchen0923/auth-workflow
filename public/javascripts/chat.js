document.addEventListener('DOMContentLoaded', () => {
    const getHostnameFromUrl = () => {
        const pathArray = window.location.pathname.split('/')
        return pathArray[pathArray.length - 1] 
    }

    const hostname = getHostnameFromUrl()

    // 連接到 Socket.IO 服務器
    const socket = io({
        query: { hostname }
    })

    const sendButton = document.getElementById('sendButton')
    const messageInput = document.getElementById('sendText')

    sendButton.addEventListener('click', () => {

        if (localuser != undefined) {
            const message = messageInput.value.trim()
            if (message) {
                socket.emit('chat message', { username: localuser, message: message })
                messageInput.value = ''
            }

        } else {
            alert('請先登入')
        }

    })

    socket.on('reveivemessage', (msg) => {
        console.log('Message from server:', msg)
        message = msg.username + ": " + msg.message
        console.log(message)
        const li = document.createElement('li')
        li.textContent = message
        const chatCon = document.getElementById('chat-con')
        chatCon.appendChild(li)
        // 讓聊天窗口自動滾動到最新訊息
        chatCon.scrollTop = chatCon.scrollHeight
    })
})
