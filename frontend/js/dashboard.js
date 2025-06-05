const API_BASE_URL = 'http://localhost:5000/api/notes'; // URL de la API para notas


function getToken() {
  return localStorage.getItem('token');
}
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Referencias DOM
const btnNewNote = document.querySelector('.note-controls button[title="Nueva nota"]');
const btnSearch = document.querySelector('.note-controls button[title="Buscar"]');
const btnRefresh = document.querySelector('.note-controls button[title="Actualizar"]');
const noteList = document.querySelector('.note-list');

const noteModalEl = document.getElementById('noteModal');
const noteModal = new bootstrap.Modal(noteModalEl);
const noteForm = document.getElementById('noteForm');
const noteTitleInput = document.getElementById('noteTitle');
const noteBodyInput = document.getElementById('noteBody');
const noteTagInput = document.getElementById('noteTag');
const noteIdInput = document.getElementById('noteId');
const tagSelector = document.getElementById('tagSelector');

const viewNoteModalEl = document.getElementById('viewNoteModal');
const viewNoteModal = new bootstrap.Modal(viewNoteModalEl);
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

let notes = [];

const tags = [
  { name: 'Limpiar', icon: '🧹' },
  { name: 'Trabajo', icon: '💼' },
  { name: 'Dibujar', icon: '🎨' },
  { name: 'Comprar', icon: '🛒' },
  { name: 'General', icon: '📝' },
  { name: 'Amor', icon: '❤️' },
  { name: 'Lista', icon: '📋' },
  { name: 'Comida', icon: '🧀' },
  { name: 'Idea', icon: '💡' },
];

function renderTagButtons(selectedTag) {
  tagSelector.innerHTML = '';
  tags.forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-light btn-sm';
    if (tag.name.toLowerCase() === selectedTag.toLowerCase()) {
      button.classList.add('active');
    }
    button.innerHTML = `${tag.icon} ${tag.name}`;
    button.addEventListener('click', () => {
      noteTagInput.value = tag.name;
      document.querySelectorAll('#tagSelector button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
    tagSelector.appendChild(button);
  });
}

async function loadNotes(filter = '') {
  try {
    const res = await fetch(API_BASE_URL, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) throw new Error('Error cargando notas');
    notes = await res.json();

    let filtered = notes;
    if (filter.trim()) {
      filtered = notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.body.toLowerCase().includes(filter.toLowerCase()) ||
        (n.tag && n.tag.toLowerCase().includes(filter.toLowerCase()))
      );
    }

    renderNotes(filtered);
  } catch (error) {
    alert(error.message);
  }
}

function renderNotes(notesToRender) {
  noteList.innerHTML = '';
  if (notesToRender.length === 0) {
    noteList.innerHTML = '<p>No hay notas para mostrar.</p>';
    return;
  }

  notesToRender.forEach(note => {
    const tagIcon = tags.find(t => t.name.toLowerCase() === (note.tag || 'general').toLowerCase())?.icon || '📝';

    const noteEl = document.createElement('div');
    noteEl.classList.add('note', 'col-md-4', 'mb-3');
    noteEl.style.cursor = 'pointer';
    noteEl.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <strong>${note.title}</strong><br/>
          <span class="meta">Creada el ${new Date(note.date).toLocaleDateString()}</span><br/>
          <small>Etiqueta: ${tagIcon} ${note.tag || 'General'}</small>
        </div>
        <div class="card-footer d-flex justify-content-end gap-2">
          <button title="Editar" class="btn btn-sm btn-warning" data-id="${note._id}"><i class="bi bi-pencil-square"></i></button>
          <button title="Eliminar" class="btn btn-sm btn-danger" data-id="${note._id}"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;

    // Mostrar modal lectura al click en la card (pero no en botones)
    noteEl.querySelector('.card').addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // si clickeó botón editar/eliminar no abrir modal lectura
  console.log('Nota clickeada:', note);
      modalTitle.innerText = note.title;
      modalBody.innerText = note.body;
      viewNoteModal.show();
    });

    // Editar
    noteEl.querySelector('button[title="Editar"]').addEventListener('click', () => {
      noteIdInput.value = note._id;
      noteTitleInput.value = note.title;
      noteBodyInput.value = note.body;
      renderTagButtons(note.tag || 'General');
      noteModalEl.querySelector('.modal-title').textContent = 'Editar Nota';
      noteModal.show();
    });

    // Eliminar
    noteEl.querySelector('button[title="Eliminar"]').addEventListener('click', () => {
      if (confirm('¿Seguro que quieres eliminar esta nota?')) {
        deleteNote(note._id);
      }
    });

    noteList.appendChild(noteEl);
  });
}

btnNewNote.addEventListener('click', () => {
  noteForm.reset();
  noteIdInput.value = '';
  renderTagButtons('General');
  noteModalEl.querySelector('.modal-title').textContent = 'Nueva Nota';
  noteModal.show();
});

async function deleteNote(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al eliminar la nota');
    }
    await loadNotes();
  } catch (error) {
    alert(error.message);
  }
}

noteForm.addEventListener('submit', async e => {
  e.preventDefault();

  const id = noteIdInput.value;
  const data = {
    title: noteTitleInput.value.trim(),
    body: noteBodyInput.value.trim(),
    tag: noteTagInput.value.trim() || 'General',
  };


  try {
    let res;
    if (id) {
      res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      
    } else {
      res = await fetch(API_BASE_URL, {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al guardar la nota');
    }

    noteModal.hide();
    await loadNotes();

  } catch (error) {
    alert(error.message);
  }
});

btnSearch.addEventListener('click', () => {
  const filter = prompt('Buscar nota por título, contenido o etiqueta:');
  if (filter !== null) {
    loadNotes(filter);
  }
});

btnRefresh.addEventListener('click', () => {
  loadNotes();
});

window.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  const payload = parseJwt(token);
  if (payload && payload.name) {
    const welcomeDiv = document.getElementById('welcomeMessage');
    if (welcomeDiv) {
      welcomeDiv.textContent = `¡Bienvenido, ${payload.name}! 👋`;
    }
  }

  loadNotes();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/frontend/index.html'; // ajusta según estructura de carpetas
    });
  }
});
