const churchId = window.location.pathname.split("/")[2]
const churchName = document.getElementById("church-name")
const churchLocation = document.getElementById("church-location")
const churchAddress = document.getElementById("church-address")
const churchSchedule = document.getElementById("church-schedule")
const churchExtra = document.getElementById("church-extra")
const extraBox = document.getElementById("extra-box")

async function getChurch() {
    const response = await fetch(`/api/church/${churchId}`)
    const church = await response.json()

    // Display basic info
    churchName.innerHTML = church.name
    churchLocation.innerHTML = "📍 " + church.location
    churchAddress.innerHTML = "🏠 " + church.address

    // Display regular schedule
    for (let i = 0; i < church.schedule.length; i++) {
        churchSchedule.innerHTML += `<li>${church.schedule[i]}</li>`
    }

    // Display extra schedule
    if (church.extraSchedule && church.extraSchedule.length > 0) {
        const activeExtra = church.extraSchedule.filter(e => e.isActive)
        if (activeExtra.length > 0) {
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