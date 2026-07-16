<template>
  <main class="container mt-5 text-center">
    <div class="alert alert-danger mx-auto access-denied">
      <h1>Access Denied</h1>

      <p class="lead">
        Your username or password is incorrect.
      </p>

      <p>
        Please return to the login page and try again.
      </p>

      <RouterLink
        to="/login"
        class="btn btn-primary"
      >
        Return to Login
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.access-denied {
  max-width: 600px;
}
</style>
