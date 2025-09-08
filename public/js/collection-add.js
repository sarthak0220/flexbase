document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addCollectionForm');
  const steps = document.querySelectorAll('.wizard-step');
  let step = 0;

  const showStep = (n) => {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    step = n;
  };

  // Next/back buttons
  document.querySelectorAll('.btn-next').forEach(btn => btn.onclick = () => showStep(step + 1));
  document.querySelectorAll('.btn-prev').forEach(btn => btn.onclick = () => showStep(step - 1));

  // Add owner fields dynamically
  document.getElementById('addOwnerBtn').onclick = () => {
    const container = document.getElementById('owners-container');
    const n = container.children.length;
    container.innerHTML +=
      `<div class="owner-block">
        <input type="text" name="prevOwnerIds" placeholder="Username or ID" required />
        <input type="date" name="prevFrom" placeholder="From" required />
        <input type="date" name="prevTo" placeholder="To" required />
        <button type="button" onclick="this.parentNode.remove()">Remove</button>
      </div>`;
  };

  // Image preview
  document.getElementById('images').addEventListener('change', function() {
    const files = Array.from(this.files);
    const container = document.getElementById('imagePreview');
    container.innerHTML = '';
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.width = 90;
        img.style.margin = '6px';
        container.appendChild(img);
      };
      reader.readAsDataURL(f);
    });
  });

  // Form submit
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/collections/add', {
        method: 'POST',
        body: fd,
        credentials: 'include'
      });
      const result = await res.json();
      toastMessage(result.success ? 'Shoe added to your collection!' : result.message);
      if(result.success) setTimeout(() => window.location.href = '/profile', 1800);
    } catch {
      toastMessage('Upload failed.');
    }
  };

  function toastMessage(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
});
