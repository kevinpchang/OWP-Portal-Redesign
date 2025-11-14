<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you’re looking for doesn’t exist.</p>
    <router-link to="/">Go back to Dashboard</router-link>
  </div>
</template>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F8F8F8;
  color: #034750;
  font-family: 'Myriad Pro', sans-serif;
}

.not-found h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.not-found p {
  font-size: 18px;
  margin-bottom: 24px;
  color: #555;
}

.not-found a {
  font-size: 16px;
  color: #007C8A;
  text-decoration: underline;
  font-weight: 600;
}

.not-found a:hover {
  color: #00A5B5;
}
</style>
