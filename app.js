var MOCK_WORKOUT_ROUTINE = {
    "routines": [
        {
            "id": "1",
            "day": "1",
            "muscleGroup": "arms",
            "muscle": "tricep",
            "targetExercise": "cable pull down",
            "weight": 500,
            "sets": 3,
            "reps": 10
        },
        {
            "id": "2",
            "day": "2",
            "muscleGroup": "arms",
            "muscle": "bicep",
            "targetExercise": "curls",
            "weight": 25,
            "sets": 3,
            "reps": 10
        },
        {
            "id": "3",
            "day": "3",
            "muscleGroup": "chest",
            "muscle": "frontal pectoral",
            "targetExercise": "bench press",
            "weight": 150,
            "sets": 3,
            "reps": 10
        },
        {
            "id": "4",
            "day": "4",
            "muscleGroup": "legs",
            "muscle": "hamstrings",
            "targetExercise": "squats",
            "weight": 200,
            "sets": 3,
            "reps": 10
        }
    ]
};

function getRoutines(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_WORKOUT_ROUTINE)}, 100);
}

function displayRoutine(data) {

    for (routine in data.routines) {
        $("body").append(
            "<p>" + routine.day + "<p>");
    }
}

$(function() {
    getRoutines(displayRoutine);
})