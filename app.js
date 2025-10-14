// Authentication state
let currentUser = null

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  checkAuthState()
})

// Check authentication state
function checkAuthState() {
  const user = localStorage.getItem("currentUser")
  if (user) {
    currentUser = JSON.parse(user)
    showUserProfile()
  }
}

// Show/Hide modals
function showLogin() {
  document.getElementById("login-modal").classList.remove("hidden")
}

function showRegister() {
  document.getElementById("register-modal").classList.remove("hidden")
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden")
}

function switchToRegister() {
  closeModal("login-modal")
  showRegister()
}

function switchToLogin() {
  closeModal("register-modal")
  showLogin()
}

// Handle login
function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    showUserProfile()
    closeModal("login-modal")
    showNotification("Đăng nhập thành công!", "success")
  } else {
    showNotification("Email hoặc mật khẩu không đúng!", "error")
  }
}

// Handle register
function handleRegister(event) {
  event.preventDefault()

  const name = document.getElementById("register-name").value
  const email = document.getElementById("register-email").value
  const password = document.getElementById("register-password").value
  const confirm = document.getElementById("register-confirm").value

  if (password !== confirm) {
    showNotification("Mật khẩu xác nhận không khớp!", "error")
    return
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if email exists
  if (users.some((u) => u.email === email)) {
    showNotification("Email đã được sử dụng!", "error")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    balance: 0,
    avatar: `/placeholder.svg?height=100&width=100&query=user+avatar`,
    services: [],
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  currentUser = newUser
  localStorage.setItem("currentUser", JSON.stringify(newUser))

  showUserProfile()
  closeModal("register-modal")
  showNotification("Đăng ký thành công!", "success")
}

// Show user profile
function showUserProfile() {
  document.getElementById("auth-buttons").classList.add("hidden")
  document.getElementById("user-profile").classList.remove("hidden")
  document.getElementById("user-profile").classList.add("flex")

  document.getElementById("user-name").textContent = currentUser.name
  document.getElementById("user-balance").textContent = formatCurrency(currentUser.balance)
  document.getElementById("user-avatar").src = currentUser.avatar
}

// Logout
function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")

  document.getElementById("auth-buttons").classList.remove("hidden")
  document.getElementById("user-profile").classList.add("hidden")
  document.getElementById("user-profile").classList.remove("flex")

  showNotification("Đã đăng xuất!", "success")
}

// Purchase service
function purchaseService(plan, amount) {
  if (!currentUser) {
    showNotification("Vui lòng đăng nhập để mua dịch vụ!", "error")
    showLogin()
    return
  }

  // Show payment modal
  document.getElementById("payment-modal").classList.remove("hidden")
  document.getElementById("payment-plan").textContent = plan.toUpperCase()
  document.getElementById("payment-amount").textContent = formatCurrency(amount)
  document.getElementById("payment-content").textContent = `ASAKA${currentUser.id}${Date.now()}`

  // Store pending payment
  sessionStorage.setItem("pendingPayment", JSON.stringify({ plan, amount }))
}

// Confirm payment
function confirmPayment() {
  const pending = JSON.parse(sessionStorage.getItem("pendingPayment"))

  if (!pending) return

  // Simulate payment processing
  showNotification("Đang xử lý thanh toán...", "info")

  setTimeout(() => {
    // Add service to user
    currentUser.services.push({
      id: Date.now(),
      plan: pending.plan,
      amount: pending.amount,
      startDate: new Date().toISOString(),
      status: "active",
    })

    // Update user in storage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    closeModal("payment-modal")
    sessionStorage.removeItem("pendingPayment")
    showNotification("Thanh toán thành công! Dịch vụ đã được kích hoạt.", "success")
  }, 2000)
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${
    type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"
  }`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" })
}

function toggleProfileMenu() {
  // Future implementation for profile dropdown menu
  showNotification("Tính năng đang phát triển!", "info")
}
