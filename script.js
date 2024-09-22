let credits = 100; // Początkowa liczba kredytów
let stake = 10; // Początkowa stawka
const symbols = ['🍒', '🍋', '🍉', '🍇', '💎']; // Symbole owoców
const grid = document.getElementById('grid');
const creditsDisplay = document.getElementById('Kredyty');
const stakeDisplay = document.getElementById('Stawka');
const winDisplay = document.getElementById('Wygrana');
const messageDisplay = document.getElementById('message');

// Funkcje do zwiększania i zmniejszania stawki
function increaseStake() {
    stake = Math.min(stake + 10, credits);
    updateStakeDisplay();
}

function decreaseStake() {
    stake = Math.max(stake - 10, 0);
    updateStakeDisplay();
}

function updateStakeDisplay() {
    stakeDisplay.innerText = `Stawka: ${stake}`;
}

// Funkcja spin
function spin() {
    if (credits <= 0) {
        messageDisplay.innerText = 'Brak kredytów';
        messageDisplay.style.color = 'red';
        return;
    }

    credits -= stake;
    creditsDisplay.innerText = `Kredyty: ${credits}`;

    grid.innerHTML = '';
    const randomSymbols = [];

    // Generowanie symboli z szansą na 5 w linii
    for (let i = 0; i < 25; i++) {
        if (Math.random() < 0.2 && i % 5 === 0 && i < 21) { // 20% szans na 5 w linii
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            randomSymbols.push(symbol, symbol, symbol, symbol, symbol);
            i += 4;
        } else {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            randomSymbols.push(symbol);
        }
    }

    // Rysowanie symboli na planszy
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'spinning');
        cell.innerText = randomSymbols[i];
        grid.appendChild(cell);
    }

    // Sprawdzanie wygranych po 2 sekundach
    setTimeout(() => {
        checkWins(randomSymbols);
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('spinning')); // Usuwanie klasy spinning
    }, 2000);
}

// Funkcja sprawdzająca wygrane
function checkWins(randomSymbols) {
    let winCount = 0;

    // Sprawdź poziome
    for (let i = 0; i < 5; i++) {
        const line = randomSymbols.slice(i * 5, i * 5 + 5);
        if (line.every((symbol) => symbol === line[0] && symbol !== '')) {
            winCount++;
            highlightWinLine(i * 5, 'horizontal', randomSymbols[i * 5]);
        }
    }

    // Sprawdź pionowe
    for (let i = 0; i < 5; i++) {
        const line = [randomSymbols[i], randomSymbols[i + 5], randomSymbols[i + 10], randomSymbols[i + 15], randomSymbols[i + 20]];
        if (line.every((symbol) => symbol === line[0] && symbol !== '')) {
            winCount++;
            highlightWinLine(i, 'vertical', randomSymbols[i]);
        }
    }

    // Sprawdź ukośne
    const diagonal1 = [randomSymbols[0], randomSymbols[6], randomSymbols[12], randomSymbols[18], randomSymbols[24]];
    const diagonal2 = [randomSymbols[4], randomSymbols[8], randomSymbols[12], randomSymbols[16], randomSymbols[20]];
    if (diagonal1.every((symbol) => symbol === diagonal1[0] && symbol !== '')) {
        winCount++;
        highlightWinLine(0, 'diagonal1', diagonal1[0]);
    }
    if (diagonal2.every((symbol) => symbol === diagonal2[0] && symbol !== '')) {
        winCount++;
        highlightWinLine(4, 'diagonal2', diagonal2[0]);
    }

    // Przypisz wygraną
    if (winCount > 0) {
        const winAmount = winCount * stake * 5; // Przykład przelicznika
        credits += winAmount;
        creditsDisplay.innerText = `Kredyty: ${credits}`;
        winDisplay.innerText = `Wygrana: ${winAmount}`;
    } else {
        winDisplay.innerText = 'Wygrana: 0';
    }
}

// Funkcja do podświetlania wygranych linii
function highlightWinLine(startIndex, direction, symbol) {
    const cells = document.querySelectorAll('.cell');
    if (direction === 'horizontal') {
        for (let i = 0; i < 5; i++) {
            cells[startIndex + i].style.backgroundColor = 'gold';
        }
    } else if (direction === 'vertical') {
        for (let i = 0; i < 5; i++) {
            cells[startIndex + i * 5].style.backgroundColor = 'gold';
        }
    } else if (direction === 'diagonal1') {
        for (let i = 0; i < 5; i++) {
            cells[i * 6].style.backgroundColor = 'gold';
        }
    } else if (direction === 'diagonal2') {
        for (let i = 0; i < 5; i++) {
            cells[4 + i * 4].style.backgroundColor = 'gold';
        }
    }
}

// Ustawienia początkowe
updateStakeDisplay();
creditsDisplay.innerText = `Kredyty: ${credits}`;
winDisplay.innerText = 'Wygrana: 0';
messageDisplay.innerText = '';
