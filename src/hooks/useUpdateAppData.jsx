import { useLayoutEffect, useReducer, useRef} from "react"
import { MdLoop } from "react-icons/md"
import { objectsAreEqual } from "../jsFunctions"

export function appDataReducer(state, action) {
    switch (action.type) {

        case 'MODIFY_ENTIRE':{
            state = action.payload
            return state
        };break
        // ----------------------<
        // exercise list actions-<
        case 'NEW_EXERCISE':{ // payload: exercise object
            const exercise = action.payload

            function allRequiredInputsAreFilled() {
                if (exercise === null) return false
                let flag = true
                for(const key in exercise){
                    const val = exercise[key]
                    if (key === 'stat' || key === 'description') continue // skip stat since its not required
                    if (val === '') {
                        flag = false
                        break
                    }
                }
                return flag
            }
            function exerciseAlreadyExists() {
                let flag = false
                for (let i = 0; i < state.exercises.length; i++) {
                    const exerciseName = state.exercises[i].name;
                    if(exerciseName === exercise?.name){ flag = true }
                }
                return flag
            }

            // check if object is valid -------
            if (exerciseAlreadyExists()) {
                alert('Exercise name already exists')
                return state
            }
            if (!allRequiredInputsAreFilled()){
                alert('all required inputs need to be filled')
                return state
            }
            // update data --------------------
            const stateCopy = {...state} // copy original state
            stateCopy.exercises = [exercise , ...stateCopy.exercises]
            return stateCopy // return the copy
        };break
        case 'DELETE_EXERCISE':{ // payload: exercise name
            let stateCopy = {...state} // copy original state
            const filteredStateCopy = stateCopy.exercises.filter((exercise)=>
                exercise.name !== action.payload
            )
            stateCopy = {routines:state.routines, exercises:filteredStateCopy}
            return stateCopy
        };break
        case 'UPDATE_EXERCISE':{ // payload: {oldExercise:exerciseName, newExercise:EXERCISE_OBJECT}
            let stateCopy = {...state}
            function indexOfExercise() {
                for (let i = 0; i < state.exercises.length; i++) {
                    const exercise = state.exercises[i];
                    if (exercise.name === action.payload.oldExerciseName) {
                        return i
                    }
                }
            }
            stateCopy.exercises[indexOfExercise()] = action.payload.newExercise
            return stateCopy
        };break
        // ----------------------<
        // routine actions ------<

        // ----------------------<
        default:
            throw Error('ACTION DOSNT EXIST DAMN IT: ' + action.type)
    }
}
// this hooks manages all the app data.
// returns the data state and the set method
// all components can use this hook to update the apps data
// the components will access the data from local storage NOT from this hook
// everytime the data is modified it is set to local storage 
export function useUpdateAppData() {
    const firstRender = useRef(true)
    const [appData, dispatch] = useReducer(appDataReducer, {
        routines:[
            { name:'routine 1', isActive:false,
                exercises:['riff', 'stretch']
            }
        ],
        exercises:[
            {
                name:'riff',
                description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur, quia sint. Fugiat, itaque. Similique, voluptas minima. Excepturi alias voluptatem incidunt sequi, porro dolore aliquid saepe?',
                stat:'speed',
                minutes:'3',
                seconds:'0'
            }
        ]
    })
    useLayoutEffect(()=> {
        if (firstRender.current) {
            const localData = JSON.parse(localStorage.getItem('appData'))
            if (localData != null) {
                dispatch({type:'MODIFY_ENTIRE', payload:localData})
            }
            firstRender.current = false
        }
        localStorage.setItem('appData', JSON.stringify(appData))
    },[appData])

    return {appData, dispatch}
}