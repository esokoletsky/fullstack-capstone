
function getRoutines(callbackFn) {
    $.getJSON("/getMyJSON", (data) => {
        callbackFn(data);
    });
}

function displayRoutine(data) {

   let routines =  data.routines.map(routine =>  {
          return `<p>${routine.day}</p>`;
    });
    $("body").append(routines);          
}

$(function() {
    getRoutines(displayRoutine);
})


function enterRoutine(){
    $('.container').html(
        `<section id="setup routine" role="main">
        <h3>Setup your workout routine</h3>
        <form>
            Day:<br>
            <input type="text" value="Ex: Day 1"></input><br>
            Muscle Group:<br>
            <input type="text" value="Ex: Arms"></input><br>
            Muscle:<br>
            <input type="text" value="Ex: Bicep"></input><br>
            Exercise Name:<br>
            <input type="text" value="Ex: Curls"></input><br>
            Exercise Weight:<br>
            <input type="text" value="Ex: 45 lbs"></input><br>
            How many sets:<br>
            <input type="text" value="Ex: 3"></input><br>
            How many reps:<br>
            <input type="text" value="Ex: 10"></input><br>

        </form>
        </section>
        ` 
    )
}