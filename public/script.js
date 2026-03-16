const churchListEl = document.getElementById("churchList-el")
const searchBtn = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const suggestions = document.getElementById("suggestions")
let allChurches = []
let showAll = false

// Search button click
searchBtn.addEventListener("click", function() {
    const searchValue = searchInput.value.toLowerCase()
    const filtered = allChurches.filter(function(church) {
        return church.name.toLowerCase().includes(searchValue) ||
               church.location.toLowerCase().includes(searchValue)
    })
    renderChurches(filtered)
    renderSchedule(filtered)
})

// Search suggestion as you type
searchInput.addEventListener("input", function() {
    const value = searchInput.value.toLowerCase()
    suggestions.innerHTML = ""
    if (value === "") return
    const filtered = allChurches.filter(function(church) {
        return church.name.toLowerCase().includes(value) ||
               church.location.toLowerCase().includes(value)
    })
    filtered.forEach(function(church) {
        suggestions.innerHTML += `
            <div class="suggestion-item" onclick="selectSuggestion('${church.name}')">
                ${church.name} - ${church.location}
            </div>
        `
    })
})

function selectSuggestion(name) {
    searchInput.value = name
    suggestions.innerHTML = ""
    const filtered = allChurches.filter(c => c.name === name)
    renderChurches(filtered)
    renderSchedule(filtered)
}

function renderChurches(churches) {
    churchListEl.innerHTML = ""
    const displayChurches = showAll ? churches : churches.slice(0, 3)
    for (let i = 0; i < displayChurches.length; i++) {
        churchListEl.innerHTML += `
            <div class="church-card">
                <h2>${displayChurches[i].name}</h2>
                <p>${displayChurches[i].location}</p>
                <a href="/church/${displayChurches[i]._id}" class="lihat-jadwal-btn">Lihat Jadwal →</a>
            </div>
        `
    }
    if (churches.length > 3) {
        churchListEl.innerHTML += `
            <div style="width:100%; text-align:center; margin-top:20px">
                <button id="show-more-btn" onclick="toggleShowAll()">
                    ${showAll ? 'Tampilkan Lebih Sedikit ↑' : 'Lihat Semua Gereja ↓'}
                </button>
            </div>
        `
    }
}

function toggleShowAll() {
    showAll = !showAll
    renderChurches(allChurches)
}

function renderSchedule(churches) {
    const scheduleBody = document.getElementById("schedule-body")
    scheduleBody.innerHTML = ""
    
    // Get today's day
    const today = new Date()
    const dayIndex = today.getDay() // 0=Sunday, 1=Monday, ...
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayKey = days[dayIndex]

    for (let i = 0; i < churches.length; i++) {
        const todaySchedule = churches[i].schedule[todayKey] || []
        
        for (let j = 0; j < todaySchedule.length; j++) {
            scheduleBody.innerHTML += `
                <tr>
                    <td>${churches[i].name}</td>
                    <td>${churches[i].location}</td>
                    <td>${todaySchedule[j]}</td>
                    <td><button class="detail-btn">Detail</button></td>
                </tr>
            `
        }
    }
}

const tabs = document.querySelectorAll(".tab")
tabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        tabs.forEach(t => t.classList.remove("active"))
        tab.classList.add("active")
        filterSchedule(tab.innerText)
    })
})

function filterSchedule(filter) {
    const scheduleBody = document.getElementById("schedule-body")
    scheduleBody.innerHTML = ""
    
    const today = new Date()
    const dayIndex = today.getDay()
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayKey = days[dayIndex]

    for (let i = 0; i < allChurches.length; i++) {
        const todaySchedule = allChurches[i].schedule[todayKey] || []
        
        for (let j = 0; j < todaySchedule.length; j++) {
            const time = todaySchedule[j]
            const hour = parseInt(time.split(":")[0])
            let show = false
            if (filter === "Semua") show = true
            else if (filter === "Pagi" && hour >= 6 && hour < 12) show = true
            else if (filter === "Siang" && hour >= 12 && hour < 15) show = true
            else if (filter === "Sore" && hour >= 15 && hour < 18) show = true
            else if (filter === "Malam" && hour >= 18) show = true
            if (show) {
                scheduleBody.innerHTML += `
                    <tr>
                        <td>${allChurches[i].name}</td>
                        <td>${allChurches[i].location}</td>
                        <td>${time}</td>
                        <td><button class="detail-btn">Detail</button></td>
                    </tr>
                `
            }
        }
    }
}

async function getChurches() {
    const response = await fetch("/churches")
    allChurches = await response.json()
    renderChurches(allChurches)
    renderSchedule(allChurches)
}

getChurches()

// Show today's date
function showTodayDate() {
    const today = new Date()
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        locale: 'id-ID'
    }
    const dateStr = today.toLocaleDateString('id-ID', options)
    document.getElementById("today-date").innerHTML = "📅 " + dateStr
}

showTodayDate()