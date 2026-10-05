const messageEl = document.getElementById('message');
const form = document.getElementById('post-form');
const authorSelect = document.getElementById('author');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const tagsInput = document.getElementById('tags');
const submitButton = document.getElementById('submit-button');
const tagFilter = document.getElementById('tag-filter');
const postsList = document.getElementById('posts');

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = type;
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = '';
}

async function request(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Could not reach the server.');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

function fillSelect(select, firstLabel, items, getValue, getLabel) {
  select.replaceChildren(new Option(firstLabel, ''));
  for (const item of items) {
    select.append(new Option(getLabel(item), getValue(item)));
  }
}

async function loadUsers() {
  try {
    const users = await request('/api/users');
    fillSelect(authorSelect, 'Select an author', users, u => String(u.id), u => u.name);
  } catch (err) {
    showMessage(`Could not load authors: ${err.message}`, 'error');
  }
}

async function loadTags() {
  const selected = tagFilter.value;
  try {
    const tags = await request('/api/tags');
    fillSelect(tagFilter, 'All tags', tags, t => t.name, t => t.name);
    tagFilter.value = tags.some(t => t.name === selected) ? selected : '';
  } catch (err) {
    showMessage(`Could not load tags: ${err.message}`, 'error');
  }
}

function renderPost(post) {
  const li = document.createElement('li');

  const title = document.createElement('h3');
  title.className = 'post-title';
  title.textContent = post.title;

  const meta = document.createElement('p');
  meta.className = 'post-meta';
  const date = new Date(post.created_at).toLocaleString();
  meta.textContent = `by ${post.author} · ${date}`;

  const content = document.createElement('p');
  content.className = 'post-content';
  content.textContent = post.content;

  li.append(title, meta, content);

  if (post.tags.length > 0) {
    const tagList = document.createElement('ul');
    tagList.className = 'tags';
    tagList.setAttribute('aria-label', 'Tags');
    for (const tag of post.tags) {
      const tagItem = document.createElement('li');
      tagItem.textContent = tag;
      tagList.append(tagItem);
    }
    li.append(tagList);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'danger';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deletePost(post, deleteButton));
  li.append(deleteButton);

  return li;
}

function showEmptyState() {
  const tag = tagFilter.value;
  const empty = document.createElement('li');
  empty.className = 'empty';
  empty.textContent = tag ? `No posts tagged "${tag}".` : 'No posts yet. Create the first one above.';
  postsList.replaceChildren(empty);
}

async function loadPosts() {
  const tag = tagFilter.value;
  const url = tag ? `/api/posts?tag=${encodeURIComponent(tag)}` : '/api/posts';
  try {
    const posts = await request(url);
    if (posts.length === 0) {
      showEmptyState();
    } else {
      postsList.replaceChildren(...posts.map(renderPost));
    }
  } catch (err) {
    showMessage(`Could not load posts: ${err.message}`, 'error');
  }
}

async function refresh() {
  await loadTags();
  await loadPosts();
}

async function deletePost(post, button) {
  if (!confirm(`Delete "${post.title}"?`)) return;
  button.disabled = true;
  clearMessage();
  try {
    await request(`/api/posts/${post.id}`, { method: 'DELETE' });
    // The server confirmed the delete, so update the list locally.
    // Tags are never deleted with their posts, so the tag dropdown stays as is.
    button.closest('li').remove();
    if (postsList.children.length === 0) showEmptyState();
    showMessage('Post deleted.', 'success');
  } catch (err) {
    showMessage(err.message, 'error');
    button.disabled = false;
  }
}

function parseTags(text) {
  return text.split(',').map(t => t.trim()).filter(t => t !== '');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  submitButton.disabled = true;
  try {
    await request('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: Number(authorSelect.value),
        title: titleInput.value,
        content: contentInput.value,
        tags: parseTags(tagsInput.value),
      }),
    });
    form.reset();
    showMessage('Post created.', 'success');
    await refresh();
  } catch (err) {
    showMessage(err.message, 'error');
  } finally {
    submitButton.disabled = false;
  }
});

tagFilter.addEventListener('change', () => {
  clearMessage();
  loadPosts();
});

loadUsers();
refresh();
