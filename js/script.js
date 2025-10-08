const colorPairs = [
    ['999999', 'FFFFFF'],
    ['303030', '000000'],
    ['353535', '212121'],
    ['C4C4C4', 'C4C4C4'],
    ['8300FF', '623091'],
    ['8300FF', '8300FF'],
    ['D200A4', '6C0054'],
    ['FF00DA', '82006F'],
    ['116200', '0A3A01'],
    ['15FF00', '0C8E00'],
    ['0EAA00', '0B8000'],
    ['FFEA00', '998C00'],
    ['FFAE00', '996900'],
    ['5BE6BF', '33806A'],
    ['608EE4', '354E7E'],
    ['0900FF', '050099'],
    ['573500', 'BD7400'],
    ['FF7BB5', 'FF5DA4'],
    ['DE0004', '990A0D']
];

function setRandomOverlayBackground() {
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    const [centerColor, edgeColor] = colorPairs[randomIndex];
    const overlay = document.querySelector('.overlay');
    overlay.style.background = `radial-gradient(circle at center, #${centerColor} 0%, #${edgeColor} 100%)`;
}

window.onload = () => {
    setRandomOverlayBackground();
    const overlayImage = document.querySelector('.overlay-image');
    overlayImage.classList.add('play-on-load');
    overlayImage.addEventListener('animationend', () => {
        overlayImage.classList.remove('play-on-load');
    }, { once: true });

    overlayImage.addEventListener('mouseenter', () => {
        if (!overlayImage.classList.contains('animate-on-hover')) {
            overlayImage.classList.add('animate-on-hover');
        }
    });

    overlayImage.addEventListener('animationend', () => {
        overlayImage.classList.remove('animate-on-hover');
    });
};
