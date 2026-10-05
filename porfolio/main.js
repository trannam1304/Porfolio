document.addEventListener("DOMContentLoaded", () => {
  // 1. Click to Copy kèm Toast Notification
  const copyElements = document.querySelectorAll('.contact-copy');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  copyElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      const textToCopy = el.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
  });

  // 2. Lọc thẻ dự án theo danh mục (Project Filter)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 3. Hiệu ứng cuộn mượt & Active Navigation
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // 4. Modal xem chi tiết dự án (Project Quick View)
  const projectCards = document.querySelectorAll('.project-card');
  const modalContainer = document.getElementById('modal-container');

  function openModal(title, desc) {
    modalContainer.innerHTML = `
      <div class="project-modal-overlay"></div>
      <div class="project-modal-content">
        <button class="close-modal">&times;</button>
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="btn-accent mt-3 p-2 px-3 border-0 rounded" style="font-weight: 600;">Explore Project</button>
      </div>
    `;
    modalContainer.classList.remove('hidden');
    document.body.classList.add('no-scroll');

    // Event listeners for closing
    modalContainer.querySelector('.close-modal').addEventListener('click', closeModal);
    modalContainer.querySelector('.project-modal-overlay').addEventListener('click', closeModal);
  }

  function closeModal() {
    modalContainer.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeModal();
    }
  });

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || card.querySelector('h3').innerText;
      const desc = card.getAttribute('data-desc') || card.querySelector('p').innerText;
      openModal(title, desc);
    });
    // Make card look clickable
    card.style.cursor = 'pointer';
  });

  // 5. Hiệu ứng gõ chữ tự động (Typing Effect)
  const roles = ["Student, Developer & Runner", "Full-stack Developer", "Tech Enthusiast", "Continuous Learner"];
  const typeWriterElement = document.getElementById('typewriter');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typeWriterElement.innerText = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeWriterElement.innerText = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typeWriterElement) {
    typeEffect();
  }
});
