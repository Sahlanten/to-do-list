// находим элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList')

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function (task) {
            // формируем css класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой задачи
    const taskHtml = `
        <li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
        </li>`;
// добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHtml)
    });

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// функции
function addTask (event){
    // отменяем отправку формы
    event.preventDefault();
    // достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // описываем хадачу в виде обьекта
    const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    };

    // Добавляем задачу в массив с задачами

    tasks.push(newTask)

    // добавляем задачу в хранилеще браузера
    saveToLocalStorage();

    // формируем css класс
    const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

    // формируем разметку для новой задачи
    const taskHtml = `
        <li id = "${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${newTask.text}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
        </li>`;
// добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHtml)

// очищаем поле ввода и возвращаем фокус
    taskInput.value = '';
    taskInput.focus()

    checkEmptyList()

}

function deleteTask(event){
    // проверяем если клик был не по кнопке 'удалить задачу'
    if(event.target.dataset.action !== 'delete')return;

    const parentNode = event.target.closest('.list-group-item');

    // определяем id задачи
    const id = Number(parentNode.id);

    // Находим индекс задачи в массиве
    const index = tasks.findIndex( (task) => task.id === id);

    // удаляем задачу из массива
    tasks.splice(index, 1)
    parentNode.remove();

    // добавляем задачу в хранилеще браузера
    saveToLocalStorage();

    checkEmptyList()
}

function doneTask(event){
    if(event.target.dataset.action !== 'done') return;
        const parentNode = event.target.closest('.list-group-item');

        // Определяем id задачи 
        const id = Number(parentNode.id);
        const task = tasks.find((task) => task.id === id)
        task.done = !task.done

        // добавляем задачу в хранилеще браузера
        saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done')
        
}

checkEmptyList()

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)   
    }
    if (tasks.length !== 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
        }
}
    
function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}