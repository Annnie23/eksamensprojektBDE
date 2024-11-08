import './style.css'

// Definerer en TypeScript-grænseflade (interface) for en todo
interface Todo {
    id: number;        
    title: string;     
    completed: boolean;
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
        id: Date.now(),    
        title: text,       
        completed: false   
    }
    todos.push(newTodo) 
    console.log("Todo added:", todos); 
    renderTodos() 

    const todoInput = document.getElementById('todo-input') as HTMLInputElement;
    if (todoInput) {
        todoInput.value = ''; 
    }
}

// Funktion til at opdatere visningen af todo-erne
const renderTodos = (): void => {
    todoList.innerHTML = '' 
  
    todos.forEach(todo => {
        const li = document.createElement('li') 
        li.className = 'todo-item' 
        li.innerHTML = `
            <span style="text-decoration: ${todo.completed ? 'line-through' : 'none'};">
              ${todo.title}
            </span>
            <button>Remove</button>
            <button id="editBtn">Edit</button>
            <button id="toggleBtn">Completed</button>
        `; // Genererer HTML-indhold for hvert todo-element
        addRemovebuttonEventListener(li, todo.id) 
        addEditbuttonEventListener(li, todo.id) 
        addTogglebuttonEventListener(li, todo.id) 
        todoList.appendChild(li) 
    })
}

// Kald funktionen for at vise eksisterende todo'er, når siden indlæses
renderTodos()

// Tilføjer en event listener til formularen, som tilføjer en ny todo, når den bliver indsendt
todoForm.addEventListener('submit', (e) => {
    e.preventDefault() // Forhindrer formularen i at sende en HTTP-anmodning
    const text = todoInput.value.trim() 
    if (text !== '') {
        addTodo(text) 
    }
})

// Funktion til at tilføje en event listener til fjern-knappen
const addRemovebuttonEventListener = (li: HTMLLIElement, id: number) => {
    const removeButton = li.querySelector('button')
    removeButton?.addEventListener('click', () => removeTodo(id))
}

// Funktion til at fjerne en todo fra listen baseret på dens id
const removeTodo = (id: number) => {
    todos = todos.filter(todo => todo.id !== id) 
    renderTodos() 
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
        const text = prompt("Edit todo", todo.title) 
        if (text) {
            todo.title = text 
            renderTodos() 
        }
    }
} 

// Funktion til at initialisere farvevælgeren
const initializeColorPicker = (): void => {
    const colorPicker = document.getElementById('colorPicker') as HTMLInputElement
    if (colorPicker) {
        colorPicker.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            changeBackgroundColor(target.value) 
        })
    } else {
        console.error("Color picker not found") 
    }
}

// Funktion til at ændre baggrundsfarven
const changeBackgroundColor = (color: string): void => {
    document.body.style.backgroundColor = color 
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
        todo.completed = !todo.completed; 
        renderTodos(); 

        if (todo.completed) {
            createConfetti();  
        }
    }
}

// Funktion til at rydde alle fuldførte todo'er
const clearCompletedTodos = (): void => {
    todos = todos.filter(todo => !todo.completed); 
    renderTodos(); 
}

// Funktion til at skifte status på alle todo'er
const toggleAllTodos = (): void => {
    const allCompleted = todos.every(todo => todo.completed); 
    todos.forEach(todo => todo.completed = !allCompleted);   

    renderTodos(); 

    if (todos.every(todo => todo.completed)) {
        createConfetti();  
    }
};

// Tilføjer knapper til at rydde og skifte alle todo'er til siden
const clearButton = document.createElement('button');
clearButton.id = 'clearButton'; 
clearButton.textContent = 'Clear Completed Todos'; 
clearButton.addEventListener('click', clearCompletedTodos); 
document.body.appendChild(clearButton); 

const toggleAllButton = document.createElement('button');
toggleAllButton.id = 'toggleAllButton'; 
toggleAllButton.textContent = 'Toggle All Todos'; 
toggleAllButton.addEventListener('click', toggleAllTodos); 
document.body.appendChild(toggleAllButton); 

// Funktion til at skabe konfetti
const createConfetti = (): void => {
    const confettiCount = 50; 
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti'; 

        // Randomiserer farve, størrelse, retning og varighed
        confetti.style.setProperty('--color', getRandomColor());
        confetti.style.setProperty('--size', `${Math.random() * 10 + 5}px`);
        confetti.style.setProperty('--x', `${Math.random() * 200 - 100}vw`); 
        confetti.style.setProperty('--y', `${Math.random() * 100 + 50}vh`);  
        confetti.style.setProperty('--duration', `${Math.random() * 2 + 1}s`); 

        document.body.appendChild(confetti); 

        // Fjerner konfettien efter animationen er færdig
        setTimeout(() => confetti.remove(), 3000);
    }
};

// Funktion til at få en tilfældig farve til konfettien
const getRandomColor = (): string => {
    const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#ff99ac', '#ffb3c1', '#ffccd5', '#ffebef', '#ffd700', '#ff5733', '#c70039', '#900c3f', '#581845'];
    return colors[Math.floor(Math.random() * colors.length)];
};