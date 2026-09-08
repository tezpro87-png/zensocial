document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();
});

async function fetchPosts() {
  const feedArea = document.getElementById('feedArea');
  try {
    const res = await fetch('/api/posts');
    const posts = await res.json();

    if (!posts || posts.length === 0) {
      feedArea.innerHTML = `<div style="text-align:center; padding: 40px; color: #a8a8a8;">No posts yet.</div>`;
      return;
    }

    feedArea.innerHTML = posts.map(post => `
      <div class="post-card">
        <div class="post-header">
          <div class="post-user">
            <div class="post-user-avatar">
              <img src="${post.userPic}" alt="avatar">
            </div>
            <span class="post-user-name">${post.username}</span>
          </div>
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        <img src="${post.postImg}" class="post-media" alt="post">
        <div class="post-actions">
          <div class="post-actions-left">
            <i class="fa-regular fa-heart"></i>
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-paper-plane"></i>
          </div>
          <i class="fa-regular fa-bookmark"></i>
        </div>
        <div class="post-likes">${post.likes} likes</div>
        <div class="post-caption"><span>${post.username}</span> ${post.caption}</div>
      </div>
    `).join('');
  } catch (err) {
    feedArea.innerHTML = `<div style="text-align:center; padding: 40px; color: #ff5555;">Error loading feed. Reload page.</div>`;
  }
}
