document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input")
  const addTaskBtn = document.getElementById("add-task-btn")
  const taskList = document.getElementById("task-list")
  const paginationControls = document.getElementById("pagination-controls")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const pageInfo = document.getElementById("page-info")

  let allTasks = []
  let currentPage = 1
  const tasksPerPage = 5

  const loadTasksFromStorage = () => {
    const loadedTasks = JSON.parse(localStorage.getItem("tasks"))
    allTasks = loadedTasks || []
    currentPage = 1
    renderTasks()
  }

  const saveTasksToStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(allTasks))
  }

  const renderTasks = () => {
    taskList.innerHTML = ""

    const startIndex = (currentPage - 1) * tasksPerPage
    const endIndex = startIndex + tasksPerPage
    const tasksToRender = allTasks.slice(startIndex, endIndex)

    tasksToRender.forEach((task, index) => {
      const globalIndex = startIndex + index
      const listItem = createNewTaskElement(task, globalIndex)
      taskList.appendChild(listItem)
    })

    updatePaginationControls()
  }

  const createNewTaskElement = (taskObject, globalIndex) => {
    const listItem = document.createElement("li")
    listItem.dataset.globalIndex = globalIndex

    if (taskObject.completed) {
      listItem.classList.add("completed")
    }

    const taskDetails = document.createElement("div")
    taskDetails.className = "task-details"

    const taskTextSpan = document.createElement("span")
    taskTextSpan.className = "task-text"
    taskTextSpan.textContent = taskObject.text

    const taskDate = document.createElement("small")
    taskDate.className = "task-date"
    taskDate.textContent = new Date(taskObject.createdAt).toLocaleString()

    taskDetails.appendChild(taskTextSpan)
    taskDetails.appendChild(taskDate)

    const deleteBtn = document.createElement("button")
    deleteBtn.className = "delete-btn"
    deleteBtn.textContent = "Remove"

    taskDetails.addEventListener("click", () => {
      toggleTask(globalIndex)
    })

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      deleteTask(globalIndex)
    })

    listItem.appendChild(taskDetails)
    listItem.appendChild(deleteBtn)

    return listItem
  }

  const updatePaginationControls = () => {
    const totalTasks = allTasks.length
    const totalPages = Math.ceil(totalTasks / tasksPerPage)

    if (totalTasks <= tasksPerPage) {
      paginationControls.style.display = "none"
      return
    }

    paginationControls.style.display = "flex"

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`

    prevBtn.disabled = currentPage === 1
    nextBtn.disabled = currentPage === totalPages
  }

  const handleAddTask = () => {
    const taskText = taskInput.value.trim()

    if (taskText === "") {
      alert("Please enter a task!")
      return
    }

    const newTask = {
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    }

    allTasks.unshift(newTask)

    saveTasksToStorage()

    currentPage = 1
    renderTasks()

    taskInput.value = ""
  }

  const toggleTask = (globalIndex) => {
    const task = allTasks[globalIndex]
    if (task) {
      task.completed = !task.completed
      saveTasksToStorage()
      renderTasks()
    }
  }

  const deleteTask = (globalIndex) => {
    const listItem = taskList.querySelector(
      `li[data-global-index="${globalIndex}"]`
    )

    if (listItem) {
      listItem.classList.add("removing")

      setTimeout(() => {
        allTasks.splice(globalIndex, 1)
        saveTasksToStorage()
        renderTasks()
      }, 300)
    }
  }

  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault()
    handleAddTask()
  })

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTask()
    }
  })

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderTasks()
    }
  })

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(allTasks.length / tasksPerPage)
    if (currentPage < totalPages) {
      currentPage++
      renderTasks()
    }
  })

  loadTasksFromStorage()
})
