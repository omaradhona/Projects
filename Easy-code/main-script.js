var concept = localStorage.getItem("concept")

var script = document.createElement("script")
script.setAttribute("src", `${concept}.js`)
script.async = false
document.body.append(script)

var script2 = document.createElement("script")
script2.setAttribute("src", "app-logic.js")
script2.async = false
document.body.append(script2)