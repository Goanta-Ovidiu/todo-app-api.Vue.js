const app = Vue.createApp({
  data() {
    return {
      todos: [],
      inputValue: "",
    };
  },
  created() {
    this.loadTodoFromApi();
  },
  methods: {
    loadTodoFromApi() {
      fetch(" http://localhost:4730/todos")
        .then((response) => response.json())
        .then((data) => (this.todos = data));
    },
    addTodo() {
      const newTodo = { description: this.inputValue, done: false };

      fetch(" http://localhost:4730/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then((data) => {
          if (this.inputValue.length > 0) {
            this.todos.push(data);
            this.inputValue = "";
          } else {
            alert("Your Input Field it's empty");
          }
        });
    },
    updateTodo(todo) {
      fetch(" http://localhost:4730/todos/" + todo.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then((data) => (data.done = todo.done));
    },
    deleteTodo() {
      const deletePromises = [];
      this.todos.forEach((todo) => {
        if (todo.done === true) {
          deletePromises.push(
            fetch(" http://localhost:4730/todos/" + todo.id, {
              method: "DELETE",
            })
          );
        }
      });
      Promise.all(deletePromises).then(() => {
        this.loadTodoFromApi();
      });
    },
  },
});
app.mount("#app");
