$(document).ready(function() {

  //window.localStorage.clear();

  $("#newTaskForm").hide();

  var listo = [];

  if (localStorage.length) {
    var unpackedObject = {};
    var todoBox = $("#newList");
    for (var prop in localStorage) {
      unpackedObject = JSON.parse(localStorage[prop]);
      listo.push(unpackedObject);
      if (unpackedObject.id === "archived") {
        todoBox = $("#archivedList");
        todoBox.append(
          "<a href='#finish' class='' id='archived'>" +
          "<li class='list-group-item'>" +
          "<h3>" + unpackedObject.task +"</h3>" +
          "<span class='arrow pull-right'>" +
          "<i class='glyphicon glyphicon-remove>" +
          "</span>" +
          "</li>" +
          "</a>"
        );

      }
      else if (unpackedObject.id === "inProgress") {
        todoBox = $("#currentList");
        todoBox.append(
          "<a href='#finish' class='' id='inProgress'>" +
          "<li class='list-group-item'>" +
          "<h3>" + unpackedObject.task +"</h3>" +
          "<span class='arrow pull-right'>" +
          "<i class='glyphicon glyphicon-arrow-right'>" +
          "</span>" +
          "</li>" +
          "</a>"
        );
      }
      else {
        todoBox.append(
          "<a href='#finish' class='' id='item'>" +
          "<li class='list-group-item'>" +
          "<h3>" + unpackedObject.task +"</h3>" +
          "<span class='arrow pull-right'>" +
          "<i class='glyphicon glyphicon-arrow-right'>" +
          "</span>" +
          "</li>" +
          "</a>"
        );
      }
    }
  }
  var saveState = function(task, yes) {
    if(yes) {
      delete localStorage[task.task];
      return;
    }
    localStorage[task.task] = JSON.stringify(task);
  };

  var Task = function(task){
    this.task = task;
    this.id = "new";
  };

  var advanceTask = function(task) {
    var modified = task.innerText.trim()
  for (var i = 0; i < listo.length; i++) {
    if (listo[i].task.toLowerCase() === modified.toLowerCase()) {
        if (listo[i].id === "new") {
          listo[i].id = "inProgress";
          saveState(listo[i]);
        } else if (listo[i].id === "inProgress") {
          listo[i].id = "archived";
          saveState(listo[i]);
        } else {
          var yes = 1;
          saveState(listo[i], yes);
          listo.splice(i, 1);
        }
        break;
      }
    }
    task.remove();
  };

  var addTask = function(task) {
    if (task) {
      task = new Task(task);
      listo.push(task);
      $("#newItemInput").val("");
      $("#newList").append(
        "<a href='#finish' class='' id='item'>" +
        "<li class='list-group-item'>" +
        "<h3>" + task.task +"</h3>" +
        "<span class='arrow pull-right'>" +
        "<i class='glyphicon glyphicon-arrow-right'>" +
        "</span>" +
        "</li>" +
        "</a>"
      );
      saveState(task);
    }
  };

  $(document).on("click", "#item", function(e) {
    e.preventDefault();
    var task = this;
    advanceTask(task);
    this.id = "inProgress";
    $("#currentList").append(this.outerHTML);
  });

  $(document).on("click", "#inProgress", function(e) {
    e.preventDefault();
    var task = this;
    task.id = "archived";
    var changeIcon = task.outerHTML.replace("glyphicon-arrow-right", "glyphicon-remove");
    advanceTask(task);
    $("#archivedList").append(changeIcon);
  });

  $(document).on("click", "#archived", function(e) {
    e.preventDefault();
    var task = this;
    advanceTask(task);
  });

  $("#saveNewItem").click(function(e) {
    e.preventDefault();
    var task = $("#newItemInput").val().trim();
    addTask(task);
  });

  $("#add-todo").click(function() {
    $("#newTaskForm").fadeToggle("fast", "linear");
    $("#newItemInput").val("");
  });

  $("#cancel").click(function(e) {
    e.preventDefault();
    $("#newTaskForm").fadeToggle("slow", "linear");
    $("#newItemInput").val("");
  });

  $("#newItemInput").keypress(function(e) {
    //e.preventDefault();
    if (e.which === 13) {
    var task = $("#newItemInput").val().trim();
    addTask(task);
  }});

});
