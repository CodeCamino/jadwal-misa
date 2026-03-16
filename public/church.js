const churchId = window.location.pathname.split("/")[2]
const churchName = document.getElementById("church-name")
const churchLocation = document.getElementById("church-location")
const churchAddress = document.getElementById("church-address")
const churchSchedule = document.getElementById("church-schedule")
const churchExtra = document.getElementById("church-extra")
const extraBox = document.getElementById("extra-box")

const dayNames = {
    sunday: "Minggu",
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu"
}

async function getChurch() {
    const response = await fetch(`/api/church/${churchId}`)
    const church = await response.json()

    churchName.innerHTML = church.name
    churchLocation.innerHTML = "📍 " + church.location
    churchAddress.innerHTML = "🏠 " + (church.address || "")

    // Display schedule
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    churchSchedule.innerHTML = ""
    
    for (let d = 0; d < days.length; d++) {
        const day = days[d]
        const times = church.schedule[day] || []
        if (times.length > 0) {
            churchSchedule.innerHTML += `
                <li>
                    <strong>${dayNames[day]}:</strong> 
                    ${times.join(" | ")}
                </li>
            `
        }
    }

    // Display extra schedule
    if (church.extraSchedule && church.extraSchedule.length > 0) {
        const activeExtra = church.extraSchedule.filter(e => e.isActive)
        if (activeExtra.length > 0) {
            extraBox.style.display = "block"
            for (let i = 0; i < activeExtra.length; i++) {
                churchExtra.innerHTML += `
                    <li>
                        <strong>${activeExtra[i].title}</strong>
                        — ${activeExtra[i].date} — ${activeExtra[i].time}
                    </li>
                `
            }
        } else {
            extraBox.style.display = "none"
        }
    } else {
        extraBox.style.display = "none"
    }
}

getChurch()