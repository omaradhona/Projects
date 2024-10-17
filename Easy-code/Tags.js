css.innerHTML +=
`
.flex-container{
    display:;
	flex-direction:;
    align-items:;
    justify-content:;
    flex-wrap:;
    align-content:;
    width:;
    height:;
    background-color:;
}
		
.flex-container > div{
	background-color:;
	width:;
    height:;
    border:;
    padding:;
    margin:;
	text-align:;
	font-size:;
}
`

cssDefault = [
    "flex", "row", "center", "center", "wrap", "space-around", "500", "500", "#ADD8E6",
    "#E6E6FA", "50", "50", "1", "solid", "#000000", "10", "10", "10", "10", "10", "10", "10", "10", "center", "20"
]

output.innerHTML = `
    <div class="flex-container">
        <div class="items">1</div>
        <div class="items">2</div>
        <div class="items">3</div>  
    </div>
`