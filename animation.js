document.addEventListener('DOMContentLoaded', () => {
  // 1. Chỉ giữ lại 2 icon
  const icons = [
    'img/icon1.png',
    'img/icon2.png'
  ];

  const css = `
    .icon-3d-container {
      width: 180px;
      height: 180px;
      margin: 5px auto;
      perspective: 1000px;
    }

    .icon {
      width: 100%;
      height: 100%;
      display: block;
      background-size: contain; 
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 0;
      box-shadow: none;
      backdrop-filter: none;
      transform-style: preserve-3d;
      /* Ban đầu hiển thị icon1, không animation */
      background-image: url('img/icon1.png');
      animation: none;
    }

    /* Class để kích hoạt animation sau khi trang đã tải xong */
    .icon.animate-3d {
      animation: flipY 12s infinite linear; 
    }

    @keyframes flipY {
      /* HIỆN ICON 1 */
      0% {
        transform: rotateY(0deg);
        background-image: url('img/icon1.png');
      }
      24.9% { background-image: url('img/icon1.png'); }

      /* CHUYỂN TIẾP (XOAY) */
      25% {
        transform: rotateY(90deg);
        background-image: url('img/icon2.png');
      }

      /* HIỆN ICON 2 */
      50% {
        transform: rotateY(180deg);
        background-image: url('img/icon2.png');
      }
      74.9% { background-image: url('img/icon2.png'); }

      /* XOAY TRỞ LẠI ICON 1 */
      75% {
        transform: rotateY(270deg);
        background-image: url('img/icon1.png');
      }

      100% {
        transform: rotateY(360deg);
        background-image: url('img/icon1.png');
      }
    }

    /* RESPONSIVE */
    @media (max-width: 480px) { 
      .icon-3d-container { 
        width: 150px;
        height: 150px; 
      } 
    }
    
    @media (min-width: 481px) and (max-width: 768px) { 
      .icon-3d-container { 
        width: 160px;
        height: 160px; 
      } 
    }
    
    @media (min-width: 769px) { 
      .icon-3d-container { 
        width: 200px;
        height: 200px; 
      } 
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Thêm một chút delay để đảm bảo icon đã hiển thị trước khi chạy animation
  setTimeout(() => {
    const iconElement = document.querySelector('.icon');
    if (iconElement) {
      iconElement.classList.add('animate-3d');
    }
  }, 500); // Delay 300ms để icon1 hiển thị trước
});