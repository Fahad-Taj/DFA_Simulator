const Q = [];
const sigma = [];
const q0 = [];
const F = [];
const delta = [];

function getRawInput(){
    let Q_temp_string = document.querySelector("#DFA_Q").value;
    let sigma_temp_string = document.querySelector("#DFA_sigma").value;
    let q0_temp_string = document.querySelector("#DFA_q0").value;
    let F_temp_string = document.querySelector("#DFA_F").value;

    let Q_temp_array = Q_temp_string.split(',');
    let sigma_temp_array = sigma_temp_string.split(',');
    let q0_temp_array = q0_temp_string.split(',');
    onlyFirstElementAllowed(q0_temp_array);
    let F_temp_array = F_temp_string.split(',');

    //In JavaScript arrays are passed by reference
    stringTrim(Q_temp_array);
    stringTrim(sigma_temp_array);
    stringTrim(q0_temp_array);
    stringTrim(F_temp_array);

    copyArray(Q, Q_temp_array);
    copyArray(sigma, sigma_temp_array);
    copyArray(q0, q0_temp_array);
    copyArray(F, F_temp_array);

    console.log(Q);
    console.log(sigma);
    console.log(q0);
    console.log(F);

    let subset_flag = DFA_start_form_validation();
    console.log(subset_flag);

    let table_container = document.querySelector("#DFA_transition_table_container");
    table_container.innerHTML = "";
    table_container.appendChild(createTableHeader());
    table_container.appendChild(createTable(Q.length, sigma.length));
    table_container.appendChild(createTransitionTableSubmitButton());

    insertTableSchema();

}

function transitionTableFill(){

    for (let i = 1; i < Q.length + 1; i++){
        delta[i-1] = [];
        for (let j = 1; j < sigma.length + 1; j++){

            let tempCell = document.querySelector("#DFA_transition_table_cell_" + i + "_" + j + " input");
            delta[i-1][j-1] = tempCell.value;
        }
    }

    console.table(delta);
    let flag = transitionTableValidation(delta, Q);
    console.log(flag)

    if (flag == false)
    {
        alert("Please check the entries of the DFA transition table, all the entries should be subset of Q and all the entries should be filled");
    }

    else {
        document.querySelector("#string_input_container").style.display = "block";
        drawGraph(Q, sigma, delta);
    } 

}

function transitionTableValidation(delta, Q){
    flag = true;
    for (let i = 0; i < delta.length; i++){
        for(let j = 0; j < delta[0].length; j++){
            flag = flag && Q.includes(delta[i][j]);
        }
    }
    return flag;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Removes whitespaces from both ends of each element of the array
function stringTrim(arrayObj){
    for(let i = 0; i < arrayObj.length; i++){
        arrayObj[i] = arrayObj[i].trim();
    }
};

function DFA_start_form_validation(){
    //Check if elements in qarray and Farray are sub-set of element in the Qarray
    console.log("Checking if qarray and Farray are subsets of Qarray");
    
    let flag_qarray = checkSubset(q0, Q);
    let flag_Farray = checkSubset(F, Q);

    console.log("flag_qarray: " + flag_qarray + ", flag_Farray: " + flag_Farray);

    if(!flag_qarray){
        alert("Starting state is not subset of Q - set of all states, program cannot proceed. Enter the details again.");
    }

    if(!flag_Farray){
        alert("set of Final states is not subset of Q - set of all states, program cannot proceed. Enter the details again.");
    }

    return flag_qarray && flag_Farray; 
}


//copies values of array2 into array1
function copyArray(array1, array2){
    for(let i = 0; i < array2.length; i++)
        array1[i] = array2[i];
}

//Checks if all elements in arrayObj1 are present in arrayObj2, returns true of arrayObj1 is subset of arrayObj2, else returns false.
function checkSubset(arrayObj1, arrayObj2){
    flag = true;
    for(let i = 0; i < arrayObj1.length; i++){
        if(!arrayObj2.includes(arrayObj1[i]) )
        {
            flag = false;
            break;
        }
    }
    return flag;
}

function onlyFirstElementAllowed(array){
    while(array.length > 1){
        array.pop();
    }
}

//Function that takes 2 parameters, number_rows and number_columns and returns a table with n(rows) = number_of_rows and n(columns) = number_columns. The table has id of "myTable" and each cell has and id of cell_i_j where i and j are the row and column number respectively. e.g. if you want to access cell at row 0 and column 0 i.e. the first cell of the table, use #cell_0_0 
function createTable(Q_length, sigma_length){
    console.log("createTable() function is called");

    let table = document.createElement("table");
    table.setAttribute("id", "DFA_transition_table");

    for(let i = 0; i <= Q_length; i++)
    {

        let tempRow = document.createElement("tr");
        tempRow.setAttribute("id", "row"+i);
        for(let j = 0; j <= sigma_length; j++)
        {
            let tempCell = document.createElement("td");
            //For testing, the next line will be commented at runtime
            let input_box = document.createElement("input");
            input_box.setAttribute("type", "text");
            tempCell.appendChild(input_box);
            tempCell.setAttribute("id", "DFA_transition_table_cell_"+i+"_"+j);
            tempCell.setAttribute("class", "DFA_transition_table_cell");
            tempRow.appendChild(tempCell);
        }

        table.appendChild(tempRow);
    }

    console.log("createTable() function has exited");
    return table;
};

function insertTableSchema(){
    let firstCell = document.querySelector("#DFA_transition_table_cell_0_0 input");
    firstCell.setAttribute("readonly", "true");

    for(let i = 1; i < Q.length + 1; i++){
        let tempRowCell = document.querySelector("#DFA_transition_table_cell_" + i + "_0 input");
        tempRowCell.setAttribute("value", Q[i-1]);
        tempRowCell.setAttribute("readonly", "true");
    }

    for(let i = 1; i < sigma.length + 1; i++){
        let tempRowCell = document.querySelector("#DFA_transition_table_cell_0_" + i + " input");
        tempRowCell.setAttribute("value", sigma[i-1]);
        tempRowCell.setAttribute("readonly", "true");
    }
}

function createTableHeader(){
    let table_header = document.createElement("div");
    table_header.setAttribute("id", "DFA_transition_table_header");
    table_header.textContent = "Enter the values of the transition table below: ";

    return table_header;
}

function createTransitionTableSubmitButton(){
    let button = document.createElement("button");
    button.setAttribute("id", "DFA_transition_table_submit");
    button.textContent = "Submit";
    button.setAttribute("onclick", "transitionTableFill()");

    return button;
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
function drawGraph(Q, sigma, delta){

    let sides = delta.length;
    console.log(sides);
    let height = 150 * sides;
    let width = 240 * sides;
    let container = "#graph_container";

    document.querySelector(container).style.display = "inline-block";
    document.querySelector(container).style.position = "relative";
    document.querySelector(container).style.width = width + "px";
    document.querySelector(container).style.height = height + "px";
    document.querySelector(container).style.backgroundColor = "#081b29";
    document.querySelector(container).style.border = "2px solid yellowgreen";
    document.querySelector(container).style.margin = "20px";

    let x_origin = document.querySelector(container).clientWidth / 2, y_origin = document.querySelector(container).clientHeight / 2;
    console.log(x_origin + ", " + y_origin);


    let side_length = y_origin - 150;
    console.log(side_length);

    //Count should start from 0 i.e if I have a polygon of 10 sides, count passed should be 0,1,2,3,4,5,6,7,8,9
    function generate_coords(number_of_sides, length){
        const array_coords = [];
        let exterior_angle = 2 * Math.PI / number_of_sides;
        
        for (let count = 0; count < number_of_sides; count++){
            let x_coord = length * Math.cos(Math.PI - (exterior_angle * count));
            let y_coord = length * Math.sin(Math.PI - (exterior_angle * count));

            array_coords.push({x_coord, y_coord});
        }

        return array_coords;
    }

    function createCircularDiv(radius, left_pos, bottom_pos, color, nam) {
        let div = document.createElement('div');
        div.innerText = nam;
        div.style.backgroundColor = color;
        div.style.borderRadius = "50%";
        div.setAttribute("id", "circle_" + nam);
        div.style.position = "absolute";
        div.style.left = left_pos + 'px';
        div.style.bottom = bottom_pos + 'px';
        div.style.width = radius*2+'px';
        div.style.height = radius*2+'px';
        div.style.display="flex";
        div.style.alignItems="center";
        div.style.justifyContent = "center";
        div.style.border="1px solid black";
        div.style.transform = "translate(-50%,50%)";

        if(F.includes(nam)){
            div.style.textDecoration = "underline";
        }

        return div;
    }

    function CreateArrow(len, color , left_pos , bottom_pos , angle , name)
    {
        let length = parseInt(len);
        let div = document.createElement('div');
        div.style.backgroundColor = color;
        div.style.height="15px";
        div.style.width=len+'px';
        div.style.position = "absolute";
        div.style.left = left_pos+'px';
        div.style.bottom = bottom_pos+'px';
        div.style.transform = 'translate(-50% , 50%) rotate('+angle+'deg) ';
        div.style.transition = '1s';
        div.setAttribute('id', 'arrow_'+name);
        div.style.clipPath = `polygon(0% 30% , ${length-30}px 30% , ${length-30}px 0% , 100% 50% , ${length-30}px 100% , ${length-30}px 70% ,0% 70% )`;
        return div;
    }

    function updatedCreateArrow(len, color, left_pos, bottom_pos, angle, name, sigma_index){
        let length = parseInt(len);
        let wrapper = document.createElement("div");
        wrapper.style.color = "white";
        wrapper.style.fontSize = "4px";
        wrapper.style.display = "inline-block";
        wrapper.style.position = "absolute";
        wrapper.style.left = left_pos+'px';
        wrapper.style.bottom = bottom_pos+'px';
        wrapper.style.transform = 'translate(-50% , 50%) rotate('+angle+'deg) ';
        wrapper.setAttribute('id', 'arrow_'+name);
        wrapper.style.paddingTop = "30px";
    
        let div = document.createElement('div');
        div.style.backgroundColor = color;
        div.style.height="20px";
        div.style.width=len+'px';
        div.style.clipPath = `polygon(0% 30% , ${length-30}px 30% , ${length-30}px 0% , 100% 50% , ${length-30}px 100% , ${length-30}px 70% ,0% 70% )`;
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
    
        let text_div = document.createElement("div");
        text_div.setAttribute("id", "arrow_" + name + "_text");
        text_div.textContent = sigma_index;
        text_div.style.fontSize = "10px";
        text_div.style.paddingLeft = "20px";
        // text_div.style.textAlign = "center";
    
        wrapper.appendChild(div);
        wrapper.appendChild(text_div);
        return wrapper;
    }

    function generateSelfLoop(circle , alphabet)
    {
        let offset  = 90;
        let wrap = document.createElement('div');
        wrap.style.position = 'absolute';
        wrap.setAttribute('id','arrow_'+circle.textContent+'_'+circle.textContent);
        let x1 = parseFloat(circle.style.left);
        let y1 = parseFloat(circle.style.bottom);
        wrap.style.width = '100px';
        wrap.style.height = '100px';
        let angle = Math.atan2(y1 - y_origin,x1 - x_origin);
        console.log(angle);
        wrap.style.left = `${x1+ (offset*Math.cos(angle))}px`;
        wrap.style.bottom = `${y1+ (offset*Math.sin(angle))}px`;
        console.log(`${x1+ (60*Math.cos(angle))}px`);
        console.log(`${Math.sin(angle)}px`);
        let angle_deg = 90-180*angle/Math.PI;
        wrap.style.transform = 'translate(-50% , 50%) rotate('+angle_deg+'deg)';
        let img = document.createElement('img');
        img.src='Self_loop.png';
        img.style.position="absolute";
        // wrap.style.display='inline-block';
        // img.style.transform = `rotate(${angle+20}deg)`
        let divi = document.createElement('div');
        divi.setAttribute('id' , 'arrow_'+circle.textContent+'_'+circle.textContent+'_text');
        divi.style.height = '10px';
        divi.style.fontSize = '10px';
        divi.textContent = alphabet;
        divi.style.marginBottom = '5px';
        divi.style.textAlign = 'center';
        divi.style.color = 'white';
        wrap.appendChild(divi);
        wrap.appendChild(img);
        
        return wrap;
    }

    //Function that takes 2 circles and an alphabet as input and returns an arrow from the first circle to the second circle, and prints the alphabet below the arrow.
    function arrow_generator(circle_1, circle_2, sigma_index){
        let offset = parseInt(circle_1.style.width)/2 + parseInt(circle_2.style.width)/2;

        let x1 = parseInt(circle_1.style.left);
        let y1 = parseInt(circle_1.style.bottom);

        let x2 = parseInt(circle_2.style.left);
        let y2 = parseInt(circle_2.style.bottom);

        //Check for self loop
        if (x1 == x2 && y1 == y2){

            return generateSelfLoop(circle_1, sigma_index);

        }


        else{
            let arrow_x = ( x1 + x2 ) / 2;
            let arrow_y = ( y1 + y2 ) / 2;

            let length = Math.sqrt( Math.pow( x2 - x1, 2)  + Math.pow( y2 - y1, 2) ) - offset;
            let angle =  -1 * Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            console.log(angle);
            console.log("(" + x1 + ", " + y1 + ")")
            console.log("(" + x2 + ", " + y2 + ")")
            console.log(parseInt(x1) + ", " + parseInt(y1));
            console.log(parseInt(x2) + ", " + parseInt(y2));
            console.log(circle_1.textContent + circle_2.textContent);
            return updatedCreateArrow(length, "#F0F0F0", arrow_x, arrow_y, angle, circle_1.textContent + "_" + circle_2.textContent, sigma_index);
        }
        

    }

    function driver(){
        let Q_boolean = []

        for (let temp_i = 0; temp_i < Q.length; temp_i++){
            Q_boolean[temp_i] = [];
            for (let temp_j = 0; temp_j < Q.length; temp_j++){
                Q_boolean[temp_i][temp_j] = false;
            }
        }
            
                

        console.table(Q_boolean);
        let graph_container = document.querySelector(container);
        let circle_container = [];
        let arrow_container = [];
        const array_of_coords = generate_coords(sides, side_length);
        console.log(array_of_coords);
        graph_container.innerHTML = "";

        //Loop for generating circles, it is pretty straightforward
        for(let j = 0; j < sides; j++){
            circle_container.push(createCircularDiv(50, array_of_coords[j].x_coord + x_origin, array_of_coords[j].y_coord + y_origin, "#00abf0", Q[j]));
            graph_container.appendChild(circle_container[j]);
        }

        //Loop for generating arrows, it uses 2 loops to traverse the transition function, and it passes 2 circles to the arrow generator function
        for (let i = 0; i < sides; i++){
            let circle_1_index = Q_indexing(Q[i]);
            console.log(circle_1_index);

            for (let j = 0; j < delta[0].length; j++){


                let circle_2_index = Q_indexing(delta[i][j]);
                let sigma_index = sigma_indexing(sigma[j]);
                let boolean = searchQBoolean(circle_1_index, circle_2_index, Q_boolean);
                console.log("circle_1_index, circle_2_index (i,j) boolean = " + circle_1_index + " " + delta[i][j] + " " + i + " " + j + " " + boolean);

                if(!boolean){
                    Q_boolean[circle_1_index][circle_2_index] = true;
                    // arrow_container.push(arrow_generator(createCircularDiv(50, array_of_coords[circle_1_index].x_coord + x_origin, array_of_coords[circle_1_index].y_coord + y_origin, "#00abf0", Q[circle_1_index]), createCircularDiv(50, array_of_coords[circle_2_index].x_coord + x_origin, array_of_coords[circle_2_index].y_coord + y_origin, "#00abf0", Q[circle_2_index]), sigma_index));

                    let temp_arrow = arrow_generator(createCircularDiv(50, array_of_coords[circle_1_index].x_coord + x_origin, array_of_coords[circle_1_index].y_coord + y_origin, "#00abf0", Q[circle_1_index]), createCircularDiv(50, array_of_coords[circle_2_index].x_coord + x_origin, array_of_coords[circle_2_index].y_coord + y_origin, "#00abf0", Q[circle_2_index]), sigma_index);

                    graph_container.appendChild(temp_arrow);
                }

                else{
                    let exising_arrow_text = document.querySelector("#arrow_" + Q[i] + "_" + delta[i][j] + "_text");
                    console.log("#arrow_" + Q[i] + "_" + delta[i][j] + "_text");
                    exising_arrow_text.textContent += ", " + sigma[j];
                    
                }

                
                console.log(circle_2_index);
                console.log(sigma_index);
            }
        }
        
        // for(let k = 0; k < arrow_container.length; k++){
        //     graph_container.appendChild(arrow_container[k]);
        // }
        
    }

    driver()
}

function Q_indexing(element){
    let count;
    for(let i = 0; i < Q.length; i++){
        if(element == Q[i])
            count = i;
    }
    return count;
}

function sigma_indexing(element){
    let count;
    for (let i = 0; i < sigma.length; i++){
        if (element == sigma[i])
            count = i;
    }
    return count;
}


function searchQBoolean(circle_1_index, circle_2_index, Q_boolean){
    if(Q_boolean[circle_1_index][circle_2_index] == true)
        return true;
    return false;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function stringInputValidation(string, sigma){
    let flag = true;
    for (let i = 0; i < string.length; i++){
        flag = flag && sigma.includes(string[i]);
    }
    return flag;
}

function generatePath(q0, string_input){
    let path = [];
    console.log(delta);

    let current_state = Q_indexing(q0[0]);
    path.push(q0[0]);

    for(let i = 0; i < string_input.length; i++){
        let sigma_index = sigma_indexing(string_input[i]);
        path.push(delta[current_state][sigma_index]);
        current_state = Q_indexing(delta[current_state][sigma_index]);
    }

    return path;

}

function animateDFA(){
    let string_input = document.querySelector("#string_input_text").value;
    let flag = stringInputValidation(string_input, sigma);

    if(!flag){
        alert("String contains letters which are not part of Σ, Check the input and try again");
    }

    else{
        let path = generatePath(q0, string_input);
        let set_of_circles = [];
        let set_of_arrows = [];
        let final_set = [];

        let string_result_text = document.querySelector("#string_result_text");

        if (F.includes(path[path.length - 1])){
            alert("String is accepted by the DFA!!");
            string_result_text.textContent = "Path = " + path.toString() + " \nString is accepted by DFA as the end state is subset of final set!";
        }
        else{
            alert("String is not accepted by the DFA!!");
            string_result_text.textContent = "Path = " + path.toString() + " \nString is not accepted by DFA as the end state is not subset of final set!";
        }
        console.log(path);

        for (let j = 0; j < path.length - 1; j++){
            set_of_circles.push("circle_" + path[j]);
            set_of_arrows.push("#arrow_" + path[j] + "_" + path[j+1]);
        }
        set_of_circles.push(path[path.length - 1]);
        console.log(set_of_circles);
        console.log(set_of_arrows);

        for (let k = 0; k < path.length - 1; k++){
            final_set.push(set_of_circles[k]);
            final_set.push(set_of_arrows[k]);
        }
        final_set.push(set_of_circles[set_of_circles.length - 1]);
        console.log(final_set);

    }

}

