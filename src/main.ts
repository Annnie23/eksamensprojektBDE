import './style.css'

// Definerer en TypeScript-grænseflade (interface) for en todo
interface Todo {
    id: number;        // Unik identifikator for todo'en
    title: string;     // Titel på todo'en
    completed: boolean; // Angiver om todo'en er fuldført eller ej
}

// Initialiserer en tom liste til at holde todo-objekter
let todos: Todo[] = []

// Får reference til HTML-elementerne
const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoList = document.getElementById('todo-list') as HTMLUListElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement

// Funktion til at tilføje en ny todo
const addTodo = (text: string): void => {
    const newTodo: Todo = {
        id: Date.now(),    // Genererer en unik id baseret på tidsstemplet
        title: text,       // Titlen tildeles fra input
        completed: false   // Sætter startstatus for todo'en til ikke færdig
    }
    todos.push(newTodo) // Tilføjer den nye todo til listen
    console.log("Todo added:", todos); // Logger den tilføjede todo til konsollen
    renderTodos() // Opdaterer visningen af todo-erne
}

// Funktion til at opdatere visningen af todo-erne
const renderTodos = (): void => {
    todoList.innerHTML = '' // Rydder eksisterende indhold i todo-listen
  
    todos.forEach(todo => {
        const li = document.createElement('li') // Opretter et nyt listeelement
        li.className = 'todo-item' // Tildeler en CSS-klasse til listeelementet
        li.innerHTML = `
            <span style="text-decoration: ${todo.completed ? 'line-through' : 'none'};">
              ${todo.title}
            </span>
            <button>Remove</button>
            <button id="editBtn">Edit</button>
            <button id="toggleBtn">Completed</button>
        `; // Genererer HTML-indhold for hvert todo-element
        addRemovebuttonEventListener(li, todo.id) // Tilføjer event listener til fjern-knappen
        addEditbuttonEventListener(li, todo.id) // Tilføjer event listener til rediger-knappen
        addTogglebuttonEventListener(li, todo.id) // Tilføjer event listener til toggle-knappen
        todoList.appendChild(li) // Tilføjer listeelementet til todo-listen
    })
}

// Kald funktionen for at vise eksisterende todo'er, når siden indlæses
renderTodos()

// Tilføjer en event listener til formularen, som tilføjer en ny todo, når den bliver indsendt
todoForm.addEventListener('submit', (e) => {
    e.preventDefault() // Forhindrer formularen i at sende en HTTP-anmodning
    const text = todoInput.value.trim() // Får værdien fra inputfeltet og fjerner overflødige mellemrum
    if (text !== '') {
        addTodo(text) // Tilføjer den nye todo, hvis input ikke er tom
    }
})

// Funktion til at tilføje en event listener til fjern-knappen
const addRemovebuttonEventListener = (li: HTMLLIElement, id: number) => {
    const removeButton = li.querySelector('button')
    removeButton?.addEventListener('click', () => removeTodo(id))
}

// Funktion til at fjerne en todo fra listen baseret på dens id
const removeTodo = (id: number) => {
    todos = todos.filter(todo => todo.id !== id) // Filtrerer listen for at fjerne todo'en
    renderTodos() // Opdaterer visningen
}

// Funktion til at tilføje en event listener til rediger-knappen
const addEditbuttonEventListener = (li: HTMLLIElement, id: number) => {
    const editButton = li.querySelector('#editBtn')
    editButton?.addEventListener('click', () => editTodo(id))
}

// Funktion til at redigere en todo
const editTodo = (id: number) => {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        const text = prompt("Edit todo", todo.title) // Vis en prompt for at ændre titlen
        if (text) {
            todo.title = text // Opdaterer todo'ens titel
            renderTodos() // Opdaterer visningen
        }
    }
} 

// Funktion til at initialisere farvevælgeren
const initializeColorPicker = (): void => {
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement
    if (colorPicker) {
        colorPicker.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            changeBackgroundColor(target.value) // Ændrer baggrundsfarven baseret på vælgerens værdi
        })
    } else {
        console.error("Color picker not found") // Logger en fejl, hvis farvevælgeren ikke findes
    }
}

// Funktion til at ændre baggrundsfarven
const changeBackgroundColor = (color: string): void => {
    document.body.style.backgroundColor = color // Ændrer baggrundsfarven på body-elementet
}

// Kalder farvevælger-initieringsfunktionen, når dokumentet er indlæst
document.addEventListener('DOMContentLoaded', () => {
    initializeColorPicker()
})

// Funktion til at tilføje en event listener til toggle-knappen
const addTogglebuttonEventListener = (li: HTMLLIElement, id: number) => {
    const toggleButton = li.querySelector('#toggleBtn')
    toggleButton?.addEventListener('click', () => toggleTodo(id))
}

// Funktion til at tilføje en event listener til toggle-knappen og ændre todo-status
const toggleTodo = (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed; // Skifter færdig-status
        renderTodos(); // Opdaterer visningen

        if (todo.completed) {
            createConfetti();  // Trigger konfetti, når todo'en er fuldført
        }
    }
}

// Funktion til at rydde alle fuldførte todo'er
const clearCompletedTodos = (): void => {
    todos = todos.filter(todo => !todo.completed); // Filtrerer listen for at fjerne fuldførte todo'er
    renderTodos(); // Opdaterer visningen
}

// Funktion til at skifte status på alle todo'er
const toggleAllTodos = (): void => {
    const allCompleted = todos.every(todo => todo.completed); // Tjekker om alle todo'er er fuldførte
    todos.forEach(todo => todo.completed = !allCompleted);    // Skifter status på alle baseret på tjekket

    renderTodos(); // Opdaterer visningen

    // Trigger konfetti, hvis alle todo'er er fuldførte efter toggle
    if (todos.every(todo => todo.completed)) {
        createConfetti();  // Trigger konfetti for at markere, at alle opgaver er fuldførte
    }
};

// Tilføjer knapper til at rydde og skifte alle todo'er til siden
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Completed Todos'; // Tekst på knappen
clearButton.addEventListener('click', clearCompletedTodos); // Tilføjer event listener til knappen
document.body.appendChild(clearButton); // Tilføjer knappen til body

const toggleAllButton = document.createElement('button');
toggleAllButton.textContent = 'Toggle All Todos'; // Tekst på knappen
toggleAllButton.addEventListener('click', toggleAllTodos); // Tilføjer event listener til knappen
document.body.appendChild(toggleAllButton); // Tilføjer knappen til body

// Funktion til at skabe konfetti
const createConfetti = (): void => {
    const confettiCount = 50; // Antallet af konfetti
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti'; // Tildeler en CSS-klasse til konfettien

        // Randomiserer farve, størrelse, retning og varighed
        confetti.style.setProperty('--color', getRandomColor());
        confetti.style.setProperty('--size', `${Math.random() * 10 + 5}px`);
        confetti.style.setProperty('--x', `${Math.random() * 200 - 100}vw`); // Vandret retning
        confetti.style.setProperty('--y', `${Math.random() * 100 + 50}vh`);  // Vertikal retning (opad)
        confetti.style.setProperty('--duration', `${Math.random() * 2 + 1}s`); // Random animation duration

        document.body.appendChild(confetti); // Tilføjer konfetti til body

        // Fjerner konfettien efter animationen er færdig
        setTimeout(() => confetti.remove(), 3000);
    }
};

// Funktion til at få en tilfældig farve til konfettien
const getRandomColor = (): string => {
    const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#ff99ac', '#ffb3c1', '#ffccd5', '#ffebef', '#ffd700', '#ff5733', '#c70039', '#900c3f', '#581845'];
    return colors[Math.floor(Math.random() * colors.length)]; // Vælger en tilfældig farve fra listen
};