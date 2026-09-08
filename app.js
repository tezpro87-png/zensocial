const $=s=>document.querySelector(s), root=$('#root');let token=localStorage.getItem('zs_token'),me=null,view='home',cache=[];
const api=async(path,opt={})=>{opt.headers={...(opt.headers||{}),...(token?{Authorization:'Bearer '+token}:{})};if(opt.body&&typeof opt.body!=='string'){opt.headers['Content-Type']='application/json';opt.body=JSON.stringify(opt.body)}const r=await fetch('/api'+path,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Something went wrong');return d};
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.append(x);setTimeout(()=>x.remove(),2200)}
function esc(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
async function boot(){if(!token)return login();try{const d=await api('/me');me=d.user;render()}catch(e){localStorage.removeItem('zs_token');token=null;login()}}
function login(){root.innerHTML=`<div class="auth"><div class="authbox glass"><div class="brand"><svg viewBox='0 0 24 24'><path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'/></svg> <span>ZenSocial</span></div><p class="muted">Premium social app • empty from day one</p><div class="tabs"><button class="tab active" id="li">Login</button><button class="tab" id="re">Register</button></div><div id="authform"></div></div></div>`;authForm('login');$('#li').onclick=()=>{authForm('login');$('#li').classList.add('active');$('#re').classList.remove('active')};$('#re').onclick=()=>{authForm('register');$('#re').classList.add('active');$('#li').classList.remove('active')}}
function authForm(mode){$('#authform').innerHTML=mode==='login'?`<input class="input" id="email" placeholder="Email"><input class="input" id="pass" type="password" placeholder="Password"><button class="primary" style="width:100%;margin-top:10px" id="go">Login</button>`:`<input class="input" id="name" placeholder="Display name"><input class="input" id="user" placeholder="Username"><input class="input" id="email" placeholder="Email"><input class="input" id="pass" type="password" placeholder="Password (6+ chars)"><button class="primary" style="width:100%;margin-top:10px" id="go">Create account</button>`;$('#go').onclick=async()=>{try{const d=mode==='login'?await api('/auth/login',{method:'POST',body:{email:$('#email').value,password:$('#pass').value}}):await api('/auth/register',{method:'POST',body:{display_name:$('#name')?.value,username:$('#user')?.value,email:$('#email').value,password:$('#pass').value}});token=d.token;localStorage.setItem('zs_token',token);me=d.user;if(d.firstUser)toast('🎉 You are the first user — Super Admin');render()}catch(e){toast(e.message)}}}
function nav(){const admin=['SUPER_ADMIN','ADMIN','MODERATOR'].includes(me.role);return `<aside class="side"><div class="brand" style="padding:10px 15px"><svg viewBox='0 0 24 24'><path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'/></svg> ZenSocial</div>${[['home','<svg viewBox='0 0 24 24'><path d='M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z'/></svg> Home'],['explore','<svg viewBox='0 0 24 24'><circle cx='11' cy='11' r='7'/><path d='M16.5 16.5L21 21'/></svg> Explore'],['reels','<svg viewBox='0 0 24 24'><rect x='4' y='3' width='16' height='18' rx='4'/><path d='M10 8l5 4-5 4z'/></svg> Reels'],['create','<svg viewBox='0 0 24 24'><path d='M12 5v14M5 12h14'/></svg> Create'],['messages','<svg viewBox='0 0 24 24'><rect x='3' y='5' width='18' height='14' rx='3'/><path d='M4 7l8 6 8-6'/></svg> Messages'],['notifications','<svg viewBox='0 0 24 24'><path d='M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7z'/></svg> Notifications'],['saved','<svg viewBox='0 0 24 24'><path d='M6 4h12v17l-6-3-6 3z'/></svg> Saved'],['profile','<svg viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 21c.8-4 3.5-6 8-6s7.2 2 8 6'/></svg> Profile'],['settings','<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M19 13.5l2 1.2-2 3.4-2.1-1.2a8 8 0 0 1-2.4 1.4V21h-4v-2.7a8 8 0 0 1-2.4-1.4L6 18.1 4 14.7l2-1.2a8 8 0 0 1 0-3L4 9.3 6 5.9l2.1 1.2A8 8 0 0 1 10.5 5V3h4v2a8 8 0 0 1 2.4 2.1L19 5.9l2 3.4-2 1.2a8 8 0 0 1 0 3z'/></svg> Settings'],...(admin?[['admin','▤ Admin Panel']]:[])].map(x=>`<button class="navbtn ${view===x[0]?'active':''}" onclick="go('${x[0]}')">${x[1]}</button>`).join('')}<button class="navbtn" onclick="logout()"><svg viewBox='0 0 24 24'><path d='M10 17l5-5-5-5M15 12H3M21 4v16'/></svg> Logout</button></aside>`}
function render(){root.innerHTML=`<div class="app"><header class="top"><div class="brand"><svg viewBox='0 0 24 24'><path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'/></svg> <span>ZenSocial</span></div><div class="spacer"></div><button class="icon" onclick="go('explore')"><svg viewBox='0 0 24 24'><circle cx='11' cy='11' r='7'/><path d='M16.5 16.5L21 21'/></svg></button><button class="icon" onclick="go('notifications')"><svg viewBox='0 0 24 24'><path d='M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7z'/></svg></button><button class="icon" onclick="go('profile')"><svg viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 21c.8-4 3.5-6 8-6s7.2 2 8 6'/></svg></button></header><div class="shell">${nav()}<main class="main" id="main"></main><aside class="right"><div class="card glass"><b>Zen Mode</b><p class="muted small">Reduce distractions with one tap.</p><button class="primary" onclick="toggleZen()">${'Open Zen Controls'}</button></div></aside></div><nav class="bottom">${[['home','<svg viewBox='0 0 24 24'><path d='M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z'/></svg>'],['explore','<svg viewBox='0 0 24 24'><circle cx='11' cy='11' r='7'/><path d='M16.5 16.5L21 21'/></svg>'],['create','<svg viewBox='0 0 24 24'><path d='M12 5v14M5 12h14'/></svg>'],['reels','<svg viewBox='0 0 24 24'><rect x='4' y='3' width='16' height='18' rx='4'/><path d='M10 8l5 4-5 4z'/></svg>'],['profile','<svg viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 21c.8-4 3.5-6 8-6s7.2 2 8 6'/></svg>']].map(x=>`<button onclick="go('${x[0]}')">${x[1]}</button>`).join('')}</nav></div>`;loadView()}
window.go=async v=>{view=v;render()};window.logout=()=>{localStorage.removeItem('zs_token');token=null;me=null;login()};
async function loadView(){try{if(view==='home')return home();if(view==='explore')return explore();if(view==='reels')return reels();if(view==='create')return create();if(view==='profile')return profile(me.id);if(view==='settings')return settings();if(view==='saved')return saved();if(view==='notifications')return notifications();if(view==='messages')return messages();if(view==='admin')return adminPanel()}catch(e){$('#main').innerHTML=`<div class="card glass"><b>Error</b><p>${esc(e.message)}</p></div>`}}
function postCard(p){const avatar=p.user.avatar?`<img class="avatar" src="${p.user.avatar}">`:`<div class="avatar">${esc((p.user.display_name||p.user.username)[0].toUpperCase())}</div>`;let media=p.media_url?(p.media_type==='video'?`<video class="media" src="${p.media_url}" controls></video>`:`<img class="media" src="${p.media_url}">`):'';return `<article class="card glass"><div class="posthead">${avatar}<div><b>${esc(p.user.display_name||p.user.username)} ${p.user.verified?'✓':''}</b><div class="muted small">@${esc(p.user.username)}</div></div><div class="spacer"></div><button onclick="reportPost(${p.id})">•••</button></div>${media}<p>${esc(p.caption)}</p><div class="actions"><button onclick="likePost(${p.id})">${p.liked?'♥':'<svg viewBox='0 0 24 24'><path d='M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7z'/></svg>'} ${p.likes}</button><button onclick="comments(${p.id})">💬 ${p.comments}</button><button onclick="savePost(${p.id})">${p.isSaved?'<svg viewBox='0 0 24 24'><path d='M6 4h12v17l-6-3-6 3z'/></svg>':'□'}</button><button onclick="sharePost(${p.id})">↗</button></div></article>`}
async function stories(){
  const rows=await api('/stories');
  return `<div class="stories-bar glass">
    <button class="story-add" onclick="addStory()">
      <span class="story-ring">+</span><small>Add Story</small>
    </button>
    ${rows.map(x=>`<button class="story-item" onclick="viewStory(${x.id})">
      <span class="story-ring">${esc((x.username||'?')[0].toUpperCase())}</span>
      <small>@${esc(x.username||'user')}</small>
    </button>`).join('')}
  </div>`;
}

window.addStory=async()=>{
  const input=document.createElement('input');
  input.type='file';
  input.accept='image/*,video/*';
  input.onchange=async()=>{
    const f=input.files[0];
    if(!f)return;
    try{
      const fd=new FormData();
      fd.append('media',f);
      const r=await fetch('/api/upload',{
        method:'POST',
        headers:{Authorization:'Bearer '+token},
        body:fd
      });
      const d=await r.json();
      if(!r.ok)throw Error(d.error||'Upload failed');
      await api('/stories',{
        method:'POST',
        body:{media_url:d.url,media_type:d.type}
      });
      toast('Story added');
      loadView();
    }catch(e){toast(e.message)}
  };
  input.click();
};

window.viewStory=async id=>{
  const rows=await api('/stories');
  const x=rows.find(s=>s.id===id);
  if(!x)return;
  const media=x.media_type==='video'
    ? `<video src="${x.media_url}" controls autoplay style="max-width:100%;max-height:70vh;border-radius:18px"></video>`
    : `<img src="${x.media_url}" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:18px">`;
  const box=document.createElement('div');
  box.className='story-viewer';
  box.innerHTML=`<div class="story-modal glass">
    <button class="story-close" onclick="this.closest('.story-viewer').remove()">×</button>
    <div class="muted">@${esc(x.username||'user')}</div>
    ${media}
  </div>`;
  document.body.append(box);
};

async function home(){const storyBar=await stories();const rows=await api('/feed');$('#main').innerHTML=storyBar+`<div class="between"><div><h2>Home</h2><p class="muted">Your feed</p></div><button class="primary" onclick="go('create')"><svg viewBox='0 0 24 24'><path d='M12 5v14M5 12h14'/></svg> Create</button></div>${rows.length?rows.map(postCard).join(''):`<div class="card glass" style="text-align:center;padding:45px 20px"><div style="font-size:45px">◌</div><h3>Your feed is empty</h3><p class="muted">Follow people to see their posts. There are no pre-created users or posts.</p><button class="primary" onclick="go('explore')">Find People</button></div>`}`}
async function explore(){const q=prompt('Search users (leave blank for latest posts):')||'';if(q){const u=await api('/users?q='+encodeURIComponent(q));$('#main').innerHTML=`<h2>Search</h2>${u.map(x=>`<div class="card glass between"><div class="row"><div class="avatar">${esc((x.display_name||x.username)[0])}</div><div><b>${esc(x.display_name)}</b><div class="muted">@${esc(x.username)} • ${x.followers} followers</div></div></div><button class="primary" onclick="follow(${x.id},this)">Follow</button></div>`).join('')||'<p class="muted">No users found.</p>'}`;return}const rows=await api('/explore');$('#main').innerHTML=`<h2>Explore</h2>${rows.map(postCard).join('')||'<div class="card glass"><p class="muted">Nothing here yet.</p></div>'}`}
async function reels(){const rows=await api('/reels');$('#main').innerHTML=`<h2>Reels</h2>${rows.map(postCard).join('')||'<div class="card glass"><p class="muted">No reels yet.</p></div>'}`}
function create(){ $('#main').innerHTML=`<h2>Create</h2><div class="card glass"><textarea class="input" id="cap" rows="4" placeholder="Write a caption..."></textarea><input class="input" id="file" type="file" accept="image/*,video/*"><button class="primary" onclick="publish()">Publish</button></div>`}
window.publish=async()=>{try{let url='',type='image';const f=$('#file').files[0];if(f){const fd=new FormData();fd.append('media',f);const r=await fetch('/api/upload',{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});const d=await r.json();if(!r.ok)throw Error(d.error);url=d.url;type=d.type}await api('/posts',{method:'POST',body:{caption:$('#cap').value,media_url:url,media_type:type}});toast('Published');go('home')}catch(e){toast(e.message)}};
window.likePost=async id=>{await api('/posts/'+id+'/like',{method:'POST'});loadView()};window.savePost=async id=>{await api('/posts/'+id+'/save',{method:'POST'});loadView()};window.follow=async(id,b)=>{const d=await api('/users/'+id+'/follow',{method:'POST'});b.textContent=d.following?'Following':'Follow'};window.sharePost=id=>{navigator.clipboard?.writeText(location.origin+'/#post-'+id);toast('Post link copied')};window.reportPost=async id=>{const r=prompt('Report reason?');if(r){await api('/reports',{method:'POST',body:{target_type:'post',target_id:id,reason:r}});toast('Report submitted')}};
window.comments=async id=>{const cs=await api('/posts/'+id+'/comments');const text=prompt(cs.map(c=>c.username+': '+c.text).join('\n')||'No comments yet. Enter a new comment:');if(text) {await api('/posts/'+id+'/comments',{method:'POST',body:{text}});toast('Comment added');loadView()}};
async function profile(id){const u=await api('/users/'+id);const rows=await api('/profile/'+id+'/posts');$('#main').innerHTML=`<div class="card glass"><div class="row">${u.avatar?`<img class="avatar" src="${u.avatar}" style="width:75px;height:75px">`:`<div class="avatar" style="width:75px;height:75px">${esc((u.display_name||u.username)[0])}</div>`}<div><h2 style="margin:0">${esc(u.display_name)} ${u.verified?'✓':''}</h2><div class="muted">@${esc(u.username)}</div></div></div><p>${esc(u.bio||'')}</p><div class="stat"><div><b>${u.posts}</b><br><span class="muted">Posts</span></div><div><b>${u.followers}</b><br><span class="muted">Followers</span></div><div><b>${u.following}</b><br><span class="muted">Following</span></div></div>${id===me.id?`<button class="secondary" style="margin-top:12px" onclick="editProfile()">Edit profile</button><label class="secondary" style="display:inline-block;margin-top:12px;margin-left:8px;padding:8px 12px;cursor:pointer">📷 Change photo<input type="file" accept="image/*" style="display:none" onchange="changeAvatar(this)"></label>`:`<button class="primary" style="margin-top:12px" onclick="follow(${id},this)">Follow</button>`}</div><div class="grid">${rows.map(p=>p.media_url?(p.media_type==='video'?`<video src="${p.media_url}" controls></video>`:`<img src="${p.media_url}">`):`<div style="aspect-ratio:1;background:#eee;border-radius:12px;padding:10px">${esc(p.caption)}</div>`).join('')}</div>`}
window.editProfile=async()=>{const name=prompt('Display name',me.display_name);const bio=prompt('Bio',me.bio||'');if(name!==null){me=await api('/profile',{method:'PUT',body:{display_name:name,bio}});loadView()}};
window.changeAvatar=async input=>{const file=input.files[0];if(!file)return;try{const fd=new FormData();fd.append('media',file);const r=await fetch('/api/upload',{method:'POST',headers:token?{Authorization:'Bearer '+token}:{},body:fd});const d=await r.json();if(!r.ok)throw Error(d.error||'Upload failed');me=await api('/profile',{method:'PUT',body:{avatar:d.url}});alert('Profile photo updated!');loadView()}catch(e){alert(e.message)}};
async function saved(){const rows=await api('/saved');$('#main').innerHTML=`<h2>Saved</h2>${rows.map(postCard).join('')||'<div class="card glass">Nothing saved yet.</div>'}`}
async function notifications(){const n=await api('/notifications');await api('/notifications/read',{method:'POST'});$('#main').innerHTML=`<h2>Notifications</h2>${n.map(x=>`<div class="card glass"><b>${esc(x.type)}</b><p>${esc(x.text)}</p><span class="muted small">${x.created_at}</span></div>`).join('')||'<div class="card glass">No notifications.</div>'}`}
async function messages(){const u=await api('/users');$('#main').innerHTML=`<h2>Messages</h2><p class="muted">Choose a registered user to chat with.</p>${u.filter(x=>x.id!==me.id).map(x=>`<div class="card glass between"><span><b>${esc(x.display_name)}</b><br><span class="muted">@${esc(x.username)}</span></span><button class="primary" onclick="chat(${x.id},'${esc(x.display_name)}')">Open</button></div>`).join('')||'<div class="card glass">No other users yet.</div>'}`}
window.chat=async(id,name)=>{const msgs=await api('/messages/'+id);const t=prompt(msgs.map(m=>(m.sender_id===me.id?'You':m.username)+': '+m.text).join('\n')||'No messages yet. Enter a message:');if(t){await api('/messages/'+id,{method:'POST',body:{text:t}});toast('Sent');}messages()};
async function settings(){const s=await api('/settings');$('#main').innerHTML=`<h2>Settings</h2><div class="card glass"><h3>Appearance</h3><label>Theme <select class="input" id="theme"><option>light</option><option>dark</option><option>system</option></select></label><label>Font <select class="input" id="font"><option>Inter</option><option>Default</option><option>SF Pro</option><option>Poppins</option><option>Roboto</option><option>Google Sans</option><option>Helvetica</option></select></label><label>Emoji <select class="input" id="emoji"><option>Default</option><option>iOS 18</option><option>iOS 16</option><option>Samsung</option><option>WhatsApp</option></select></label><label>Location style <select class="input" id="loc"><option>Default</option><option>iOS</option><option>iOS 18</option></select></label><label><input type="checkbox" id="glass" ${s.glass?'checked':''}> Liquid Glass</label><hr><h3>Zen / Distraction Free</h3>${[['zen','Zen Mode'],['block_reels','Block Reels'],['block_posts','Block Posts'],['block_stories','Block Stories'],['block_explore','Block Explore'],['block_comments','Block Comments']].map(x=>`<label style="display:block;margin:10px 0"><input type="checkbox" id="${x[0]}" ${s[x[0]]?'checked':''}> ${x[1]}</label>`).join('')}<button class="primary" onclick="saveSettings()">Save settings</button></div>`;$('#theme').value=s.theme;$('#font').value=s.font;$('#emoji').value=s.emoji;$('#loc').value=s.location_style}
window.saveSettings=async()=>{const keys=['zen','block_reels','block_posts','block_stories','block_explore','block_comments'];const body={theme:$('#theme').value,font:$('#font').value,emoji:$('#emoji').value,location_style:$('#loc').value,glass:$('#glass').checked};keys.forEach(k=>body[k]=$('#'+k).checked?1:0);await api('/settings',{method:'PUT',body});toast('Settings saved');render()};window.toggleZen=()=>go('settings');
async function adminPanel(){const st=await api('/admin/stats');$('#main').innerHTML=`<h2>Admin Panel</h2><div class="stat"><div><b>${st.users}</b><br>Users</div><div><b>${st.posts}</b><br>Posts</div><div><b>${st.reports}</b><br>Open reports</div></div><div class="adminnav"><button onclick="adminUsers()">Users</button><button onclick="adminReports()">Reports</button><button onclick="adminAnnounce()">Announcement</button><button onclick="adminLogs()">Audit Logs</button></div><div class="card glass"><h3>Super Admin controls</h3><p class="muted">Manage real registered users only. No seeded users/content.</p><button class="primary" onclick="adminUsers()">Manage users</button></div>`}
window.adminUsers=async()=>{const u=await api('/admin/users');$('#main').innerHTML=`<h2>Users</h2><div class="card glass"><table class="table"><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr>${u.map(x=>`<tr><td>${esc(x.username)}<br><span class="small muted">${esc(x.email)}</span></td><td>${x.role}</td><td>${x.banned?'Banned':'Active'} ${x.verified?'✓':''}</td><td><button onclick="adminVerify(${x.id},${x.verified})">${x.verified?'Unverify':'Verify'}</button> <button onclick="adminBan(${x.id},${x.banned})" class="${x.banned?'':'danger'}">${x.banned?'Unban':'Ban'}</button></td></tr>`).join('')}</table></div>`};window.adminVerify=async(id,v)=>{await api('/admin/users/'+id,{method:'PUT',body:{verified:v?0:1}});adminUsers()};window.adminBan=async(id,v)=>{await api('/admin/users/'+id,{method:'PUT',body:{banned:v?0:1}});adminUsers()};window.adminReports=async()=>{const r=await api('/admin/reports');$('#main').innerHTML=`<h2>Reports</h2>${r.map(x=>`<div class="card glass"><b>#${x.id} ${esc(x.target_type)}</b><p>${esc(x.reason)}</p><div class="muted">by @${esc(x.reporter)} • ${x.status}</div><button class="primary" onclick="resolveReport(${x.id})">Resolve</button></div>`).join('')||'<div class="card glass">No reports.</div>'}`};window.resolveReport=async id=>{await api('/admin/reports/'+id,{method:'PUT',body:{status:'RESOLVED'}});adminReports()};window.adminAnnounce=async()=>{const t=prompt('Announcement to all users');if(t){const d=await api('/admin/announce',{method:'POST',body:{text:t}});toast('Sent to '+d.sent+' users')}};window.adminLogs=async()=>{const l=await api('/admin/logs');$('#main').innerHTML=`<h2>Audit Logs</h2>${l.map(x=>`<div class="card glass"><b>${esc(x.action)}</b><div class="muted">@${esc(x.admin)} • ${x.target_type} #${x.target_id} • ${x.created_at}</div></div>`).join('')}`};

<style id="premium-icons">
.icon svg,.navbtn svg,.bottom svg,.brand svg,.story-ring svg{
 width:21px;height:21px;fill:none;stroke:currentColor;
 stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;
 vertical-align:middle
}
.navbtn{display:flex;align-items:center;gap:12px}
.stories-bar{
 display:flex;gap:18px;overflow-x:auto;padding:16px 14px;
 margin-bottom:18px;scrollbar-width:none
}
.stories-bar::-webkit-scrollbar{display:none}
.story-item,.story-add{
 border:0;background:transparent;color:inherit;
 min-width:68px;display:flex;flex-direction:column;
 align-items:center;gap:7px;cursor:pointer
}
.story-ring{
 width:62px;height:62px;border-radius:50%;
 padding:3px;display:grid;place-items:center;
 background:linear-gradient(135deg,#ff4d8d,#8b5cf6,#22d3ee);
 box-shadow:0 5px 20px rgba(124,58,237,.22)
}
.story-ring::after{
 content:"";width:100%;height:100%;border-radius:50%;
 background:var(--card,#fff);grid-area:1/1
}
.story-ring:not(:empty){
 font-size:20px;font-weight:800
}
.story-ring{position:relative;z-index:0}
.story-ring::after{z-index:-1}
.story-add .story-ring{
 background:linear-gradient(135deg,#7c3aed,#06b6d4)
}
.story-add .story-ring::before{
 content:"";position:absolute;inset:5px;border-radius:50%;
 background:var(--card,#fff)
}
.story-add .story-ring{
 color:#7c3aed
}
.story-item small,.story-add small{
 max-width:72px;overflow:hidden;text-overflow:ellipsis;
 white-space:nowrap;font-size:11px
}
.story-viewer{
 position:fixed;inset:0;background:rgba(5,8,20,.82);
 backdrop-filter:blur(18px);z-index:9999;
 display:grid;place-items:center;padding:20px
}
.story-modal{
 width:min(430px,94vw);min-height:60vh;
 padding:18px;display:flex;flex-direction:column;
 gap:14px;align-items:center;justify-content:center
}
.story-modal img,.story-modal video{
 width:100%;max-height:70vh;object-fit:contain
}
.story-close{
 position:absolute;top:18px;right:18px;
 width:42px;height:42px;border-radius:50%;
 border:1px solid rgba(255,255,255,.25);
 background:rgba(255,255,255,.12);color:white;
 font-size:25px;cursor:pointer
}
@media(max-width:700px){
 .stories-bar{margin-left:-4px;margin-right:-4px}
 .story-ring{width:58px;height:58px}
}
</style>
boot();
