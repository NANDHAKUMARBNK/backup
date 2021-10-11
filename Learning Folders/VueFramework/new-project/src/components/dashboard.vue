<template>
  <div>
    <h2>
      Welcome
      <p>{{ userName }}</p>
    </h2>
    <div><strong>This is your EmailId==>></strong>{{ userEmailId }}</div>
    <div>
      <strong>This is your MobileNumber==>></strong>{{ userMobileNumber }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      userMobileNumber: "",
      userEmailId: "",
      userId:""
    };
  },
  components: {},
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.userName = localStorage.getItem("username");
      this.userMobileNumber = localStorage.getItem("mobilenumber");
      this.userEmailId = localStorage.getItem("email");
      
    }
  }
};
</script>
