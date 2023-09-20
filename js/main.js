import { createID } from "./utils/id.js";

const addButton = document.querySelector(".add");
const cancelDialog = document.querySelector(".cancelButton");
const confirmButton = document.querySelector(".confirmButton");
const addDialog = document.querySelector(".addDialog");
const deleteBTN = document.querySelector(".delete");

let tasks = [];

let doneTasks = [];

let task = {
  id: null,
  name: "default name",
  desc: "default desc",
};

window.addEventListener("load", () => {
  let getString = localStorage.getItem("tasks");
  tasks = JSON.parse(getString);
  console.log(tasks);

  let getDoneString = localStorage.getItem("doneTasks");
  doneTasks = JSON.parse(getDoneString);
  console.log(doneTasks);

  if (tasks == null) {
    console.log("Du har ikke nogle opgaver");
  } else {
    tasks.forEach(build);
  }

  if (doneTasks == null) {
    console.log("Du har ikke gennemført nogle opgaver endnu!");
    doneTasks = [
      {
        id: null,
        name: " ",
        desc: " ",
      },
    ];
  } else if (doneTasks[0].id == null) {
    doneTasks.shift();
    doneTasks.forEach(buildDone);
  } else {
    doneTasks.forEach(buildDone);
  }
});

cancelDialog.addEventListener("click", () => {
  addDialog.close();
});

addButton.addEventListener("click", () => {
  addDialog.showModal();
});

confirmButton.addEventListener("click", () => {
  task.id = createID();

  task.name = document.querySelector(".nameInput").value;
  document.querySelector(".nameInput").value = "";
  task.desc = document.querySelector(".descText").value;
  document.querySelector(".descText").value = "";

  if (tasks == null) {
    tasks = [
      {
        id: 1,
        name: "Dummy name",
        desc: "Dette er et dummy objekt",
      },
    ];
  }

  let newTask = JSON.parse(JSON.stringify(task));

  tasks.push(newTask);

  console.log("tasks efter push", tasks);

  if (tasks[0].id === 1) {
    tasks.shift();
  }

  let stringTasks = JSON.stringify(tasks);
  localStorage.setItem("tasks", stringTasks);

  document.querySelector(".taskList").innerHTML = "";

  tasks.forEach(build);

  addDialog.close();
});

function build(task) {
  const clone = document.querySelector("template.buildTemplate").content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = task.name;
  clone.querySelector("[data-field=desc]").textContent = task.desc;
  clone.querySelector(".done").setAttribute("data-doneID", task.id);
  clone.querySelector(".done").addEventListener("click", taskDone);
  clone.querySelector(".delete").setAttribute("data-deleteID", task.id);
  clone.querySelector(".delete").addEventListener("click", deleteTask);

  document.querySelector(".taskList").appendChild(clone);
}

let deleteID = 0;

function deleteTask(event) {
  // console.log(event);
  deleteID = event.target.parentNode.firstElementChild.attributes[0].nodeValue;
  // console.log(deleteID);

  let warningName = "";

  for (let j = 0; j < tasks.length; j++) {
    if (tasks[j].id == deleteID) {
      warningName = tasks[j].name;
    }
  }

  document.querySelector(".warning").showModal();
  document.querySelector(".warningText").textContent = `Er du sikker på at du vil slette "${warningName}"`;
  document.querySelector(".cancelDelete").addEventListener("click", () => {
    document.querySelector(".warning").close();
  });

  document.querySelector(".confirmDelete").addEventListener("click", () => {
    document.querySelector(".warning").close();

    findIndexById(tasks, deleteID);
  });
}

function findIndexById(array, id) {
  for (let index = 0; index < array.length; index++) {
    if (array[index].id == id) {
      console.log(`Dette objekt er på index: ${index}`);
      tasks.splice(index, 1);
      document.querySelector(".taskList").innerHTML = "";

      tasks.forEach(build);
      let stringTasks = JSON.stringify(tasks);
      localStorage.setItem("tasks", stringTasks);
    }
  }
}

let doneID = 0;

function taskDone(event) {
  doneID = event.target.parentNode.firstElementChild.attributes[0].nodeValue;

  // console.log(doneID);

  sendDoneTask(tasks, doneID);
}

function sendDoneTask(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      console.log("bla bla", tasks.slice(i, i + 1)[0]);
      let doneTask = tasks.slice(i, i + 1)[0];
      console.log("Done task", doneTask);
      tasks.splice(i, 1);
      doneTasks.unshift(doneTask);

      document.querySelector(".taskList").innerHTML = "";
      tasks.forEach(build);

      document.querySelector(".doneTaskList").innerHTML = "";
      doneTasks.forEach(buildDone);

      let stringTasks = JSON.stringify(tasks);
      localStorage.setItem("tasks", stringTasks);

      let stringDoneTasks = JSON.stringify(doneTasks);
      localStorage.setItem("doneTasks", stringDoneTasks);
    }
  }
}

function buildDone(done) {
  const cloneDone = document.querySelector("template.doneTemplate").content.cloneNode(true);

  cloneDone.querySelector("[data-field=doneName]").textContent = done.name;
  cloneDone.querySelector("[data-field=doneDesc]").textContent = done.desc;
  document.querySelector(".doneTaskList").appendChild(cloneDone);
}

function checkID(ID) {
  if (id == tasks.id) {
    createID();
  } else {
    tasks.id = id;
  }
}
