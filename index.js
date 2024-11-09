const firebaseConfig = {
    apiKey: "AIzaSyCCoSZXh-GdVLZdEoZTnWmIdcjSbhl94yY",
    authDomain: "newtw-e7c70.firebaseapp.com",
    projectId: "newtw-e7c70",
    storageBucket: "newtw-e7c70.firebasestorage.app",
    messagingSenderId: "565260065075",
    appId: "1:565260065075:web:fc692f5a8abc9071ca4646",
    measurementId: "G-75P4L5P7DX"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// 將這些變量聲明為全局變量
let postContent, charCount, submitButton, postMedia, mediaPreview;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化全局變量
    postContent = document.getElementById('postContent');
    charCount = document.getElementById('charCount');
    submitButton = document.getElementById('submitButton');
    postMedia = document.getElementById('postMedia');
    mediaPreview = document.getElementById('mediaPreview');

    // 添加事件監聽器
    if (postContent) {
        postContent.addEventListener('input', updateCharCount);
    }

    // 添加表單提交事件監聽器
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handleSubmit);
    }
});

function updateCharCount() {
    const currentLength = postContent.value.length;
    charCount.textContent = `已輸入 ${currentLength} 字`;
    
    if (currentLength < 3) {
        charCount.classList.add('text-red-400');
    } else {
        charCount.classList.remove('text-red-400');
    }
}

// 將提交處理函數分離出來
async function handleSubmit(e) {
    e.preventDefault();
    
    const content = postContent.value;
    
    if (content.trim().length < 3) {
        alert('請輸入至少3個字');
        return;
    }
    
    submitButton.innerHTML = '<div class="spinner mx-auto"></div>';
    submitButton.disabled = true;
    
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;
        
        const mediaUrls = [];

        const postData = {
            content: content,
            mediaUrls: mediaUrls,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ipAddress: ipAddress,
            status: 'pending',
            createdDate: new Date().toISOString(),
            replyCount: 0,
            isReply: false
        };

        // 創建新貼文
        await db.collection('posts').add(postData);

        // 重置表單
        postContent.value = '';
        mediaPreview.innerHTML = '';
        charCount.textContent = '已輸入 0 字';
        
        submitButton.innerHTML = `
            <span>發布成功</span>
            <svg class="h-8 w-8 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
        `;
        
        setTimeout(() => {
            submitButton.innerHTML = `
                <span>發布貼文</span>
                <svg class="h-8 w-8 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            `;
            submitButton.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        submitButton.innerHTML = `
            <span>發布失敗</span>
            <svg class="h-8 w-8 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        `;
        setTimeout(() => {
            submitButton.innerHTML = `
                <span>發布貼文</span>
                <svg class="h-8 w-8 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            `;
            submitButton.disabled = false;
        }, 2000);
    }
}

// 生成星星的函數
function createStars() {
    const container = document.getElementById('starsContainer');
    const starCount = 150; // 增加星星數量

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const left = Math.random() * 100;
        star.style.left = `${left}%`;
        
        const size = Math.random() * 4;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        const duration = 4 + Math.random() * 8;
        star.style.setProperty('--duration', `${duration}s`);
        
        const delay = Math.random() * 5;
        star.style.animationDelay = `${delay}s`;
        
        container.appendChild(star);
    }
}

window.addEventListener('load', createStars);