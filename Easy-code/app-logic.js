/*---------------------------------------------------------------------------------------------------------
                                        ***    DECLARE VARIABLES   ***
    ---------------------------------------------------------------------------------------------------------*/

var css = document.getElementById("css");

/* css.innerText +=
`.flex-container{
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
}` */

// store parts of "css" so we can separate the code at a certain index or character
var part = "";
// store the index of each ":" in "css" in array, we have to separate our "css" innerHTML/innerText so we can add dynamically inputs fields and values just after ":"
var posArr = [0];
// store css and manipulate it before display so we can add classes, spans and line breaks to our code dynamically
var cssPiece = "<span class='selector'>";
// store a property name
var propName = "";
// store all properties names
var myProps = [];
// css code to be executed
var cssFinal = "";
// store the value of each property
var valuesArr = [];
// we want to give all input fields of the same property the same id so we can manipulate the data
var inputsIds = [];
// This is the displayed CSS
var cssCode = document.getElementById("cssCode");
var output = document.getElementById("output");
var htmlEditor = CodeMirror(
    document.getElementById("htmlEditor"),
    {
        mode: "htmlmixed",

    }
);
CodeMirror.commands["selectAll"](htmlEditor);
var htmlCopyBtn = document.getElementById("htmlCopyBtn");
var cssCopyBtn = document.getElementById("cssCopyBtn");
var flexContainer = document.getElementsByClassName("flex-container");
var items = document.getElementsByClassName("items");
var inputs = document.getElementsByClassName("inputs");
var styleCode = document.getElementById("styleCode");
// store all properties as objects
var propList = {

}

/*---------------------------------------------------------------------------------------------------------
                                ***    CREATE PROPERTIES AS OBJECTS   ***
---------------------------------------------------------------------------------------------------------*/

//create every property with the "prop" constructor
//properties that have input
propList.backgroundcolor = new prop("", "color");
propList.color = new prop("", "color");
propList.height = new prop("", "number");
propList.width = new prop("", "number");
propList.lineheight = new prop("", "number");
propList.fontsize = new prop("", "number");

//properties that have select
propList.alignitems = new prop(["", "normal", "stretch", "center", "flex-start", "flex-end", "start", "end", "baseline"], "");
propList.display = new prop(["", "inline", "block", "contents", "flex", "grid", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "run-in", "table", "table-caption", "table-column-group", "table-header-group", "table-footer-group", "table-row-group", "table-cell", "table-column", "table-row", "none"], "");
propList.flexdirection = new prop(["", "row", "row-reverse", "column", "column-reverse"], "");
propList.justifycontent = new prop(["", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"], "");
propList.textalign = new prop(["", "left", "right", "center", "justify"], "");
propList.flexwrap = new prop(["", "wrap", "nowrap", "wrap-reverse"], "");
propList.aligncontent = new prop(["", "flex-start", "flex-end", "stretch", "center", "space-between", "space-around", "space-evenly"]);

//properties that have special input like "border" and "box-shadow" for example
propList.border = new prop("", "number");
propList.border.create = function () { createBorderInpt(["", "solid", "dashed", "dotted"]) };
propList.margin = new prop("", "number");
propList.margin.create = function () { createMarginInpt(); };
propList.padding = new prop("", "number");
propList.padding.create = function () { createMarginInpt(); };
propList.borderradius = new prop("", "number");
propList.borderradius.create = function () { createMarginInpt(); };
propList.boxshadow = new prop("", "number");
propList.boxshadow.create = function () { createMarginInpt(); };

/*---------------------------------------------------------------------------------------------------------
                                        ***    MAIN CODE   ***
---------------------------------------------------------------------------------------------------------*/

// we set the default HTML code as the starting innerHTML of output
htmlEditor.setValue(output.innerHTML);
// we format our HTML code
autoFormatSelection();

// this loop checks every character in css so we can store, separate and manipulate "css"
for (var i = 0; i < css.innerHTML.length; i++) {
    part = css.innerText.slice(i, i + 1);
    cssPiece += part;

    // here we format css code and make it readable
    // we add line breaks, spans and classes to style the displayed css code with colors later
    if (part == "{" || part == ";" || part == "}") {
        cssPiece += "<br>";
        if ((css.innerText.slice(i + 2, i + 3) !== "}" && part == ";")) {
            cssPiece += "&emsp;&emsp;&emsp;<span class='property'>";
        }
        else if (part == "{") {
            cssPiece = cssPiece.replace(cssPiece.slice(0, cssPiece.length), cssPiece.slice(0, cssPiece.length - 5));
            cssPiece += "</span> {<br>&emsp;&emsp;&emsp;<span class='property'>";
        }
        else if (part == "}") {
            cssPiece += "<br><span class='selector'>";
        }
    }

    //split css to pieces to join every piece with its input or value later
    if (part == ":") {
        // we store the index of all ":" characters
        posArr.push(i + 1);

        cssPiece = cssPiece.replace(cssPiece.slice(0, cssPiece.length), cssPiece.slice(0, cssPiece.length - 1));
        cssCode.innerHTML += cssPiece + "</span>:";

        // at this point in "css" we add the input of the property, which is the last stored property in "myProps"
        propList[myProps[myProps.length - 1]].create();
        // we empty "cssPiece" so we start the same operation over and over again
        cssPiece = "";
    }

    //store properties
    if (part == "{" || part == ";") {
        // this second loop starts from every "{" and ";"
        for (var k = i + 2; k < css.innerText.length; k++) {
            part = css.innerText.slice(k, k + 1);

            // if the character of part is a letter then we know it's a letter of a property name, so we store it except the "-" (so our stored properties names are for example : fontsize NOT font-size...), we do this because i could not use "-" when naming the properties objects, so we can use them easily like we did in line 305 
            if (part.toLowerCase() !== part.toUpperCase()) {
                propName += part;
            }
            else if (part == ":" || part == "}") {
                // if we started checking from ";" to "}" and part is never a letter then here we have to break the loop, otherwise part will store a letter that is after "}" which is a selector, we don't need it 
                if (propName.length == 0) {
                    break;
                }
                // if we started checking from "{" to ":" and the length of "propName" is different from 0 then there is a letter at least between the two characters (obviously), we store "propName" in "myProps" 
                else {
                    myProps.push(propName);
                }

                propName = "";
                break;
            }
        }
    }
}

if(cssCode.innerText.length > 0){
    cssCode.innerHTML += ";<br>}";
}
else{
    cssCode.innerHTML += "&emsp;";
}

// we make the "update" function execute every time the "onchange" event fires, for every input field 
for (var i = 0; i < inputs.length; i++) {
    inputs[i].setAttribute("onchange", "update()");
    inputs[i].style.color = "black";
}

// we give every input a value
for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = cssDefault[i];
}

update();

/*---------------------------------------------------------------------------------------------------------
                                        ***    FUNCTIONS   ***
---------------------------------------------------------------------------------------------------------*/

// this function gets a selection range in or HTML editor, in this case the whole HTML code is selected, starting from line 0 and character 0 to the last character of the last line (check CodeMirror documentation)
function getSelectedRange() {
    return {
        from: { line: 0, ch: 0 },
        to: { line: htmlEditor.lineCount(), ch: htmlEditor.lastLine().length },
    };
}

// this function formats the HTML code
function autoFormatSelection() {
    var range = getSelectedRange();

    htmlEditor.autoFormatRange(range.from, range.to);
    htmlEditor.setCursor({ line: htmlEditor.lineCount(), ch: htmlEditor.lastLine().length });
}

// this function updates the output every time the user change the HTML code
function runHtml() {
    output.innerHTML = htmlEditor.getValue();
    htmlCopyBtn.innerHTML = "Copy HTML code";
}

// this function copies CSS code
function copyCss() {
    //        cssFinal = cssFinal.replace("#output ", "");
    navigator.clipboard.writeText(cssFinal);
    cssCopyBtn.innerHTML = "Copied!";
    if (htmlCopyBtn.innerHTML == "Copied!") {
        htmlCopyBtn.innerHTML = "Copy HTML code";
    }
}

// this function copies HTML code
function copyHtml() {
    navigator.clipboard.writeText(htmlEditor.getValue());
    htmlCopyBtn.innerHTML = "Copied!";
    if (cssCopyBtn.innerHTML == "Copied!") {
        cssCopyBtn.innerHTML = "Copy CSS code";
    }
}

// this function adds a div element to the container
function addElement() {
    var myItem = document.createElement("div");
    myItem.innerHTML = items.length + 1;
    myItem.className = "items";
    flexContainer[0].append(myItem);
    htmlEditor.setValue(output.innerHTML);
    autoFormatSelection();
}

// this function removes the last div element in the container
function removeElement() {
    flexContainer[0].removeChild(flexContainer[0].lastElementChild);
    htmlEditor.setValue(output.innerHTML);
    autoFormatSelection();
}

// this is an object constructor to create properties as objects, each with a type (number, color), values (an array containing all possible values of a given property) and a function that creates the right input field for the property
function prop(values, type) {
    this.values = values;
    this.type = type;
    this.create = function () {
        if (this.values !== "") {
            createSelect(this.values);
        }
        else if (this.type !== "") {
            createInput(this.type);
        }
    };
}

// each of the following functions is called at line 257 where we add the input field just after adding ":" in our cssCode
// function to create select field and append it to "cssCode"
function createSelect(allValues) {
    var mySelect = document.createElement("select");
    inputsIds.push(inputsIds.length);
    // we give all input fields of the same property the same id so we can manipulate data easier later in "update" function
    mySelect.id = inputsIds.length;
    // create a select element that has all values that we give as an argument
    for (var i = 0; i < allValues.length; i++) {
        var myOption = document.createElement("option");
        myOption.text = allValues[i];
        mySelect.options.add(myOption, i);
    }
    mySelect.style.height = 19 + "px";
    mySelect.style.fontSize = 14 + "px";
    mySelect.className = "inputs";
    cssCode.append(mySelect);
}

// function to create input field and append it to "cssCode"
function createInput(inputType) {
    var myInput = document.createElement("input");
    inputsIds.push(inputsIds.length);
    myInput.id = inputsIds.length;
    myInput.type = inputType;
    myInput.className = "inputs";
    cssCode.append(myInput);

    if (myInput.type == "number") {
        myInput.style.width = 55 + "px";
        myInput.style.height = 19 + "px";
        cssCode.innerHTML += "px";
    }
    else if (myInput.type == "color") {
        myInput.style.height = 19 + "px";
    }
}

// function to create border inputs fields
function createBorderInpt(allValues) {
    var myInput = document.createElement("input");
    inputsIds.push(inputsIds.length);
    myInput.id = inputsIds.length;

    myInput.type = "number";
    myInput.style.width = 40 + "px";
    myInput.style.height = 19 + "px";
    myInput.className = "inputs";
    cssCode.append(myInput);
    cssCode.innerHTML += "px ";

    var mySelect = document.createElement("select");
    mySelect.id = inputsIds.length;
    for (var i = 0; i < allValues.length; i++) {
        var myOption = document.createElement("option");
        myOption.text = allValues[i];
        mySelect.options.add(myOption, i);
    }
    mySelect.style.height = 19 + "px";
    mySelect.style.fontSize = 14 + "px";
    mySelect.style.verticalAlign = "middle";
    mySelect.className = "inputs";
    cssCode.append(mySelect);

    var myColorInput = document.createElement("input");
    myColorInput.id = inputsIds.length;
    myColorInput.type = "color";
    myColorInput.style.height = 19 + "px";
    myColorInput.style.verticalAlign = "middle";
    myColorInput.className = "inputs";
    cssCode.append(myColorInput);
}

// function to create 4 number inputs
function createMarginInpt() {
    var myInput = document.createElement("input");
    inputsIds.push(inputsIds.length);

    myInput.id = inputsIds.length;
    myInput.type = "number";
    myInput.style.width = 40 + "px";
    myInput.style.height = 19 + "px";
    myInput.className = "inputs";
    cssCode.append(myInput);
    cssCode.innerHTML += "px ";

    var myInput2 = document.createElement("input");
    myInput2.id = inputsIds.length;
    myInput2.type = "number";
    myInput2.style.width = 40 + "px";
    myInput2.style.height = 19 + "px";
    myInput2.className = "inputs";
    cssCode.append(myInput2);
    cssCode.innerHTML += "px ";

    var myInput3 = document.createElement("input");
    myInput3.id = inputsIds.length;
    myInput3.type = "number";
    myInput3.style.width = 40 + "px";
    myInput3.style.height = 19 + "px";
    myInput3.className = "inputs";
    cssCode.append(myInput3);
    cssCode.innerHTML += "px ";

    var myInput4 = document.createElement("input");
    myInput4.id = inputsIds.length;
    myInput4.type = "number";
    myInput4.style.width = 40 + "px";
    myInput4.style.height = 19 + "px";
    myInput4.className = "inputs";
    cssCode.append(myInput4);
    cssCode.innerHTML += "px";
}

// this function updates the css code to be executed every time the user change the value of a css property
function update() {
    // we start by storing all properties values in "valuesArr"
    for (var i = 0; i < inputs.length; i++) {
        // here we check if the input is of one value and not 3 or 4 values (like border or box-shadow)
        if (inputs[i + 2] == undefined || inputs[i].id !== inputs[i + 2].id) {
            if (inputs[i].type == "number") {
                valuesArr[inputs[i].id - 1] = inputs[i].value + "px";
            }
            else {
                valuesArr[inputs[i].id - 1] = inputs[i].value;
            }
        }
        // here we check if the input is of a border
        else if (inputs[i + 3] == undefined || inputs[i].id == inputs[i + 2].id && inputs[i].id !== inputs[i + 3].id) {
            valuesArr[inputs[i].id - 1] = inputs[i].value + "px " + inputs[i + 1].value + " " + inputs[i + 2].value;

            // we skip two iterations in our loop because a border has 3 elements of "inputs"
            i += 2;
        }
        // here we check if the input is of a 4 values like box-shadow or border-radius
        else if (inputs[i].id == inputs[i + 3].id) {
            valuesArr[inputs[i].id - 1] = inputs[i].value + "px " + inputs[i + 1].value + "px " + inputs[i + 2].value + "px " + inputs[i + 3].value + "px";

            // we skip 3 iterations in our loop because here we are dealing with 4 elements of "inputs"
            i += 3;
        }
    }
    part = "";
    cssFinal = "";

    // now we combine the different pieces that we have stored to make the final css code to be executed
    for (var i = 0; i < posArr.length - 1; i++) {
        // "posArr" stores all indexes of ":" in "css"
        part = css.innerText.slice(posArr[i], posArr[i + 1]);
        // we store each static part of "css" that ends with ":"
        cssFinal += part;
        // then we add the property value, note that the number of ":" and the number of values is the same 
        cssFinal += " " + valuesArr[i];
    }

    if(cssFinal.length > 0){
        cssFinal += ";\n}";
    }
    
    // when we have a div element, we want to apply css code only to the divs that are inside "#output" where the user see the results, not to other divs in our page, so we replace "div" in our final css code with "#output div" 
    // cssFinal = cssFinal.replace("div", "#output div");
    styleCode.innerHTML = "<style>" + cssFinal + "</style>";
    cssCopyBtn.innerHTML = "Copy CSS code";
}