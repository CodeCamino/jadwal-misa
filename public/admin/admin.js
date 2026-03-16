const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "jadwalmisa2025"

// Login function
const loginBtn = document.getElementById("login-btn")
const errorMsg = document.getElementById("error-msg")

if (loginBtn) {
    loginBtn.addEventListener("click", function() {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem("isAdmin", "true")
            window.location.href = "/admin"
        } else {
            errorMsg.innerHTML = "❌ Username atau password salah!"
        }
    })
}

// Dashboard
const logoutBtn = document.getElementById("logout-btn")
const churchListAdmin = document.getElementById("church-list-admin")

if (churchListAdmin) {
    if (localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "/admin/login"
    } else {
        loadChurches()
    }
}

// ← ADD THIS
const addChurchBtn = document.getElementById("add-church-btn")
if (addChurchBtn) {
    addChurchBtn.addEventListener("click", function() {
        window.location.href = "/admin/add"
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("isAdmin")
        window.location.href = "/admin/login"
    })
}

async function loadChurches() {
    const response = await fetch("/churches")
    const churches = await response.json()
    churchListAdmin.innerHTML = ""
    for (let i = 0; i < churches.length; i++) {
        churchListAdmin.innerHTML += `
            <div class="church-admin-card">
                <div>
                    <h3>${churches[i].name}</h3>
                    <p>📍 ${churches[i].location}</p>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editChurch('${churches[i]._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteChurch('${churches[i]._id}')">Hapus</button>
                </div>
            </div>
        `
    }
}

async function deleteChurch(id) {
    if (confirm("Yakin mau hapus gereja ini?")) {
        await fetch(`/churches/${id}`, { method: "DELETE" })
        loadChurches()
    }
}

function editChurch(id) {
    window.location.href = `/admin/edit/${id}`
}

// Edit page
const saveBtn = document.getElementById("save-btn")
const addExtraBtn = document.getElementById("add-extra-btn")
let extraSchedules = []

// Helper functions
function toArray(str) {
    if (!str || str.trim() === "") return []
    return str.split(",").map(t => t.trim()).filter(t => t !== "")
}

function toStr(arr) {
    if (!arr || arr.length === 0) return ""
    return arr.join(", ")
}

if (saveBtn) {
    if (localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "/admin/login"
    } else {
        loadChurchData()
    }
}

async function loadChurchData() {
    const id = window.location.pathname.split("/")[3]
    const response = await fetch(`/api/church/${id}`)
    const church = await response.json()

    document.getElementById("edit-name").value = church.name || ""
    document.getElementById("edit-location").value = church.location || ""
    document.getElementById("edit-address").value = church.address || ""
    document.getElementById("edit-sunday").value = toStr(church.schedule.sunday)
    document.getElementById("edit-monday").value = toStr(church.schedule.monday)
    document.getElementById("edit-tuesday").value = toStr(church.schedule.tuesday)
    document.getElementById("edit-wednesday").value = toStr(church.schedule.wednesday)
    document.getElementById("edit-thursday").value = toStr(church.schedule.thursday)
    document.getElementById("edit-friday").value = toStr(church.schedule.friday)
    document.getElementById("edit-saturday").value = toStr(church.schedule.saturday)

    // Load extra schedules
    extraSchedules = church.extraSchedule || []
    renderExtraSchedules()
}

function renderExtraSchedules() {
    const list = document.getElementById("extra-schedule-list")
    if (!list) return
    list.innerHTML = ""

    if (extraSchedules.length === 0) {
        list.innerHTML = "<p style='color:#666; font-size:0.85rem; margin-bottom:10px'>Belum ada jadwal tambahan</p>"
        return
    }

    for (let i = 0; i < extraSchedules.length; i++) {
        const extra = extraSchedules[i]
        list.innerHTML += `
            <div class="extra-item">
                <div>
                    <p><strong>${extra.title}</strong> — ${extra.date} — ${extra.time}</p>
                </div>
                <div style="display:flex; gap:8px; align-items:center">
                    <button class="active-toggle ${extra.isActive ? 'active' : 'inactive'}" 
                        onclick="toggleExtra(${i})">
                        ${extra.isActive ? '✅ Aktif' : '❌ Nonaktif'}
                    </button>
                    <button class="remove-extra" onclick="removeExtra(${i})">Hapus</button>
                </div>
            </div>
        `
    }
}

function toggleExtra(index) {
    extraSchedules[index].isActive = !extraSchedules[index].isActive
    renderExtraSchedules()
}

function removeExtra(index) {
    extraSchedules.splice(index, 1)
    renderExtraSchedules()
}

if (addExtraBtn) {
    addExtraBtn.addEventListener("click", function() {
        const title = document.getElementById("extra-title").value
        const date = document.getElementById("extra-date").value
        const time = document.getElementById("extra-time").value

        if (!title || !date || !time) {
            alert("⚠️ Lengkapi semua field jadwal tambahan!")
            return
        }

        extraSchedules.push({
            title: title,
            date: date,
            time: time,
            isActive: true
        })

        // Clear inputs
        document.getElementById("extra-title").value = ""
        document.getElementById("extra-date").value = ""
        document.getElementById("extra-time").value = ""

        renderExtraSchedules()
    })
}

if (saveBtn) {
    saveBtn.addEventListener("click", async function() {
        const id = window.location.pathname.split("/")[3]
        const updatedChurch = {
            name: document.getElementById("edit-name").value,
            location: document.getElementById("edit-location").value,
            address: document.getElementById("edit-address").value,
            schedule: {
                sunday: toArray(document.getElementById("edit-sunday").value),
                monday: toArray(document.getElementById("edit-monday").value),
                tuesday: toArray(document.getElementById("edit-tuesday").value),
                wednesday: toArray(document.getElementById("edit-wednesday").value),
                thursday: toArray(document.getElementById("edit-thursday").value),
                friday: toArray(document.getElementById("edit-friday").value),
                saturday: toArray(document.getElementById("edit-saturday").value)
            },
            extraSchedule: extraSchedules
        }

        await fetch(`/churches/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedChurch)
        })

        alert("✅ Perubahan berhasil disimpan!")
        window.location.href = "/admin"
    })
}

// Add new church page
const addChurchSaveBtn = document.getElementById("add-church-save-btn")

if (addChurchSaveBtn) {
    if (localStorage.getItem("isAdmin") !== "true") {
        window.location.href = "/admin/login"
    }

    addChurchSaveBtn.addEventListener("click", async function() {
        const name = document.getElementById("add-name").value
        const location = document.getElementById("add-location").value
        const address = document.getElementById("add-address").value

        if (!name || !location || !address) {
            alert("⚠️ Nama, lokasi dan alamat harus diisi!")
            return
        }

        const newChurch = {
            name: name,
            location: location,
            address: address,
            schedule: {
                sunday: toArray(document.getElementById("add-sunday").value),
                monday: toArray(document.getElementById("add-monday").value),
                tuesday: toArray(document.getElementById("add-tuesday").value),
                wednesday: toArray(document.getElementById("add-wednesday").value),
                thursday: toArray(document.getElementById("add-thursday").value),
                friday: toArray(document.getElementById("add-friday").value),
                saturday: toArray(document.getElementById("add-saturday").value)
            },
            extraSchedule: []
        }

        await fetch("/churches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newChurch)
        })

        alert("✅ Gereja berhasil ditambahkan!")
        window.location.href = "/admin"
    })
}