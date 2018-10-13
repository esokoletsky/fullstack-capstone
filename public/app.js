
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

