document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('streamKeyBtn').addEventListener('click', function () {
        document.getElementById('contentText').textContent = actualContent
    })

    document.getElementById('copyContentBtn').addEventListener('click', function () {
        
        const contentTextValue = actualContent
        navigator.clipboard.writeText(contentTextValue).then(() => {
            alert('內容已複製')
        }).catch(err => {
            console.error('複製失敗', err)
        })
    })
})