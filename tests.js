import { Selector } from "testcafe";

fixture ("Styling Tests")
    .page("https://test.annnie01.one/todo/")

// Selectors
const todoInput = Selector('input[placeholder="Add new todo"]');
const addButton = Selector('button').withText('Add');
const todoList = Selector('.todo-list');
const todoItem = todoList.find('.todo-item'); 

test('Add a new todo item', async t => {
    const newTodoText = 'Buy groceries';

    // Skriv i input-feltet og klik på "Add" knappen
    await t
        .typeText(todoInput, newTodoText)
        .click(addButton);

    // Tjek, om den nye todo er blevet tilføjet til listen
    const newTodo = todoItem.withText(newTodoText);
    await t.expect(newTodo.exists).ok('The new todo item should appear in the list');
});

test('Add, complete, and clear completed todos', async t => {
    const completedTodoText = 'Read a book';

    // Tilføj en ny todo
    await t
        .typeText(todoInput, completedTodoText)
        .click(addButton);

    const completedTodo = todoItem.withText(completedTodoText);
    const markAsCompleteButton = completedTodo.find('#toggleBtn'); // Brug knappen for at markere som komplet
    const clearCompletedButton = Selector('body > button:nth-child(3)');

    // Tjek, at todo-listen og todo-item eksisterer
    await t.expect(todoList.exists).ok('Todo list should exist');
    await t.expect(completedTodo.exists).ok(`Todo item should exist with text "${completedTodoText}"`);

    // Markér todoen som fuldført ved at klikke på "Completed"-knappen
    await t.click(markAsCompleteButton);

    // Klik på knappen til at rydde fuldførte todos
    await t.click(clearCompletedButton);

    // Tjek, at todoen er fjernet fra listen
    await t.takeScreenshot();
    await t.expect(completedTodo.exists).notOk('The completed todo item should be cleared from the list');
});

test('Add multiple todos, toggle all as completed, and clear completed todos', async t => {
    const firstTodoText = 'Read a book';
    const secondTodoText = 'Go for a run';

    // Tilføj to nye todos
    await t
        .typeText(todoInput, firstTodoText)
        .click(addButton)
        .typeText(todoInput, secondTodoText)
        .click(addButton);

    const firstTodo = todoItem.withText(firstTodoText);
    const secondTodo = todoItem.withText(secondTodoText);
    const toggleAllButton = Selector('body > button:nth-child(4)');
    const clearCompletedButton = Selector('body > button:nth-child(3)');

    // Tjek, at begge todo-items eksisterer
    await t.expect(firstTodo.exists).ok(`Todo item should exist with text "${firstTodoText}"`);
    await t.expect(secondTodo.exists).ok(`Todo item should exist with text "${secondTodoText}"`);

    // Brug "toggle all" knappen til at markere alle som fuldførte
    await t.takeScreenshot();
    await t.click(toggleAllButton);

    // Klik på knappen til at rydde fuldførte todos
    await t.click(clearCompletedButton);

    // Tjek, at begge todos er fjernet fra listen
    await t.expect(firstTodo.exists).notOk(`The todo item "${firstTodoText}" should be cleared from the list`);
    await t.expect(secondTodo.exists).notOk(`The todo item "${secondTodoText}" should be cleared from the list`);
});
