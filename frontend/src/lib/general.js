export function getRandomColor () {
        const signs = '0123456789abcdef';
        let color = '#';
        for (let i = 0; i < 6; i++) color += signs[Math.floor(Math.random() * 16)];
        return color;
};
