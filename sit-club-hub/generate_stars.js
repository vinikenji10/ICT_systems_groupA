const generateShadows = (n, color) => {
  let shadows = [];
  for (let i = 0; i < n; i++) {
    shadows.push(`${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px ${color}`);
  }
  return shadows.join(', ');
};

const css = `
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
`;
const fs = require('fs');
fs.writeFileSync('stars.css', css);
console.log('stars.css generated');
