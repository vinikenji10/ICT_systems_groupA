const fs = require('fs');

const generateShadows = (n, color) => {
  let shadows = [];
  for (let i = 0; i < n; i++) {
    shadows.push(`${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px ${color}`);
  }
  return shadows.join(', ');
};

const css = `
/* STARS ANIMATION */
#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: ${generateShadows(700, 'var(--primary)')};
  animation: animStar 50s linear infinite;
}
#stars:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: ${generateShadows(700, 'var(--primary)')};
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: ${generateShadows(200, 'var(--secondary)')};
  animation: animStar 100s linear infinite;
}
#stars2:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: ${generateShadows(200, 'var(--secondary)')};
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: ${generateShadows(100, '#FFF')};
  animation: animStar 150s linear infinite;
}
#stars3:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: ${generateShadows(100, '#FFF')};
}

@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
}

/* WAVES ANIMATION */
.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px; /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% { transform: translate3d(-90px,0,0); }
  100% { transform: translate3d(85px,0,0); }
}

@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
}
`;

fs.writeFileSync('app/animations.css', css);
console.log('app/animations.css generated');
