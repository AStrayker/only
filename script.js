const character = document.getElementById('character');
const leftButton = document.getElementById('left');
const jumpButton = document.getElementById('jump');
const rightButton = document.getElementById('right');

let posX = 0; // Позиция по оси X
let isJumping = false;

// Звуки
const jumpSound = new Audio('assets/jump.mp3'); // Звук прыжка
const backgroundMusic = new Audio('assets/background.mp3'); // Фоновая музыка

// Включаем фоновую музыку
backgroundMusic.loop = true; // Зацикливаем музыку
backgroundMusic.play(); // Запускаем музыку

// Создание врагов и их движение
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    
    let enemyPosX = Math.random() * (360); // Случайная позиция по оси X
    enemy.style.left = enemyPosX + 'px';
    
    document.getElementById('gameArea').appendChild(enemy);
    
    let direction = Math.random() < 0.5 ? -1 : 1; // Случайное направление движения
    
    const moveEnemy = setInterval(() => {
        enemyPosX += direction * 2; // Скорость движения врага
        
        if (enemyPosX <= 0 || enemyPosX >= 360) {
            direction *= -1; // Меняем направление при столкновении со стеной
        }
        
        enemy.style.left = enemyPosX + 'px';
        
        // Проверка на столкновение с персонажем
        if (isColliding(character, enemy)) {
            alert("Вы проиграли!"); // Обработка столкновения с врагом
            clearInterval(moveEnemy);
            enemy.remove();
        }
        
        // Удаляем врага, если он вышел за пределы экрана
        if (enemyPosX <= -40 || enemyPosX >= 440) {
            clearInterval(moveEnemy);
            enemy.remove();
        }
        
    }, 100);
}

// Проверка на столкновение между двумя элементами
function isColliding(character, enemy) {
    const charRect = character.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    
    return !(
        charRect.right < enemyRect.left ||
        charRect.left > enemyRect.right ||
        charRect.bottom < enemyRect.top ||
        charRect.top > enemyRect.bottom
    );
}

// Создаем врагов каждые 2 секунды
setInterval(createEnemy, 2000);

leftButton.addEventListener('mousedown', () => {
    const moveLeft = setInterval(() => {
        if (posX > 0) {
            posX -= 5; // Скорость движения влево
            character.style.left = posX + 'px';
        }
    }, 100);
    
    leftButton.addEventListener('mouseup', () => clearInterval(moveLeft));
});

rightButton.addEventListener('mousedown', () => {
   const moveRight = setInterval(() => {
       if (posX < 360) { // Ограничение по правой стороне
           posX += 5; // Скорость движения вправо
           character.style.left = posX + 'px';
       }
   }, 100);
   
   rightButton.addEventListener('mouseup', () => clearInterval(moveRight));
});

jumpButton.addEventListener('click', () => {
   if (!isJumping) {
       isJumping = true;
       jumpSound.play(); // Воспроизводим звук прыжка

       let jumpHeight = 0;

       const jump = setInterval(() => {
           if (jumpHeight < 100) { // Высота прыжка
               jumpHeight += 5;
               character.style.bottom = jumpHeight + 'px';
           } else {
               clearInterval(jump);
               const fall = setInterval(() => {
                   if (jumpHeight > 0) {
                       jumpHeight -= 5;
                       character.style.bottom = jumpHeight + 'px';
                   } else {
                       clearInterval(fall);
                       isJumping = false;
                   }
               }, 50);
           }
       }, 50);
   }
});

// Сохранение состояния игры в куки
window.onbeforeunload = () => {
   document.cookie = "position=" + posX + "; path=/";
};

// Восстановление состояния из куки
window.onload = () => {
   const cookies = document.cookie.split('; ');
   cookies.forEach(cookie => {
       const [name, value] = cookie.split('=');
       if (name === 'position') {
           posX = parseInt(value);
           character.style.left = posX + 'px';
       }
   });
};