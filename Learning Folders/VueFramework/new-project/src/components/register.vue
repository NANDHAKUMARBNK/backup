<template>
  <form style="border:1px solid #ccc">
    <div class="container">
      <p>Please fill in this form to create an account.</p>
      <hr />
      <label for="name"><b>Name</b></label>
      <input
        type="text"
        placeholder="Enter Name"
        v-model="name"
        name="name"
        required
      />

      <label for="email"><b>Email</b></label>
      <input
        type="text"
        placeholder="Enter Email"
        name="email"
        v-model="email"
        required
      />

      <label for="mobilenumber"><b>Mobile</b></label>
      <input
        type="text"
        placeholder="Enter mobilenumber"
        name="mobilenumber"
        v-model="mobilenumber"
        required
      />
      <div class="clearfix">
        <button class="signupbtn" v-on:click="addRecord()">Sign Up</button>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";
export default {
  name: "register",

  data() {
    return {
      mobilenumber: "",
      name: "",
      email: ""
     
    };
  },
  methods: {
    addRecord: function() {
      localStorage.setItem("username", this.name);
      localStorage.setItem("email", this.email);
      localStorage.setItem("mobilenumber", this.mobilenumber);
      const body = {
        name: this.name,
        mobilenumber: this.mobilenumber,
        email: this.email
      };

      axios
        .post("http://localhost:3000/saveinfo", body)
        .then(function(response) {
          window.location.href = "/dashboardscreen";
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addRecords() {
      alert("clicked");
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
* {
  box-sizing: border-box;
}

/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for all buttons */
button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity: 1;
}

/* Extra styles for the cancel button */
.cancelbtn {
  padding: 14px 20px;
  background-color: #f44336;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn,
.signupbtn {
  float: left;
  width: 50%;
}

/* Add padding to container elements */
.container {
  padding: 16px;
}

/* Clear floats */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {
  .cancelbtn,
  .signupbtn {
    width: 100%;
  }
}
</style>
