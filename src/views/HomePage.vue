<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
       
       <ion-list>
        <ion-item v-for="user in userInfo.data" :key="user.user_id">
          <ion-label>
            Name: {{ user.name }} <br>
            Age: {{ user.age }}
          </ion-label>
          <ion-button slot="end" size="small" fill="outline" @click="editUser(user)">Edit</ion-button>
          <ion-button slot="end" size="small" color="danger" @click="deleteUser(user.user_id)">Delete</ion-button>
        </ion-item>
      </ion-list>

      <form @submit.prevent="submitForm">

        <ion-input v-model="user.name" placeholder="Enter name" required></ion-input>
        <ion-input v-model="user.age" type="number" placeholder="Enter age" required></ion-input>
        <ion-button type="submit" expand="block" color="primary">
          {{ editingUserId === null ? 'Submit' : 'Update' }}
        </ion-button>
        <ion-button v-if="editingUserId !== null" expand="block" fill="outline" @click="cancelEdit">
          Cancel
        </ion-button>

      </form>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {reactive, ref, onMounted} from 'vue';
import api from '@/axios';
import { IonInput, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/vue';

const axios = api;

interface UserRecord {
  user_id: number;
  name: string;
  age: number | string;
}

const user = reactive({
name:'',
age:''
})

const userInfo = reactive({
  data: [] as UserRecord[],
 });

const editingUserId = ref<number | null>(null);

const clearForm = () => {
  user.name = '';
  user.age = '';
  editingUserId.value = null;
};

const cancelEdit = () => {
  clearForm();
};

const editUser = (selectedUser: UserRecord) => {
  editingUserId.value = selectedUser.user_id;
  user.name = selectedUser.name;
  user.age = String(selectedUser.age);
};

const submitForm = async () => {
  try {
    const isEditing = editingUserId.value !== null;
    const response = isEditing
      ? await axios.post('/updateuser.php', { ...user, user_id: editingUserId.value })
      : await axios.post('/adduser.php', user);
    console.log(response.data);

    await fetchUserInfo();
    clearForm();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const deleteUser = async (userId: number) => {
  if (!window.confirm('Are you sure you want to delete this user?')) {
    return;
  }

  try {
    const response = await axios.post('/deleteuser.php', { user_id: userId });
    console.log(response.data);
    if (editingUserId.value === userId) {
      clearForm();
    }
    await fetchUserInfo();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};



const fetchUserInfo = async () => {
  try {
    const response = await axios.post('/getusers.php');

    console.log(response.data);


    userInfo.data = response.data;
   


  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};


onMounted(() => {
  fetchUserInfo();
});



</script>

<style scoped>
#container {
  text-align: center;
  padding: 16px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
