import { createContext, useContext, useRef, useState } from "react"
import { pageCtx } from "../pageCtx.JSX"
import { AiFillDelete } from "react-icons/ai";
import { MdEdit} from "react-icons/md";
import { ConfirmMenu } from "./REUSABLE_COMPONENTS";
import { Backdrop } from "./REUSABLE_COMPONENTS";


function RoutineExerciseData({routineObject}) {
  const {name, exercises} = routineObject
  let count = 0
  return <div className='routineExerciseData'>
      {
        exercises.map((exercise)=> {
          count++
          return <span key={exercise}
            style={{backgroundColor:(count % 2 == 0)? 'gainsboro' : null}}
          >
            <b>
              {(count < 10)?0:null}{count}
            </b> {exercise}
          </span>
        }
        )
      }
  </div> // =========================>
}
function Routine({routineObject}) {
  const {dispatch} = useContext(pageCtx)
  const {name} = routineObject
  const [confirmMenu, setConfirmMenu] = useState(null)
  function deleteRoutine() {
    setConfirmMenu(<ConfirmMenu
      text={{
        warningText:'Are you sure you want to delete this routine?',
        cancelBtnText:'cancel',
        confirmBtnText:'delete'
      }}
      callBackIfNo={()=> setConfirmMenu(null)}
      callBackIfYes={()=> {
        dispatch({
          type:'DELETE_ROUTINE',
          payload:routineObject.name
        })
      }}
    />)
  }
  return <div className='routine'>
    <div className="overview">
      <h2>{name}</h2>
      <button>Set as Active Routine</button>
      {/* todo: */}
      <button><MdEdit/></button>
      <button onClick={deleteRoutine}><AiFillDelete/></button>
    </div>
    <RoutineExerciseData routineObject={routineObject} />
    {confirmMenu}
  </div> // =====================>
}
function RoutinesList() {
  const {appData} = useContext(pageCtx)
  return <div className='routinesList dataList'>
    {
      appData.routines.map((routineObject)=>
        <Routine key={routineObject.name} routineObject={routineObject} />
      )
    }
  </div> // ===================================>
}

// #region NewRoutineMenuComponents

function NewRoutineContents() {
  const {routineObject, setRoutineObject} = useContext(NewRoutineCtx)
  function removeExercise(exercise) {
    let update = {...routineObject}
    const index = update.exercises.indexOf(exercise.name)
    update.exercises.splice(index,1)
    setRoutineObject(update)
  }
  return <div className='newRoutineContents'>
    <h4><u>Routine contents</u></h4>
    <ul>
      { routineObject.exercises.map((exercise)=>
          <li key={exercise}>
            <button onClick={()=> {
              removeExercise(exercise)
            }}>-</button>
            <span>
              <b>{routineObject.exercises.indexOf(exercise)+1}</b>
            </span>
            <span>{exercise}</span>
          </li>
        ) }
    </ul>
  </div> // ================================>
}

function ExercisesList() {
  const {appData} = useContext(pageCtx)
  const {routineObject, setRoutineObject} = useContext(NewRoutineCtx)
  let count = 0
  function exerciseAdded(exerciseName) {
    let flag = false
    routineObject.exercises.forEach(exercise => {
      if (exerciseName === exercise) flag = true
    }); return flag
  }
  function addExercise(exercise) {
    let update = {...routineObject}
    update.exercises.push(exercise.name)
    setRoutineObject(update)
  }
  return <div className='exercisesList'>
    <h4><u>Exercises</u></h4>
      <ul>
        {
          appData.exercises.map((exercise)=> {

            count++
            const style = (exerciseAdded(exercise.name))? {
                opacity: '30%',
                textDecoration:'line-through'
            } : null

            return <li key={exercise.name}
              className="exercise"
              style={style}
            >

              <button onClick={
                (!exerciseAdded(exercise.name))?
                ()=> addExercise(exercise) : null
              }>+</button>

              <span>{exercise.name}</span>

            </li>
          })
        }
      </ul>
  </div> // ===========================>
}

// #endregion

const NewRoutineCtx = createContext()
function NewRoutineMenu({visible, setVisible}) {
  const {appData, dispatch} = useContext(pageCtx)
  const defaultObject = { isActive:false, name:'', exercises:[] }
  const [routineObject, setRoutineObject] = useState(defaultObject)
  const RoutineNameRef = useRef()
  function UPDATE_NAME() {
    const update = {...routineObject}; 
    update.name = RoutineNameRef.current.value
    setRoutineObject(update)
  }
  function ROUTINE_VALID() {
    const appRoutines = [] // make array of all the apps routines // // //
    appData.routines.forEach(routine=> appRoutines.push(routine.name)) //

    const routineName = RoutineNameRef.current.value
    if (routineName == '') return false
    if (appRoutines.includes(routineName))  return false
    if (routineObject.exercises.length < 1) return false
    return true
  }
  function close() {
    setVisible(false)
    setRoutineObject(defaultObject)
  }
  function createRoutine() {
    UPDATE_NAME()
    if (ROUTINE_VALID()) {
      dispatch({
        type:'NEW_ROUTINE',
        payload:routineObject
      })
      close()
    } else {alert('Invalid routine')}
  }
  return (
    (visible)?

    <Backdrop>
      <div className="newRoutineMenu">

        <div className="nameInput">
          <label>Routine name:</label>
          <input ref={RoutineNameRef} onChange={UPDATE_NAME} type="text" placeholder="Routine name"/>
        </div>

        <div className="edit">
          <NewRoutineCtx.Provider value={{routineObject, setRoutineObject}}>
            <NewRoutineContents/>
            <ExercisesList/>
          </NewRoutineCtx.Provider>
        </div>

        <div className="btns">
          <button onClick={close}>Cancel</button>
          <button onClick={createRoutine}>Create</button>
        </div>

      </div>
    </Backdrop>
    : null
  )
}

export default function RoutinesPage() {
  const [visible, setVisible] = useState(false)
  function openMenu() {
    setVisible(true)
  }
  return <div className='routinesPage'>
    <button className="newRoutineBtn" onClick={openMenu}>New routine</button>
    <NewRoutineMenu visible={visible} setVisible={setVisible} />
    <RoutinesList />
  </div> // ==========================>
}